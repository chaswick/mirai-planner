param([string]$q)
try {
  $enc = [System.Uri]::EscapeDataString($q)
  $url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=$enc"
  $r = Invoke-RestMethod -Uri $url -Headers @{ 'User-Agent'='mirai-planner-geocoder/1.0 (contact: chaswick@example.com)' } -ErrorAction Stop
  $r | ConvertTo-Json -Depth 5
} catch {
  Write-Output "ERROR: $_"
}
