# Claude Guidelines — Oogi Workout

This file defines how to work on this project. Read it before making any changes.
Companion docs: [RULES.md](RULES.md) · [TECH.md](TECH.md) · [DESIGN.md](DESIGN.md)

---

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173/
npm test          # Vitest — must pass before committing
npm run build     # must pass with zero errors before committing
```

---

## Project overview

Modular single-page React app that runs a structured home workout session. All workout content lives in two JSON data files; the React code is purely UI and timer logic. Deployed to Cloudflare Pages on every push to `main`.

**Live app:** https://oogi-workout.pages.dev/  
**Repo:** https://github.com/Dorbra/oogi-workout

---

## Architecture

```
src/
  App.jsx              # Root: useReducer + 3 hooks + screen router only
  main.jsx             # React 19 entry point
  index.css            # Tailwind import + global resets
  screens/             # One file per full-page view
    HomeScreen.jsx         # Category / duration / variation picker
    PreviewScreen.jsx      # Exercise list preview before starting
    ActiveWorkoutScreen.jsx  # Live workout timer (largest screen)
    CompleteScreen.jsx     # Post-workout summary
  components/          # Shared presentational components
    NavBar.jsx             # Pause / skip controls
    ProgressBar.jsx        # Visual step-countdown bar
    Svgs.jsx               # All exercise SVG diagrams (ExerciseSvg lookup)
  hooks/               # Side-effect hooks
    useWorkoutTimer.js     # Dispatches TICK every second during active workout
    useWakeLock.js         # Keeps screen awake during workout
    useWorkoutAudio.js     # Web Audio API beeps and tones
  lib/                 # Pure functions — no React imports
    steps.js               # buildSteps, formatTime, totalRemainingSeconds
    steps.test.js          # Vitest unit tests (25 tests)
    plan.js                # Category/duration helpers
    audio.js               # Low-level Web Audio tone generation
  store/               # State
    reducer.js             # useReducer handler + initialState
  constants/           # Static data
    translations.js        # T object with `he` and `en` keys
  data/                # JSON content — no JS logic
    exercises.json         # 38 exercises
    workout-plan.json      # warmup, cooldown, 8 workout templates
```

**Data flow:** `App.jsx` owns all state via `useReducer(reducer, initialState)`. Screens receive `state` and `dispatch` as props — `dispatch` is the only way to mutate state.

**Where new code goes:**
- New full-page view → `screens/`
- New shared UI component → `components/`
- New side-effect hook → `hooks/`
- New pure business logic → `lib/`
- New static lookup / constant → `constants/`

---

## Non-negotiable rules

- **Never commit or push directly to `main`.** Always work on a feature branch and open a PR.
- **Never force-push** to any branch.
- **Never skip CI hooks** (`--no-verify`).
- **Always run `npm run build` and `npm test` before committing.** Both must pass.

---

## Git workflow

### Branch naming

```
feat/short-description          # new feature
fix/short-description           # bug fix
refactor/short-description      # code restructure, no behaviour change
chore/short-description         # tooling, deps, CI, docs
```

Examples: `feat/rest-timer-extend`, `fix/superset-timer-reset`, `chore/add-eslint`

### Commit message format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short imperative summary>

<optional body — wrap at 72 chars>
- bullet points for multi-part changes
- explain *what* changed and *why*, not just how

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**Types:** `feat` · `fix` · `refactor` · `chore` · `docs`

Rules:
- Subject line: lowercase, imperative mood, no trailing period, ≤ 72 chars
- Body: required when the change is non-obvious or touches multiple areas
- Always include the `Co-Authored-By` trailer

### Pull requests

- One PR per logical change
- Title = the commit subject line (same conventional format)
- Always target `main`
- The user merges — never merge a PR yourself

---

## Versioning

`package.json` is the **single source of truth** for the app version. Vite reads it directly at build time (dev and prod) and bakes it into `__APP_VERSION__`, which the home screen displays.

### How CI resolves the version on every push to `main`

1. Reads `package.json.version` (PKG) and the latest `vX.Y.Z` git tag (TAG).
2. If `PKG > TAG` → honours the manual bump and releases as PKG.
3. Otherwise → auto-increments the **patch** of TAG.
4. Writes the resolved version back into `package.json` via `npm version --no-git-tag-version`.
5. Runs tests, builds, deploys, commits the updated `package.json` back to `main`, pushes the `vX.Y.Z` tag, and creates a GitHub Release with auto-generated notes.

The commit CI pushes back (`chore(release): vX.Y.Z`) uses `GITHUB_TOKEN`, which by design does not retrigger workflows — no infinite loop. The workflow also guards with an `if:` that skips runs whose head commit starts with `chore(release):`.

### What you need to do

| Bump | When | Action |
|------|------|--------|
| Patch `1.0.0 → 1.0.1` | Any push to `main` | Nothing — CI handles it. `package.json` will be updated in-place. |
| Minor `1.0.x → 1.1.0` | New user-facing feature | Edit `"version"` in `package.json` in the PR. CI honours it as-is. |
| Major `1.x.y → 2.0.0` | Only on explicit instruction from the user | Edit `"version"` in `package.json` in the PR. |

After merge, `package.json` on `main` always matches the live deployed version and the number shown in the UI.

---

## Data files

### `src/data/exercises.json`

The exercise library. 38 exercises keyed by string ID (`"1"` – `"38"`). Each entry:

```json
{
  "id": "1",
  "nameHe": "...",
  "nameEn": "...",
  "svg": "key_into_ExerciseSvg_map",
  "instrHe": "...",
  "instrEn": "..."
}
```

- Adding a new exercise requires a matching SVG key in `src/components/Svgs.jsx`
- IDs are string numbers — increment from the current highest

### `src/workout-plan.json`

The active workout plan. Key sections:

- `warmup[]` — shared across all templates
- `cooldown[]` — shared across all templates
- `templates{}` — keyed by `{category}_{duration}` or `{category}_{duration}{a|b}`

**Template key convention:**
```
upper_30a     → Upper Body, 30 min, Day A
abs_legs_20   → Abs & Legs, 20 min (no A/B split)
```

The UI derives all category tabs and duration buttons dynamically from the template keys. Adding a new category only requires adding template keys — no code change needed.

**Exercise data is personal.** The weights, reps, and sets in the templates are calibrated to the user's current training level. Do not modify them without explicit instruction.

---

## Code conventions

- **No new files unless necessary.** Adding a new screen warrants a new file in `screens/`; otherwise prefer editing existing files.
- **No speculative abstractions.** Don't add helpers or utilities for one-off uses.
- **No extra comments or docstrings** on code you didn't change.
- **No error handling for impossible states.** Trust the data files and reducer.
- State lives exclusively in the `useReducer` store. Do not introduce `useState` for anything that affects workout flow, screen routing, or language.
- Translations go in `src/constants/translations.js` — both `he` and `en` keys required for every new string.
- New SVG diagrams go in `src/components/Svgs.jsx`, keyed to match the `svg` field in `exercises.json`.
- Do not put business logic in screen files. If a screen computes non-trivial derived values, extract to `lib/`.
- Do not put side effects (timers, API calls, audio) in `lib/` files — those belong in `hooks/`.

---

## Build & test

```bash
npm run build     # must pass with zero errors before any commit
npm run dev       # open http://localhost:5173/ to test manually
npm test          # Vitest — must pass before any commit
npm run test:watch  # watch mode during development
```

Tests live in `src/lib/steps.test.js` (25 tests). They cover `buildSteps`, `formatTime`, and `totalRemainingSeconds`. See Testing guidelines below.

Before marking any UI change complete, manually verify:
1. The changed feature works on a mobile viewport
2. Both Hebrew and English modes render correctly
3. The timer flow (warmup → sets → cooldown) is unaffected

---

## Testing guidelines

**What has tests:** Pure functions in `src/lib/` — `steps.js` is fully covered.

**What does not have tests (currently acceptable):** `reducer.js`, hooks, and screen components.

**When to add tests:** Any new function added to `src/lib/` must have accompanying tests in a colocated `.test.js` file next to it.

**Test environment:** Vitest runs in `node` mode — no DOM available. Do not write tests for React components or hooks unless specifically asked and the jsdom environment is configured first.

**Test file naming:** Colocate as `[filename].test.js` next to the file under test. Do not create a separate `__tests__/` directory.

**Rule:** Do not modify existing tests to make new code pass. Fix the code instead.

---

## CI / deployment

`.github/workflows/deploy.yml` is the single workflow. On push to `main` it:

1. Installs dependencies with `npm ci` and runs `npm test` (deploy aborts if tests fail)
2. Resolves the next version (see **Versioning** above)
3. Syncs `package.json` to that version via `npm version --no-git-tag-version`
4. Builds (Vite reads the new version from `package.json`)
5. Deploys `dist/` to Cloudflare Pages
6. Commits the `package.json` bump back to `main` as `chore(release): vX.Y.Z`
7. Pushes the `vX.Y.Z` tag
8. Creates a GitHub Release with auto-generated notes

Do not modify the CI workflow unless explicitly asked.
