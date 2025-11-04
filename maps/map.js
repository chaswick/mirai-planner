
/*! Trip Planner Map Helper (map.js) — with route distance */
(function(global){
  function assertLeaflet(){ if (!global.L) throw new Error('Leaflet (L) not found. Include Leaflet JS before map.js.'); }
  const DEFAULTS = {
    zoom: 15,
    mode: 'poi',
    poi: { radius: 800, categories: ['convenience','restaurant','bakery','pharmacy','atm','station','park','temple','shrine','museum'], useOverpass: true, items: [] },
    route: { waypoints: [], requestRouting: true },
    ui: { modeToggleCheckboxId: null, distanceElId: null, formatDistance: null, onDistance: null },
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  };

  function deepMerge(target, source){
    if (!source) return target;
    for (const k of Object.keys(source)){
      if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])){
        if (!target[k]) target[k] = {};
        deepMerge(target[k], source[k]);
      } else { target[k] = source[k]; }
    }
    return target;
  }

  // Haversine distance in meters
  function haversine(a, b){
    const R = 6371000; // meters
    const toRad = (x)=> x * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
    const s = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  function defaultFormatDistance(m){
    if (m == null || isNaN(m)) return '';
    if (m < 1000) return `${Math.round(m)} m`;
    return `${(m/1000).toFixed(1)} km`;
  }

  function initTripMap(elOrId, cfg){
    assertLeaflet();
    const config = deepMerge(JSON.parse(JSON.stringify(DEFAULTS)), cfg || {});
    if (!config.center || typeof config.center.lat !== 'number' || typeof config.center.lng !== 'number'){
      throw new Error('center {lat, lng} is required');
    }
    const el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
    if (!el) throw new Error('Map container not found');

    const map = L.map(el);
    L.tileLayer(config.tileUrl, { attribution: config.tileAttribution, maxZoom: 19 }).addTo(map);
    const poiLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);

    const centerMarker = L.marker([config.center.lat, config.center.lng], { title: config.center.label || 'Center' })
      .bindPopup(`<b>${config.center.label || 'Center'}</b>`).addTo(map);

    map.setView([config.center.lat, config.center.lng], config.zoom);

    let lastDistanceMeters = null;

    function fit(){
      const group = L.featureGroup([centerMarker, ...poiLayer.getLayers(), ...routeLayer.getLayers()]);
      if (group.getLayers().length > 1) map.fitBounds(group.getBounds().pad(0.1));
      else map.setView([config.center.lat, config.center.lng], config.zoom);
    }

    async function loadPOIs(){
      poiLayer.clearLayers();
      if (Array.isArray(config.poi.items) && config.poi.items.length){
        for (const p of config.poi.items){
          poiLayer.addLayer(L.marker([p.lat, p.lng], { title: p.label || 'POI' }).bindPopup(`<b>${escapeHtml(p.label || 'POI')}</b>`));
        }
        return;
      }
      if (!config.poi.useOverpass) return;

      const radius = Number(config.poi.radius) || 800;
      const cats = (config.poi.categories || []).map(c => `node(around:${radius},${config.center.lat},${config.center.lng})[amenity=${c}]`).join(';\n');
      const leisureCats = (config.poi.categories || []).filter(c => ['park'].includes(c)).map(c => `node(around:${radius},${config.center.lat},${config.center.lng})[leisure=${c}]`).join(';\n');
      const tourismCats = (config.poi.categories || []).filter(c => ['temple','shrine','museum'].includes(c)).map(c => `node(around:${radius},${config.center.lat},${config.center.lng})[tourism=${c}]`).join(';\n');
      const queryParts = [cats, leisureCats, tourismCats].filter(Boolean).join(';\n');
      if (!queryParts) return;

      const overpass = `[out:json][timeout:25];(${queryParts};);out body;`;
      try{
        const res = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body: overpass, headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} });
        const data = await res.json();
        (data.elements || []).forEach((e) => {
          const lat = e.lat, lng = e.lon;
          const name = (e.tags && (e.tags.name || e.tags['name:en'])) || (e.tags && (e.tags.amenity || e.tags.tourism || e.tags.leisure)) || 'POI';
          const icon = (e.tags && (e.tags.amenity || e.tags.tourism || e.tags.leisure)) || '';
          poiLayer.addLayer(L.marker([lat, lng]).bindPopup(`<b>${escapeHtml(name)}</b><br/><small>${escapeHtml(icon)}</small>`));
        });
      }catch(err){ console.error('Overpass error:', err); }
    }

    function drawStraightPolyline(pts){
      if (pts.length < 2) return;
      routeLayer.addLayer(L.polyline(pts, { dashArray: '6,6' }));
    }

    function updateDistanceUI(meters){
      lastDistanceMeters = meters;
      const fmt = typeof config.ui.formatDistance === 'function' ? config.ui.formatDistance : defaultFormatDistance;
      const text = meters == null ? '' : fmt(meters);
      if (config.ui.distanceElId){
        const el = document.getElementById(config.ui.distanceElId);
        if (el) el.textContent = text;
      }
      if (typeof config.ui.onDistance === 'function'){
        try { config.ui.onDistance(meters, text); } catch(e){ /* ignore */}
      }
    }

    async function loadRoute(){
      routeLayer.clearLayers();
      const wps = (config.route && Array.isArray(config.route.waypoints)) ? config.route.waypoints : [];
      if (wps.length === 0){ updateDistanceUI(null); return; }

      // markers
      wps.forEach((w,i)=>{
        routeLayer.addLayer(L.marker([w.lat,w.lng],{title:w.label || `Stop ${i+1}`}).bindPopup(`<b>${escapeHtml(w.label || `Stop ${i+1}`)}</b>`));
      });

      if (!config.route.requestRouting || wps.length < 2){
        drawStraightPolyline(wps.map(w=>[w.lat,w.lng]));
        // compute simple haversine total
        let total = 0;
        for (let i=1;i<wps.length;i++){
          total += haversine(wps[i-1], wps[i]);
        }
        updateDistanceUI(total);
        return;
      }

      try{
        const coords = wps.map(w=>`${w.lng},${w.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson&annotations=distance`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.routes || !data.routes[0]){
          drawStraightPolyline(wps.map(w=>[w.lat,w.lng]));
          // fallback to haversine
          let total = 0;
          for (let i=1;i<wps.length;i++) total += haversine(wps[i-1], wps[i]);
          updateDistanceUI(total);
          return;
        }
        const route = data.routes[0];
        // OSRM provides total distance in meters
        const meters = typeof route.distance === 'number' ? route.distance : null;
        if (route.geometry) routeLayer.addLayer(L.geoJSON(route.geometry));
        updateDistanceUI(meters);
      }catch(err){
        console.error('OSRM error:', err);
        drawStraightPolyline(wps.map(w=>[w.lat,w.lng]));
        // fallback to haversine
        let total = 0;
        for (let i=1;i<wps.length;i++) total += haversine(wps[i-1], wps[i]);
        updateDistanceUI(total);
      }
    }

    function wireToggle(){
      const id = config.ui && config.ui.modeToggleCheckboxId;
      if (!id) return;
      const cb = document.getElementById(id);
      if (!cb) return;
      const setFromCb = ()=> setMode(cb.checked ? 'route' : 'poi');
      cb.addEventListener('change', setFromCb);
      cb.checked = (config.mode === 'route');
    }

    async function setMode(mode){
      config.mode = mode;
      poiLayer.clearLayers(); routeLayer.clearLayers();
      if (mode === 'poi'){
        await loadPOIs();
        updateDistanceUI(null);
        map.addLayer(poiLayer); map.removeLayer(routeLayer);
      } else {
        await loadRoute();
        map.addLayer(routeLayer); map.removeLayer(poiLayer);
      }
      fit();
    }

    async function refresh(){ if (config.mode === 'poi') await loadPOIs(); else await loadRoute(); fit(); }

    function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

    // Init
    wireToggle(); setMode(config.mode);

    // Ensure the map layout is correct after initial render. In some "saved page" or
    // hidden-container scenarios the map can render with incorrect tile sizing until
    // invalidateSize() is called. Call it shortly after initialization and when the
    // map reports ready.
    try {
      map.whenReady(() => {
        setTimeout(() => {
          try { map.invalidateSize(); fit(); } catch (e) { /* non-fatal */ }
        }, 200);
      });
    } catch (e) {
      // older Leaflet versions may not support whenReady; fallback to a timed invalidate
      setTimeout(() => { try { map.invalidateSize(); fit(); } catch (e) {} }, 300);
    }

    return { setMode, refresh, fit, map, poiLayer, routeLayer, config, get lastDistanceMeters(){ return lastDistanceMeters; } };
  }
  global.initTripMap = initTripMap;
})(window);
