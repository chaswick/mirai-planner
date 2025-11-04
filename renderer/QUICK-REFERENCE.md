# Renderer Quick Reference

## What You Can Configure

### 🎨 Visual Style
- **clean** - Original minimalist design
- **daily-planner** - Japan-inspired with decorative elements, Japanese fonts

### 📚 Educational Modules

| Module | What It Does | Example |
|--------|--------------|---------|
| **Word Bank** | Daily vocabulary list | 朝 (asa) — morning |
| **Phrase of Day** | Useful daily phrase | ありがとうございます — Thank you |
| **Kanji of Day** | One kanji with meaning | 駅 (eki) — Station |
| **Fun Facts** | Cultural tidbits | "Over 3 million vending machines in Japan" |

### 🎯 Interactive Elements

| Module | Purpose | Good For |
|--------|---------|----------|
| **Scavenger Hunt** | "I Spy" checklist per day | Kids, photography, engagement |
| **Kid Daily Quest** | Simple daily goals | Children, gamification |
| **Meals Checklist** | Track breakfast/lunch/dinner | Food planning |
| **Travel Checklist** | Log transportation modes | Transit tracking |

### 📝 Practical Additions

| Module | What It Adds |
|--------|--------------|
| **Notes Section** | Ruled lines for handwritten notes |
| **Day Rating** | Bubbles to rate each day (○○○○) |

### 🎌 Japanese Decorative Elements

| Module | Description |
|--------|-------------|
| **Watermark** | Large, subtle background kanji (e.g., 旅 = journey) |
| **Microseasons** | Traditional 5-day seasonal periods (七十二候) |
| **Japanese Labels** | Show 朝 next to "Morning", etc. |

## Quick Config Examples

### Family Trip with Kids
```json
{
  "style": "daily-planner",
  "modules": {
    "wordBank": { "enabled": true, "words": [...] },
    "scavengerHunt": { "enabled": true, "hunts": [...] },
    "kidQuest": { "enabled": true, "quests": [...] },
    "mealsChecklist": true,
    "notesSection": true,
    "dayRating": true,
    "japaneseLabels": true
  }
}
```

### Solo Cultural Immersion
```json
{
  "style": "daily-planner",
  "modules": {
    "phraseOfDay": { "enabled": true, "phrases": [...] },
    "kanjiOfDay": { "enabled": true, "kanjis": [...] },
    "funFacts": { "enabled": true, "facts": [...] },
    "notesSection": true,
    "decorativeWatermark": { "enabled": true, "text": "旅" },
    "japaneseMicroseasons": { "enabled": true, "seasons": [...] }
  }
}
```

### Business Trip (Minimal)
```json
{
  "style": "clean",
  "modules": {
    "notesSection": true,
    "travelChecklist": true
  }
}
```

### Print-Only Logistics
```json
{
  "style": "clean",
  "modules": {
    "mealsChecklist": true,
    "travelChecklist": true
  }
}
```

## Per-Day vs. Global Modules

### Per-Day (Date-Specific)
These modules map content to specific dates:
- Phrase of Day
- Kanji of Day
- Fun Facts
- Scavenger Hunt
- Kid Quest

**Example:**
```json
"phraseOfDay": {
  "enabled": true,
  "phrases": [
    { "date": "2025-11-18", "phrase": "...", "romaji": "...", "english": "..." },
    { "date": "2025-11-19", "phrase": "...", "romaji": "...", "english": "..." }
  ]
}
```

### Global (Apply to All Days)
These modules apply everywhere:
- Word Bank
- Meals Checklist
- Travel Checklist
- Notes Section
- Day Rating
- Watermark
- Japanese Labels

**Example:**
```json
"mealsChecklist": true,
"notesSection": true
```

## Config File Organization

### Recommended Structure
```
my-trips/
├── data/
│   ├── japan-2025.json          # Trip data
│   └── europe-2026.json         # Trip data
└── configs/
    ├── japan-family.json        # Japan + kids
    ├── japan-cultural.json      # Japan + language learning
    ├── general-clean.json       # Minimal for any trip
    └── photo-tour.json          # Scavenger hunts focused
```

### Reusable Configs
Create template configs you can reuse:
- `kid-friendly-template.json` - Quests, scavenger hunts, simple language
- `cultural-deep-dive-template.json` - All educational modules
- `photography-template.json` - Heavy on scavenger hunts and fun facts
- `logistics-only-template.json` - Just checklists and notes

## Common Patterns

### Pattern: Progressive Phrases
Start simple, get more complex:
```json
[
  { "date": "2025-11-16", "phrase": "ありがとう", "english": "Thanks (casual)" },
  { "date": "2025-11-17", "phrase": "ありがとうございます", "english": "Thank you (polite)" },
  { "date": "2025-11-18", "phrase": "どうもありがとうございます", "english": "Thank you very much" }
]
```

### Pattern: Themed Scavenger Hunts
Match hunts to day activities:
- **Transit Day:** Train stations, IC cards, platform signs
- **Temple Day:** Shrine gates, fox statues, lanterns
- **Food Day:** Ramen shops, vending machines, konbini

### Pattern: Age-Appropriate Quests
```json
// Young kids (5-8)
["Spot 3 colors", "Find something round", "Count to 5 in Japanese"]

// Older kids (9-12)
["Learn a kanji", "Try a new food", "Take a creative photo"]

// Teens
["Read a sign in Japanese", "Navigate to next location", "Interview a local"]
```

## Tips

1. **Start Small:** Begin with clean style + notes + rating, add modules gradually
2. **Test Print:** Always print preview before final printing
3. **Date Alignment:** Make sure phrase/kanji/fact dates match your actual trip days
4. **Backup Configs:** Save working configs as templates for future trips
5. **Mix Styles:** You can render the same trip twice (clean for adults, daily-planner for kids)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not showing | Check `enabled: true` and verify date matches |
| Japanese text not displaying | Ensure browser has font support or uses CDN font |
| Print looks wrong | Use print preview, check page breaks |
| Config not loading | Validate JSON syntax (use JSONLint) |

## Resources

- Full documentation: `renderer/README.md`
- Implementation details: `renderer/IMPLEMENTATION.md`
- Example configs: `renderer/*.json`
- Mockup reference: `renderer/Japan_Travel_Planner_Mockup.html`
