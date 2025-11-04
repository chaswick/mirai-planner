# Quick Start - Enhanced Renderer

## 5-Minute Setup

### Step 1: Open the Enhanced Renderer
```
📂 mirai-planner/renderer/index-enhanced.html
```
Double-click to open in your browser

### Step 2: Load Your Files
1. **Trip JSON (required):** Click "Browse" next to "Trip JSON"
   - Select: `japan_trip.json` (or your trip file)

2. **Config JSON (optional):** Click "Browse" next to "Render Config JSON"
   - Select: `renderer/japan-planner-config.json` (full features)
   - OR: `renderer/clean-config.json` (minimal)
   - OR: Leave empty (original style)

### Step 3: Click "Render Guide"
That's it! Your trip guide appears below.

## What You'll See

### Without Config
- Clean minimalist design
- Activities by day
- Time totals
- Basic notes field

### With clean-config.json
- Everything above, plus:
- Ruled lines for notes
- Day rating bubbles

### With japan-planner-config.json
- Everything above, plus:
- 📚 Word bank vocabulary
- 🗣️ Daily Japanese phrases
- 📝 Kanji of the day
- 💡 Fun facts about Japan
- 🔍 Scavenger hunts
- 🎯 Kid daily quests
- 🍽️ Meals checklist
- 🚇 Travel checklist
- Japanese labels (朝/昼/夜)
- Decorative watermark (旅)
- Microseasons

## Print Your Guide

1. Press **Ctrl+P** (Windows) or **Cmd+P** (Mac)
2. Check **"Background graphics"** option
3. Preview looks good? Click Print!
4. Or save as PDF for digital use

## Customize Your Config

### Start from Template
```bash
# Copy the full example
cp renderer/japan-planner-config.json my-trip-config.json
```

### Edit Dates
Make sure dates match your trip:
```json
"phraseOfDay": {
  "enabled": true,
  "phrases": [
    { "date": "2025-11-18", ... },  ← Change these dates
    { "date": "2025-11-19", ... }   ← to match your trip
  ]
}
```

### Enable/Disable Modules
```json
"modules": {
  "wordBank": { "enabled": true },     ← true = show
  "scavengerHunt": { "enabled": false } ← false = hide
}
```

### Save and Reload
1. Save your config file
2. Click "Load different files" in renderer
3. Load trip JSON + your new config
4. Click "Render Guide"

## Common Scenarios

### Scenario 1: Just Testing
```
Load: japan_trip.json
Config: japan-planner-config.json
Result: See all features in action
```

### Scenario 2: My Real Trip
```
1. Copy japan-planner-config.json → my-trip-config.json
2. Edit dates to match your trip
3. Update phrases/facts/hunts for your destinations
4. Load: your-trip.json + my-trip-config.json
```

### Scenario 3: Different Audiences
```
# For kids:
Load: japan_trip.json + kids-config.json
(Enable: scavenger hunts, quests, word bank)

# For adults:
Load: japan_trip.json + cultural-config.json
(Enable: phrases, kanji, facts, microseasons)

# For logistics only:
Load: japan_trip.json + clean-config.json
(Enable: checklists, notes only)
```

## Troubleshooting

### Problem: Japanese text not showing
**Solution:** Check internet connection (font loads from Google)

### Problem: Module not appearing
**Solution:** 
1. Check `enabled: true` in config
2. Verify date format: `YYYY-MM-DD`
3. Make sure date exists in your trip JSON

### Problem: Nothing loads
**Solution:**
1. Check browser console (F12) for errors
2. Validate JSON at jsonlint.com
3. Try with example files first

### Problem: Print looks wrong
**Solution:**
1. Enable "Background graphics" in print dialog
2. Try Chrome if using other browser
3. Export as PDF instead of direct printing

## File Locations

```
mirai-planner/
├── renderer/
│   ├── index-enhanced.html       ← Open this
│   ├── japan-planner-config.json ← Full example
│   ├── clean-config.json         ← Minimal example
│   └── README.md                 ← Full documentation
└── japan_trip.json               ← Your trip data
```

## Getting Help

1. **Quick answers:** `renderer/QUICK-REFERENCE.md`
2. **Full docs:** `renderer/README.md`
3. **Testing help:** `renderer/TESTING.md`
4. **Comparison:** `renderer/COMPARISON.md`

## Tips

💡 **Start simple:** No config first, then add features gradually

💡 **Dates matter:** Config dates must match trip JSON dates exactly

💡 **Reuse configs:** Create templates for different trip types

💡 **Test often:** Load and preview after each config change

💡 **Print early:** Test print layout before finalizing

💡 **Multiple versions:** Create different configs for different family members

## Success Checklist

- [ ] Opened `index-enhanced.html` in browser
- [ ] Loaded a trip JSON file
- [ ] Tried without config (clean style)
- [ ] Tried with `japan-planner-config.json` (full features)
- [ ] Tested print preview
- [ ] Customized a config file
- [ ] Saved and reloaded successfully

## What's Next?

1. **Use it:** Plan your actual trip with the enhanced renderer
2. **Share it:** Create configs for family members
3. **Expand it:** Add more phrases/facts/hunts to your config
4. **Adapt it:** Use the system for other destinations

---

**You're ready to create beautiful, interactive trip guides!** 🎉

Need more help? Check the full documentation in `renderer/README.md`
