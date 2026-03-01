# Planum — Chess Strategy Puzzles

A frontend-only chess strategy training app. No tactics, no engine scores, no "find the best move." Just positions, plans, and the reasoning behind good chess.

---

## What it is

Planum presents players with real chess positions and asks them to choose the best *plan* — not a specific move or forcing line. Every puzzle is built around a single strategic concept (minority attack, prophylaxis, piece quality, etc.), and every wrong answer comes with an explanation of *why* that plan falls short, not just that it does.

---

## Quick start

### Option A — No install required
Open `preview.html` directly in any browser. Everything is self-contained in that one file.

### Option B — Vite dev server
```bash
npm install
npm run dev
```

---

## Project structure

```
planum/
├── preview.html        # Self-contained single file — open directly in browser
├── index.html          # Vite HTML entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # All components + puzzle data
```

`preview.html` and `src/App.jsx` contain the same application. `preview.html` uses Babel in the browser for zero-install use; the `src/` folder is for local development with Vite. Keep both in sync when making changes.

---

## Puzzle format

All puzzles live in the `PUZZLES` array at the top of `App.jsx` (and `preview.html`). Each puzzle follows this shape:

```js
{
  id: 1,
  fen: "...",                   // Valid FEN string — determines the board position
  sideToMove: "white",          // "white" or "black" — board flips automatically for black
  theme: "structural_weaknesses", // Key into THEME_LABELS for the badge display
  prompt: "What is White's plan here?",
  options: [
    { id: "a", text: "...", correct: false, wrongReason: "..." },
    { id: "b", text: "...", correct: true },   // Exactly one option has correct: true
    { id: "c", text: "...", correct: false, wrongReason: "..." },
    { id: "d", text: "...", correct: false, wrongReason: "..." },
  ],
  explanation: "...",            // Shown after submit — explains the correct plan
}
```

**Field notes:**
- `wrongReason` is optional on the correct answer and required on all incorrect ones. It appears when the user clicks a wrong option after submitting, explaining the strategic flaw.
- `explanation` should focus on *why the correct plan works*, not on move sequences.
- `sideToMove` only affects board orientation — it doesn't enforce any rules.

### Current themes

Add new themes to the `THEME_LABELS` object in `App.jsx`:

| Key | Display name |
|---|---|
| `central_control` | Central Control |
| `structural_weaknesses` | Structural Weaknesses |
| `open_files` | Open Files |
| `piece_quality` | Piece Quality |
| `prophylaxis` | Prophylaxis |
| `dynamic_vs_static` | Dynamic vs. Static |

---

## Current puzzles

| # | Theme | Position notes |
|---|---|---|
| 1 | Central Control | White has a spatial edge; cxd5 opens the c-file and targets d5 |
| 2 | Structural Weaknesses | Carlsbad structure; minority attack with b5 |
| 3 | Open Files | Only open file is the d-file; Rd3 to double rooks |
| 4 | Piece Quality | Locked position; good knight vs. bad bishop endgame |
| 5 | Prophylaxis | Opposite-side castling; Kb1 before the kingside attack |
| 6 | Dynamic vs. Static | IQP position; h4 attack before Black consolidates |

---

## Component map

| Component | Responsibility |
|---|---|
| `App` | Top-level screen router (`home` / `puzzle`) |
| `HomePage` | Landing page with hero, feature cards, and quote |
| `PuzzlePage` | Puzzle state management — selection, submission, inspection, navigation |
| `Chessboard` | Parses FEN, renders 8×8 board with Unicode pieces, view-only |
| `GhostBoard` | Decorative empty board used on the homepage |
| `Logo` | Shared header logo; clickable in puzzle view to return home |
| `AnswerOption` | Single answer button; handles pre-submit selection and post-submit inspection |
| `ThemeBadge` | Pill badge displaying the puzzle's strategic theme |
| `ProgressBar` | Thin gold bar at the top of the puzzle page showing overall progress |

---

## User flow

```
Home page
    └── "Begin Training" →  Puzzle page (puzzle 1 of 6)
                                ├── Select an option
                                ├── "Confirm Plan"
                                │       ├── Result banner (correct / incorrect)
                                │       ├── Explanation of the correct plan
                                │       ├── Click any other wrong option → inline wrongReason panel
                                │       └── "Next Puzzle" → (repeat for puzzles 2–6)
                                └── Logo click → Home page
```

---

## UX principles

- Prompts and explanations never use the word "move" — only "plan" and "idea"
- No engine evaluations are shown at any point
- No calculation is required or rewarded by any puzzle
- The board is view-only — no dragging, clicking squares, or move highlighting
- Wrong answers are not just marked incorrect; every one has a `wrongReason` explaining the strategic flaw
- The board flips automatically when `sideToMove` is `"black"`

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

## Extending beyond MVP

| Goal | Approach |
|---|---|
| More puzzles | Add entries to the `PUZZLES` array — no other changes needed |
| New themes | Add a key/label pair to `THEME_LABELS` |
| Puzzle filtering by theme | Add a filter bar above the puzzle; filter `PUZZLES` by `theme` before indexing |
| Save progress across sessions | Store `puzzleIndex` in `localStorage` |
| Pull puzzles from an API | Replace the `PUZZLES` array with a `fetch()` call; the data shape is already API-ready |
| Separate data from UI | Move `PUZZLES` to `src/puzzles.js` and import it into `App.jsx` |
