# Enhanced Trip Planner Renderer

## Overview

The enhanced renderer now supports **modular, optional rendering elements** inspired by daily planner aesthetics, specifically tailored for Japan trips but configurable for other destinations.

## Architecture

### Components

1. **Schema** (`trip-planner.schema.json`) - Defines the trip data structure
2. **Trip JSON** (`japan_trip.json`) - Contains your actual trip activities, days, segments
3. **Render Config** (`render-config.schema.json` + example configs) - NEW! Controls which optional modules to render
4. **Renderer** (`index.html`) - Loads trip JSON and config, renders the guide

### Modular Design

The renderer remains **backward compatible**. Without a config file, it uses the "clean" style. With a config, you can enable:

- Japanese labels and decorative elements
- Word banks (vocabulary lists)
- Phrase/Kanji of the day
- Fun facts
- Scavenger hunts
- Kid daily quests
- Meals & travel checklists
- Handwritten notes sections
- Day rating bubbles
- Decorative watermarks
- Japanese microseasons (七十二候 - 72 micro-seasons)

## Usage

### Enhanced Renderer (NEW - Recommended)

1. Open `renderer/index-enhanced.html`
2. Load your trip JSON file (required)
3. Optionally load a render config JSON (see examples below)
4. Click "Render Guide"

**Without config:** Uses clean style (original minimalist design)  
**With config:** Enables optional modules based on your configuration

### Original Renderer (Legacy)

1. Open `renderer/index.html`
2. Load your trip JSON file
3. Click "Render Guide"

> **Note:** The original renderer is kept for backward compatibility. New features are only available in `index-enhanced.html`.

## Configuration Options

### Style

```json
{
  "style": "clean" | "daily-planner"
}
```

- **clean**: Original minimalist design
- **daily-planner**: Japan-inspired with decorative elements

### Modules

#### Word Bank
Display daily vocabulary words with kanji, romaji, and English translations.

```json
"wordBank": {
  "enabled": true,
  "words": [
    { "kanji": "朝", "romaji": "asa", "english": "morning" },
    { "kanji": "駅", "romaji": "eki", "english": "station" }
  ]
}
```

#### Phrase of the Day
Show a useful phrase for each day of the trip.

```json
"phraseOfDay": {
  "enabled": true,
  "phrases": [
    {
      "date": "2025-11-18",
      "phrase": "ありがとうございます",
      "romaji": "arigatou gozaimasu",
      "english": "Thank you very much"
    }
  ]
}
```

#### Kanji of the Day
Highlight one kanji character per day with pronunciation and meaning.

```json
"kanjiOfDay": {
  "enabled": true,
  "kanjis": [
    { "date": "2025-11-18", "kanji": "駅", "romaji": "eki", "english": "Station" }
  ]
}
```

#### Fun Facts
Add interesting cultural facts for each day.

```json
"funFacts": {
  "enabled": true,
  "facts": [
    { "date": "2025-11-18", "fact": "Nishiki Market is nicknamed 'Kyoto's Kitchen.'" }
  ]
}
```

#### Scavenger Hunt
Create interactive "I Spy" checklists for kids (or adults!).

```json
"scavengerHunt": {
  "enabled": true,
  "hunts": [
    {
      "date": "2025-11-18",
      "title": "Local Exploration",
      "items": [
        "Lanterns on a side street",
        "Wooden machiya house",
        "Fox statue (Inari)"
      ]
    }
  ]
}
```

#### Kid Daily Quest
Simple daily goals for children.

```json
"kidQuest": {
  "enabled": true,
  "quests": [
    {
      "date": "2025-11-18",
      "tasks": [
        "Spot a shrine gate",
        "Try a local treat",
        "Learn 1 Japanese word"
      ]
    }
  ]
}
```

#### Checklists

Simple boolean toggles:

```json
"mealsChecklist": true,      // Breakfast, Lunch, Dinner checkboxes
"travelChecklist": true,     // Taxi, Train, Walking, etc.
"notesSection": true,        // Ruled lines for handwritten notes
"dayRating": true            // Rate your day: ○○○○
```

#### Decorative Watermark

Add large, subtle background text (e.g., kanji) to each page.

```json
"decorativeWatermark": {
  "enabled": true,
  "text": "旅"  // "Journey" in Japanese
}
```

#### Japanese Microseasons (七十二候)

Display traditional Japanese 5-day seasonal periods.

```json
"japaneseMicroseasons": {
  "enabled": true,
  "seasons": [
    {
      "startDate": "2025-11-17",
      "endDate": "2025-11-21",
      "kanji": "虹蔵不見",
      "romaji": "niji kakurete miezu",
      "english": "Rainbows hide away"
    }
  ]
}
```

#### Japanese Labels

Show Japanese text alongside English headers:

```json
"japaneseLabels": true  // Shows "朝" next to "Morning", etc.
```

## Examples

### Minimal Config (Clean Style)

```json
{
  "style": "clean",
  "modules": {
    "notesSection": true,
    "dayRating": true
  }
}
```

### Full Japan Planner Config

See `renderer/japan-planner-config.json` for a complete example with all modules enabled.

## SVG Accent Decorations

The daily-planner style includes decorative SVG icons for different sections:
- Transportation icons (plane, train, bus)
- Food/meal icons
- Cultural icons (temple, shrine)
- Activity icons

These are automatically applied when `style: "daily-planner"` is selected.

## Print Styling

Both styles support print-optimized layouts:
- Page break controls
- High-contrast for readability
- Letter size (8.5" × 11") with 0.5" margins
- Color preservation with `-webkit-print-color-adjust: exact`

## Future Enhancements

Potential additions:
- Photo upload/attachment per activity
- Map integration (per the mockup examples)
- Weather forecast integration
- Budget tracking
- Packing list generator
- Emergency contacts/phrases section

## File Structure

```
renderer/
├── index.html                        # Main renderer (enhanced)
├── render-config.schema.json         # Config schema definition
├── japan-planner-config.json         # Example: full Japan config
├── clean-config.json                 # Example: minimal config
└── Japan_Travel_Planner_Mockup.html  # Design inspiration reference
```

## Customization Tips

1. **Per-Day Content**: Most modules support date-specific content (phrase, kanji, facts, scavenger hunts)
2. **Mix & Match**: Enable only the modules relevant to your trip
3. **Reusable Configs**: Save configs for different trip types (city exploration, nature hiking, food tours)
4. **Language Adaptation**: While built for Japan, word banks and phrases can be adapted for any destination

## Contributing

When adding new modules:
1. Update `render-config.schema.json` with the new module definition
2. Add rendering logic to `index.html`
3. Provide an example in a config file
4. Document the module in this README
5. Consider backward compatibility

---

**Note**: The renderer keeps the trip JSON and render config separate by design. This allows you to:
- Reuse the same trip data with different rendering styles
- Share trip data without personalization
- Test different configurations without modifying core data
