# Design & Feature Ideas — Oogi Workout

Feature and UX improvement backlog. Nothing here is committed to. Items are ordered P1 → P3.
Each item is tagged: `[data-only]` · `[frontend-only]` · `[new-api]` · `[new-screen]`.

---

## Shipped

### ✅ Rest screen UX overhaul

PR: [#35 feat/workout-ux-polish](https://github.com/Dorbra/oogi-workout/pull/35)

- **Skip Rest button** — replaces the old +15s extend button; dispatches `SKIP_SET_FORWARD` / `SKIP_FORWARD` so you can jump straight to the next set without waiting out the full rest.
- **Next set number** — the set counter during rest now shows the *upcoming* set (e.g. "Set 4 / 4") rather than the one just completed, so you always know what you're about to do.
- **Red countdown** — the last 10 s of rest turns red: timer ring, background glow, label, and set number all shift to red as an urgency signal.
- **Bigger instructions** — exercise form cues bumped from `text-xs` to `text-sm` (exercise screen) and `text-sm` to `text-base` (warmup / cooldown / transition), readable at 1–2 m distance.

### ✅ 3-category workout system

PR: [#34 feat/new-workout-categories](https://github.com/Dorbra/oogi-workout/pull/34)

Restructured from 2 categories (`upper` / `abs_legs`) to 3 clean categories:

| Category | Key | Durations | Split |
|---|---|---|---|
| Upper Body | `upper` | 20 · 30 · 45 min | Day A / Day B |
| Lower Body | `lower` | 20 · 30 · 45 min | Single template |
| Full Body | `full_body` | 30 · 45 min | Single template |

`lower_*` templates replaced `abs_legs_*` with a more leg-dominant structure (Sumo Squat, Goblet Squat, RDL, Bulgarian Split Squat, Hip Thrust for the 45 min session). `full_body_*` follows a squat → hinge → push → pull → core pattern. Exercise #39 Hip Thrust added to the library. Category cards on HomeScreen show a one-line description subtitle (e.g. "Chest · Back · Arms").

---

### ✅ Dark / light mode toggle

PRs: [#15 feat/light-dark-mode-toggle](https://github.com/Dorbra/oogi-workout/pull/15) · [#17 feat/light-dark-mode-fix](https://github.com/Dorbra/oogi-workout/pull/17)

`theme: 'dark' | 'light'` lives in the reducer (seeded from `localStorage.theme`); a `SET_THEME` action flips it and `App.jsx` toggles a `dark` class on the root. Theme-aware CSS variables in `src/index.css` drive surface, glass, divider, pause-overlay, SVG stroke/equipment colours, timer-ring track, and ring number colours — so every screen (home, preview, active, complete) renders with high contrast in both modes. SVG diagrams use `var(--svg-figure)` / `var(--svg-equipment)` / `var(--svg-bar)` instead of hardcoded hex.

### ✅ Workout history

`src/lib/history.js` · `src/hooks/useWorkoutHistory.js` · `src/screens/HistoryScreen.jsx`

Versioned `localStorage` schema (`oogi_history` key, v1). Each entry stores: `id`, `completedAt` (ISO 8601), `category`, `duration`, `variation` (null when no A/B split), `skipWarmup`, `elapsedSeconds`. Saved automatically on `active → complete` transition in `App.jsx` via a `prevScreen` ref — fires exactly once per workout, no double-save risk.

`HistoryScreen` shows: stats bar (total sessions · total training time · this-week count), a reverse-chronological card list with planned vs actual time, per-entry delete (×), and a clear-all button with a 3-second double-tap confirm guard.

History entry point: `📊` icon button in the top-right corner, grouped with the theme toggle. Orange count badge shows session total (capped at `9+`); badge hidden until first workout is logged.

---

### ✅ Haptic feedback

`src/lib/haptics.js` · `src/hooks/useHaptics.js`

`navigator.vibrate()` wrapped in a lazy availability check — silent no-op on desktop and iOS Safari (where the API is unsupported). Hook mirrors `useWorkoutAudio` in structure; both are called independently in `App.jsx` so a denied vibration permission never affects audio.

| Moment | Pattern |
|---|---|
| Exercise step starts | Double pulse — 100ms · 80ms pause · 200ms |
| Any other step change (rest, warmup, transition, cooldown) | Short pulse — 100ms |
| Last 3 s of rest / transition | One short pulse per second (mirrors audio beep) |
| Workout complete | Long buzz — 500ms |

4 unit tests in `src/lib/haptics.test.js` — 44 tests total.

---

### ✅ Premium visual makeover

PRs: [#12](https://github.com/Dorbra/oogi-workout/pull/12) · [#13](https://github.com/Dorbra/oogi-workout/pull/13) · [#14](https://github.com/Dorbra/oogi-workout/pull/14)

SVG circular timer ring (`TimerRing`), glass-card surfaces, gradient CTAs, shine sweep, set-level navigation, rest-set indicator, and swap from ring pull-ups → ring dips.

### ✅ Galaxy Watch support

PRs: [#46 feat/galaxy-watch-ui](https://github.com/Dorbra/oogi-workout/pull/46)

Compact, per-screen UI for small square screens (Galaxy Watch 4/5/7 and similar — detected by `screen.width ≤ 450 && screen.height ≤ 450`). Once detected, `state.isWatch = true` is set for the session. Changes by screen:

- **Home** — full-width vertical category buttons, no preview step (taps Start straight to workout)
- **Transition / Rest** — condensed header, larger ring relative to viewport, stripped footer
- **Warmup / Cooldown** — name + ring only; instructions hidden
- **Exercise** — ring, set counter, reps + weight; SVG diagram hidden; pause overlay retained

Detection fires once in a `useEffect` on mount. The watch-mode branch of each screen is a sibling code path, not a separate screen file.

---

## P1 — High Value, Feasible Solo (evening-scale)

### 1. Quick weight/rep session override `[frontend-only]` (half-day)

On the **PreviewScreen**, allow the user to tap a weight or rep value to bump it up or down for this session only.

**Implementation:**

- New reducer state: `sessionOverrides: {}` — map of `{ [exerciseId]: { weight, reps } }`
- New reducer action: `SET_SESSION_OVERRIDE` — merges into the map
- `buildSteps` (inside `START_WORKOUT`) reads from `plan.exercises` merged with `sessionOverrides`
- Overrides are cleared when dispatching `GO_HOME`
- **Never write overrides to `workout-plan.json`** — session-only

**UI:** Tap the weight/reps line in the preview list to open a small inline stepper (no modal). +/- buttons with the current value between them.

**Why this matters:** some days you go heavier, some days lighter. This avoids editing the JSON manually.

---

## P2 — Worth Planning (weekend-scale)

### 3. Personal records per template key `[frontend-only]` (2–3 hrs)

**Depends on:** workout history (shipped).

Track the fastest (fewest elapsed seconds) completed session per template key. Show a "🏅 PR" badge on the CompleteScreen when the user beats their previous best for that template.

**Implementation:**

- Compute `pr = history.filter(e => matches template).min(e => e.elapsedSeconds)` in `useWorkoutHistory`
- Pass to `CompleteScreen` via props
- Badge renders only when the current `elapsedSeconds < pr`

---

### 4. Share workout summary — Web Share API `[new-api]` (2–3 hrs)

On the **CompleteScreen**, add a "Share" button that opens the native share sheet.

**Implementation:**

- New file: `src/lib/share.js` — `shareWorkout({ templateKey, durationSeconds, date })` function
- Uses `navigator.share()` if available; falls back to `navigator.clipboard.writeText()` with a "Copied!" toast
- Share text example: "Finished Upper Body 30min (Day A) in 29:42 — Oogi Workout"
- Button: only render if `navigator.share` OR `navigator.clipboard` is defined

---

### 5. Stretching / active recovery category `[data-only]` (half-day)

A cooldown-only template — essentially just the shared cooldown steps plus some extra mobility work. Useful as a standalone recovery session on off days.

- Add template key `stretch_20` to `workout-plan.json` with `exercises: []` and only `warmupSecs`/`cooldownSecs`
- Add a row to `CATEGORY_META` in `src/constants/categories.js`
- Add translation keys (`labelKey` / `descKey`) in both `he` and `en`

Note: the app now has 3 established categories (upper / lower / full_body). A stretch category would be a fourth — low friction to add, since the infrastructure is in place.

---

## P3 — Future / Big Bets (multi-day)

### 6. Custom workout builder `[new-screen]` (3–5 days)

A new screen where the user can compose their own workout from the exercise library.

**Scope:**

- Exercise picker with search/filter from `exercises.json` (read-only source of truth)
- Drag-to-reorder (or up/down buttons — simpler)
- Set / rep / weight inputs per exercise
- Save as a named custom template in `localStorage`
- Custom templates appear alongside built-in templates in HomeScreen

**Design considerations:** This is the single largest UX addition possible. Plan it as a separate milestone with its own design doc before starting implementation.

---

### 7. Progress charts — weekly volume (2–3 days)

**Depends on:** workout history (item 3).

Weekly volume = `sets × reps × weight` summed per exercise per week. A bar chart of volume over the last 8 weeks shows whether you're improving.

**Implementation notes:**

- Evaluate vanilla Canvas (`<canvas>`) before adding a chart library dependency
- If a library is needed, `recharts` (React-native) is the least-invasive option — but add it only if the Canvas approach produces worse UX
- Gate: implement history (item 3) first and collect at least 4 weeks of data before charting is meaningful

---

### 8. AI-assisted progressive overload suggestions (unknown effort)

After enough workout history exists, surface "+2.5kg on Floor Press" style suggestions.

**Requirements before starting:**

- Workout history (item 3) with ≥ 10 sessions per exercise
- Weight/rep override data (item 2) to detect what the user actually lifted
- Anthropic API access (requires a backend proxy or edge function — this is the blocker)

**Design consideration:** API calls per workout completion add ongoing cost. Cache suggestions locally per exercise and refresh only when a new session is recorded.

---

### 9. Workout scheduling `[new-api]` (1 week+)

Remind users to work out at a set time.

**Phase 1 — Web Push Notifications:** ask for permission on HomeScreen, let the user set a daily time, send a push reminder. Requires a small service worker addition. Feasible without a backend using the Push API + a VAPID key.

**Phase 2 — Calendar integration:** Google Calendar API. Requires OAuth — significant scope increase. This is a v2.0 feature.

---

### 10. Landscape / tablet mode `[frontend-only]` (1–2 days)

The app currently forces portrait via the PWA manifest (`orientation: 'portrait'`). On tablets or landscape phones, the layout is cramped vertically.

**Approach:**

- Remove `orientation: 'portrait'` from `vite.config.js` PWA manifest
- On landscape: show exercise SVG on the left column, controls (timer, buttons) on the right
- Use Tailwind `landscape:` variants and `md:` breakpoints
- ActiveWorkoutScreen will need the most layout work — other screens should adapt naturally

---

## Rejected / Not Recommended

**Server-side persistence / user accounts** — adds auth, hosting cost, and GDPR scope. A personal fitness app doesn't need it.

**Animated SVG exercise demos** — current static SVGs are ~100 lines each. Animated versions would be 5–10× larger and would render during the most CPU-sensitive moment (timer ticking). Not worth it.

**Voice commands** — Web Speech Recognition has poor reliability on mobile during exercise (ambient noise, heavy breathing). The failure rate would frustrate users more than help them.

**Multiple user profiles** — the workout data (weights, reps, sets) is calibrated to one person. Multi-user support requires a complete data model rewrite and offers no benefit for a personal app.

**Social / friend challenges** — requires accounts, a backend, and real-time infrastructure. Out of scope for a personal tool.
