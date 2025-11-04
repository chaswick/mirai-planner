# Testing the Enhanced Renderer

## Quick Test Steps

1. **Open the enhanced renderer:**
   - Navigate to `renderer/index-enhanced.html` in your browser
   
2. **Test Clean Style (No Config):**
   - Load only `japan_trip.json`
   - Leave config file input empty
   - Click "Render Guide"
   - ✓ Should display original clean style
   
3. **Test Clean Style with Minimal Modules:**
   - Load `japan_trip.json`
   - Load `renderer/clean-config.json`
   - Click "Render Guide"
   - ✓ Should show notes section and day rating

4. **Test Daily Planner Style (Full Features):**
   - Load `japan_trip.json`
   - Load `renderer/japan-planner-config.json`
   - Click "Render Guide"
   - ✓ Should show:
     - Japanese fonts and labels
     - Word bank at bottom
     - Phrase/Kanji of day (side by side)
     - Fun facts
     - Scavenger hunts
     - Kid quests
     - Meals/Travel checklists
     - Notes with ruled lines
     - Day rating bubbles
     - Watermark (旅) in background

5. **Test Print Preview:**
   - Use browser's Print Preview (Ctrl+P / Cmd+P)
   - ✓ Should see page breaks
   - ✓ Colors should be preserved
   - ✓ Ruled lines should be visible

## What to Check

### Visual Elements
- [ ] Japanese font (Noto Sans JP) loads correctly
- [ ] Watermark appears faded in background
- [ ] SVG icons display next to section headers
- [ ] Two-column layout for phrase/kanji/fact
- [ ] Checkboxes render as empty squares

### Module Functionality
- [ ] Word Bank: Shows all vocabulary at once
- [ ] Phrase of Day: Shows correct phrase for each date
- [ ] Kanji of Day: Shows correct kanji for each date
- [ ] Fun Facts: Shows correct fact for each date
- [ ] Scavenger Hunt: Shows correct items for each date
- [ ] Kid Quest: Shows correct tasks for each date
- [ ] Meals Checklist: Shows breakfast/lunch/dinner
- [ ] Travel Checklist: Shows taxi/train/walking/etc
- [ ] Notes Section: Shows ruled lines
- [ ] Day Rating: Shows 4 empty bubbles

### Configuration
- [ ] No config = clean style works
- [ ] clean-config.json = minimal additions
- [ ] japan-planner-config.json = full features
- [ ] Can reload and switch between configs

### Print Quality
- [ ] Page breaks between days
- [ ] No content cut off
- [ ] Colors visible in print
- [ ] Ruled lines print clearly

## Known Limitations

1. **Font Loading:** Requires internet connection for Google Fonts
   - Solution: Download Noto Sans JP and host locally if needed

2. **Date Matching:** Phrase/kanji/fact only show if date exactly matches
   - Make sure config dates align with your trip JSON dates

3. **Browser Compatibility:** Tested in modern Chrome/Firefox/Safari
   - IE11 and older browsers not supported

## Troubleshooting

### Japanese Text Not Showing
- Check internet connection (font needs to load)
- Verify browser supports web fonts
- Try refreshing the page

### Module Not Appearing
- Verify `enabled: true` in config
- Check date format is YYYY-MM-DD
- Ensure date exists in your trip JSON

### Print Issues
- Use "Background graphics" option in print dialog
- Try different browsers if colors don't show
- Export as PDF for best results

## Example Test Data

The example configs are already aligned with the sample dates in `japan_trip.json`:
- Dates: 2025-11-16 through 2025-11-XX
- Phrases, kanji, facts, and hunts configured for these dates

If your trip JSON has different dates, update the config file dates to match.

## Next Steps After Testing

1. **Create Your Own Config:**
   - Copy `japan-planner-config.json`
   - Update dates to match your trip
   - Customize phrases, facts, and hunts
   - Add/remove modules as needed

2. **Replace Original Renderer (Optional):**
   - If you want to make enhanced version the default
   - Backup `renderer/index.html`
   - Rename `index-enhanced.html` to `index.html`

3. **Create Additional Templates:**
   - Make configs for different trip types
   - Share templates with family/friends
   - Build a library of reusable configs

## Report Issues

If you find bugs or have suggestions:
- Check the date alignment first
- Verify JSON is valid (use JSONLint.com)
- Try with example files to isolate the issue
- Check browser console for errors (F12)
