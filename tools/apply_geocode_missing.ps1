# This script geocodes a list of activities and updates the trip JSON in-place.
$path = '.\japan_trip_biovortex_and_nintendo.json'
$j = Get-Content $path -Raw | ConvertFrom-Json

# Map of authoritative_name -> query string for Nominatim
$queries = @{
  'Gion District' = 'Gion, Kyoto, Japan'
  'Osaka Castle Grounds' = 'Osaka Castle, Osaka, Japan'
  'teamLab Botanical Garden Osaka' = 'teamLab Botanical Garden Nagai Park, Osaka, Japan'
  'Fushimi Inari Taisha' = 'Fushimi Inari Taisha, Kyoto, Japan'
  'Todai-ji' = 'Todai-ji, Nara, Japan'
  'Kinkaku-ji' = 'Kinkaku-ji, Kyoto, Japan'
  'Tenryu-ji' = 'Tenryu-ji, Arashiyama, Kyoto, Japan'
  'teamLab Planets' = 'teamLab Planets, Toyosu, Tokyo, Japan'
  'Hamarikyu Gardens' = 'Hamarikyu Gardens, Tokyo, Japan'
  'Mori Tower Observation Deck' = 'Mori Tower Roppongi Hills observation deck, Tokyo, Japan'
  'Shibuya Shopping/Dinner' = 'Shibuya, Tokyo, Japan'
  'teamLab Biovortex' = 'teamLab Biovortex, Osaka, Japan'
}

function Geocode($q) {
    $url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + [System.Uri]::EscapeDataString($q)
    try {
        $resp = Invoke-RestMethod -Uri $url -Headers @{ 'User-Agent' = 'mirai-planner-geocoder/1.0 (contact: chaswick@example.com)' } -Method Get -ErrorAction Stop
        if ($resp -and $resp.Count -gt 0) {
            return @{lat=[double]$resp[0].lat; lon=[double]$resp[0].lon; display=$resp[0].display_name}
        }
    } catch {
        Write-Output "HTTP error for query: $q -> $_"
    }
    return $null
}

$updated = 0
foreach ($a in $j.activities_catalog) {
    if ($queries.ContainsKey($a.authoritative_name)) {
        $q = $queries[$a.authoritative_name]
        Write-Output "Geocoding $($a.authoritative_name) -> $q"
        $res = Geocode $q
        Start-Sleep -Seconds 1
        if ($res -ne $null) {
            if (-not $a.logistics) { $a.logistics = @{} }
            # Use Add-Member to safely add properties to the child object
            $a.logistics | Add-Member -NotePropertyName latitude -NotePropertyValue $res.lat -Force
            $a.logistics | Add-Member -NotePropertyName longitude -NotePropertyValue $res.lon -Force
            Write-Output " -> $($res.display) => $($res.lat),$($res.lon)"
            $updated++
        } else {
            Write-Output " -> not found: $q"
        }
    }
}

if ($updated -gt 0) {
    $json = $j | ConvertTo-Json -Depth 10
    Set-Content -Path $path -Value $json -Encoding UTF8
    Write-Output "WROTE $path with $updated updates"
} else {
    Write-Output "No updates applied."
}
