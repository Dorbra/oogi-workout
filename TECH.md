# Tech Improvements — Oogi Workout

Engineering improvement backlog. Nothing here is broken. Items are ordered P1 → P3 within each tier. Quick wins are marked **QW**.

---

## Shipped

- ✅ **Timestamp-based timer** — replaced the decrement model with a deadline model so the reducer self-corrects against wall-clock time on every tick. Fixed timer drift under mobile throttling, CPU load, and brief device sleep. (PR [#11](https://github.com/Dorbra/oogi-workout/pull/11), commit `527464b`.)
- ✅ **Custom hooks + Vitest** — split `App.jsx` into `useWorkoutTimer`, `useWakeLock`, `useWorkoutAudio`, and introduced Vitest with 25 tests covering `buildSteps`, `formatTime`, `totalRemainingSeconds`. (PR [#9](https://github.com/Dorbra/oogi-workout/pull/9).)
- ✅ **Smart versioning + single-workflow CI** — `package.json` is now the single source of truth; CI auto-bumps the patch (or honours manual minor/major bumps), syncs `package.json` back to `main`, tags, and publishes the GitHub Release in one workflow.
- ✅ **Workout history (localStorage)** — versioned storage layer (`oogi_history`, schema v1) with pure CRUD in `src/lib/history.js` (15 unit tests), a `useWorkoutHistory` React hook, and a dedicated `HistoryScreen` showing stats (total sessions, total time, this-week count) plus a per-entry log. Entry saved automatically on `active → complete` screen transition. Per-entry delete and double-tap-confirm clear-all included.
- ✅ **Haptic feedback** — `src/lib/haptics.ts` wraps `navigator.vibrate()` lazily (silent no-op where unsupported). `useHaptics` hook fires: double pulse on exercise start, short pulse on all other step changes, one pulse/second during the last 3 s of rest/transition, long buzz on workout complete. 4 unit tests.
- ✅ **PWA force-update via version.json** — Vite emits `dist/version.json` (`{ v: "<version>" }`) at build time; `public/_headers` marks it `Cache-Control: no-store` so neither Cloudflare edge nor the browser ever caches it. `main.jsx` calls `checkVersion()` on page load and on every `visibilitychange` to visible, fetching `/version.json?t=<timestamp>` and reloading if the deployed version differs from `__APP_VERSION__`. Loop-safety: a `sessionStorage` flag (`oogi_version_reload`) prevents a reload storm while the new SW is still installing — at most 2 forced reloads per deploy. The 30-min `setInterval` was removed; the SW `controllerchange` path is kept as a parallel route. (PRs [#53](https://github.com/Dorbra/oogi-workout/pull/53), [#57](https://github.com/Dorbra/oogi-workout/pull/57))
- ✅ **Dependency audit in CI** — `npm audit --audit-level=high --omit=dev` runs in both `ci.yml` (on every PR) and `deploy.yml` (on every merge to `main`), blocking on any high or critical CVE in production deps. `wrangler` corrected to `devDependencies` so its transitive CVEs don't pollute the production audit.
- ✅ **Dependabot** — `.github/dependabot.yml` auto-raises weekly PRs for npm and GitHub Actions updates. Patch and minor bumps are grouped into one PR per ecosystem per week; major bumps get individual PRs for manual review.
- ✅ **Fix `categoryLabel` / `categoryIcon` hardcoding** — `src/constants/categories.js` exports `CATEGORY_META` with `icon`, `labelKey`, and `descKey` per category. `categoryLabel()`, `categoryIcon()`, and the new `categoryDesc()` in `plan.js` look up from this table. Adding a category now requires one row in `CATEGORY_META` + two translation keys — no more if-chains. (PR [#34](https://github.com/Dorbra/oogi-workout/pull/34))
- ✅ **Hyper Intense Mode** — optional per-workout toggle on the Preview screen that cuts every rest period by 15 s. The reduction constant (`HYPER_INTENSE_REST_REDUCTION = 15`) is exported from `src/lib/steps.ts` and used in three places: `buildSteps` (applies `Math.max(0, rest − reduction)` to every rest step), `reducer.js` (`START_WORKOUT` passes `{ reduceRestSecs }` based on `state.hyperIntense`), and `PreviewScreen.jsx` (live preview of effective rest times and the orange toggle UI). Toggle resets to off on every return to the home screen.
- ✅ **Galaxy Watch UI** — compact per-screen layouts for small square screens (≤ 450 × 450 px, e.g. Galaxy Watch). Detected once at startup via a `useEffect` that compares `screen.width` and `screen.height`; dispatches `SET_WATCH_MODE` → sets `state.isWatch = true`. All five active screens (`home`, `transition`, `warmup`, `rest`, `cooldown`, `exercise`) have a dedicated watch branch that strips non-essential chrome and uses tighter spacing. The watch home screen skips the preview step and starts the workout directly.
- ✅ **10 s rest audio alert** — `useWorkoutAudio` fires `playGetReadyAlert()` (two rising beeps) at exactly 10 s remaining during any rest step, giving advance warning before the countdown beeps at 3 s. `playGetReadyAlert` is a new export in `src/lib/audio.ts`.
- ✅ **Fix `getDurationLabel` for all variant durations** — `getDurationLabel` was hardcoded to return Day A / Day B only when `selectedDuration === 30`. Upper Body 20-min and 45-min workouts also have a/b variants, so their preview and complete screens showed "20 min" / "45 min" instead of "Day A" / "Day B". Fix: pass `templates` + `category` so the function derives `hasVariants` from the actual template keys, matching the reducer's `START_WORKOUT` logic. (PR [#54](https://github.com/Dorbra/oogi-workout/pull/54))
- ✅ **Preference persistence** — `src/lib/prefs.ts` persists `lang`, `selectedCategory`, `selectedDuration`, `selectedVariation`, and `skipWarmup` to `localStorage` (`oogi_prefs`). `loadPrefs()` is called in `App.jsx` to seed `initialState`; a `useEffect` in `App.jsx` saves prefs whenever any of the five fields change. `GO_HOME` explicitly re-copies pref fields so the selection survives returning home. 7 unit tests in `prefs.test.ts`. (PR [#55](https://github.com/Dorbra/oogi-workout/pull/55))
- ✅ **useMemo for `totalRemainingSeconds`** — split the O(n) future-steps loop in `ActiveWorkoutScreen.jsx` into a `useMemo` keyed on `[steps, stepIndex]`. Only recomputes on step transitions, not every tick; `secondsRemaining` is added inline each render. (PR [#55](https://github.com/Dorbra/oogi-workout/pull/55))
- ✅ **Data integrity tests** — `steps.test.ts` gained a `data integrity` describe block that cross-checks `workout-plan.json` against `exercises.json` at test time: every `exerciseId` must exist, every exercise must have all required fields, no template contains a duplicate `exerciseId`. Catches data regressions before they reach production. (PR [#55](https://github.com/Dorbra/oogi-workout/pull/55))
- ✅ **Error boundary** — `main.jsx` wraps `<App>` in a class-component `ErrorBoundary` that catches uncaught runtime errors. Shows a styled dark-theme error card with the error message and a "Reload App" button instead of a blank white screen. No dependencies. (PR [#56](https://github.com/Dorbra/oogi-workout/pull/56))
- ✅ **ESLint with `react-hooks`** — flat config in `eslint.config.js` with `eslint-plugin-react` and `eslint-plugin-react-hooks`. `react-hooks/exhaustive-deps` catches stale-closure bugs in `useEffect` / `useCallback` / `useMemo`. `npm run lint` added to `package.json`. (PR [#56](https://github.com/Dorbra/oogi-workout/pull/56))
- ✅ **TypeScript for `src/lib/`** — all pure-function files migrated from `.js` to `.ts` with strict mode. `tsconfig.json` added (`allowJs: true`, `checkJs: false` — JSX files remain `.jsx`). `src/vite-env.d.ts` shim declares the `__APP_VERSION__` global. Test files also migrated to `.ts`. 116 tests total. (PR [#56](https://github.com/Dorbra/oogi-workout/pull/56))

---

## P1 — Fix Now (High Impact, Low Risk)

### ~~4. Fix `categoryLabel` / `categoryIcon` hardcoding~~ ✅ Shipped
### ~~Galaxy Watch UI~~ ✅ Shipped
### ~~10 s rest audio alert~~ ✅ Shipped

### ~~1. useMemo for `totalRemainingSeconds`~~ ✅ Shipped

---

### 2. Reducer + hook test coverage **QW** (2–3 hrs)

**Problem:** `reducer.js`, `useWorkoutTimer`, `useWakeLock`, and `useWorkoutAudio` have zero test coverage. These are the highest-risk paths in the app.

**Fix:** Configure Vitest with jsdom environment for hook tests, then add:

- Reducer tests: `TICK` (timer advance + step advance), `SKIP_FORWARD`, `SKIP_BACKWARD`, `START_WORKOUT` (step count, groupStarts), `PAUSE_RESUME`
- Hook tests with `@testing-library/react-hooks` or `renderHook` from `@testing-library/react`

Priority order: reducer first (pure function, no DOM needed), then hooks.

File placement: `src/store/reducer.test.js`, `src/hooks/useWorkoutTimer.test.js`.

---

### ~~3. ESLint~~ ✅ Shipped

---

## P2 — Improve Soon (Meaningful Gain, Moderate Effort)

### 5. Unify step-advance logic in reducer (half-day)

**Problem:** "Go to step N" logic is implemented three separate times — once in `TICK` exhaustion, once in `SKIP_FORWARD`, once in `SKIP_BACKWARD`. When the three implementations drift, bugs are subtle.

**Fix:** Extract a private `advanceToStep(state, targetIndex)` helper inside `reducer.js` that handles all the shared concerns (set `stepIndex`, reset `secondsRemaining`, route to complete screen when past end). All three action handlers call it.

Risk: medium — requires careful regression testing against superset flows, skip-at-warmup, skip-at-last-step.

---

### 6. Split `buildSteps` into smaller functions — SRP (half-day)

**Problem:** `src/lib/steps.ts` → `buildSteps` handles warmup steps, superset groups, normal exercise groups, cooldown steps, and `groupStarts` tracking in one ~80-line function. Individual cases cannot be unit-tested in isolation.

**Fix:** Extract private helpers:

```ts
function buildWarmupSteps(warmup) { ... }
function buildExerciseGroup(exercise, plan) { ... }
function buildSupersetGroup(exerciseA, exerciseB, plan) { ... }
function buildCooldownSteps(cooldown) { ... }
```

`buildSteps` becomes an orchestrator that calls them in sequence. Existing tests remain valid as integration tests. New unit tests can target individual builders.

---

### ~~7. User preference persistence~~ ✅ Shipped

---

### 8. Accessibility baseline (half-day)

**Problem:** NavBar buttons have no text content (emoji-only or icon-only), countdown has no ARIA role, keyboard navigation is absent.

**Fixes:**
- Add `aria-label` to all three NavBar buttons (previous, pause/resume, next)
- Add `role="timer"` and `aria-live="polite"` to the countdown display in `ActiveWorkoutScreen`
- Add `aria-pressed` to the pause button (reflects `isPaused` state)
- Keyboard: `Space` for pause/resume, `ArrowRight` / `ArrowLeft` for skip (via `useEffect` `keydown` listener in `ActiveWorkoutScreen`)

---

### ~~9. Error boundary~~ ✅ Shipped

---

## P3 — Future (High Value, High Effort)

### 10. TypeScript migration (incremental PRs) — `src/lib/` complete

`src/lib/` has been fully migrated to TypeScript (PR [#56](https://github.com/Dorbra/oogi-workout/pull/56)). `tsconfig.json` is in place with `strict: true`; `src/vite-env.d.ts` declares `__APP_VERSION__`. Remaining layers, one PR each:

1. ~~`src/lib/`~~ ✅ Done
2. `src/store/reducer.js` — type the state shape and the action discriminated union
3. `src/hooks/` — type hook return shapes and parameters
4. `src/components/` — type props
5. `src/screens/` — type props (all receive `{ state, dispatch }`)
6. `src/data/` — add type imports or generate from JSON schema

Key type still to define: the `Step` discriminated union:

```ts
type Step =
  | { type: 'warmup'; ... }
  | { type: 'transition'; ... }
  | { type: 'exercise'; ... }
  | { type: 'rest'; ... }
  | { type: 'cooldown'; ... }
  | { type: 'complete' }
```

Do NOT do this as a single PR.

---

### 11. `react-i18next` migration (1–2 days)

**Current approach** (`T[state.lang]` lookup in `constants/translations.js`) is simple and works well at the current scale.

**Trigger for migration:** more than 3 languages, more than 100 translation keys, or need for plural forms / interpolation.

Until then: keep the T object. It's debuggable without tooling and has no runtime dependency.

---

### 12. Prettier (1 hr setup, 1 PR to format codebase)

ESLint is already in place (item 3 ✅). Config that matches the existing style:

```json
{ "semi": false, "singleQuote": true, "tabWidth": 2 }
```

Add format-on-save recommendation in `.vscode/settings.json`. Do NOT enforce in CI — formatting PRs are noisy for a solo project.

---

## Quick Wins Summary

| # | Item | Effort | Impact |
|---|------|--------|--------|
| ~~1~~ | ~~useMemo for totalRemainingSeconds~~ | ~~30 min~~ | ✅ Shipped |
| 2 | Reducer + hook tests | 2–3 hrs | Safety (high) |
| ~~3~~ | ~~ESLint with react-hooks~~ | ~~3–4 hrs~~ | ✅ Shipped |
| ~~4~~ | ~~Fix categoryLabel hardcoding~~ | ~~30 min~~ | ✅ Shipped |
| 8 | ARIA labels on buttons | 2 hrs | Accessibility |
| ~~9~~ | ~~Error boundary~~ | ~~2 hrs~~ | ✅ Shipped |
