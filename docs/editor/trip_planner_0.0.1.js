// Trip Planner Minimal Editor JS (Schema-driven Form UI)

// Tab switching logic
document.addEventListener('DOMContentLoaded', function() {
  var tabBtns = document.querySelectorAll('#tabbar .tab-btn');
  var tabPanes = {
    activities: document.getElementById('tab-activities'),
    days: document.getElementById('tab-days'),
    segments: document.getElementById('tab-segments'),
    trips: document.getElementById('tab-trips'),
    kpis: document.getElementById('tab-kpis')
  };
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      Object.keys(tabPanes).forEach(function(key) {
        if (btn.getAttribute('data-tab') === key) {
          tabPanes[key].classList.add('active');
        } else {
          tabPanes[key].classList.remove('active');
        }
      });
      // Clear any existing forms when switching tabs
      try { clearFormArea(); } catch(e){}
    });
  });
});

var loadedSchema = null;
var dataDoc = null;
var inputFileName = 'data.json';
var sortables = {};

function log(m){
  try {
    var status = document.getElementById('status');
    var out = document.getElementById('out');
    if (status) status.textContent = m;
    if (out) out.textContent = '';
  } catch(e){}
}
function logJSON(o){
  try {
    var status = document.getElementById('status');
    var out = document.getElementById('out');
    if (status && !out) status.textContent = 'Invalid';
    if (out) out.textContent = JSON.stringify(o,null,2);
  } catch(e){}
}

document.addEventListener('DOMContentLoaded', function() {
  var schemaFile = document.getElementById('schemaFile');
  if (schemaFile) {
    schemaFile.addEventListener('change', async function(e){
      if (!e.target.files || !e.target.files.length) return;
      try {
        loadedSchema = JSON.parse(await readFileAsText(e.target.files[0]));
        setTimeout(function(){ log('Schema loaded.'); }, 0);
      } catch(err){ setTimeout(function(){ log('Schema parse error: '+err.message); }, 0); }
    });
  }
  var jsonFile = document.getElementById('jsonFile');
  if (jsonFile) {
    jsonFile.addEventListener('change', async function(e){
      if (!e.target.files || !e.target.files.length) return;
      var f = e.target.files[0];
      inputFileName = f.name || inputFileName;
      try {
        dataDoc = JSON.parse(await readFileAsText(f));
        refreshAllLists();
        clearFormArea();
      } catch(err){ setTimeout(function(){ log('Data JSON parse error: '+err.message); }, 0); }
    });
  }
});

document.getElementById('validate').addEventListener('click', function(){
  if (typeof Ajv !== 'function') { log('Ajv not available.'); return; }
  if (!loadedSchema) { log('No schema available. Choose a schema file.'); return; }
  if (!dataDoc) { log('No data loaded.'); return; }
  var ajv;
  try { ajv = new Ajv({allErrors:true, strict:false}); }
  catch(e){ log('Ajv constructor error: '+e.message); return; }
  var validate;
  try { validate = ajv.compile(loadedSchema); }
  catch(e){ log('Schema compile error: '+e.message); return; }
  var ok = false;
  try { ok = validate(dataDoc); }
  catch(e){ log('Validation runtime error: '+e.message); return; }
  if (ok) {
    document.getElementById('status').textContent = 'VALID ✔';
    document.getElementById('out').textContent = '';
    document.getElementById('status').textContent = 'VALID';
    var _outEl = document.getElementById('out'); if (_outEl) _outEl.textContent = '';
  } else {
    logJSON(validate.errors);
  }
});

document.getElementById('save').addEventListener('click', function(){
  if (!dataDoc) return;
  var blob = new Blob([JSON.stringify(dataDoc, null, 2)], {type: 'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  var fname = inputFileName || 'data.json';
  if (!/\.json$/i.test(fname)) fname += '.json';
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }, 100);
});

function readFileAsText(file) {
  return new Promise(function(resolve, reject){
    var fr = new FileReader();
    fr.onerror = function(){ reject(new Error('Failed to read file')); };
    fr.onload = function(){ resolve(String(fr.result)); };
    fr.readAsText(file);
  });
}

function ensureArrays(){
  if (!dataDoc) return;
  dataDoc.activities_catalog = Array.isArray(dataDoc.activities_catalog)?dataDoc.activities_catalog:[];
  dataDoc.day_collection = Array.isArray(dataDoc.day_collection)?dataDoc.day_collection:[];
  dataDoc.segment_collection = Array.isArray(dataDoc.segment_collection)?dataDoc.segment_collection:[];
  dataDoc.trip_itinerary = Array.isArray(dataDoc.trip_itinerary)?dataDoc.trip_itinerary:[];
  dataDoc.kpi_mappings = dataDoc.kpi_mappings && typeof dataDoc.kpi_mappings==='object' ? dataDoc.kpi_mappings : {};
}

function addSkeleton(path){
  if (!dataDoc) return;
  ensureArrays();
  switch(path){
    case 'activities_catalog':
      dataDoc.activities_catalog.push({
        "authoritative_name":"New Activity",
        "descriptive_name":"New Activity",
        "descriptive_text":"",
        "experiences":[],
        "kid_friendly":true,
        "logistics":{"activity_hours":1}
      });
      var aIdx = dataDoc.activities_catalog.length - 1;
      refreshAllLists();
      var aSchema = getSchemaForPath([path]);
      renderFormForObject(dataDoc.activities_catalog[aIdx], [path, aIdx], aSchema);
      break;
    case 'day_collection':
      dataDoc.day_collection.push({
        "date":"2025-01-01",
        "overview_text":"",
        "day_parts":[
          {"part":"Morning","hours":"08:00-11:00am","activity_authoritative_name":null,"logistics":{"transit_hours":0,"transit_kpis":[]}},
          {"part":"Afternoon","hours":"12:00pm-04:00pm","activity_authoritative_name":null,"logistics":{"transit_hours":0,"transit_kpis":[]}},
          {"part":"Evening","hours":"05:00pm-08:00pm","activity_authoritative_name":null,"logistics":{"transit_hours":0,"transit_kpis":[]}}
        ]
      });
      var dIdx = dataDoc.day_collection.length - 1;
      refreshAllLists();
      var dSchema = getSchemaForPath([path]);
      renderFormForObject(dataDoc.day_collection[dIdx], [path, dIdx], dSchema);
      break;
    case 'segment_collection':
      dataDoc.segment_collection.push({
        "title":"New Segment",
        "date_range":"2025-01-01 to 2025-01-02",
        "overview_text":""
      });
      var sIdx = dataDoc.segment_collection.length - 1;
      refreshAllLists();
      var sSchema = getSchemaForPath([path]);
      renderFormForObject(dataDoc.segment_collection[sIdx], [path, sIdx], sSchema);
      break;
    case 'trip_itinerary':
      dataDoc.trip_itinerary.push({
        "title":"New Trip",
        "date_range":"2025-01-01 to 2025-01-05",
        "overview_text":""
      });
      var tIdx = dataDoc.trip_itinerary.length - 1;
      refreshAllLists();
      var tSchema = getSchemaForPath([path]);
      renderFormForObject(dataDoc.trip_itinerary[tIdx], [path, tIdx], tSchema);
      break;
  }
}

function deleteAt(path, idx, keyName){
  if (!dataDoc) return;
  ensureArrays();
  if (path==='kpi_mappings') {
    delete dataDoc.kpi_mappings[keyName];
  } else {
    if (!Array.isArray(dataDoc[path])) return;
    dataDoc[path].splice(idx,1);
  }
  refreshAllLists();
  clearFormArea();
}

document.getElementById('addKpi').addEventListener('click', function(){
  if (!dataDoc) return;
  ensureArrays();
  var schema = getSchemaForPath('kpi_mappings');
  // Render empty KPI mapping form using the same editor
  renderFormForObject({ key: '', value: [] }, ['kpi_mappings', '__new__'], schema);
});

document.querySelectorAll('button[data-add]').forEach(function(btn){
  btn.addEventListener('click', function(){
    addSkeleton(btn.getAttribute('data-add'));
  });
});

function clearFormArea() {
  var formArea = document.getElementById('form-area');
  if (formArea) formArea.innerHTML = '';
  var daysForm = document.getElementById('days-form-area');
  if (daysForm) daysForm.innerHTML = '';
  var segForm = document.getElementById('segments-form-area');
  if (segForm) segForm.innerHTML = '';
  var tripForm = document.getElementById('trips-form-area');
  if (tripForm) tripForm.innerHTML = '';
  var segList = document.getElementById('segment-days-list');
  if (segList) segList.innerHTML = '';
  var tripList = document.getElementById('trip-segments-list');
  if (tripList) tripList.innerHTML = '';
}

// Render a form for an object in #form-area, using the schema for field definitions
function renderFormForObject(obj, path, schema) {
  // Special-case: if editing Days, mount form into the Days pane left column
  var isDays = Array.isArray(path) && path[0] === 'day_collection';
  var isSegs = Array.isArray(path) && path[0] === 'segment_collection';
  var isTrips = Array.isArray(path) && path[0] === 'trip_itinerary';
  var formArea = document.getElementById(
    isDays ? 'days-form-area' : (isSegs ? 'segments-form-area' : (isTrips ? 'trips-form-area' : 'form-area'))
  );
  formArea.innerHTML = '';
  var resolvedSchema = resolveSchemaRefs(schema, loadedSchema) || schema;
  //
  if (!resolvedSchema || (!resolvedSchema.properties && resolvedSchema.type !== 'array')) {
    formArea.textContent = 'No schema loaded or schema missing properties.';
    return;
  }

  // Work on a deep copy and mutate via change handlers
  var working = deepClone(obj);
  var form = document.createElement('form');
  form.className = 'object-edit-form';

  var container = document.createElement('div');
  form.appendChild(container);

  // Render fields recursively for object or array root
  if (resolvedSchema.type === 'array') {
    renderArrayEditor(container, '', working, resolvedSchema);
  } else {
    renderObjectFields(container, working, resolvedSchema, []);
  }

  var saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.textContent = 'Save';
  form.appendChild(saveBtn);

  form.onsubmit = function(e) {
    e.preventDefault();
    // Save back to dataDoc
    if (Array.isArray(path)) {
      var parent = dataDoc;
      for (var i = 0; i < path.length - 1; i++) {
        parent = parent[path[i]];
      }
      if (path[0] === 'kpi_mappings') {
        var originalKey = path[path.length - 1];
        var newKey = working.key || originalKey;
        var newVal = Array.isArray(working.value) ? working.value : [];
        if (newKey !== originalKey) delete parent[originalKey];
        parent[newKey] = newVal;
      } else {
        parent[path[path.length - 1]] = working;
      }
    }
    refreshAllLists();
    formArea.innerHTML = '<em>Saved.</em>';
  };

  formArea.appendChild(form);

  // Render derived inclusions for segments/trips
  if (isSegs) {
    renderSegmentInclusions(working);
  } else if (isTrips) {
    renderTripInclusions(working);
  }
}

function deepClone(v) {
  return v == null ? v : JSON.parse(JSON.stringify(v));
}

function createEl(tag, attrs, text) {
  var el = document.createElement(tag);
  if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, String(attrs[k])); });
  if (text != null) el.textContent = String(text);
  return el;
}

function renderObjectFields(host, target, schema, basePath) {
  if (!schema || !schema.properties) return;
  Object.keys(schema.properties).forEach(function (key) {
    var fieldSchema = resolveSchemaRefs(schema.properties[key], loadedSchema) || schema.properties[key];
    var wrap = createEl('div', { class: 'field' });
    var label = createEl('label', null, key);
    wrap.appendChild(label);

    // Special case: activity reference dropdown (by authoritative_name)
    if ((key === 'activity_authoritative_name')
        && dataDoc && Array.isArray(dataDoc.activities_catalog)) {
      var selectAct = createEl('select');
      selectAct.appendChild(createEl('option', { value: '' }, '-- select activity --'));
      dataDoc.activities_catalog.forEach(function (act) {
        var valueId = (act.authoritative_name != null ? String(act.authoritative_name) : '');
        var labelTxt = (act.authoritative_name || '(no-authoritative)') + (act.descriptive_name ? ' – ' + act.descriptive_name : '');
        var opt = createEl('option', { value: valueId }, labelTxt);
        selectAct.appendChild(opt);
      });
      var currentVal = target[key];
      selectAct.value = (currentVal != null) ? String(currentVal) : '';
      selectAct.addEventListener('change', function(){
        var v = selectAct.value || '';
        target[key] = v;
      });
      wrap.appendChild(selectAct);
      host.appendChild(wrap);
      return;
    }

    // Object
    if ((fieldSchema.type === 'object') || fieldSchema.properties) {
      if (typeof target[key] !== 'object' || target[key] == null || Array.isArray(target[key])) {
        target[key] = {};
      }
      var fs = createEl('fieldset');
      var legend = createEl('legend', null, key);
      fs.appendChild(legend);
      renderObjectFields(fs, target[key], fieldSchema, basePath.concat([key]));
      wrap.appendChild(fs);

    // Array
    } else if (fieldSchema.type === 'array') {
      if (!Array.isArray(target[key])) target[key] = [];
      renderArrayEditor(wrap, key, target, fieldSchema);

    // oneOf with nullable option
    } else if (Array.isArray(fieldSchema.oneOf)) {
      var hasNull = fieldSchema.oneOf.some(function (opt) {
        var o = resolveSchemaRefs(opt, loadedSchema) || opt;
        return o.type === 'null' || o.const === null;
      });
      var nonNullSchema = null;
      for (var oi = 0; oi < fieldSchema.oneOf.length; oi++) {
        var opt = resolveSchemaRefs(fieldSchema.oneOf[oi], loadedSchema) || fieldSchema.oneOf[oi];
        if (!(opt.type === 'null' || opt.const === null)) { nonNullSchema = opt; break; }
      }
      var nullToggle = createEl('input');
      nullToggle.type = 'checkbox';
      nullToggle.checked = target[key] === null;
      var nullLbl = createEl('span', { style: 'margin-left:8px' }, '(null)');
      label.appendChild(nullToggle);
      label.appendChild(nullLbl);
      var inputHolder = createEl('div');
      wrap.appendChild(inputHolder);
      function renderNonNullEditor() {
        inputHolder.innerHTML = '';
        var inner = resolveSchemaRefs(nonNullSchema, loadedSchema) || nonNullSchema || {};
        // Reuse existing branches for primitive/object/array
        if (inner.type === 'boolean') {
          var inputB2 = createEl('input');
          inputB2.type = 'checkbox';
          inputB2.checked = !!target[key];
          inputB2.addEventListener('change', function(){ target[key] = !!inputB2.checked; });
          inputHolder.appendChild(inputB2);
        } else if (inner.type === 'number' || inner.type === 'integer') {
          var inputN2 = createEl('input');
          inputN2.type = 'number';
          if (inner.type === 'number') {
            inputN2.step = (typeof inner.multipleOf === 'number') ? String(inner.multipleOf) : 'any';
          } else {
            inputN2.step = '1';
          }
          if (typeof inner.minimum === 'number') inputN2.min = String(inner.minimum);
          if (typeof inner.maximum === 'number') inputN2.max = String(inner.maximum);
          inputN2.value = target[key] != null ? target[key] : '';
          inputN2.addEventListener('input', function(){ var v = inputN2.value; target[key] = v === '' ? undefined : Number(v); });
          inputHolder.appendChild(inputN2);
        } else if (inner.type === 'array') {
          if (!Array.isArray(target[key])) target[key] = [];
          renderArrayEditor(inputHolder, key, target, inner);
        } else if (inner.type === 'object' || inner.properties) {
          if (typeof target[key] !== 'object' || target[key] == null || Array.isArray(target[key])) target[key] = {};
          renderObjectFields(inputHolder, target[key], inner, basePath.concat([key]));
        } else {
          // enum/const aware string
          if (Array.isArray(inner.enum)) {
            var sel = createEl('select');
            sel.appendChild(createEl('option', { value: '' }, '-- select --'));
            inner.enum.forEach(function(optVal){
              var optEl = createEl('option', { value: String(optVal) }, String(optVal));
              sel.appendChild(optEl);
            });
            sel.value = (target[key] != null) ? String(target[key]) : '';
            sel.addEventListener('change', function(){ target[key] = sel.value === '' ? undefined : sel.value; });
            inputHolder.appendChild(sel);
          } else if (inner.const !== undefined) {
            var ro = createEl('input');
            ro.type = 'text';
            ro.value = String(inner.const);
            ro.disabled = true;
            inputHolder.appendChild(ro);
            target[key] = inner.const;
          } else {
            var inputT2 = createEl('input');
            inputT2.type = 'text';
            inputT2.value = target[key] != null ? target[key] : '';
            inputT2.addEventListener('input', function(){ target[key] = inputT2.value; });
            inputHolder.appendChild(inputT2);
          }
        }
      }
      function setNullMode(on){
        if (on) {
          target[key] = null;
          inputHolder.innerHTML = '';
        } else {
          if (target[key] === null) target[key] = undefined;
          renderNonNullEditor();
        }
      }
      nullToggle.addEventListener('change', function(){ setNullMode(nullToggle.checked); });
      setNullMode(hasNull && (target[key] === null));

    // Boolean
    } else if (fieldSchema.type === 'boolean') {
      var inputB = createEl('input');
      inputB.type = 'checkbox';
      inputB.checked = !!target[key];
      inputB.addEventListener('change', function(){ target[key] = !!inputB.checked; });
      label.appendChild(inputB);

    // Number / Integer
    } else if (fieldSchema.type === 'number' || fieldSchema.type === 'integer') {
      var inputN = createEl('input');
      inputN.type = 'number';
      if (fieldSchema.type === 'number') {
        inputN.step = (typeof fieldSchema.multipleOf === 'number') ? String(fieldSchema.multipleOf) : 'any';
      } else {
        inputN.step = '1';
      }
      if (typeof fieldSchema.minimum === 'number') inputN.min = String(fieldSchema.minimum);
      if (typeof fieldSchema.maximum === 'number') inputN.max = String(fieldSchema.maximum);
      inputN.value = target[key] !== undefined ? target[key] : '';
      inputN.addEventListener('input', function(){
        var v = inputN.value;
        target[key] = v === '' ? undefined : Number(v);
      });
      wrap.appendChild(inputN);

    // Enum
    } else if (Array.isArray(fieldSchema.enum)) {
      var select = createEl('select');
      select.appendChild(createEl('option', { value: '' }, '-- select --'));
      fieldSchema.enum.forEach(function(optVal){
        var optEl = createEl('option', { value: String(optVal) }, String(optVal));
        select.appendChild(optEl);
      });
      select.value = (target[key] !== undefined && target[key] !== null) ? String(target[key]) : '';
      select.addEventListener('change', function(){ target[key] = select.value === '' ? undefined : select.value; });
      wrap.appendChild(select);

    // Const
    } else if (fieldSchema.const !== undefined) {
      var ro2 = createEl('input');
      ro2.type = 'text';
      ro2.value = String(fieldSchema.const);
      ro2.disabled = true;
      wrap.appendChild(ro2);
      target[key] = fieldSchema.const;

    // Primitive string or fallback
    } else {
      // Special-case: date (ISO) as date picker
      if (key === 'date' || (fieldSchema && typeof fieldSchema.pattern === 'string' && /\\d{4}-\\d{2}-\\d{2}/.test(fieldSchema.pattern))) {
        var inputDate = createEl('input');
        inputDate.type = 'date';
        inputDate.name = key;
        inputDate.value = target[key] || '';
        inputDate.addEventListener('change', function(){ target[key] = inputDate.value; updateDerivedListsIfNeeded(); });
        wrap.appendChild(inputDate);
      // Special-case: date_range as two date pickers
      } else if (key === 'date_range') {
        var startEnd = parseDateRange(target[key] || '');
        var inputStart = createEl('input'); inputStart.type = 'date'; inputStart.name = 'date_range_start'; inputStart.value = startEnd.start || '';
        var inputEnd = createEl('input'); inputEnd.type = 'date'; inputEnd.name = 'date_range_end'; inputEnd.value = startEnd.end || '';
        inputStart.addEventListener('change', function(){ target[key] = combineDateRange(inputStart.value, inputEnd.value); updateDerivedListsIfNeeded(); });
        inputEnd.addEventListener('change', function(){ target[key] = combineDateRange(inputStart.value, inputEnd.value); updateDerivedListsIfNeeded(); });
        var holder = createEl('div'); holder.style.display = 'flex'; holder.style.gap = '6px';
        holder.appendChild(inputStart); holder.appendChild(createEl('span', null, 'to')); holder.appendChild(inputEnd);
        wrap.appendChild(holder);
      // Multiline for descriptive/overview text fields
      } else if (fieldSchema.type === 'string' && (key === 'descriptive_text' || key === 'overview_text')) {
        var taMulti = createEl('textarea');
        taMulti.rows = 4;
        taMulti.value = target[key] !== undefined ? target[key] : '';
        taMulti.addEventListener('input', function(){ target[key] = taMulti.value; });
        wrap.appendChild(taMulti);
      } else {
        var inputT = createEl('input');
        inputT.type = 'text';
        inputT.value = target[key] !== undefined ? target[key] : '';
        inputT.addEventListener('input', function(){ target[key] = inputT.value; });
        wrap.appendChild(inputT);
      }
    }

    host.appendChild(wrap);
  });
}

// Helpers for date handling
function parseISO(d){ if(!d) return null; var t = Date.parse(d); return isNaN(t)?null:new Date(t); }
function parseDateRange(s){
  var m = (s||'').match(/^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})$/);
  return { start: m?m[1]:'', end: m?m[2]:'' };
}
function combineDateRange(a,b){
  if (!a && !b) return '';
  return (a||'') + ' to ' + (b||'');
}
function isDateWithin(dateStr, startStr, endStr){
  var d = parseISO(dateStr), s = parseISO(startStr), e = parseISO(endStr);
  if (!d || !s || !e) return false;
  d.setHours(0,0,0,0); s.setHours(0,0,0,0); e.setHours(0,0,0,0);
  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
}

function updateDerivedListsIfNeeded(){
  var segForm = document.getElementById('segments-form-area');
  var tripForm = document.getElementById('trips-form-area');
  // Determine which object is currently being edited by reading the form's first legend or simply re-render from latest form area contents
  // Simpler: use the last rendered object kept in closures is non-trivial; instead, recompute from currently active tab and form fields
  var tabSeg = document.getElementById('tab-segments');
  var tabTrip = document.getElementById('tab-trips');
  if (tabSeg && tabSeg.classList.contains('active')) {
    var obj = readFormObject(segForm);
    if (obj) renderSegmentInclusions(obj);
  } else if (tabTrip && tabTrip.classList.contains('active')) {
    var obj2 = readFormObject(tripForm);
    if (obj2) renderTripInclusions(obj2);
  }
}

// Read minimal data needed from current form (date/date_range only)
function readFormObject(formArea){
  if (!formArea) return null;
  var o = {};
  var dateInput = formArea.querySelector('input[type="date"]');
  var inputs = formArea.querySelectorAll('input[type="date"]');
  if (inputs && inputs.length >= 2) {
    // assume date_range two inputs are in order
    var a = inputs[0].value || ''; var b = inputs[1].value || '';
    o.date_range = combineDateRange(a,b);
  }
  var singleDate = formArea.querySelector('input[type="date"][name="date"]');
  if (singleDate) { o.date = singleDate.value; }
  return o;
}

function renderSegmentInclusions(segment){
  var box = document.getElementById('segment-days-list');
  if (!box) return;
  box.innerHTML = '';
  var hdr = createEl('h4', null, 'Days in Segment Range');
  box.appendChild(hdr);
  if (!segment || !segment.date_range || !Array.isArray(dataDoc && dataDoc.day_collection)) { box.appendChild(createEl('div', null, 'No days available.')); return; }
  var dr = parseDateRange(segment.date_range);
  var ul = createEl('ul');
  dataDoc.day_collection.forEach(function(d){
    if (isDateWithin(d.date, dr.start, dr.end)) {
      ul.appendChild(createEl('li', null, (d.date || '') + ' - ' + (d.overview_text || '')));
    }
  });
  if (!ul.firstChild) { box.appendChild(createEl('div', null, 'No matching days.')); } else { box.appendChild(ul); }
}

function renderTripInclusions(trip){
  var box = document.getElementById('trip-segments-list');
  if (!box) return;
  box.innerHTML = '';
  var hdr = createEl('h4', null, 'Segments in Trip Range');
  box.appendChild(hdr);
  if (!trip || !trip.date_range || !Array.isArray(dataDoc && dataDoc.segment_collection)) { box.appendChild(createEl('div', null, 'No segments available.')); return; }
  var tr = parseDateRange(trip.date_range);
  var ul = createEl('ul');
  dataDoc.segment_collection.forEach(function(s){
    var sr = parseDateRange(s.date_range || '');
    if (sr.start && sr.end && tr.start && tr.end) {
      // include if segment fully within trip range
      if (isDateWithin(sr.start, tr.start, tr.end) && isDateWithin(sr.end, tr.start, tr.end)) {
        ul.appendChild(createEl('li', null, (s.title || '(untitled)') + ' - ' + (s.date_range || '')));
      }
    }
  });
  if (!ul.firstChild) { box.appendChild(createEl('div', null, 'No matching segments.')); } else { box.appendChild(ul); }
}

function renderArrayEditor(host, key, parentTarget, schema) {
  var isTuple = Array.isArray(schema.items);
  var itemsSchema = schema.items;

  // Tuple typing (fixed-length arrays with per-index schema)
  if (isTuple) {
    var arr = parentTarget[key];
    if (!Array.isArray(arr)) { arr = []; parentTarget[key] = arr; }
    for (var i = 0; i < itemsSchema.length; i++) {
      if (arr[i] == null) arr[i] = {};
      var itemSchema = resolveSchemaRefs(itemsSchema[i], loadedSchema) || itemsSchema[i];
      var fs = createEl('fieldset');
      fs.appendChild(createEl('legend', null, (key || 'item') + ' [' + i + ']'));
      if (itemSchema.properties || itemSchema.type === 'object') {
        renderObjectFields(fs, arr[i], itemSchema, [key, i]);
      } else {
        // primitive fallback
        var input = createEl('input');
        input.type = 'text';
        input.value = arr[i] || '';
        (function(idx, inp){
          inp.addEventListener('input', function(){ arr[idx] = inp.value; });
        })(i, input);
        fs.appendChild(input);
      }
      host.appendChild(fs);
    }
    return;
  }

  // Single item schema
  var itemSchema = resolveSchemaRefs(itemsSchema, loadedSchema) || itemsSchema || {};
  var arr2 = key === '' ? parentTarget : parentTarget[key];
  if (!Array.isArray(arr2)) { arr2 = []; if (key !== '') parentTarget[key] = arr2; }

  // If primitive array, keep textarea UX (except for certain keys)
  var primitiveTypes = ['string','number','integer','boolean'];
  // If enum for primitives, render checkbox group for better UX
  if (Array.isArray(itemSchema.enum) && (primitiveTypes.indexOf(itemSchema.type) !== -1 || !itemSchema.type)) {
    var group = createEl('div', { class: 'enum-checkbox-group' });
    itemSchema.enum.forEach(function(val){
      var id = (key || 'arr') + '_' + String(val);
      var cb = createEl('input', { type: 'checkbox' });
      cb.checked = Array.isArray(arr2) && arr2.indexOf(val) !== -1;
      var lbl = createEl('label', null, String(val));
      cb.addEventListener('change', function(){
        var i = arr2.indexOf(val);
        if (cb.checked) { if (i === -1) arr2.push(val); }
        else { if (i !== -1) arr2.splice(i,1); }
      });
      var row = createEl('div');
      row.appendChild(cb);
      row.appendChild(lbl);
      group.appendChild(row);
    });
    host.appendChild(group);
    return;
  }

  if (primitiveTypes.indexOf(itemSchema.type) !== -1 || (!itemSchema.properties && !itemSchema.type)) {
    // Special-case: activities.experiences should be single-line input
    if (key === 'experiences') {
      var inp = createEl('input');
      inp.type = 'text';
      inp.placeholder = 'Comma-separated values';
      inp.value = Array.isArray(arr2) ? arr2.join(', ') : '';
      inp.addEventListener('input', function(){
        var vals = inp.value.split(',').map(function(s){ return s.trim(); }).filter(function(s){ return s !== ''; });
        arr2.length = 0;
        if (itemSchema.type === 'number' || itemSchema.type === 'integer') {
          vals.forEach(function(v){ arr2.push(Number(v)); });
        } else if (itemSchema.type === 'boolean') {
          vals.forEach(function(v){ arr2.push(v.toLowerCase() === 'true'); });
        } else {
          vals.forEach(function(v){ arr2.push(v); });
        }
      });
      host.appendChild(inp);
      return;
    }
    // Default primitive array: textarea
    var ta = createEl('textarea');
    ta.placeholder = 'Comma-separated values';
    ta.value = Array.isArray(arr2) ? arr2.join(', ') : '';
    ta.addEventListener('input', function(){
      var vals = ta.value.split(',').map(function(s){ return s.trim(); }).filter(function(s){ return s !== ''; });
      if (itemSchema.type === 'number' || itemSchema.type === 'integer') {
        arr2.length = 0;
        vals.forEach(function(v){ arr2.push(Number(v)); });
      } else if (itemSchema.type === 'boolean') {
        arr2.length = 0;
        vals.forEach(function(v){ arr2.push(v.toLowerCase() === 'true'); });
      } else {
        arr2.length = 0;
        vals.forEach(function(v){ arr2.push(v); });
      }
    });
    host.appendChild(ta);
    return;
  }

  // Object array editor
  var listWrap = createEl('div', { class: 'array-list' });
  var addBtn = createEl('button', { type: 'button' }, 'Add Item');
  addBtn.addEventListener('click', function(){
    arr2.push({});
    rerender();
  });
  host.appendChild(addBtn);
  host.appendChild(listWrap);

  function rerender(){
    listWrap.innerHTML = '';
    arr2.forEach(function(item, idx){
      var row = createEl('div', { class: 'array-item' });
      var del = createEl('button', { type: 'button' }, 'Remove');
      del.addEventListener('click', function(){ arr2.splice(idx,1); rerender(); });
      row.appendChild(del);
      var fs = createEl('fieldset');
      fs.appendChild(createEl('legend', null, 'Item #' + (idx+1)));
      renderObjectFields(fs, item, itemSchema, [key, idx]);
      row.appendChild(fs);
      listWrap.appendChild(row);
    });
  }
  rerender();
}

// Get the schema for a given path (top-level arrays/objects)
function getSchemaForPath(path) {
  if (!loadedSchema || !loadedSchema.properties) {
    return null;
  }
  var key = Array.isArray(path) ? path[0] : path;
  var result = null;
  if (loadedSchema.properties[key] && loadedSchema.properties[key].items) {
    result = loadedSchema.properties[key].items;
  } else if (loadedSchema.properties[key]) {
    result = loadedSchema.properties[key];
  }
  // Special-case: editing a single KPI mapping (key/value pair)
  if (key === 'kpi_mappings') {
    result = {
      type: 'object',
      properties: {
        key: { type: 'string' },
        value: { type: 'array', items: { type: 'string' } }
      }
    };
  }
  // Resolve local $ref and simple allOf merges so we have properties
  var resolved = resolveSchemaRefs(result, loadedSchema);
  return resolved;
}

// Resolve a JSON Pointer like "#/$defs/Activity" against the given root
function resolvePointer(ptr, root) {
  if (typeof ptr !== 'string' || !ptr.startsWith('#/')) return null;
  var parts = ptr.slice(2).split('/').map(function (p) {
    return p.replace(/~1/g, '/').replace(/~0/g, '~');
  });
  var node = root;
  for (var i = 0; i < parts.length; i++) {
    if (node && Object.prototype.hasOwnProperty.call(node, parts[i])) {
      node = node[parts[i]];
    } else {
      return null;
    }
  }
  return node || null;
}

// Best-effort resolver: follows local $ref chains and flattens simple allOf
function resolveSchemaRefs(schema, root) {
  if (!schema) return schema;
  var seen = 0;
  var current = schema;
  // Follow $ref chains (local only)
  while (current && typeof current.$ref === 'string' && seen < 10) {
    var target = resolvePointer(current.$ref, root || loadedSchema);
    if (!target) break;
    current = target;
    seen++;
  }
  // If there is no direct properties but there is allOf, try to merge
  if (current && !current.properties && Array.isArray(current.allOf)) {
    var merged = { properties: {} };
    current.allOf.forEach(function (sub) {
      var res = resolveSchemaRefs(sub, root || loadedSchema) || {};
      if (res.properties) {
        Object.keys(res.properties).forEach(function (k) {
          merged.properties[k] = res.properties[k];
        });
      }
    });
    // Preserve type if available
    if (current.type && !merged.type) merged.type = current.type;
    current = merged;
  }
  return current;
}

// Render lists and KPIs, with click-to-edit
function renderArrayList(path, renderItem){
  var host = document.getElementById(path);
  host.innerHTML = '';
  if (!dataDoc || !Array.isArray(dataDoc[path])) return;
  var ul = document.createElement('ul');
  dataDoc[path].forEach(function(item, idx){
    var li = document.createElement('li');
    li.setAttribute('data-idx', idx);
    li.className = 'tab-list-item';

    var span = document.createElement('span');
    span.textContent = renderItem(item);
    span.title = 'Edit this item';
    span.className = 'tab-list-label';
    span.addEventListener('click', function(){
      var schema = getSchemaForPath([path]);
      renderFormForObject(item, [path, idx], schema);
    });

    var del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', function(){ deleteAt(path, idx); });

    li.appendChild(span);
    li.appendChild(del);
    ul.appendChild(li);
  });
  host.appendChild(ul);

  if (sortables[path]) { sortables[path].destroy(); }
  sortables[path] = new Sortable(ul, {
    animation: 100,
    onEnd: function(evt){
      var from = evt.oldIndex, to = evt.newIndex;
      if (from === to) return;
      var arr = dataDoc[path];
      var moved = arr.splice(from,1)[0];
      arr.splice(to, 0, moved);
      refreshAllLists();
      clearFormArea();
    }
  });
}

function renderKpis(){
  var host = document.getElementById('kpi_mappings');
  host.innerHTML = '';
  if (!dataDoc || !dataDoc.kpi_mappings) return;
  Object.keys(dataDoc.kpi_mappings).forEach(function(k){
    var row = document.createElement('div');
    row.className = 'tab-kpi-row';
    var span = document.createElement('span');
    span.textContent = k + ' → [' + dataDoc.kpi_mappings[k].join(', ') + ']';
    span.className = 'tab-kpi-label';
    span.title = 'Edit this KPI';
    span.addEventListener('click', function(){
      var schema = getSchemaForPath('kpi_mappings');
      renderFormForObject({key: k, value: dataDoc.kpi_mappings[k]}, ['kpi_mappings', k], schema);
    });
    var del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', function(){ deleteAt('kpi_mappings', -1, k); });
    row.appendChild(span);
    row.appendChild(del);
    host.appendChild(row);
  });
}

function refreshAllLists(){
  renderArrayList('activities_catalog', function(a){
    var key = (a.authoritative_name || '(no-key)');
    return key + ' – ' + (a.descriptive_name || '');
  });
  renderArrayList('day_collection', function(d){
    return (d.date || '(no-date)') + ' — ' + (d.overview_text || '');
  });
  renderArrayList('segment_collection', function(s){
    return (s.title || '(no-title)') + ' — ' + (s.date_range || '');
  });
  renderArrayList('trip_itinerary', function(t){
    return (t.title || '(no-title)') + ' — ' + (t.date_range || '');
  });
  renderKpis();
}

// Normalized overrides for display formatting
function renderKpis(){
  var host = document.getElementById('kpi_mappings');
  host.innerHTML = '';
  if (!dataDoc || !dataDoc.kpi_mappings) return;
  Object.keys(dataDoc.kpi_mappings).forEach(function(k){
    var row = document.createElement('div');
    row.className = 'tab-kpi-row';
    var span = document.createElement('span');
    span.textContent = k + ' - [' + dataDoc.kpi_mappings[k].join(', ') + ']';
    span.className = 'tab-kpi-label';
    span.title = 'Edit this KPI';
    span.addEventListener('click', function(){
      var schema = getSchemaForPath('kpi_mappings');
      renderFormForObject({key: k, value: dataDoc.kpi_mappings[k]}, ['kpi_mappings', k], schema);
    });
    var del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', function(){ deleteAt('kpi_mappings', -1, k); });
    row.appendChild(span);
    row.appendChild(del);
    host.appendChild(row);
  });
}

function refreshAllLists(){
  renderArrayList('activities_catalog', function(a){
    var key = (a.authoritative_name || '(no-key)');
    return key + ' - ' + (a.descriptive_name || '');
  });
  renderArrayList('day_collection', function(d){
    return (d.date || '(no-date)') + ' - ' + (d.overview_text || '');
  });
  renderArrayList('segment_collection', function(s){
    return (s.title || '(no-title)') + ' - ' + (s.date_range || '');
  });
  renderArrayList('trip_itinerary', function(t){
    return (t.title || '(no-title)') + ' - ' + (t.date_range || '');
  });
  renderKpis();
}
