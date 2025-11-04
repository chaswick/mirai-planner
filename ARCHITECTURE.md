# Mirai Planner Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MIRAI PLANNER SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   SCHEMA LAYER   │         │    DATA LAYER    │         │  PRESENTATION    │
│                  │         │                  │         │      LAYER       │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│                  │         │                  │         │                  │
│ trip-planner     │ defines │ japan_trip.json  │ feeds   │ renderer/        │
│ .schema.json     │────────>│                  │────────>│ index.html       │
│                  │         │ - activities     │         │                  │
│ Defines:         │         │ - day_collection │         │ Renders:         │
│ - Activities     │         │ - segments       │         │ - Trip overview  │
│ - Days           │         │ - itinerary      │         │ - Daily plans    │
│ - Segments       │         │ - KPI mappings   │         │ - Activity cards │
│ - Transit        │         │                  │         │                  │
│                  │         └──────────────────┘         └──────────────────┘
│                  │                   │                           ▲
│                  │                   │                           │
│ render-config    │                   │         ┌─────────────────┘
│ .schema.json     │ defines           └────────>│
│                  │                             │
│ Defines:         │         ┌──────────────────▼┐
│ - Style options  │         │  CONFIG LAYER     │
│ - Module toggles │         │  (Optional)       │
│ - Content data   │         ├───────────────────┤
│                  │         │                   │
└──────────────────┘         │ japan-planner     │
                             │ -config.json      │
                             │                   │
                             │ OR                │
                             │                   │
                             │ clean-config.json │
                             │                   │
                             │ Configures:       │
                             │ - Word banks      │
                             │ - Daily phrases   │
                             │ - Scavenger hunts │
                             │ - Decorations     │
                             │ - Checklists      │
                             │                   │
                             └───────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         EDITING WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────┘

   ┌──────────────┐
   │   EDITOR     │
   │ (Planner)    │
   └──────┬───────┘
          │
          │ Create/Edit
          ▼
   ┌──────────────┐
   │ Trip JSON    │
   │ (Data Only)  │
   └──────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                        RENDERING WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────┘

   ┌──────────────┐       ┌──────────────┐
   │ Trip JSON    │       │ Config JSON  │
   │              │       │  (Optional)  │
   └──────┬───────┘       └──────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
                     │ Load both
                     ▼
          ┌─────────────────────┐
          │     RENDERER        │
          │                     │
          │ 1. Parse trip data  │
          │ 2. Apply config     │
          │ 3. Render modules   │
          │ 4. Style output     │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │  HTML Trip Guide    │
          │                     │
          │ Print or View       │
          └─────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      MODULE ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────┘

                    ┌────────────────┐
                    │   RENDERER     │
                    │   CORE         │
                    └────────┬───────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼─────────┐         ┌────────▼────────┐
    │  BASE RENDERING   │         │ OPTIONAL        │
    │                   │         │ MODULES         │
    │ - Trip overview   │         │                 │
    │ - Segment cards   │         │ If enabled:     │
    │ - Day cards       │         │                 │
    │ - Activity details│         │ ┌─────────────┐ │
    │ - KPI badges      │         │ │ Word Bank   │ │
    │ - Time totals     │         │ ├─────────────┤ │
    │                   │         │ │ Phrase/Day  │ │
    └───────────────────┘         │ ├─────────────┤ │
                                  │ │ Kanji/Day   │ │
                                  │ ├─────────────┤ │
                                  │ │ Fun Facts   │ │
                                  │ ├─────────────┤ │
                                  │ │ Scav Hunt   │ │
                                  │ ├─────────────┤ │
                                  │ │ Kid Quest   │ │
                                  │ ├─────────────┤ │
                                  │ │ Checklists  │ │
                                  │ ├─────────────┤ │
                                  │ │ Notes       │ │
                                  │ ├─────────────┤ │
                                  │ │ Decorations │ │
                                  │ └─────────────┘ │
                                  └─────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                     CONFIGURATION MATRIX                            │
└─────────────────────────────────────────────────────────────────────┘

  Module             │ Per-Day │ Global │ Style-Specific │
  ───────────────────┼─────────┼────────┼────────────────┤
  Word Bank          │         │   ✓    │                │
  Phrase of Day      │    ✓    │        │                │
  Kanji of Day       │    ✓    │        │                │
  Fun Facts          │    ✓    │        │                │
  Scavenger Hunt     │    ✓    │        │                │
  Kid Quest          │    ✓    │        │                │
  Meals Checklist    │         │   ✓    │                │
  Travel Checklist   │         │   ✓    │                │
  Notes Section      │         │   ✓    │                │
  Day Rating         │         │   ✓    │                │
  Watermark          │         │   ✓    │  daily-planner │
  Microseasons       │    ✓    │        │  daily-planner │
  Japanese Labels    │         │   ✓    │  daily-planner │
  SVG Decorations    │         │   ✓    │  daily-planner │


┌─────────────────────────────────────────────────────────────────────┐
│                         USE CASES                                   │
└─────────────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────┐
  │ USE CASE: Family with Kids                                 │
  ├────────────────────────────────────────────────────────────┤
  │ Trip Data: japan_trip.json                                 │
  │ Config: japan-planner-config.json (full features)          │
  │                                                            │
  │ Modules Enabled:                                           │
  │ ✓ Scavenger hunts (interactive engagement)                 │
  │ ✓ Kid daily quests (gamification)                          │
  │ ✓ Word bank (language learning)                            │
  │ ✓ Fun facts (educational)                                  │
  │ ✓ Meals checklist (practical)                              │
  │ ✓ Japanese decorations (cultural immersion)                │
  └────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────┐
  │ USE CASE: Solo Cultural Immersion                          │
  ├────────────────────────────────────────────────────────────┤
  │ Trip Data: japan_trip.json                                 │
  │ Config: cultural-config.json                               │
  │                                                            │
  │ Modules Enabled:                                           │
  │ ✓ Phrase of day (language practice)                        │
  │ ✓ Kanji of day (writing practice)                          │
  │ ✓ Fun facts (deep cultural insights)                       │
  │ ✓ Microseasons (traditional calendar)                      │
  │ ✓ Notes section (journaling)                               │
  └────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────┐
  │ USE CASE: Business Trip                                    │
  ├────────────────────────────────────────────────────────────┤
  │ Trip Data: tokyo-business.json                             │
  │ Config: clean-config.json                                  │
  │                                                            │
  │ Modules Enabled:                                           │
  │ ✓ Travel checklist (logistics tracking)                    │
  │ ✓ Notes section (meeting notes)                            │
  │ ✗ All educational/fun modules (not needed)                 │
  └────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────┐
  │ USE CASE: Multiple Renderings                              │
  ├────────────────────────────────────────────────────────────┤
  │ Scenario: Same trip, different audiences                   │
  │                                                            │
  │ japan_trip.json + japan-planner-config.json                │
  │   → Full planner for kids                                  │
  │                                                            │
  │ japan_trip.json + clean-config.json                        │
  │   → Logistics summary for grandparents                     │
  │                                                            │
  │ japan_trip.json + cultural-config.json                     │
  │   → Language-focused guide for language students           │
  └────────────────────────────────────────────────────────────┘
```
