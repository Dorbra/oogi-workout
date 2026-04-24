# Design & Feature Ideas — Oogi Workout

Feature and UX improvement backlog. Nothing here is committed to. Items are ordered P1 → P3.
Each item is tagged: `[data-only]` · `[frontend-only]` · `[new-api]` · `[new-screen]`.

---

## Shipped

### ✅ Rest timer extension — tap to add 15s
PR: [feat/rest-timer-extend](https://github.com/Dorbra/oogi-workout/pull/new/feat/rest-timer-extend)

`EXTEND_REST` reducer action adds 15s to both `secondsRemaining` and the step's `duration` (keeps progress bar accurate). Button renders only on rest steps; `stopPropagation` prevents triggering pause.

### ✅ Dark / light mode toggle
PRs: [#15 feat/light-dark-mode-toggle](https://github.com/Dorbra/oogi-workout/pull/15) · [#17 feat/light-dark-mode-fix](https://github.com/Dorbra/oogi-workout/pull/17)

`theme: 'dark' | 'light'` lives in the reducer (seeded from `localStorage.theme`); a `SET_THEME` action flips it and `App.jsx` toggles a `dark` class on the root. Theme-aware CSS variables in `src/index.css` drive surface, glass, divider, pause-overlay, SVG stroke/equipment colours, timer-ring track, and ring number colours — so every screen (home, preview, active, complete) renders with high contrast in both modes. SVG diagrams use `var(--svg-figure)` / `var(--svg-equipment)` / `var(--svg-bar)` instead of hardcoded hex.

### ✅ Workout history
`src/lib/history.js` · `src/hooks/useWorkoutHistory.js` · `src/screens/HistoryScreen.jsx`

Versioned `localStorage` schema (`oogi_history` key, v1). Each entry stores: `id`, `completedAt` (ISO 8601), `category`, `duration`, `variation` (null when no A/B split), `skipWarmup`, `elapsedSeconds`. Saved automatically on `active → complete` transition in `App.jsx` via a `prevScreen` ref — fires exactly once per workout, no double-save risk.

`HistoryScreen` shows: stats bar (total sessions · total training time · this-week count), a reverse-chronological card list with planned vs actual time, per-entry delete (×), and a clear-all button with a 3-second double-tap confirm guard.

History entry point: `📊 History N` button on the home screen (count badge hidden until at least one workout is logged).

---

### ✅ Premium visual makeover
PRs: [#12](https://github.com/Dorbra/oogi-workout/pull/12) · [#13](https://github.com/Dorbra/oogi-workout/pull/13) · [#14](https://github.com/Dorbra/oogi-workout/pull/14)

SVG circular timer ring (`TimerRing`), glass-card surfaces, gradient CTAs, shine sweep, set-level navigation, rest-set indicator, and swap from ring pull-ups → ring dips.

---

## P1 — High Value, Feasible Solo (evening-scale)

### 1. Haptic feedback `[new-api]` (2 hrs)

Audio cues already exist. Haptic cues make the app usable when the screen is face-down or in a pocket.

**Implementation:**
- New file: `src/lib/haptics.js` — wraps `navigator.vibrate()` with an availability check
- New hook: `src/hooks/useHaptics.js` — mirrors `useWorkoutAudio` in structure
- Patterns:
  - Step transition start: single short pulse (100ms)
  - Exercise start: double pulse (100ms · pause · 200ms)
  - Workout complete: long buzz (500ms)
  - Last 3 seconds of rest: three quick pulses (matching audio countdown)

Call `useHaptics` alongside `useWorkoutAudio` in `App.jsx`. The two hooks stay independent — audio can be working while haptics are denied, and vice versa.

---

### 2. Quick weight/rep session override `[frontend-only]` (half-day)

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

### 5. New workout categories: stretching & cardio `[data-only]` (half-day each)

**Stretching:** A cooldown-only template — essentially just the cooldown steps. Useful as a standalone recovery session.
- Add template key `stretch_20` to `workout-plan.json` with `exercises: []` and only warmupSecs/cooldownSecs
- Add translation keys `stretch` / `גמישות` to `T`
- Zero code change (the UI derives categories from template keys)

**Cardio:** Similar pattern — a warmup + lightweight interval circuit.
- Data-only if the intervals fit the existing step model (exercise/rest pairs)
- If true HIIT is needed (different timing logic, intensity labels), that requires a new step type — separate engineering effort

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
