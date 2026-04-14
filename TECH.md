# Tech Improvements — Oogi Workout

Engineering improvement backlog. Nothing here is broken. Items are ordered P1 → P3 within each tier. Quick wins are marked **QW**.

---

## P1 — Fix Now (High Impact, Low Risk)

### 1. useMemo for `totalRemainingSeconds` **QW** (30 min)

**Problem:** `totalRemainingSeconds(steps, stepIndex)` iterates the full `steps[]` array on every render of `ActiveWorkoutScreen`. This is called during every timer tick (every second).

**Fix:** Wrap the call in `useMemo` keyed on `[steps, stepIndex]` inside `ActiveWorkoutScreen.jsx`.

```js
const remaining = useMemo(
  () => totalRemainingSeconds(steps, stepIndex),
  [steps, stepIndex]
)
```

Note: `buildSteps` itself is not the problem — it runs only inside the `START_WORKOUT` reducer case and its result is stored in state. Only the per-render helper call needs memoization.

---

### 2. Reducer + hook test coverage **QW** (2–3 hrs)

**Problem:** `reducer.js`, `useWorkoutTimer`, `useWakeLock`, and `useWorkoutAudio` have zero test coverage. These are the highest-risk paths in the app.

**Fix:** Configure Vitest with jsdom environment for hook tests, then add:

- Reducer tests: `TICK` (timer advance + step advance), `SKIP_FORWARD`, `SKIP_BACKWARD`, `START_WORKOUT` (step count, groupStarts), `PAUSE_RESUME`
- Hook tests with `@testing-library/react-hooks` or `renderHook` from `@testing-library/react`

Priority order: reducer first (pure function, no DOM needed), then hooks.

File placement: `src/store/reducer.test.js`, `src/hooks/useWorkoutTimer.test.js`.

---

### 3. ESLint **QW** (3–4 hrs)

**Problem:** No linting. Stale closures in the custom hooks are the most likely source of future bugs — `useEffect` dependency arrays are not verified by anything.

**Fix:** Add ESLint with flat config (`eslint.config.js`):

```
eslint
eslint-plugin-react
eslint-plugin-react-hooks
```

Most critical rule: `react-hooks/exhaustive-deps` — catches missing dependencies in `useEffect` / `useCallback` / `useMemo` inside all three custom hooks.

Do NOT add `eslint-plugin-prettier`. Keep formatting concerns separate.

Add `"lint": "eslint src"` to `package.json` scripts.

---

### 4. Fix `categoryLabel` / `categoryIcon` hardcoding **QW** (30 min)

**Problem:** `src/lib/plan.js` uses `if (cat === 'upper')` / `if (cat === 'abs_legs')` chains. CLAUDE.md says "adding a new category requires zero code changes" — that's currently false because these functions also need updating.

**Fix:** Drive category display from a lookup table in `src/constants/`:

```js
// src/constants/categories.js
export const CATEGORY_META = {
  upper:    { icon: '💪', labelKey: 'upperBody' },
  abs_legs: { icon: '🦵', labelKey: 'absLegs' },
}
```

`categoryLabel(cat, t)` and `categoryIcon(cat)` become one-liners that look up from `CATEGORY_META`. Adding a new category then truly requires only: a template key in `workout-plan.json`, a row in `CATEGORY_META`, and two translation keys.

---

## P2 — Improve Soon (Meaningful Gain, Moderate Effort)

### 5. Unify step-advance logic in reducer (half-day)

**Problem:** "Go to step N" logic is implemented three separate times — once in `TICK` exhaustion, once in `SKIP_FORWARD`, once in `SKIP_BACKWARD`. When the three implementations drift, bugs are subtle.

**Fix:** Extract a private `advanceToStep(state, targetIndex)` helper inside `reducer.js` that handles all the shared concerns (set `stepIndex`, reset `secondsRemaining`, route to complete screen when past end). All three action handlers call it.

Risk: medium — requires careful regression testing against superset flows, skip-at-warmup, skip-at-last-step.

---

### 6. Split `buildSteps` into smaller functions — SRP (half-day)

**Problem:** `src/lib/steps.js` → `buildSteps` handles warmup steps, superset groups, normal exercise groups, cooldown steps, and `groupStarts` tracking in one ~80-line function. Individual cases cannot be unit-tested in isolation.

**Fix:** Extract private helpers:

```js
function buildWarmupSteps(warmup) { ... }
function buildExerciseGroup(exercise, plan) { ... }
function buildSupersetGroup(exerciseA, exerciseB, plan) { ... }
function buildCooldownSteps(cooldown) { ... }
```

`buildSteps` becomes an orchestrator that calls them in sequence. Existing 26 tests remain valid as integration tests. New unit tests can target individual builders.

---

### 7. State persistence with `localStorage` (2–3 hrs)

**Problem:** Every time the app loads, the user must re-select their category, duration, variation, and language.

**Fix:** Persist `lang`, `selectedCategory`, `selectedDuration`, `selectedVariation`, `skipWarmup` to `localStorage`. Read on `initialState` construction. Wrap dispatch in `App.jsx` with a thin persistence middleware:

```js
function persistingDispatch(action) {
  dispatch(action)
  // write relevant fields after state update via useEffect
}
```

Do NOT persist `steps`, `stepIndex`, `secondsRemaining`, or any active workout state — mid-workout resume is a separate, complex feature.

---

### 8. Accessibility baseline (half-day)

**Problem:** NavBar buttons have no text content (emoji-only or icon-only), countdown has no ARIA role, keyboard navigation is absent.

**Fixes:**
- Add `aria-label` to all three NavBar buttons (previous, pause/resume, next)
- Add `role="timer"` and `aria-live="polite"` to the countdown display in `ActiveWorkoutScreen`
- Add `aria-pressed` to the pause button (reflects `isPaused` state)
- Keyboard: `Space` for pause/resume, `ArrowRight` / `ArrowLeft` for skip (via `useEffect` `keydown` listener in `ActiveWorkoutScreen`)

---

### 9. Error boundary (2 hrs)

**Problem:** An uncaught runtime error (e.g., malformed data, unexpected step type) renders a blank white screen with no recovery path.

**Fix:** Add a simple class component error boundary wrapping `<App>` in `main.jsx`:

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError)
      return <div>Something went wrong. <button onClick={() => location.reload()}>Reload</button></div>
    return this.props.children
  }
}
```

Style with Tailwind to match the dark theme. No dependencies needed.

---

## P3 — Future (High Value, High Effort)

### 10. TypeScript migration (3–5 days, incremental PRs)

Incremental order — one PR per layer:

1. `src/lib/` — pure functions are easiest to type; start here
2. `src/store/reducer.js` — type the state shape and the action discriminated union
3. `src/hooks/` — type hook return shapes and parameters
4. `src/components/` — type props
5. `src/screens/` — type props (all receive `{ state, dispatch }`)
6. `src/data/` — add type imports or generate from JSON schema

Key type to define first: the `Step` discriminated union:

```ts
type Step =
  | { type: 'warmup'; ... }
  | { type: 'transition'; ... }
  | { type: 'exercise'; ... }
  | { type: 'rest'; ... }
  | { type: 'cooldown'; ... }
  | { type: 'complete' }
```

Also needed: `vite-env.d.ts` shim for the `__APP_VERSION__` global injected by CI.

Do NOT do this as a single PR.

---

### 11. `react-i18next` migration (1–2 days)

**Current approach** (`T[state.lang]` lookup in `constants/translations.js`) is simple and works well at the current scale.

**Trigger for migration:** more than 3 languages, more than 100 translation keys, or need for plural forms / interpolation.

Until then: keep the T object. It's debuggable without tooling and has no runtime dependency.

---

### 12. Prettier (1 hr setup, 1 PR to format codebase)

Only add after ESLint (item 3) is in place. Config that matches the existing style:

```json
{ "semi": false, "singleQuote": true, "tabWidth": 2 }
```

Add format-on-save recommendation in `.vscode/settings.json`. Do NOT enforce in CI — formatting PRs are noisy for a solo project.

---

## Quick Wins Summary

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 1 | useMemo for totalRemainingSeconds | 30 min | Perf (minor) |
| 2 | Reducer + hook tests | 2–3 hrs | Safety (high) |
| 3 | ESLint with react-hooks | 3–4 hrs | Safety (high) |
| 4 | Fix categoryLabel hardcoding | 30 min | Correctness |
| 8 | ARIA labels on buttons | 2 hrs | Accessibility |
| 9 | Error boundary | 2 hrs | Resilience |
