# Oogi Workout

A mobile-first home workout timer app — built for equipment-minimal training with a weighted vest, gymnastic rings, and dumbbells. Choose a category, pick a duration, and the app guides you through every set, rest, warmup, and cooldown with a live timer, visual exercise diagrams, and audio cues.

**[Open the app →](https://dorbra.github.io/oogi-workout/)**

---

## Features

- **Two workout categories** — Upper Body (push/pull split) and Abs & Legs
- **Three durations** — 20, 30, or 45 minutes per session
- **Day A / Day B variations** — every upper-body duration has a push-focused day and a pull-focused day so you never repeat the same stimulus back-to-back
- **Full session structure** — automatic warmup (90 s) → working sets → cooldown (150 s)
- **Live countdown timer** — colour shifts to orange in the last 10 s of a set; audio beep fires at 5 s remaining
- **Superset support** — paired exercises are shown and timed together
- **SVG exercise diagrams** — stick-figure illustrations for every exercise, warmup, and cooldown movement
- **Bilingual UI** — Hebrew (RTL) and English, switchable at any time
- **Pause / resume** — tap anywhere on the active screen to pause mid-set
- **Skip controls** — jump forward or back between sets without losing your place
- **Semantic versioning** — every deploy is tagged; current version is shown on the home screen

---

## Workout structure

### Upper Body

| Duration | Day A (Push + Vertical Pull) | Day B (Horizontal Pull + Push) |
|----------|------------------------------|-------------------------------|
| 20 min | Ring Pull-Ups · Incline Press · Ring Dips · Shoulder Press + Rear Delt Fly | Ring Rows · Floor Press · Bent-Over Row · Curl + Tricep Ext |
| 30 min | Ring Pull-Ups · Incline Press · Arnold Press · Ring Dips · Lateral Raise + Rear Delt Fly | Ring Rows · Floor Press · Bent-Over Row · Weighted Push-Ups · Hammer Curl + Tricep Ext |
| 45 min | Full push + vertical pull block with finisher | Full horizontal pull + push block with accessories |

### Abs & Legs

Single template per duration (no A/B split) — combines compound leg work with core work.

| Duration | Focus |
|----------|-------|
| 20 min | Goblet Squat · Glute Bridge · Plank · Crunch + Leg Raise |
| 30 min | Goblet Squat · RDL · Reverse Lunge · Glute Bridge · Plank · Crunch + Leg Raise |
| 45 min | Sumo Squat · Goblet Squat · RDL · Bulgarian Split Squat · Reverse Lunge · Glute Bridge · Plank · Leg Raise + Crunch · Russian Twists |

---

## Running locally

```bash
git clone git@github.com:Dorbra/oogi-workout.git
cd oogi-workout
npm install
npm run dev        # opens at http://localhost:5173/oogi-workout/
```

Production build:

```bash
npm run build      # output in dist/
npm run preview    # serve the built output locally
```

---

## Project structure

```
src/
  App.jsx                  # single-file React app — all screens, reducer, and logic
  main.jsx                 # React entry point
  index.css                # global styles (Tailwind v4)
  data/
    exercises.json         # exercise library — 38 exercises keyed by string ID
    workout-plan.json      # workout plan — templates, warmup, cooldown
.github/
  workflows/
    deploy.yml             # build → deploy to GitHub Pages → push version tag
    release.yml            # create GitHub Release from version tag
```

### Data-driven architecture

Workout plans and exercises live in JSON files, not in component code. This means:

- **Add an exercise** — add an entry to `exercises.json`
- **Change sets, reps, rest, or weight** — edit the relevant template in `workout-plan.json`
- **Add a new category or duration** — add a template key following the `{category}_{duration}` or `{category}_{duration}{a|b}` convention; the UI derives category tabs and duration buttons automatically from the keys present

Template key format:
```
upper_30a      → Upper Body, 30 min, Day A
abs_legs_20    → Abs & Legs, 20 min (no A/B split)
```

---

## Deployment & versioning

Every merge to `main` triggers a GitHub Actions workflow that:

1. Reads the latest `vX.Y.Z` git tag
2. Auto-increments the **patch** number
3. Bakes the version string into the build (shown on the home screen)
4. Deploys to GitHub Pages
5. Pushes the new tag → triggers a GitHub Release automatically

| Bump | When | How |
|------|------|-----|
| Patch (`1.0.0 → 1.0.1`) | Every deploy | Automatic — no action needed |
| Minor (`1.0 → 1.1`) | New feature shipped | Edit `"version"` in `package.json` before opening the PR |
| Major (`1.x → 2.0`) | Full redesign | Explicit instruction only |

---

## Tech stack

| | |
|-|-|
| Framework | React 19 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Language | JavaScript (JSX) |
