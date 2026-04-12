# PLANNING.md — Workout Timer App

## Overview

A personal workout timer web app (React SPA) for tablet/phone browsers. The user selects a workout duration, previews the plan, and starts a hands-free timed session that auto-advances through all exercises, sets, and rests.

**Primary language**: Hebrew (RTL), with English toggle.
**Target devices**: Tablet & phone browsers (landscape & portrait).
**User profile**: Intermediate lifter, training ~2x/week, goal is hypertrophy + strength for upper body (chest, shoulders, back, arms).

---

## User Flow

### Pre-Workout Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  OPEN    │     │  HOME        │     │  PREVIEW     │     │  WORKOUT     │
│  APP     │────▶│  SCREEN      │────▶│  SCREEN      │────▶│  BEGINS      │
│          │     │              │     │              │     │              │
└──────────┘     │ • Pick time: │     │ • Full list  │     │ (auto-flow)  │
                 │   20/30/45m  │     │   of all     │     └──────────────┘
                 │ • Language   │     │   exercises  │
                 │   toggle     │     │ • Sets, reps │
                 │              │     │   weights    │
                 │ [סקירת אימון]│     │ • Est. time  │
                 │  (Preview)   │     │ • Skip warmup│
                 │              │     │   toggle     │
                 └──────────────┘     │              │
                                      │ [התחל אימון] │
                                      │  (Start)     │
                                      └──────────────┘
```

### During-Workout Flow (Auto-Advancing, Hands-Free)

The entire workout runs on a timer. No taps required to advance.
User only interacts to: skip forward/backward, or pause.

```
                            ┌─────────────────────────────────┐
                            │         SKIP WARMUP?            │
                            │  (toggle set on Preview screen) │
                            └────────┬───────────┬────────────┘
                                     │ No        │ Yes
                                     ▼           │
                            ┌─────────────────┐  │
                            │    WARMUP       │  │
                            │  (timed moves,  │  │
                            │   auto-advance) │  │
                            └────────┬────────┘  │
                                     │           │
                                     ▼           │
                  ┌──────────────────────────────────────────┐
                  │                                          │
                  │  ┌────────────────────┐                  │
                  │  │  TRANSITION (10s)  │◀─────────────┐   │
                  │  │  "Get ready"       │              │   │
                  │  │  Shows next        │              │   │
                  │  │  exercise preview  │              │   │
                  │  └────────┬───────────┘              │   │
                  │           │                          │   │
                  │           ▼                          │   │
                  │  ┌────────────────────┐              │   │
              ┌───│──│  EXERCISE SET      │              │   │
              │   │  │  (working timer)   │              │   │
              │   │  │  Shows: name,      │              │   │
              │   │  │  diagram, set#,    │              │   │
              │   │  │  reps, weight,     │              │   │
              │   │  │  instructions      │              │   │
              │   │  └────────┬───────────┘              │   │
              │   │           │                          │   │
              │   │           ▼                          │   │
              │   │  ┌────────────────────┐              │   │
              │   │  │  REST between sets │   More       │   │
              │   │  │  (countdown)       │──sets?──YES──┘   │
              │   │  │                    │   remaining      │
              │   │  └────────┬───────────┘              │   │
              │   │           │ Last set done            │   │
              │   │           │                          │   │
              │   │           ▼                          │   │
              │   │     More exercises? ──YES────────────┘   │
              │   │           │                              │
              │   │           │ NO                           │
              │   │           ▼                              │
              │   │  ┌────────────────────┐                  │
              │   │  │    COOLDOWN        │                  │
              │   │  │  (guided stretches │                  │
              │   │  │   with timer)      │                  │
              │   │  └────────┬───────────┘                  │
              │   │           │                              │
              │   └───────────│──────────────────────────────┘
              │               ▼
              │      ┌────────────────────┐
              │      │    COMPLETE        │
              │      │  Total time,       │
              │      │  summary,          │
              │      │  [חזרה הביתה]      │
              │      │  (Back to Home)    │
              │      └────────────────────┘
              │
              │  Available at ANY point during workout:
              │  ┌──────────────────────────────────┐
              └──│  ◀ Previous exercise              │
                 │  ▶ Next exercise (skip remaining) │
                 │  ⏸ Pause / Resume (tap center)    │
                 └──────────────────────────────────┘
```

### Superset Flow Detail

Some workouts pair two exercises back-to-back (a "superset") to maximize
time efficiency. Within a superset, the flow is:

```
TRANSITION (10s) → Exercise A Set 1 → Exercise B Set 1 → REST
                 → Exercise A Set 2 → Exercise B Set 2 → REST
                 → Exercise A Set 3 → Exercise B Set 3 → TRANSITION (10s)
```

No extra 10s transition between A and B — they alternate immediately.
The shared rest comes after completing both movements.
The UI shows "סופרסט 1/3" (Superset 1/3) and which of the two
exercises is currently active.

---

## Equipment Available

| Equipment | Details |
|---|---|
| Weighted vest | 20 × 1 kg plates (up to 20 kg) |
| Heavy dumbbell | 1 × 17.5 kg |
| Medium dumbbells | 2 × 10 kg |
| Light dumbbells | 2 × 5 kg |
| Flat/incline bench | Adjustable |
| Olympic rings | Mounted; used primarily for pull-ups, rows, dips |

---

## Workout Philosophy & Programming

### Training Split

Since the user trains ~2x/week, each workout should be a **full upper-body session** (not a body-part split). Every session hits all major groups with compound-first ordering:

**Exercise priority order (per session):**
1. **Compound push** (chest/shoulders/triceps)
2. **Compound pull** (back/biceps)
3. **Shoulder isolation**
4. **Arm isolation**
5. **Finisher / burnout** (if time allows)

### Rep/Set Schemes (Hypertrophy Focus)

- **Compound lifts**: 3–4 sets × 8–12 reps, 60–90s rest between sets
- **Isolation lifts**: 2–3 sets × 10–15 reps, 45–60s rest between sets
- **Bodyweight / rings**: 3 sets × 8–12 reps (or to near-failure), 60–90s rest

### Timing Model

Each exercise block consists of:

```
[10s countdown] → Set 1 → [rest] → Set 2 → [rest] → ... → Set N → [10s countdown to next exercise]
```

- The **10-second countdown** appears only between exercises (not between sets within the same exercise).
- Rest between sets is displayed as a countdown timer but requires no user interaction.
- **Set duration is estimated** (see table below) — the timer counts the working set time, then auto-transitions to rest.

**Estimated working-set durations (seconds):**

| Rep range | Tempo (assumed) | Estimated set duration |
|---|---|---|
| 8 reps | 3s per rep | ~25s |
| 10 reps | 3s per rep | ~30s |
| 12 reps | 3s per rep | ~35s |
| 15 reps | 2.5s per rep | ~38s |

### Time Budget Breakdown

| Duration | Warmup | Working time | Cooldown |
|---|---|---|---|
| 20 min | 2 min (skippable) | ~17 min | 1 min |
| 30 min | 3 min (skippable) | ~25.5 min | 1.5 min |
| 45 min | 4 min (skippable) | ~39 min | 2 min |

---

## Exercise Library

Each exercise entry contains:

```ts
interface Exercise {
  id: string;
  nameHe: string;
  nameEn: string;
  muscleGroup: "chest" | "back" | "shoulders" | "biceps" | "triceps" | "core";
  equipment: "vest" | "dumbbell_17.5" | "dumbbell_10" | "dumbbell_5" | "bench" | "rings" | "bodyweight";
  sets: number;
  reps: number;          // target reps
  restBetweenSets: number; // seconds
  estimatedSetDuration: number; // seconds
  weight: string;        // human-readable, e.g. "2×10 kg" or "vest 16 kg"
  instructions: {
    he: string;
    en: string;
  };
  diagram: string;       // SVG id or inline illustration reference
}
```

### Compound Push

| # | Exercise (EN) | Exercise (HE) | Equipment | Sets×Reps | Rest | Weight |
|---|---|---|---|---|---|---|
| 1 | Floor Press | לחיצת רצפה | 2×10 kg DBs + bench | 3×10 | 75s | 2×10 kg |
| 2 | Incline DB Press | לחיצה משופעת | Bench + 2×10 kg | 3×10 | 75s | 2×10 kg |
| 3 | Ring Dips | מתח בטבעות | Rings + vest | 3×8 | 90s | Vest 10–16 kg |
| 4 | DB Squeeze Press | לחיצת סיחוט | 2×10 kg | 3×12 | 60s | 2×10 kg |
| 5 | Single-Arm DB Press | לחיצה חד-צדדית | 1×17.5 kg + bench | 3×8/side | 75s | 17.5 kg |
| 6 | Push-Ups (weighted) | שכיבות סמיכה עם אפוד | Vest | 3×12 | 60s | Vest 10–20 kg |

### Compound Pull

| # | Exercise (EN) | Exercise (HE) | Equipment | Sets×Reps | Rest | Weight |
|---|---|---|---|---|---|---|
| 7 | Ring Pull-Ups | מתח בטבעות | Rings + vest | 3×8 | 90s | Vest 0–16 kg |
| 8 | Ring Rows | חתירה בטבעות | Rings + vest | 3×10 | 75s | Vest 0–10 kg |
| 9 | Single-Arm DB Row | חתירה חד-צדדית | 17.5 kg + bench | 3×10/side | 75s | 17.5 kg |
| 10 | Bent-Over DB Row | חתירה רחבה | 2×10 kg | 3×10 | 75s | 2×10 kg |
| 11 | Renegade Rows | חתירת רנגייד | 2×10 kg | 3×8/side | 60s | 2×10 kg |

### Shoulders

| # | Exercise (EN) | Exercise (HE) | Equipment | Sets×Reps | Rest | Weight |
|---|---|---|---|---|---|---|
| 12 | DB Shoulder Press | לחיצת כתפיים | 2×10 kg, seated bench | 3×10 | 75s | 2×10 kg |
| 13 | Lateral Raise | הרמה צדדית | 2×5 kg | 3×12 | 45s | 2×5 kg |
| 14 | Front Raise | הרמה קדמית | 2×5 kg | 3×12 | 45s | 2×5 kg |
| 15 | Arnold Press | לחיצת ארנולד | 2×10 kg | 3×10 | 60s | 2×10 kg |
| 16 | Rear Delt Fly | פרפר אחורי | 2×5 kg | 3×12 | 45s | 2×5 kg |

### Arms — Biceps

| # | Exercise (EN) | Exercise (HE) | Equipment | Sets×Reps | Rest | Weight |
|---|---|---|---|---|---|---|
| 17 | DB Curl | כיפוף מרפק | 2×10 kg | 3×10 | 60s | 2×10 kg |
| 18 | Hammer Curl | כיפוף פטיש | 2×10 kg | 3×10 | 60s | 2×10 kg |
| 19 | Concentration Curl | כיפוף ריכוז | 1×10 kg | 3×10/side | 45s | 10 kg |
| 20 | Incline Curl | כיפוף משופע | 2×5 kg, bench | 3×12 | 45s | 2×5 kg |

### Arms — Triceps

| # | Exercise (EN) | Exercise (HE) | Equipment | Sets×Reps | Rest | Weight |
|---|---|---|---|---|---|---|
| 21 | Overhead Tricep Ext. | הארכה מעל הראש | 1×17.5 kg | 3×10 | 60s | 17.5 kg |
| 22 | DB Kickback | בעיטה אחורית | 2×5 kg | 3×12 | 45s | 2×5 kg |
| 23 | Close-Grip Push-Up | שכיבות סמיכה צרות | Bodyweight/vest | 3×12 | 60s | Vest optional |
| 24 | Ring Tricep Extension | הארכה בטבעות | Rings | 3×10 | 60s | Bodyweight |

### Warmup Moves (Dynamic, no equipment)

| # | Exercise | Duration |
|---|---|---|
| W1 | Arm circles (forward + backward) | 30s |
| W2 | Band pull-aparts / shoulder dislocates (mimicked, no band — use wide arm rotations) | 30s |
| W3 | Push-up to downward dog | 30s |
| W4 | Jumping jacks | 30s |
| W5 | Scapular push-ups | 30s |
| W6 | Bodyweight squats (general activation) | 30s |

### Cooldown

| # | Exercise | Duration |
|---|---|---|
| C1 | Chest doorway stretch | 20s/side |
| C2 | Cross-body shoulder stretch | 20s/side |
| C3 | Tricep overhead stretch | 20s/side |
| C4 | Slow deep breaths / shake out | 30s |

---

## Workout Templates

### 20-Minute Workout (~17 min working)

**Goal**: Hit each muscle group once with compound movements. 4 exercises.

| Order | Exercise | Sets×Reps | Set dur. | Rest | Total (incl. 10s transition) |
|---|---|---|---|---|---|
| 1 | Ring Pull-Ups (#7) | 3×8 | 25s | 90s | 25+90+25+90+25 = 255s (4:15) |
| 2 | Floor Press (#1) | 3×10 | 30s | 75s | 30+75+30+75+30 = 240s (4:00) |
| 3 | DB Shoulder Press (#12) | 3×10 | 30s | 75s | 240s (4:00) |
| 4 | Superset: Curl (#17) + Overhead Ext (#21) | 3×10 each | 30s+30s | 60s | (30+30+60)×3 = 360s (6:00) |

**Timing**: Warmup 2:00 + transitions 3×10s = 0:30 + working ~18:15 + cooldown ~1:00 = **~21:45**
*(Achievable in ~20 min by skipping warmup or shortening rests slightly.)*

### 30-Minute Workout (~25.5 min working)

**Goal**: Two compound pushes, two pulls, one shoulder, one arm superset. 6 exercises.

| Order | Exercise | Sets×Reps | Set dur. | Rest | Block time |
|---|---|---|---|---|---|
| 1 | Ring Pull-Ups (#7) | 3×8 | 25s | 90s | 4:15 |
| 2 | Incline DB Press (#2) | 3×10 | 30s | 75s | 4:00 |
| 3 | Single-Arm DB Row (#9) | 3×10/side | 60s | 75s | (60+75)×2 + 60 = 330s (5:30) |
| 4 | Push-Ups weighted (#6) | 3×12 | 35s | 60s | 35+60+35+60+35 = 225s (3:45) |
| 5 | Lateral Raise (#13) | 3×12 | 35s | 45s | 35+45+35+45+35 = 195s (3:15) |
| 6 | Superset: Hammer Curl (#18) + Kickback (#22) | 3×10+12 | 30s+35s | 60s | (65+60)×3 = 375s (6:15) |

**Timing**: Warmup 3:00 + transitions 5×10s = 0:50 + working ~27:00 + cooldown 1:30 = **~32:20**
*(Trim 2 min by skipping warmup or cutting 1 set from isolation.)*

### 45-Minute Workout (~39 min working)

**Goal**: Full coverage with volume. 8–9 exercises.

| Order | Exercise | Sets×Reps | Set dur. | Rest | Block time |
|---|---|---|---|---|---|
| 1 | Ring Pull-Ups (#7) | 4×8 | 25s | 90s | 25+90+25+90+25+90+25 = 370s (6:10) |
| 2 | Incline DB Press (#2) | 4×10 | 30s | 75s | 30+75+30+75+30+75+30 = 345s (5:45) |
| 3 | Ring Rows (#8) | 3×10 | 30s | 75s | 240s (4:00) |
| 4 | Ring Dips (#3) | 3×8 | 25s | 90s | 255s (4:15) |
| 5 | Arnold Press (#15) | 3×10 | 30s | 60s | 30+60+30+60+30 = 210s (3:30) |
| 6 | Rear Delt Fly (#16) | 3×12 | 35s | 45s | 195s (3:15) |
| 7 | DB Curl (#17) | 3×10 | 30s | 60s | 210s (3:30) |
| 8 | Overhead Tricep Ext (#21) | 3×10 | 30s | 60s | 210s (3:30) |
| 9 | Push-Ups burnout (#6) | 2×max | 40s | — | 80s (1:20) |

**Timing**: Warmup 4:00 + transitions 8×10s = 1:20 + working ~35:15 + cooldown 2:00 = **~42:35**

---

## UI/UX Architecture

### Screens

1. **Home Screen** — Duration picker (20 / 30 / 45 min), language toggle (HE/EN), "סקירת אימון" (preview) button.
2. **Workout Preview** — Scrollable list of all exercises with sets, reps, weights, total time. "התחל אימון" (Start Workout) button. Toggle: "דלג על חימום" (Skip Warmup).
3. **Active Workout** — The main screen during exercise. Auto-advances. Minimal interaction needed.
4. **Workout Complete** — Summary, total time, encouragement.

### Active Workout Screen Layout

```
┌─────────────────────────────────┐
│  ⏱ 32:15 remaining    [4/8]    │  ← total timer + exercise progress
│─────────────────────────────────│
│                                 │
│     [ Exercise Diagram ]        │  ← simple SVG illustration
│     (animated or static)        │
│                                 │
│─────────────────────────────────│
│  לחיצה משופעת                    │  ← exercise name (large)
│  Incline DB Press               │  ← English subtitle (small, if EN mode)
│                                 │
│  סט 2 / 3                       │  ← current set / total sets
│  10 חזרות  •  2×10 ק"ג          │  ← reps • weight
│                                 │
│─────────────────────────────────│
│  💬 "שכב על הספסל בזווית 30-45  │  ← instruction text
│   מעלות, לחץ את המשקולות כלפי   │
│   מעלה בתנועה מבוקרת"           │
│─────────────────────────────────│
│                                 │
│  ██████████░░░░░  00:25         │  ← set/rest countdown bar
│                                 │
│  [ ◀ הקודם ]      [ הבא ▶ ]    │  ← skip back / forward
└─────────────────────────────────┘
```

### Transition Screen (10s countdown between exercises)

```
┌─────────────────────────────────┐
│                                 │
│       תתכונן לתרגיל הבא         │
│       GET READY                 │
│                                 │
│            ⏱ 7                  │  ← large countdown number
│                                 │
│     [ Next exercise preview ]   │
│     חתירה חד-צדדית               │
│     17.5 ק"ג  •  3×10           │
│                                 │
│  [ ◀ הקודם ]      [ דלג ▶ ]    │
└─────────────────────────────────┘
```

### State Machine

```
IDLE → WARMUP → TRANSITION(10s) → EXERCISE_SET → REST → EXERCISE_SET → REST → ... → TRANSITION(10s) → ... → COOLDOWN → COMPLETE
                    ↑                                                                       |
                    |_______________________________________________________________________|
```

States:
- `IDLE` — Home screen
- `PREVIEW` — Viewing workout plan
- `WARMUP` — Timed warmup exercises (skippable)
- `TRANSITION` — 10s countdown between exercises
- `EXERCISE_SET` — Working set countdown (auto-advances to REST)
- `REST` — Rest between sets countdown (auto-advances to next SET or TRANSITION)
- `COOLDOWN` — Cooldown stretches
- `COMPLETE` — Done screen

### User Interactions During Workout

**Minimal by design.** The screen auto-advances. Available controls:
- **Skip forward** (▶) — jump to next exercise (skips remaining sets)
- **Skip backward** (◀) — go back to previous exercise
- **Pause / Resume** — tap center area to pause timer
- **Skip warmup** — available only during warmup phase

NO "complete set" buttons. NO rep logging. The timer drives everything.

---

## Technical Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React (single .jsx artifact) | Simple SPA, no routing needed, Claude Code can produce it in one file |
| Styling | Tailwind CSS (utility classes) | Fast iteration, RTL support via `dir="rtl"` |
| State management | `useReducer` | Workout state machine maps cleanly to reducer |
| Timer | `useEffect` + `setInterval` | 1-second tick driving the state machine |
| Diagrams | Inline SVGs | Simple stick-figure exercise illustrations, no external assets |
| Persistence | None (or `window.storage` if needed) | Personal use, no login, no history needed initially |
| i18n | Simple object map `{ he: {...}, en: {...} }` | Two languages, no library needed |
| Sound | Web Audio API (optional) | Beep on transition countdown (3-2-1) |

### File Structure (single-file SPA)

```
workout-app.jsx          ← entire app: data, logic, UI
```

All exercise data, workout templates, SVG diagrams, translations, and UI components live in one file for simplicity.

---

## Data Architecture

```ts
// Workout template
interface WorkoutTemplate {
  id: string;
  duration: 20 | 30 | 45;
  warmup: WarmupExercise[];
  exercises: WorkoutExercise[];
  cooldown: CooldownExercise[];
  totalEstimatedSeconds: number;
}

// A single exercise in a workout
interface WorkoutExercise {
  exerciseId: string;       // references Exercise library
  sets: number;
  reps: number;
  restBetweenSets: number;  // seconds
  estimatedSetDuration: number; // seconds
  weight: string;
  supersetWith?: string;    // exerciseId of paired exercise (if superset)
  notes?: string;
}

// Timer state
interface TimerState {
  phase: "idle" | "preview" | "warmup" | "transition" | "exercise" | "rest" | "cooldown" | "complete";
  currentExerciseIndex: number;
  currentSet: number;
  secondsRemaining: number;       // for current phase
  totalSecondsRemaining: number;  // for entire workout
  isPaused: boolean;
}
```

---

## Implementation Plan

### Phase 1 — Core MVP
1. **Exercise data**: Define all exercises with Hebrew + English names, instructions, sets/reps/weights.
2. **Workout templates**: Build the 3 duration templates (20/30/45 min), 1 variant each.
3. **Timer engine**: Implement the state machine with `useReducer`, auto-advancing through all phases.
4. **Home screen**: Duration picker + start button.
5. **Active workout screen**: Timer, exercise info, progress indicator, instruction text.
6. **Transition screen**: 10s countdown with next-exercise preview.
7. **Navigation**: Forward/backward skip, pause/resume, skip warmup.

### Phase 2 — Polish
8. **Exercise diagrams**: Simple SVG stick-figure illustrations for each exercise.
9. **Sound cues**: Beep on 3-2-1 countdown, tone on exercise complete.
10. **RTL/Hebrew layout**: Full Hebrew UI with `dir="rtl"`, English toggle.
11. **Workout preview screen**: Scrollable plan before starting.
12. **Cooldown phase**: Guided stretches with timer.
13. **Completion screen**: Summary + total time.

---

## Design Direction

**Aesthetic**: Industrial / gym-utilitarian. Dark background (near-black), bold sans-serif type, high-contrast accent color (electric orange or neon green). Large readable text — designed to be glanced at from a bench 1–2 meters away. Progress bars are thick and chunky. Countdown numbers are massive. Minimal chrome, maximum information density where it matters.

**Typography**: Bold, condensed display font for exercise names and countdown numbers. Clean sans-serif for instructions and details.

**Key constraint**: Must be readable at arm's length on a tablet propped up nearby during exercise. No squinting.

---

## Timing Accuracy Notes

The total workout time is an **estimate**. Real-world variance comes from:
- Actual set duration may differ from the 3s/rep estimate
- User might pause
- Skip warmup saves 2–4 minutes

The app should display "~20 min" / "~30 min" / "~45 min" and show a live total-remaining timer. The timer counts down regardless of user speed — it's a pacer, not a tracker. If a set timer runs out, it moves on. The user follows the rhythm.

---

## Open Questions / Future Considerations

- [ ] Add lower-body day option? (Currently upper-body only per user request)
- [ ] Track workout history / streak? (Not needed for MVP)
- [ ] Progressive overload prompts? (e.g., "Try vest at 14 kg this week")
- [ ] Rest timer audio cues vs. visual only?
- [ ] Landscape-optimized layout for tablet?
