# Planum — Chess Strategy Puzzles

A chess strategy training app built with React, Vite, and Supabase. No tactics, no engine scores, no "find the best move." Just positions, plans, and the reasoning behind good chess.

---

## What it is

Planum presents players with real chess positions and asks them to choose the best *plan* — not a specific move or forcing line. Every puzzle is built around a single strategic concept (minority attack, prophylaxis, piece quality, etc.), and every wrong answer comes with an explanation of *why* that plan falls short, not just that it does.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Database | Supabase (PostgreSQL) |
| Styling | Inline styles + global CSS in `index.html` |
| Fonts | Playfair Display + Crimson Pro (Google Fonts) |

---

## Prerequisites

- Node.js v18 or higher
- A Supabase project with the `puzzles` and `themes` tables set up (see [Database setup](#database-setup) below)

---

## Quick start

**1. Clone the repo and install dependencies**
```bash
git clone https://github.com/your-username/planum.git
cd planum
npm install
```

**2. Set up your environment variables**

Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values are found in your Supabase project under **Project Settings → API**.

**3. Start the dev server**
```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Project structure

```
planum/
├── index.html              # Vite entry point — fonts + global CSS live here
├── package.json
├── vite.config.js
├── .env                    # Local environment variables (never commit this)
├── .gitignore
├── scripts/
│   └── seed.js             # One-time script to populate the database
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # All components
    ├── puzzles.js          # Supabase fetch function
    └── supabase.js         # Supabase client
```

---

## Database setup

The app uses two Supabase tables.

### `themes`

| Column | Type | Notes |
|---|---|---|
| `id` | int8 | Primary key |
| `name` | text | Display name e.g. "Central Control" |
| `slug` | text | URL-friendly identifier e.g. "central-control" — must be unique |

### `puzzles`

| Column | Type | Notes |
|---|---|---|
| `id` | int8 | Primary key |
| `fen` | text | Valid FEN string |
| `side_to_move` | text | `"white"` or `"black"` — flips board automatically |
| `theme_id` | int8 | Foreign key → `themes.id` |
| `prompt` | text | The question shown to the user |
| `explanation` | text | Shown after submitting — explains the correct plan |
| `options` | jsonb | Array of answer options (see format below) |
| `created_at` | timestamptz | Auto-generated |

### Options JSONB format

```json
[
  { "id": "a", "text": "...", "correct": false, "wrongReason": "..." },
  { "id": "b", "text": "...", "correct": true },
  { "id": "c", "text": "...", "correct": false, "wrongReason": "..." },
  { "id": "d", "text": "...", "correct": false, "wrongReason": "..." }
]
```

- Exactly one option must have `"correct": true`
- `wrongReason` is shown when a user clicks a wrong option after submitting
- `explanation` and `wrongReason` should focus on strategic ideas, never move sequences

### Row Level Security

Make sure RLS read policies are enabled on both tables so the anon key can fetch data. In Supabase go to **Authentication → Policies** and add an **Enable read access for all users** policy on both `puzzles` and `themes`.

### Seeding the database

To populate the database with the initial puzzles, add your service role key to `.env`:
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then run:
```bash
npm run seed
```

This is a one-time operation. The seed script uses upsert on `themes` (matching on `slug`) so it is safe to run multiple times without creating duplicates.

---

## Component map

| Component | Responsibility |
|---|---|
| `App` | Top-level screen router (`home` / `puzzle`), fetches puzzles on mount |
| `HomePage` | Landing page — hero, feature cards, Tarrasch quote, footer |
| `PuzzlePage` | Puzzle state — selection, submission, wrong-reason inspection, navigation |
| `Chessboard` | Parses FEN, renders 8×8 board with Unicode pieces, view-only |
| `GhostBoard` | Decorative empty board on the homepage |
| `Logo` | Shared header logo — clickable on puzzle page to return home |
| `AnswerOption` | Answer button — handles pre-submit selection and post-submit inspection |
| `ThemeBadge` | Pill badge showing the puzzle's strategic theme |
| `ProgressBar` | Thin gold line at the top of the puzzle page |

---

## User flow

```
Home page
    └── "Begin Training" →  Puzzle page (puzzle 1 of N)
                                ├── Select an option
                                ├── "Confirm Plan"
                                │       ├── Result banner (correct / incorrect)
                                │       ├── Explanation of the correct plan
                                │       ├── Click any wrong option → wrongReason panel slides in
                                │       └── "Next Puzzle" → (repeat for all puzzles)
                                └── Logo → Home page
```

---

## UX principles

- Prompts and explanations never use the word "move" — only "plan" and "idea"
- No engine evaluations are shown at any point
- No calculation is required or rewarded
- The board is view-only — no dragging, clicking squares, or move highlighting
- Every wrong answer has a `wrongReason` explaining the strategic flaw
- The board flips automatically when `side_to_move` is `"black"`
- The "Begin Training" button is disabled until puzzles have loaded

---

## Design

| Decision | Rationale |
|---|---|
| Playfair Display + Crimson Pro | Serif pairing that evokes chess literature and editorial print |
| Warm dark background (`#141210`) | Matches the feel of a wooden board under low light |
| Board squares (`#f0d9b5` / `#b58863`) | Standard Lichess color scheme, widely recognized |
| Gold accent (`#c8a84b`) | Selected states, badges, CTAs — consistent throughout |
| Unicode chess pieces | Zero external dependencies; fully readable and customizable |
| Staggered entrance animations | Homepage elements reveal in sequence to guide the eye naturally |

---

## Roadmap

- [ ] More puzzles added via Supabase table editor
- [ ] Puzzle modes (by theme, spaced repetition, timed challenge)
- [ ] User accounts and progress tracking
- [ ] Deploy to Vercel or Netlify