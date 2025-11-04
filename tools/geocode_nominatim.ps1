$queries = @(
 @{id='Kyoto_Inabado_Hotel'; q='717-1 Inabado-cho, Matsubara-agaru Higashigawa, Karasuma-dori, Shimogyo-ku, Kyoto 600-8415, Japan'},
 @{id='Hakone_Airu'; q='499-1 Yumoto, Hakone-machi, Ashigarashimo-gun, Kanagawa, Japan'},
 @{id='Tokyo_Akasaka_Hotel'; q='7-9-6 Akasaka, Minato-ku, Tokyo 107-0052, Japan'},
 @{id='Kiyomizu-dera'; q='Kiyomizu-dera, Kyoto, Japan'},
 @{id='Higashiyama Lanes'; q='Sannenzaka Ninenzaka, Higashiyama, Kyoto, Japan'},
 @{id='Yasaka Shrine'; q='Yasaka Shrine, Gion, Kyoto, Japan'},
 @{id='Gion District'; q='Gion, Kyoto, Japan'},
 @{id='Osaka Castle Grounds'; q='Osaka Castle, Osaka, Japan'},
 @{id='Dotonbori'; q='Dotonbori, Osaka, Japan'},
 @{id='teamLab Botanical Garden'; q='teamLab Botanical Garden Nagai Park, Osaka, Japan'},
 @{id='Fushimi Inari Taisha'; q='Fushimi Inari Taisha, Kyoto, Japan'},
 @{id='Todai-ji'; q='Todai-ji, Nara, Japan'},
 @{id='Nara Park Deer'; q='Nara Park, Nara, Japan'},
 @{id='Kinkaku-ji'; q='Kinkaku-ji, Kyoto, Japan'},
 @{id='Tenryu-ji'; q='Tenryu-ji, Arashiyama, Kyoto, Japan'},
 @{id='Arashiyama Bamboo Grove'; q='Arashiyama Bamboo Grove, Kyoto, Japan'},
 @{id='Iwatayama Monkey Park'; q='Iwatayama Monkey Park, Arashiyama, Kyoto, Japan'},
 @{id='Nijo Castle'; q='Nijo Castle, Kyoto, Japan'},
 @{id='Hakone Ropeway'; q='Hakone Ropeway, Hakone, Japan'},
 @{id='Owakudani'; q='Owakudani, Hakone, Japan'},
 @{id='Lake Ashi Cruise'; q='Lake Ashi, Hakone, Japan'},
 @{id='Ryokan Onsen Evening'; q='Yumoto Hakone ryokan, Hakone, Japan'},
 @{id='teamLab Planets'; q='teamLab Planets, Toyosu, Tokyo, Japan'},
 @{id='Tokyo National Museum'; q='Tokyo National Museum, Ueno, Tokyo, Japan'},
 @{id='Ueno Zoo'; q='Ueno Zoo, Ueno, Tokyo, Japan'},
 @{id='Ameyoko Market'; q='Ameyoko, Ueno, Tokyo, Japan'},
 @{id='Imperial Palace East Gardens'; q='Imperial Palace East Gardens, Tokyo, Japan'},
 @{id='teamLab Borderless'; q='teamLab Borderless, Odaiba, Tokyo, Japan'},
 @{id='Hamarikyu Gardens'; q='Hamarikyu Gardens, Tokyo, Japan'},
 @{id='Mori Tower Observation Deck'; q='Mori Tower Roppongi Hills observation deck, Tokyo, Japan'},
 @{id='Shinjuku Gyoen'; q='Shinjuku Gyoen, Tokyo, Japan'},
 @{id='Shinjuku District Wander'; q='Shinjuku, Tokyo, Japan'},
 @{id='Shibuya Crossing'; q='Shibuya Crossing, Tokyo, Japan'},
 @{id='Shibuya Shopping/Dinner'; q='Shibuya, Tokyo, Japan'},
 @{id='Nintendo Museum'; q='Nintendo Museum, Kyoto, Japan'},
 @{id='teamLab Biovortex'; q='teamLab Biovortex, Osaka, Japan'},
 @{id='Kiyomizu-dera-dup'; q='Kiyomizu-dera, Kyoto, Japan'}
)

$results = @()

foreach ($item in $queries) {
    $url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + [System.Uri]::EscapeDataString($item.q)
    try {
        $resp = Invoke-RestMethod -Uri $url -Headers @{ 'User-Agent' = 'mirai-planner-geocoder/1.0 (contact: chaswick@example.com)' } -Method Get -ErrorAction Stop
    } catch {
        $resp = @()
    }
    if ($resp -and $resp.Count -gt 0) {
        $r = $resp[0]
        $results += [pscustomobject]@{id=$item.id; query=$item.q; display_name=$r.display_name; lat=[double]$r.lat; lon=[double]$r.lon; type=$r.type}
    } else {
        $results += [pscustomobject]@{id=$item.id; query=$item.q; display_name=$null; lat=$null; lon=$null; type=$null}
    }
    Start-Sleep -Seconds 1
}

$results | ConvertTo-Json -Depth 5 | Out-File -FilePath geocoding_results.json -Encoding UTF8
Write-Output 'WROTE geocoding_results.json'
