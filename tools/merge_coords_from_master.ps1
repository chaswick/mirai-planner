# Merge coordinates from master trip JSON into a variant JSON by matching authoritative_name
param(
    [string]$master = "japan_trip_biovortex_and_nintendo.json",
    [string]$variant = "japan_trip_biovortex_and_nintendo_gion_corner.json",
    [string]$out = "japan_trip_biovortex_and_nintendo_gion_corner_with_coords.json"
)

Write-Host "Loading master: $master"
$masterText = Get-Content -Raw -Path $master
$masterJson = $masterText | ConvertFrom-Json -ErrorAction Stop

Write-Host "Loading variant: $variant"
$variantText = Get-Content -Raw -Path $variant
$variantJson = $variantText | ConvertFrom-Json -ErrorAction Stop

# Build lookup of coords from master activities
$coordLookup = @{}
foreach ($act in $masterJson.activities_catalog) {
    if ($act.authoritative_name -and $act.logistics) {
        $lat = $act.logistics.latitude
        $lon = $act.logistics.longitude
        if ($lat -and $lon) {
            $coordLookup[$act.authoritative_name] = @{ latitude = [double]$lat; longitude = [double]$lon }
        }
        elseif ($act.logistics.location) {
            # accept .lat/.lng or .latitude/.longitude inside location
            $loc = $act.logistics.location
            if ($loc.lat -and $loc.lng) { $coordLookup[$act.authoritative_name] = @{ latitude = [double]$loc.lat; longitude = [double]$loc.lng } }
            elseif ($loc.latitude -and $loc.longitude) { $coordLookup[$act.authoritative_name] = @{ latitude = [double]$loc.latitude; longitude = [double]$loc.longitude } }
        }
    }
}

$updated = 0
foreach ($act in $variantJson.activities_catalog) {
    if ($act.authoritative_name) {
        $key = $act.authoritative_name
        if ($coordLookup.ContainsKey($key)) {
            $coords = $coordLookup[$key]
            if (-not $act.logistics) { $act.logistics = New-Object -TypeName PSObject }
            $hasLatProp = $false
            if ($act.logistics.PSObject.Properties['latitude']) { $hasLatProp = $true }
            if (-not $hasLatProp) {
                # Add note properties safely so PSCustomObject accepts them
                $act.logistics | Add-Member -NotePropertyName 'latitude' -NotePropertyValue ([double]$coords.latitude) -Force
                $act.logistics | Add-Member -NotePropertyName 'longitude' -NotePropertyValue ([double]$coords.longitude) -Force
                # Add a location PSCustomObject as well
                $locObj = New-Object -TypeName PSObject
                $locObj | Add-Member -NotePropertyName 'latitude' -NotePropertyValue ([double]$coords.latitude)
                $locObj | Add-Member -NotePropertyName 'longitude' -NotePropertyValue ([double]$coords.longitude)
                $act.logistics | Add-Member -NotePropertyName 'location' -NotePropertyValue $locObj -Force
                $updated++
            }
        }
    }
}

if ($updated -gt 0) {
    Write-Host "Updated $updated activities with coordinates. Writing out to $out"
    $variantJson | ConvertTo-Json -Depth 10 | Out-File -FilePath $out -Encoding UTF8
} else {
    Write-Host "No updates were applied. No matching coordinates found or variant already had coords."
}

Write-Host "Done."