# CodeAtlas (`</>`) — Interactive Programming Language Universe

CodeAtlas is an interactive visual atlas of programming languages where developers and students can explore programming languages, their historical genealogy, relationships, ecosystems, use cases, side-by-side comparisons, domain learning paths, and an interactive architecture quiz.

---

## 1. Visual & Architectural Design System

* **Primary Background:** `#05070D` (`--bg-void`)
* **Surface:** `#0B1020` (`--bg-surface`)
* **Elevated Surface:** `#111827` (`--bg-elevated`)
* **Border:** `#1E293B` (`--border-subtle`)
* **Primary Accent:** `#00F0FF` (Electric Cyan)
* **Secondary Accent:** `#8B5CF6` (Quantum Violet)
* **Typography:** `Inter` (Interface & Editorial Display) + `DM Mono` (Technical Telemetry, Years, Coordinates, and Code Syntax)

---

## 2. Project Structure

```text
CodeAtlas/
├── index.html          # Main entry point + integrated multi-view SPA/MPA experience
├── atlas.html          # Signature 3-pane Spatial Atlas Workbench
├── languages.html      # Searchable & filterable 16-language library
├── timeline.html       # Chronological milestones (1957 Fortran – 2014 Swift)
├── compare.html        # Side-by-side descriptive language comparison matrix
├── explore.html        # Interactive 6-domain learning path blueprints
├── quiz.html           # Interactive client-side programming architecture quiz
├── login.html          # Client-side demo session login
├── profile.html        # Language Dossier (?lang=python) & Developer Profile
├── admin.html          # Internal Admin Console (Overview, Languages, Quiz, Activity, Settings)
├── css/
│   ├── style.css       # Core CSS variables, reset, typography, navigation
│   ├── components.css  # Reusable cards, badges, buttons, inputs, code blocks
│   ├── atlas.css       # 3-pane spatial Atlas layout, HUD controls, tooltips
│   ├── admin.css       # Admin console shell, CRUD tables, status indicators
│   └── responsive.css  # Mobile navigation drawer, bottom-sheet inspector, breakpoints
├── js/
│   ├── data.js         # Centralized 16-language dataset, timeline, paths, quiz & localStorage store
│   ├── atlas.js        # Interactive Hero constellation & 3D-projected Spatial Atlas graph engine
│   └── main.js         # Hybrid router, UI controllers, comparison engine, quiz, and Admin CRUD
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 3. Static Client-Side Demo Architecture (`localStorage`)

This base version operates 100% client-side with zero backend or database requirement:

1. **PUBLIC CONTENT (`window.CODEATLAS_DEFAULT_LANGUAGES`, `CODEATLAS_TIMELINE`, `CODEATLAS_PATHS`):** Immutable baseline dataset defined in `js/data.js`.
2. **USER DEMO DATA (`codeatlas_user_session_v1`, `codeatlas_user_profile_v1`):** Stores local demo sign-in state (`{ email, joined }`), explored language nodes, selected learning path, and quiz telemetry. **Note:** This is a client-side static demonstration and is NOT production authentication.
3. **ADMIN DEMO DATA (`codeatlas_admin_langs_v1`, `codeatlas_admin_quiz_v1`, `codeatlas_admin_activity_v1`, `codeatlas_admin_settings_v1`):** Allows administrators to test editing/deleting languages, adding/deleting quiz questions, inspecting activity logs, and updating settings in `localStorage` without mutating source files. Includes a 1-click **Restore Default Dataset** button.
