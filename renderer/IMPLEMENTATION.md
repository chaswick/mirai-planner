# Renderer Enhancement Implementation Guide

## Overview

This document explains how to integrate the daily-planner-style modules from `Japan_Travel_Planner_Mockup.html` into the existing `renderer/index.html`.

## Design Principles

1. **Separation of Concerns**: Trip data (activities, days) stays separate from presentation config (word banks, phrases)
2. **Backward Compatibility**: Existing renderer works unchanged without a config file
3. **Modularity**: Each enhancement (word bank, scavenger hunt, etc.) is independently toggled
4. **Reusability**: Same trip JSON can be rendered multiple ways by changing the config

## Implementation Steps

### Phase 1: Configuration System ✓ COMPLETE

**Files Created:**
- `renderer/render-config.schema.json` - Schema defining all optional modules
- `renderer/japan-planner-config.json` - Full-featured example for Japan trips
- `renderer/clean-config.json` - Minimal example with just notes and ratings

**What It Does:**
- Defines structure for all optional rendering modules
- Validates configuration files
- Provides examples for different use cases

### Phase 2: Renderer Enhancement (TO DO)

**Modify `renderer/index.html` to:**

1. **Add Config Loading**
   ```javascript
   // Add alongside trip JSON file input
   <input id="configFile" type="file" accept=".json" />
   ```

2. **Extend State Object**
   ```javascript
   const state = {
     data: null,      // trip JSON
     config: null     // render config JSON
   };
   ```

3. **Add Module Rendering Functions**
   
   For each module, create a builder function:
   
   ```javascript
   function renderWordBank(config, grid) {
     if (!config?.modules?.wordBank?.enabled) return;
     const words = config.modules.wordBank.words || [];
     // Build word bank UI element
   }
   
   function renderPhraseOfDay(date, config, grid) {
     if (!config?.modules?.phraseOfDay?.enabled) return;
     const phrase = config.modules.phraseOfDay.phrases.find(p => p.date === date);
     if (!phrase) return;
     // Build phrase UI element
   }
   
   // Similar functions for:
   // - renderKanjiOfDay
   // - renderFunFact
   // - renderScavengerHunt
   // - renderKidQuest
   // - renderMealsChecklist
   // - renderTravelChecklist
   // - renderNotesSection
   // - renderDayRating
   ```

4. **Add Style Switching**
   ```javascript
   function applyStyle(config) {
     const style = config?.style || 'clean';
     if (style === 'daily-planner') {
       // Add daily-planner CSS classes
       // Load Japanese font (Noto Sans JP)
       // Apply page layout changes
     }
   }
   ```

5. **Enhance Day Rendering**
   
   Modify the existing `renderDay()` function:
   
   ```javascript
   function renderDay(root, day, lookup, kpiMap, config) {
     // ... existing day rendering ...
     
     // Add modular enhancements if configured
     if (config) {
       renderPhraseOfDay(day.date, config, card);
       renderKanjiOfDay(day.date, config, card);
       renderFunFact(day.date, config, card);
       renderScavengerHunt(day.date, config, card);
       renderKidQuest(day.date, config, card);
       
       if (config.modules.mealsChecklist) {
         renderMealsChecklist(card);
       }
       if (config.modules.travelChecklist) {
         renderTravelChecklist(card);
       }
       if (config.modules.notesSection) {
         renderNotesSection(card);
       }
       if (config.modules.dayRating) {
         renderDayRating(card);
       }
     }
     
     // ... rest of existing code ...
   }
   ```

6. **Add CSS Styles**
   
   Extract styles from `Japan_Travel_Planner_Mockup.html`:
   
   ```css
   /* Daily Planner Style */
   .daily-planner .page {
     page-break-after: always;
   }
   
   .daily-planner header .watermark {
     position: absolute;
     right: 10px;
     bottom: 0;
     font-family: 'NotoSansJP', sans-serif;
     color: rgba(0,0,0,.08);
     font-size: 64px;
     font-weight: 700;
   }
   
   .daily-planner .jp-mini {
     font-family: 'NotoSansJP', sans-serif;
     color: rgba(0,0,0,.35);
     font-size: 14px;
   }
   
   /* Word Bank */
   .wordbank {
     display: flex;
     gap: 10px;
     font-family: 'NotoSansJP', sans-serif;
   }
   
   .wordbank .wb {
     border: 1px solid var(--line);
     padding: 2px 5px;
     border-radius: 4px;
   }
   
   /* Scavenger Hunt */
   .scav {
     list-style: none;
     columns: 2;
     column-gap: 14px;
   }
   
   .scav li .box {
     width: 10px;
     height: 10px;
     border: 1px solid var(--ink);
     display: inline-block;
     margin-right: 6px;
   }
   
   /* ... other styles from mockup ... */
   ```

7. **Add SVG Icon Library**
   
   Create helper functions for decorative SVG icons:
   
   ```javascript
   const SVG_ICONS = {
     transportation: `<svg class='accent' viewBox='0 0 200 40'>...</svg>`,
     food: `<svg class='accent' viewBox='0 0 64 16'>...</svg>`,
     // ... other icons from mockup
   };
   
   function getIcon(name) {
     return SVG_ICONS[name] || '';
   }
   ```

### Phase 3: Japanese Elements (TO DO)

1. **Font Loading**
   ```css
   @font-face {
     font-family: 'NotoSansJP';
     src: url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@200..900');
   }
   ```

2. **Microseason Lookup**
   ```javascript
   function getMicroseason(date, config) {
     if (!config?.modules?.japaneseMicroseasons?.enabled) return null;
     const seasons = config.modules.japaneseMicroseasons.seasons || [];
     return seasons.find(s => date >= s.startDate && date <= s.endDate);
   }
   ```

3. **Watermark Rendering**
   ```javascript
   function addWatermark(container, config) {
     if (!config?.modules?.decorativeWatermark?.enabled) return;
     const text = config.modules.decorativeWatermark.text || '';
     const watermark = el('div', 'watermark', text);
     container.appendChild(watermark);
   }
   ```

### Phase 4: Testing & Refinement (TO DO)

1. **Test Scenarios:**
   - Load trip JSON without config (should work as before)
   - Load trip JSON with clean-config.json (minimal enhancements)
   - Load trip JSON with japan-planner-config.json (all features)
   - Test print layout with each config
   - Test with different date ranges

2. **Browser Compatibility:**
   - Test print styles in Chrome, Firefox, Safari
   - Verify Japanese fonts load correctly
   - Check page breaks for printing

3. **Performance:**
   - Ensure large trip JSONs render smoothly
   - Optimize SVG rendering if needed

## Key Decisions

### Why Separate Config from Trip JSON?

**Pros:**
- Same trip data can have multiple presentations (family-friendly, business trip, solo adventure)
- Trip data stays clean and focused on logistics
- Easier to share trip data without personal customizations
- Configs can be templates (reuse "Tokyo trip config" for multiple Tokyo trips)

**Cons:**
- Two files to manage
- Extra UI complexity for file loading

**Decision:** Separate is better for modularity and reusability

### Why Not Extend the Schema?

We could have added these fields to the main trip schema:

```json
"day_collection": [{
  "date": "2025-11-18",
  "phrase_of_day": { "phrase": "...", "romaji": "..." },
  "scavenger_hunt": [...],
  // ...
}]
```

**Why we didn't:**
- Bloats the core data model
- Mixes presentation with data
- Makes schema validation more complex
- Harder to maintain separation of concerns

### Module On/Off vs. Full Feature Sets

We chose granular enable/disable per module rather than preset "profiles" (e.g., "family mode", "solo mode"):

**Advantages:**
- Maximum flexibility
- Users create custom combinations
- Easy to add new modules without complex profile management

**Disadvantages:**
- More verbose configs
- Users need to understand each module

**Mitigation:** Provide good example configs as templates

## Next Steps for Full Implementation

1. **Implement Phase 2** - Add config loading and module rendering to `renderer/index.html`
2. **Implement Phase 3** - Add Japanese fonts and decorative elements
3. **Test thoroughly** with various configs and trip data
4. **Create additional example configs** for different trip types:
   - `family-adventure-config.json` - Kid-friendly features
   - `cultural-immersion-config.json` - Language learning focus
   - `photography-config.json` - Visual elements and scavenger hunts
   - `minimal-print-config.json` - Just essential logistics for printing

## File Dependencies

```
renderer/
├── index.html (NEEDS ENHANCEMENT)
│   ├── Loads: trip JSON
│   ├── Loads: config JSON (optional)
│   └── Renders: HTML guide
├── render-config.schema.json (COMPLETE)
├── japan-planner-config.json (COMPLETE)
├── clean-config.json (COMPLETE)
├── README.md (COMPLETE)
└── Japan_Travel_Planner_Mockup.html (REFERENCE)
```

## Additional Resources

- **Noto Sans JP Font:** Google Fonts CDN or download for offline use
- **72 Japanese Microseasons:** https://en.wikipedia.org/wiki/Shichij%C5%ABni_k%C5%8D for complete list
- **Print CSS Best Practices:** https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/

---

**Status:** Phase 1 complete. The configuration system and schema are ready. Next step is to enhance the renderer to actually use these configs to generate the styled output.
