$j = Get-Content .\japan_trip_biovortex_and_nintendo.json -Raw | ConvertFrom-Json
$missing = @()
foreach ($a in $j.activities_catalog) {
  if (-not ($a.logistics -and $a.logistics.PSObject.Properties.Name -contains 'latitude')) {
    $missing += $a.authoritative_name
  }
}
Write-Output 'MISSING ACTIVITIES (no latitude):'
$missing | ConvertTo-Json -Depth 3
Write-Output 'MISSING HOTELS (no location.lat):'
$hm = @()
foreach ($h in $j.hotels) {
  if (-not ($h.location -and $h.location.PSObject.Properties.Name -contains 'lat')) {
    $hm += $h.authoritative_name
  }
}
$hm | ConvertTo-Json -Depth 3
