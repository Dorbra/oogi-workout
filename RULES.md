# Rules — Oogi Workout

Terse, imperative rules. Read before acting. These complement [CLAUDE.md](CLAUDE.md).

---

## Code Quality

- Pure JavaScript. Do not add `.ts` / `.tsx` files or JSDoc type annotations unless explicitly asked.
- No ESLint, no Prettier config. Do not create `eslint.config.js`, `.eslintrc`, `.prettierrc`, or similar. Do not reformat code style.
- Named exports everywhere. The only default export in the codebase is `App` in `App.jsx`.
- No barrel files (`index.js` re-exports). Import directly from the source file.
- No third-party libraries without explicit user approval. The dependency list is intentionally minimal.
- Tailwind utility classes only in JSX. No inline `style={}` except for dynamic values (e.g., `width: progress + '%'`). No custom CSS classes.
- `const` by default. `let` only inside loops or where reassignment is unavoidable.
- Arrow functions for components and inline handlers. Regular `function` declarations for exports in `lib/` and `hooks/`.

---

## State Management

- **All workout flow state lives in `src/store/reducer.js`.** Never introduce `useState` for screen routing, step progression, timer state, language selection, category/duration selection, or pause state.
- `useState` is permitted only for ephemeral local UI state that has no effect beyond the component (e.g., a tooltip open/close flag that does not survive a re-render cycle).
- Mutate state only by dispatching actions. Never call reducer logic directly from a component.
- `initialState` in `reducer.js` is the single source of truth for default values. Do not hardcode defaults elsewhere.
- `buildSteps` is called once inside the `START_WORKOUT` reducer case. Its result is stored in `state.steps`. Do not call `buildSteps` in render functions, `useEffect`, or `useMemo`.

---

## Bilingual / RTL

- **Every user-visible string must have both `he` and `en` keys** in `src/constants/translations.js`. Adding one without the other is a bug.
- Access translations via `T[state.lang]` (or `t` prop passed from parent). Never hardcode Hebrew or English strings in JSX.
- RTL direction is set once at the root `<div dir={...}>` in `App.jsx`. Do not set `dir` on child elements.
- When adding a new category or variation label anywhere, add the corresponding translation key to `T` in the same PR.

---

## File & Module Placement

```
screens/     → one file per full-page view, named [Name]Screen.jsx
components/  → shared presentational components only
hooks/       → custom hooks that encapsulate side effects (timers, audio, APIs)
lib/         → pure functions — no React imports, no side effects
store/       → reducer.js only
constants/   → translations.js (T object)
data/        → JSON only — no JS logic
```

- Do not put business logic in screen files. Screens receive `state` + `dispatch` — they render and dispatch, nothing more.
- Do not put side effects in `lib/`. If a function needs `useEffect` or accesses browser APIs directly, it belongs in `hooks/`.
- Do not create new top-level directories without explicit instruction.

---

## Data File Rules

### exercises.json

- Do not add, remove, or rename exercises without explicit user instruction.
- IDs are string integers (`"1"` – `"38"`). New entries increment from the current maximum.
- Every exercise entry requires exactly: `id`, `nameHe`, `nameEn`, `svg`, `instrHe`, `instrEn`.
- The `svg` field must match a key in `src/components/Svgs.jsx`. Adding a new exercise without a matching SVG is incomplete.

### workout-plan.json

- **Weights, reps, and sets are personal.** Never adjust them without explicit instruction.
- Template key format: `{category}_{duration}` or `{category}_{duration}{a|b}`. No other formats.
- `warmup[]` and `cooldown[]` are shared across all templates. Changes affect every workout.
- Adding a new category requires only new template keys — no code change. But do add translation keys.

---

## Testing Rules

- Every new function added to `src/lib/` must have accompanying tests in a colocated `.test.js` file.
- Tests run via `npm test` (Vitest, `node` environment — no DOM available).
- Do not write tests for React components, screen files, or hooks unless explicitly asked.
- Do not modify existing passing tests to make new code pass. Fix the code.
- Test files: colocate as `[filename].test.js` next to the source file. No separate `__tests__/` directory.

---

## PR Process

- One logical change per PR. If a PR touches `screens/` AND `data/`, split it.
- Run `npm run build && npm test` before opening any PR. Both must pass.
- Never merge your own PR. The user merges.
- Always target `main`. Never target another branch.
- Branch names: `feat/` · `fix/` · `refactor/` · `chore/` — no other prefixes.
- PR title = commit subject line (same conventional commit format as in CLAUDE.md).

---

## Anti-Patterns — Never Do These

- `useState` for `screen`, `stepIndex`, `lang`, `isPaused`, `selectedCategory`, `selectedDuration`, or any other reducer-owned field
- Calling `buildSteps` inside a component render or `useEffect`
- Hardcoded Hebrew or English strings in JSX
- Adding a translation key to only one language (`he` or `en`)
- `console.log` left in committed code
- Modifying weights, reps, or sets in `workout-plan.json` without explicit user instruction
- Installing npm packages without user approval
- Rewriting or renaming existing exports — downstream consumers will break silently
- Force-pushing to any branch (`git push --force`)
- Skipping git hooks (`--no-verify`)
- Creating `index.js` barrel files
- Importing from `App.jsx` in any other file

---

## Security & Safety

- This app has no backend, no authentication, and sends no user data anywhere. Keep it that way.
- `useWakeLock` and `useWorkoutAudio` are best-effort. Both are wrapped in try/catch. Audio or wake lock failures must never throw to the user.
- The PWA service worker is managed by `vite-plugin-pwa` with `registerType: 'autoUpdate'`. Do not touch workbox configuration without understanding cache invalidation.
- Do not add external script tags, analytics, telemetry, or tracking of any kind.
