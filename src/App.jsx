import { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import exercisesData from './data/exercises.json'
import defaultPlanData from './data/workout-plan.json'

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────
const T = {
  he: {
    appTitle: 'אימון',
    pickDuration: 'בחר משך אימון',
    min: 'דקות',
    preview: 'סקירת אימון',
    start: 'התחל אימון',
    skipWarmup: 'דלג על חימום',
    back: 'חזרה',
    pause: 'השהה',
    resume: 'המשך',
    prev: 'הקודם',
    next: 'הבא',
    skip: 'דלג',
    set: 'סט',
    of: '/',
    reps: 'חזרות',
    rest: 'מנוחה',
    getReady: 'התכוננו לתרגיל הבא',
    warmup: 'חימום',
    cooldown: 'שחרור',
    complete: 'כל הכבוד!',
    totalTime: 'זמן כולל',
    backHome: 'חזרה הביתה',
    superset: 'סופרסט',
    paused: 'מושהה',
    tapResume: 'לחץ להמשך',
    weight: 'משקל',
    exercises: 'תרגילים',
    remaining: 'נותר',
    sec: 'שנ׳',
    dayA: 'יום א׳',
    dayB: 'יום ב׳',
    pushFocus: 'דחיפה + משיכה אנכית',
    pullFocus: 'משיכה אופקית + דחיפה',
    upperBody: 'גוף עליון',
    absLegs: 'בטן + רגליים',
    category: 'קטגוריה',
  },
  en: {
    appTitle: 'Workout',
    pickDuration: 'Pick workout duration',
    min: 'min',
    preview: 'Preview Workout',
    start: 'Start Workout',
    skipWarmup: 'Skip Warmup',
    back: 'Back',
    pause: 'Pause',
    resume: 'Resume',
    prev: 'Prev',
    next: 'Next',
    skip: 'Skip',
    set: 'Set',
    of: '/',
    reps: 'reps',
    rest: 'Rest',
    getReady: 'Get Ready',
    warmup: 'Warm Up',
    cooldown: 'Cool Down',
    complete: 'Great Work!',
    totalTime: 'Total Time',
    backHome: 'Back Home',
    superset: 'Superset',
    paused: 'Paused',
    tapResume: 'Tap to Resume',
    weight: 'Weight',
    exercises: 'exercises',
    remaining: 'remaining',
    sec: 's',
    dayA: 'Day A',
    dayB: 'Day B',
    pushFocus: 'Push + Vertical Pull',
    pullFocus: 'Horizontal Pull + Push',
    upperBody: 'Upper Body',
    absLegs: 'Abs & Legs',
    category: 'Category',
  },
}

// ─────────────────────────────────────────────
// PLAN RESOLVER
// Merges the built-in exercise library with any
// extra exercises defined inside a custom plan.
// ─────────────────────────────────────────────
function resolvePlan(plan) {
  return {
    ...plan,
    exercises: { ...exercisesData.exercises, ...(plan.exercises ?? {}) },
  }
}

const DEFAULT_PLAN = resolvePlan(defaultPlanData)

// ─────────────────────────────────────────────
// STEP FLATTENER
// ─────────────────────────────────────────────
function buildSteps(template, skipWarmup, plan) {
  const { exercises, warmup, cooldown } = plan
  const steps = []
  let groupIndex = 0
  const groupStarts = []

  // Warmup
  if (!skipWarmup) {
    groupStarts.push(0)
    for (const wu of warmup) {
      steps.push({ type: 'warmup', exercise: wu, duration: wu.duration, groupIndex })
    }
    groupIndex++
  }

  // Exercise blocks
  const exList = template.exercises
  let i = 0
  while (i < exList.length) {
    const ex = exList[i]
    const exData = exercises[ex.exerciseId]

    if (ex.supersetWith) {
      // Superset: current ex is A, next entry is B
      const exB = exList[i + 1]
      const exDataB = exercises[exB.exerciseId]

      groupStarts.push(steps.length)
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, workoutEx: ex, previewExB: exDataB, workoutExB: exB, isSuperset: true, groupIndex })

      for (let set = 1; set <= ex.sets; set++) {
        steps.push({ type: 'exercise', exercise: exData, workoutEx: ex, set, totalSets: ex.sets, supersetPart: 'A', duration: ex.setDuration, groupIndex })
        steps.push({ type: 'exercise', exercise: exDataB, workoutEx: exB, set, totalSets: exB.sets, supersetPart: 'B', duration: exB.setDuration, groupIndex })
        if (set < ex.sets) {
          steps.push({ type: 'rest', duration: ex.rest, previewExercise: exData, previewExB: exDataB, isSuperset: true, groupIndex })
        }
      }
      groupIndex++
      i += 2
    } else {
      groupStarts.push(steps.length)
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, workoutEx: ex, groupIndex })

      for (let set = 1; set <= ex.sets; set++) {
        steps.push({ type: 'exercise', exercise: exData, workoutEx: ex, set, totalSets: ex.sets, duration: ex.setDuration, groupIndex })
        if (set < ex.sets) {
          steps.push({ type: 'rest', duration: ex.rest, previewExercise: exData, groupIndex })
        }
      }
      groupIndex++
      i++
    }
  }

  // Cooldown
  groupStarts.push(steps.length)
  for (const cd of cooldown) {
    steps.push({ type: 'cooldown', exercise: cd, duration: cd.duration, groupIndex })
  }
  groupIndex++

  steps.push({ type: 'complete', duration: 0, groupIndex })

  return { steps, groupStarts }
}

function totalRemainingSeconds(steps, stepIndex, secondsRemaining) {
  let total = secondsRemaining
  for (let i = stepIndex + 1; i < steps.length; i++) {
    total += steps[i].duration || 0
  }
  return total
}

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ─────────────────────────────────────────────
// SOUND
// ─────────────────────────────────────────────
const audioCtxRef = { current: null }

function getAudioCtx() {
  if (!audioCtxRef.current) {
    try {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) { return null }
  }
  return audioCtxRef.current
}

function playBeep(freq = 880, duration = 0.12, volume = 0.25) {
  const ctx = getAudioCtx()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (e) {}
}

function playStartTone() {
  // Two ascending beeps
  playBeep(660, 0.1, 0.2)
  setTimeout(() => playBeep(880, 0.2, 0.3), 120)
}

function playRestTone() {
  playBeep(440, 0.2, 0.2)
}

// ─────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────
const initialState = {
  lang: 'he',
  screen: 'home',        // home | preview | active | complete
  selectedCategory: 'upper',           // derived from plan template key prefix
  selectedDuration: 30,
  selectedVariation: 'a',              // only used when category+duration has a/b variants
  skipWarmup: false,
  plan: DEFAULT_PLAN,    // active workout plan (can be swapped by LOAD_PLAN)
  steps: [],
  groupStarts: [],
  stepIndex: 0,
  secondsRemaining: 0,
  isPaused: false,
  completedSeconds: 0,   // how long the workout took
}

function advanceStep(state) {
  const nextIndex = state.stepIndex + 1
  if (nextIndex >= state.steps.length) {
    return { ...state, screen: 'complete' }
  }
  const nextStep = state.steps[nextIndex]
  if (nextStep.type === 'complete') {
    return { ...state, screen: 'complete', stepIndex: nextIndex, completedSeconds: state.completedSeconds + 1 }
  }
  return {
    ...state,
    stepIndex: nextIndex,
    secondsRemaining: nextStep.duration || 0,
    completedSeconds: state.completedSeconds + 1,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.category,
        selectedDuration: getAvailableDurations(state.plan.templates, action.category)[0] ?? 30,
      }

    case 'SET_DURATION':
      return { ...state, selectedDuration: action.duration }

    case 'SET_VARIATION':
      return { ...state, selectedVariation: action.variation }

    case 'TOGGLE_SKIP_WARMUP':
      return { ...state, skipWarmup: !state.skipWarmup }

    case 'SET_LANG':
      return { ...state, lang: action.lang }

    case 'GO_PREVIEW':
      return { ...state, screen: 'preview' }

    case 'GO_HOME':
      return { ...initialState, lang: state.lang, plan: state.plan, selectedCategory: state.selectedCategory }

    case 'LOAD_PLAN': {
      const loaded = resolvePlan(action.plan)
      const firstCat = getAvailableCategories(loaded.templates)[0] ?? 'upper'
      const firstDuration = getAvailableDurations(loaded.templates, firstCat)[0] ?? 30
      return { ...initialState, lang: state.lang, plan: loaded, selectedCategory: firstCat, selectedDuration: firstDuration }
    }

    case 'START_WORKOUT': {
      const hasVariants = state.plan.templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined
      const templateKey = hasVariants
        ? `${state.selectedCategory}_${state.selectedDuration}${state.selectedVariation}`
        : `${state.selectedCategory}_${state.selectedDuration}`
      const template = state.plan.templates[templateKey]
      const { steps, groupStarts } = buildSteps(template, state.skipWarmup, state.plan)
      const firstStep = steps[0]
      return {
        ...state,
        screen: 'active',
        steps,
        groupStarts,
        stepIndex: 0,
        secondsRemaining: firstStep?.duration ?? 0,
        isPaused: false,
        completedSeconds: 0,
      }
    }

    case 'TICK': {
      if (state.isPaused) return state
      if (state.secondsRemaining > 1) {
        return { ...state, secondsRemaining: state.secondsRemaining - 1, completedSeconds: state.completedSeconds + 1 }
      }
      return advanceStep(state)
    }

    case 'SKIP_FORWARD': {
      const currentGroup = state.steps[state.stepIndex]?.groupIndex ?? 0
      const nextGroupIdx = currentGroup + 1
      if (nextGroupIdx >= state.groupStarts.length) {
        return { ...state, screen: 'complete' }
      }
      const nextStart = state.groupStarts[nextGroupIdx]
      const nextStep = state.steps[nextStart]
      return {
        ...state,
        stepIndex: nextStart,
        secondsRemaining: nextStep?.duration ?? 0,
      }
    }

    case 'SKIP_BACKWARD': {
      const currentGroup = state.steps[state.stepIndex]?.groupIndex ?? 0
      const currentGroupStart = state.groupStarts[currentGroup] ?? 0
      const isNearStart = state.stepIndex <= currentGroupStart + 1
      let targetGroup = isNearStart ? Math.max(0, currentGroup - 1) : currentGroup
      const targetStart = state.groupStarts[targetGroup] ?? 0
      const targetStep = state.steps[targetStart]
      return {
        ...state,
        stepIndex: targetStart,
        secondsRemaining: targetStep?.duration ?? 0,
      }
    }

    case 'PAUSE_RESUME':
      return { ...state, isPaused: !state.isPaused }

    default:
      return state
  }
}

// ─────────────────────────────────────────────
// SVG DIAGRAMS
// ─────────────────────────────────────────────
// Shared stick figure primitives
function Head({ cx = 50, cy = 18, r = 8 }) {
  return <circle cx={cx} cy={cy} r={r} fill="#e2e8f0" />
}
function Body({ x1 = 50, y1 = 26, x2 = 50, y2 = 60 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
}
function Dumbbell({ x1, y1, x2, y2 }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x={x1 - 4} y={y1 - 3} width={5} height={6} rx={1} fill="#f97316" />
      <rect x={x2 - 1} y={y2 - 3} width={5} height={6} rx={1} fill="#f97316" />
    </g>
  )
}

const SVGS = {
  bench_press: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: flat bench, dumbbells at chest */}
      <rect x="5" y="52" width="82" height="6" rx="2" fill="#3f3f46" />
      <line x1="14" y1="58" x2="14" y2="70" stroke="#3f3f46" strokeWidth="2.5" />
      <line x1="79" y1="58" x2="79" y2="70" stroke="#3f3f46" strokeWidth="2.5" />
      <circle cx="14" cy="44" r="6" fill="#e2e8f0" />
      <line x1="20" y1="44" x2="72" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="46" x2="28" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="48" x2="58" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={23} y1={33} x2={33} y2={33} />
      <Dumbbell x1={53} y1={35} x2={63} y2={35} />
      <line x1="72" y1="50" x2="80" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="50" x2="84" y2="57" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms extended */}
      <rect x="115" y="52" width="82" height="6" rx="2" fill="#3f3f46" />
      <line x1="124" y1="58" x2="124" y2="70" stroke="#3f3f46" strokeWidth="2.5" />
      <line x1="189" y1="58" x2="189" y2="70" stroke="#3f3f46" strokeWidth="2.5" />
      <circle cx="124" cy="44" r="6" fill="#e2e8f0" />
      <line x1="130" y1="44" x2="182" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="142" y1="46" x2="136" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="165" y1="48" x2="171" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={131} y1={21} x2={141} y2={21} />
      <Dumbbell x1={166} y1={21} x2={176} y2={21} />
      <line x1="182" y1="50" x2="190" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="182" y1="50" x2="194" y2="57" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  incline_press: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: incline bench — HEAD AT HIGH END (right), dumbbells at chest */}
      <line x1="5" y1="70" x2="85" y2="42" stroke="#3f3f46" strokeWidth="5" strokeLinecap="round" />
      <line x1="85" y1="42" x2="85" y2="70" stroke="#3f3f46" strokeWidth="2.5" />
      <circle cx="78" cy="34" r="6" fill="#e2e8f0" />
      <line x1="72" y1="40" x2="28" y2="62" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="44" x2="55" y2="27" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="50" x2="49" y2="33" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={50} y1={24} x2={60} y2={24} />
      <Dumbbell x1={44} y1={30} x2={54} y2={30} />
      <line x1="28" y1="62" x2="18" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="62" x2="22" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: same bench, arms extended upward */}
      <line x1="115" y1="70" x2="195" y2="42" stroke="#3f3f46" strokeWidth="5" strokeLinecap="round" />
      <line x1="195" y1="42" x2="195" y2="70" stroke="#3f3f46" strokeWidth="2.5" />
      <circle cx="188" cy="34" r="6" fill="#e2e8f0" />
      <line x1="182" y1="40" x2="138" y2="62" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="170" y1="44" x2="162" y2="12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="156" y1="50" x2="162" y2="15" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={157} y1={9} x2={167} y2={9} />
      <line x1="138" y1="62" x2="128" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="138" y1="62" x2="132" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  pull_up: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms fully extended, hanging */}
      <line x1="10" y1="6" x2="88" y2="6" stroke="#78716c" strokeWidth="3" />
      <circle cx="28" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="70" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <line x1="28" y1="19" x2="49" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="19" x2="49" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="49" cy="43" r="6" fill="#e2e8f0" />
      <line x1="49" y1="49" x2="49" y2="67" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="49" y1="55" x2="40" y2="66" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="49" y1="55" x2="58" y2="66" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: chin above rings, arms bent */}
      <line x1="120" y1="6" x2="198" y2="6" stroke="#78716c" strokeWidth="3" />
      <circle cx="138" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="180" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="159" cy="20" r="6" fill="#e2e8f0" />
      <line x1="153" y1="26" x2="138" y2="19" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="165" y1="26" x2="180" y2="19" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="159" y1="26" x2="159" y2="56" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="159" y1="56" x2="150" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="159" y1="56" x2="168" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_row: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: leaning back, arms fully extended */}
      <line x1="10" y1="6" x2="88" y2="6" stroke="#78716c" strokeWidth="3" />
      <circle cx="28" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="70" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="22" cy="52" r="6" fill="#e2e8f0" />
      <line x1="28" y1="48" x2="64" y2="32" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="36" y1="44" x2="28" y2="19" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="37" x2="70" y2="19" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="32" x2="74" y2="18" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="32" x2="80" y2="26" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: chest pulled to rings, elbows back */}
      <line x1="120" y1="6" x2="198" y2="6" stroke="#78716c" strokeWidth="3" />
      <circle cx="138" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="180" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="135" cy="28" r="6" fill="#e2e8f0" />
      <line x1="141" y1="30" x2="175" y2="42" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="34" x2="138" y2="19" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="162" y1="38" x2="180" y2="19" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="175" y1="42" x2="185" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="175" y1="42" x2="190" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_dip: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms straight, top position */}
      <line x1="5" y1="6" x2="88" y2="6" stroke="#78716c" strokeWidth="3" />
      <circle cx="22" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="75" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <line x1="22" y1="21" x2="32" y2="32" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="21" x2="65" y2="32" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="49" cy="32" r="6" fill="#e2e8f0" />
      <line x1="49" y1="38" x2="49" y2="60" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="49" y1="46" x2="40" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="49" y1="46" x2="58" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms bent ~90°, body dropped */}
      <line x1="115" y1="6" x2="198" y2="6" stroke="#78716c" strokeWidth="3" />
      <circle cx="132" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="185" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <line x1="132" y1="21" x2="138" y2="32" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="138" y1="32" x2="159" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="185" y1="21" x2="179" y2="32" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="179" y1="32" x2="159" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="159" cy="44" r="6" fill="#e2e8f0" />
      <line x1="159" y1="50" x2="159" y2="68" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="159" y1="56" x2="150" y2="66" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="159" y1="56" x2="168" y2="66" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  single_row: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Bench */}
      <rect x="10" y="44" width="45" height="7" rx="2" fill="#3f3f46" />
      <line x1="18" y1="51" x2="18" y2="62" stroke="#3f3f46" strokeWidth="3" />
      <line x1="47" y1="51" x2="47" y2="62" stroke="#3f3f46" strokeWidth="3" />
      {/* Person kneeling on bench */}
      <circle cx="30" cy="30" r="7" fill="#e2e8f0" />
      <line x1="30" y1="37" x2="30" y2="44" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="39" x2="18" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rowing arm */}
      <line x1="30" y1="39" x2="72" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={68} y1={30} x2={80} y2={30} />
    </svg>
  ),
  bent_row: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: bent over, arms hanging down */}
      <circle cx="18" cy="22" r="6" fill="#e2e8f0" />
      <line x1="18" y1="28" x2="56" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="33" x2="26" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="40" x2="40" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={56} x2={31} y2={56} />
      <Dumbbell x1={35} y1={62} x2={45} y2={62} />
      <line x1="56" y1="46" x2="47" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="46" x2="65" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: bent over, elbows pulled up to ribs */}
      <circle cx="128" cy="22" r="6" fill="#e2e8f0" />
      <line x1="128" y1="28" x2="166" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="138" y1="33" x2="134" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="152" y1="40" x2="148" y2="26" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={129} y1={17} x2={139} y2={17} />
      <Dumbbell x1={143} y1={23} x2={153} y2={23} />
      <line x1="166" y1="46" x2="157" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="166" y1="46" x2="175" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  renegade: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Push-up position */}
      <circle cx="20" cy="30" r="7" fill="#e2e8f0" />
      <line x1="20" y1="37" x2="72" y2="48" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="36" x2="25" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={52} x2={29} y2={52} />
      {/* One arm rowing up */}
      <line x1="55" y1="42" x2="52" y2="26" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={48} y1={22} x2={56} y2={22} />
      <line x1="72" y1="48" x2="68" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="48" x2="78" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  shoulder_press: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: dumbbells at ear/shoulder height */}
      <rect x="28" y="57" width="32" height="5" rx="2" fill="#3f3f46" />
      <circle cx="44" cy="14" r="6" fill="#e2e8f0" />
      <line x1="44" y1="20" x2="44" y2="57" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="57" x2="34" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="57" x2="54" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="28" x2="22" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="28" x2="20" y2="16" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="28" x2="66" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="28" x2="68" y2="16" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={15} y1={15} x2={25} y2={15} />
      <Dumbbell x1={63} y1={15} x2={73} y2={15} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms fully extended overhead */}
      <rect x="138" y="57" width="32" height="5" rx="2" fill="#3f3f46" />
      <circle cx="154" cy="14" r="6" fill="#e2e8f0" />
      <line x1="154" y1="20" x2="154" y2="57" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="154" y1="57" x2="144" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="57" x2="164" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="142" y2="10" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="166" y2="10" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={137} y1={7} x2={147} y2={7} />
      <Dumbbell x1={161} y1={7} x2={171} y2={7} />
    </svg>
  ),
  lateral_raise: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms at sides */}
      <circle cx="45" cy="16" r="6" fill="#e2e8f0" />
      <line x1="45" y1="22" x2="45" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="30" x2="32" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="30" x2="58" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={27} y1={44} x2={27} y2={52} />
      <Dumbbell x1={62} y1={44} x2={62} y2={52} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms at shoulder height */}
      <circle cx="155" cy="16" r="6" fill="#e2e8f0" />
      <line x1="155" y1="22" x2="155" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="54" x2="147" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="54" x2="163" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="30" x2="124" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="30" x2="186" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={119} y1={27} x2={119} y2={33} />
      <Dumbbell x1={190} y1={27} x2={190} y2={33} />
    </svg>
  ),
  front_raise: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="8" fill="#e2e8f0" />
      <line x1="50" y1="28" x2="50" y2="60" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="60" x2="42" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="60" x2="58" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* One arm raised forward */}
      <line x1="50" y1="38" x2="36" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="38" x2="38" y2="18" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={33} y1={14} x2={43} y2={14} />
      <line x1="50" y1="38" x2="62" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  arnold: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: dumbbells at shoulder, palms facing in */}
      <rect x="28" y="58" width="32" height="5" rx="2" fill="#3f3f46" />
      <circle cx="44" cy="16" r="6" fill="#e2e8f0" />
      <line x1="44" y1="22" x2="44" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="58" x2="34" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="58" x2="54" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="30" x2="28" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="34" x2="26" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="30" x2="60" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="34" x2="62" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={17} x2={31} y2={17} />
      <Dumbbell x1={57} y1={17} x2={67} y2={17} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms fully extended overhead */}
      <rect x="138" y="58" width="32" height="5" rx="2" fill="#3f3f46" />
      <circle cx="154" cy="16" r="6" fill="#e2e8f0" />
      <line x1="154" y1="22" x2="154" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="154" y1="58" x2="144" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="58" x2="164" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="142" y2="12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="166" y2="12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={137} y1={8} x2={147} y2={8} />
      <Dumbbell x1={161} y1={8} x2={171} y2={8} />
    </svg>
  ),
  rear_fly: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: hinged forward, arms hanging down */}
      <circle cx="18" cy="20" r="6" fill="#e2e8f0" />
      <line x1="18" y1="26" x2="56" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="32" x2="26" y2="54" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="40" x2="40" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={54} x2={31} y2={54} />
      <Dumbbell x1={35} y1={60} x2={45} y2={60} />
      <line x1="56" y1="46" x2="47" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="46" x2="65" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms spread wide, shoulder blades squeezed */}
      <circle cx="128" cy="20" r="6" fill="#e2e8f0" />
      <line x1="128" y1="26" x2="166" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="138" y1="32" x2="116" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="152" y1="40" x2="174" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={111} y1={16} x2={120} y2={16} />
      <Dumbbell x1={169} y1={24} x2={178} y2={24} />
      <line x1="166" y1="46" x2="157" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="166" y1="46" x2="175" y2="63" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  curl: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms down, palms forward */}
      <circle cx="45" cy="14" r="6" fill="#e2e8f0" />
      <line x1="45" y1="20" x2="45" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="36" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="54" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="30" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="34" x2="28" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="60" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="34" x2="62" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={23} y1={53} x2={33} y2={53} />
      <Dumbbell x1={57} y1={53} x2={67} y2={53} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms curled to shoulders */}
      <circle cx="155" cy="14" r="6" fill="#e2e8f0" />
      <line x1="155" y1="20" x2="155" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="54" x2="146" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="54" x2="164" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="140" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="34" x2="136" y2="16" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="170" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="34" x2="174" y2="16" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={131} y1={13} x2={141} y2={13} />
      <Dumbbell x1={169} y1={13} x2={179} y2={13} />
    </svg>
  ),
  hammer_curl: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms down, neutral (hammer) grip */}
      <circle cx="45" cy="14" r="6" fill="#e2e8f0" />
      <line x1="45" y1="20" x2="45" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="36" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="54" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="30" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="34" x2="28" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="60" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="34" x2="62" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="50" x2="28" y2="62" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="24" y="48" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="24" y="60" width="8" height="4" rx="1" fill="#f97316" />
      <line x1="62" y1="50" x2="62" y2="62" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="58" y="48" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="58" y="60" width="8" height="4" rx="1" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms curled to shoulders */}
      <circle cx="155" cy="14" r="6" fill="#e2e8f0" />
      <line x1="155" y1="20" x2="155" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="54" x2="146" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="54" x2="164" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="140" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="34" x2="136" y2="16" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="170" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="34" x2="174" y2="16" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="136" y1="10" x2="136" y2="22" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="132" y="8" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="132" y="20" width="8" height="4" rx="1" fill="#f97316" />
      <line x1="174" y1="10" x2="174" y2="22" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="170" y="8" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="170" y="20" width="8" height="4" rx="1" fill="#f97316" />
    </svg>
  ),
  conc_curl: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <rect x="25" y="50" width="30" height="7" rx="2" fill="#3f3f46" />
      <line x1="30" y1="57" x2="30" y2="68" stroke="#3f3f46" strokeWidth="3" />
      <line x1="50" y1="57" x2="50" y2="68" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="42" cy="22" r="7" fill="#e2e8f0" />
      <line x1="42" y1="29" x2="40" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arm curling on thigh */}
      <line x1="40" y1="36" x2="25" y2="42" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="25" y1="42" x2="22" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={17} y1={24} x2={27} y2={24} />
    </svg>
  ),
  incline_curl: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <line x1="10" y1="70" x2="75" y2="35" stroke="#3f3f46" strokeWidth="6" strokeLinecap="round" />
      <line x1="75" y1="35" x2="75" y2="70" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="25" cy="42" r="7" fill="#e2e8f0" />
      <line x1="25" y1="49" x2="60" y2="38" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arms hanging down from incline */}
      <line x1="35" y1="44" x2="28" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={23} y1={62} x2={33} y2={62} />
      <line x1="48" y1="41" x2={42} y2={58} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={37} y1={58} x2={47} y2={58} />
    </svg>
  ),
  overhead_ext: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms bent, dumbbell lowered behind head */}
      <circle cx="45" cy="14" r="6" fill="#e2e8f0" />
      <line x1="45" y1="20" x2="45" y2="56" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="56" x2="36" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="56" x2="54" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="26" x2="32" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="20" x2="38" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="26" x2="58" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="20" x2="52" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="39" y="36" width="12" height="5" rx="2" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms straight overhead */}
      <circle cx="155" cy="14" r="6" fill="#e2e8f0" />
      <line x1="155" y1="20" x2="155" y2="56" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="56" x2="146" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="56" x2="164" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="26" x2="147" y2="12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="26" x2="163" y2="12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="149" y="5" width="12" height="5" rx="2" fill="#f97316" />
    </svg>
  ),
  kickback: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="20" cy="22" r="7" fill="#e2e8f0" />
      <line x1="20" y1="29" x2="55" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Elbow up, arm extending back */}
      <line x1="35" y1="36" x2="40" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="28" x2="70" y2="24" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={65} y1={20} x2={75} y2={20} />
      <line x1="55" y1="46" x2="48" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="46" x2="62" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  close_pushup: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="20" cy="26" r="7" fill="#e2e8f0" />
      <line x1="20" y1="33" x2="75" y2="44" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arms close together */}
      <line x1="28" y1="34" x2="36" y2="48" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="37" x2={44} y2={48} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="48" x2={44} y2={48} stroke="#e2e8f0" strokeWidth="2" />
      <line x1="75" y1="44" x2="67" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="44" x2="80" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_ext: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <line x1="20" y1="8" x2="80" y2="8" stroke="#78716c" strokeWidth="3" />
      <circle cx="32" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="68" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      {/* Person leaning into rings, arms bent */}
      <circle cx="50" cy="40" r="8" fill="#e2e8f0" />
      <line x1="50" y1="48" x2="50" y2="66" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="66" x2="42" y2="76" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="66" x2="58" y2="76" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="37" y1="40" x2="32" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="63" y1="40" x2="68" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  squeeze_press: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="46" r="7" fill="#e2e8f0" />
      <line x1="50" y1="53" x2="50" y2="70" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="53" x2="38" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="53" x2="62" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Dumbbells squeezed together */}
      <Dumbbell x1={35} y1={28} x2={65} y2={28} />
      <line x1="50" y1="28" x2="50" y2="14" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  single_press: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <rect x="10" y="52" width="80" height="8" rx="2" fill="#3f3f46" />
      <line x1="20" y1="60" x2="20" y2="72" stroke="#3f3f46" strokeWidth="3" />
      <line x1="80" y1="60" x2="80" y2="72" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="25" cy="44" r="7" fill="#e2e8f0" />
      <line x1="32" y1="44" x2="70" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* One arm pressing up */}
      <line x1="45" y1="47" x2="42" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={37} y1={28} x2={47} y2={28} />
      {/* Other arm down */}
      <line x1="58" y1="48" x2="62" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  push_up: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: chest near floor, arms bent */}
      <circle cx="12" cy="28" r="6" fill="#e2e8f0" />
      <line x1="18" y1="30" x2="80" y2="44" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="32" x2="24" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="38" x2="48" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="44" x2="70" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="44" x2="86" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="30" y="34" width="20" height="8" rx="2" fill="#f97316" opacity="0.7" />
      <text x="40" y="41" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">V</text>
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms extended, top position */}
      <circle cx="122" cy="20" r="6" fill="#e2e8f0" />
      <line x1="128" y1="24" x2="190" y2="42" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="136" y1="26" x2="136" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="158" y1="33" x2="158" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="190" y1="42" x2="180" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="190" y1="42" x2="196" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="140" y="31" width="20" height="8" rx="2" fill="#f97316" opacity="0.7" />
      <text x="150" y="38" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">V</text>
    </svg>
  ),
  // Warmup SVGs
  warmup_circles: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="55" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="42" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms in circle motion */}
      <path d="M 22 30 Q 15 20 22 12 Q 30 4 38 12" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="3 2" />
      <path d="M 78 30 Q 85 20 78 12 Q 70 4 62 12" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="3 2" />
      <line x1="50" y1="36" x2="24" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="76" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  warmup_shoulder: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="55" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="42" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="22" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="78" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 18 28 A 12 12 0 0 1 18 44" stroke="#f97316" strokeWidth="2" fill="none" />
      <path d="M 82 28 A 12 12 0 0 0 82 44" stroke="#f97316" strokeWidth="2" fill="none" />
    </svg>
  ),
  warmup_downdog: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="7" fill="#e2e8f0" />
      {/* Inverted V shape */}
      <line x1="50" y1="27" x2="22" y2="52" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="27" x2="78" y2="52" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="52" x2="16" y2="66" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="52" x2="28" y2="64" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="78" y1="52" x2="72" y2="64" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="78" y1="52" x2="84" y2="66" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  warmup_jj: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="16" r="8" fill="#e2e8f0" />
      <line x1="50" y1="24" x2="50" y2="52" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arms up */}
      <line x1="50" y1="34" x2="22" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="34" x2="78" y2="20" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs spread */}
      <line x1="50" y1="52" x2="34" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="52" x2="66" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  warmup_scap: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="20" cy="28" r="7" fill="#e2e8f0" />
      <line x1="20" y1="35" x2="76" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="37" x2="28" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="42" x2="52" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="46" x2="68" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="46" x2="82" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 36 35 Q 44 28 52 35" stroke="#f97316" strokeWidth="2" fill="none" />
    </svg>
  ),
  warmup_squat: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="16" r="8" fill="#e2e8f0" />
      <line x1="50" y1="24" x2="50" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="34" x2="34" y2="42" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="34" x2="66" y2="42" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs bent in squat */}
      <line x1="50" y1="46" x2="36" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="56" x2="30" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="46" x2="64" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="56" x2="70" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  // Cooldown SVGs
  cool_chest: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="22" r="8" fill="#e2e8f0" />
      <line x1="50" y1="30" x2="50" y2="60" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="60" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="60" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* One arm on doorframe */}
      <line x1="50" y1="38" x2="80" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="80" y="10" width="6" height="60" rx="2" fill="#52525b" />
      {/* Other arm relaxed */}
      <line x1="50" y1="38" x2="34" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  cool_shoulder: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="8" fill="#e2e8f0" />
      <line x1="50" y1="28" x2="50" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arm across body */}
      <line x1="50" y1="36" x2="22" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="68" y2="26" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  ),
  cool_tricep: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arm up, bent at elbow */}
      <line x1="50" y1="34" x2="66" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="28" x2="60" y2="12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Other hand pulling */}
      <line x1="50" y1="34" x2="38" y2="26" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="38" y1="26" x2="60" y2="12" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  ),
  cool_breathe: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="8" fill="#e2e8f0" />
      <line x1="50" y1="28" x2="50" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="28" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="72" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Breath waves */}
      <path d="M 36 10 Q 40 6 44 10 Q 48 14 52 10 Q 56 6 60 10" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M 40 5 Q 44 1 48 5 Q 52 9 56 5" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  ),

  // ── ABS ──────────────────────────────────────
  plank: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Forearm plank — single position */}
      <circle cx="12" cy="27" r="6" fill="#e2e8f0" />
      <line x1="18" y1="30" x2="80" y2="43" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Left forearm on floor */}
      <line x1="22" y1="32" x2="20" y2="43" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="43" x2="28" y2="43" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right forearm on floor */}
      <line x1="44" y1="37" x2="42" y2="48" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="48" x2="50" y2="48" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <line x1="80" y1="43" x2="72" y2="57" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="43" x2="86" y2="57" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hold-timer arc */}
      <path d="M56 18 A9 9 0 1 1 56.1 18" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="4 3" strokeLinecap="round" />
    </svg>
  ),
  crunch: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: lying flat, knees bent */}
      <circle cx="10" cy="50" r="5" fill="#e2e8f0" />
      <line x1="15" y1="50" x2="55" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="46" x2="10" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="46" x2="30" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="50" x2="65" y2="42" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="65" y1="42" x2="76" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="50" x2="63" y2="57" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="63" y1="57" x2="76" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: upper body crunched up */}
      <circle cx="120" cy="33" r="5" fill="#e2e8f0" />
      <line x1="125" y1="36" x2="154" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="28" x2="113" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="125" y1="31" x2="130" y2="23" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="50" x2="164" y2="42" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="164" y1="42" x2="175" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="50" x2="162" y2="57" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="162" y1="57" x2="175" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  leg_raise: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: lying flat, legs low */}
      <circle cx="10" cy="46" r="5" fill="#e2e8f0" />
      <line x1="15" y1="46" x2="60" y2="48" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="44" x2="22" y2="55" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="45" x2="40" y2="55" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="48" x2="80" y2="47" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="50" x2="80" y2="51" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: legs raised ~90° */}
      <circle cx="115" cy="46" r="5" fill="#e2e8f0" />
      <line x1="120" y1="46" x2="164" y2="48" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="128" y1="44" x2="128" y2="55" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="146" y1="45" x2="146" y2="55" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="164" y1="48" x2="158" y2="14" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="164" y1="48" x2="170" y2="14" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  russian_twist: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Seated, leaning back 45°, dumbbell to side */}
      <circle cx="46" cy="20" r="6" fill="#e2e8f0" />
      <line x1="46" y1="26" x2="58" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arms extended to right */}
      <line x1="50" y1="34" x2="70" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={66} y1={24} x2={76} y2={24} />
      {/* Bent legs */}
      <line x1="58" y1="50" x2="44" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="62" x2="36" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="50" x2="72" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="60" x2="80" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rotation arc */}
      <path d="M40 30 A14 14 0 0 1 56 20" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  mountain_climber: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* High plank, one knee driven forward */}
      <circle cx="14" cy="22" r="6" fill="#e2e8f0" />
      <line x1="20" y1="25" x2="76" y2="38" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="27" x2="24" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="32" x2="46" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Driven knee under chest */}
      <line x1="76" y1="38" x2="58" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="46" x2="50" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Back leg straight */}
      <line x1="76" y1="38" x2="84" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="84" y1="52" x2="90" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Knee-drive arrow */}
      <path d="M66 38 L56 46 M58 42 L56 46 L60 47" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dead_bug: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Lying on back — arm + opposite leg extended */}
      <circle cx="12" cy="44" r="5" fill="#e2e8f0" />
      <line x1="17" y1="44" x2="65" y2="44" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Left arm extended overhead (orange = the moving limb) */}
      <line x1="22" y1="41" x2="14" y2="22" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right arm up (static, tabletop) */}
      <line x1="36" y1="41" x2="40" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="28" x2="50" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right leg tabletop (bent) */}
      <line x1="55" y1="44" x2="56" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="30" x2="68" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leg extended (orange = opposite to extended arm) */}
      <line x1="65" y1="44" x2="84" y2="43" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  // ── LEGS ─────────────────────────────────────
  goblet_squat: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing, DB at chest */}
      <circle cx="45" cy="12" r="6" fill="#e2e8f0" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="30" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="60" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="30" y="32" width="30" height="6" rx="2" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: deep squat, DB at chest */}
      <circle cx="155" cy="26" r="6" fill="#e2e8f0" />
      <line x1="155" y1="32" x2="155" y2="52" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="40" x2="140" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="40" x2="170" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="140" y="44" width="30" height="6" rx="2" fill="#f97316" />
      <line x1="155" y1="52" x2="140" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="60" x2="134" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="52" x2="170" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="60" x2="176" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  reverse_lunge: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing, DBs at sides */}
      <circle cx="45" cy="12" r="6" fill="#e2e8f0" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="28" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={24} y1={34} x2={24} y2={46} />
      <line x1="45" y1="28" x2="62" y2={34} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={66} y1={34} x2={66} y2={46} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: back lunge — front knee 90°, rear knee near floor */}
      <circle cx="148" cy="18" r="6" fill="#e2e8f0" />
      <line x1="148" y1="24" x2="148" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="148" y1="32" x2="132" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={128} y1={38} x2={128} y2={50} />
      <line x1="148" y1="32" x2="164" y2={38} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={168} y1={38} x2={168} y2={50} />
      {/* Front leg bent 90° */}
      <line x1="148" y1="50" x2="136" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="136" y1="60" x2="130" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Back leg, knee near floor */}
      <line x1="148" y1="50" x2="166" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="166" y1="56" x2="172" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  rdl: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing, DBs at hips */}
      <circle cx="45" cy="12" r="6" fill="#e2e8f0" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="32" x2="26" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={22} y1={38} x2={22} y2={50} />
      <line x1="45" y1="32" x2="64" y2={38} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={68} y1={38} x2={68} y2={50} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: hinged forward, back straight, DBs near shins */}
      <circle cx="130" cy="30" r="6" fill="#e2e8f0" />
      <line x1="136" y1="32" x2="170" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="148" y1="38" x2="140" y2="18" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={134} y1={14} x2={146} y2={14} />
      <line x1="158" y1="44" x2={152} y2={26} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={146} y1={22} x2={158} y2={22} />
      <line x1="170" y1="50" x2="162" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="50" x2="178" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  glute_bridge: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: lying on back, knees bent, hips on floor */}
      <circle cx="10" cy="44" r="5" fill="#e2e8f0" />
      <line x1="15" y1="44" x2="48" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="43" x2="22" y2="54" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="44" x2="38" y2="54" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="46" x2="60" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="36" x2="72" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="46" x2="56" y2="54" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="54" x2="72" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: hips raised, body like a ramp */}
      <circle cx="115" cy="44" r="5" fill="#e2e8f0" />
      <line x1="120" y1="44" x2="148" y2="28" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="126" y1="42" x2="126" y2="53" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="138" y1="36" x2="138" y2="47" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="148" y1="28" x2="158" y2="40" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="158" y1="40" x2="170" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="148" y1="28" x2="154" y2="46" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="46" x2="170" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  split_squat: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Bulgarian split squat — down position, rear foot on bench */}
      {/* Bench */}
      <rect x="54" y="44" width="38" height="6" rx="2" fill="#3f3f46" />
      <line x1="60" y1="50" x2="60" y2="60" stroke="#3f3f46" strokeWidth="2.5" />
      <line x1="86" y1="50" x2="86" y2="60" stroke="#3f3f46" strokeWidth="2.5" />
      {/* Person */}
      <circle cx="38" cy="18" r="6" fill="#e2e8f0" />
      <line x1="38" y1="24" x2="38" y2="52" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Front leg bent ~90° */}
      <line x1="38" y1="52" x2="26" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26" y1="60" x2="20" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rear leg — foot on bench */}
      <line x1="38" y1="52" x2="56" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rear knee near floor */}
      <line x1="38" y1="52" x2="52" y2="62" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  sumo_squat: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: wide stance standing, DB between legs */}
      <circle cx="45" cy="12" r="6" fill="#e2e8f0" />
      <line x1="45" y1="18" x2="45" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="28" x2="28" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="36" x2="45" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="62" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="62" y1="36" x2="45" y2="50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="50" x2="28" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="50" x2="62" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="39" y="48" width="12" height="5" rx="2" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: wide squat, thighs parallel */}
      <circle cx="155" cy="22" r="6" fill="#e2e8f0" />
      <line x1="155" y1="28" x2="155" y2="48" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="36" x2="136" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="136" y1="44" x2="128" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="36" x2="174" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="174" y1="44" x2="182" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="48" x2="136" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="48" x2="174" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="149" y="46" width="12" height="5" rx="2" fill="#f97316" />
    </svg>
  ),
  step_up: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Step/box */}
      <rect x="42" y="44" width="50" height="20" rx="2" fill="#3f3f46" />
      {/* Person stepping up — one foot on box, one on floor */}
      <circle cx="44" cy="14" r="6" fill="#e2e8f0" />
      <line x1="44" y1="20" x2="44" y2="44" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="30" x2="28" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={24} y1={36} x2={24} y2={48} />
      <line x1="44" y1="30" x2="60" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={64} y1={36} x2={64} y2={48} />
      {/* Front foot on box */}
      <line x1="44" y1="44" x2="52" y2="44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Back foot on floor */}
      <line x1="44" y1="44" x2="30" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="56" x2="18" y2="64" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Up arrow */}
      <path d="M44 40 L44 28 M40 32 L44 28 L48 32" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calf_raise: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing flat */}
      <circle cx="45" cy="12" r="6" fill="#e2e8f0" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="36" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="54" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="30" x2="26" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={22} y1={36} x2={22} y2={48} />
      <line x1="45" y1="30" x2="64" y2={36} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={68} y1={36} x2={68} y2={48} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: raised on toes */}
      <circle cx="155" cy="6" r="6" fill="#e2e8f0" />
      <line x1="155" y1="12" x2="155" y2="48" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="48" x2="148" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="148" y1="58" x2="144" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="48" x2="162" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="162" y1="58" x2="166" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="24" x2="136" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={132} y1={30} x2={132} y2={42} />
      <line x1="155" y1="24" x2="174" y2={30} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={178} y1={30} x2={178} y2={42} />
    </svg>
  ),
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function ExerciseSvg({ svgKey }) {
  const svg = SVGS[svgKey]
  if (!svg) {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <circle cx="50" cy="25" r="10" fill="#e2e8f0" />
        <line x1="50" y1="35" x2="50" y2="62" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="45" x2="34" y2="55" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="45" x2="66" y2="55" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="62" x2="42" y2="76" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="62" x2="58" y2="76" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  return svg
}

function ProgressBar({ progress, color = 'bg-orange-500' }) {
  return (
    <div className="w-full bg-zinc-800 rounded-full h-4 md:h-5 overflow-hidden">
      <div
        className={`h-4 md:h-5 rounded-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
      />
    </div>
  )
}

function getDurationLabel(selectedDuration, selectedVariation, t) {
  if (selectedDuration === 30 && selectedVariation === 'a') return t.dayA
  if (selectedDuration === 30 && selectedVariation === 'b') return t.dayB
  return `${selectedDuration} ${t.min}`
}

// ─────────────────────────────────────────────
// SCREEN: HOME
// ─────────────────────────────────────────────
// Derive unique category prefixes from template keys (e.g. "upper_20" → ["upper"])
function getAvailableCategories(templates) {
  const cats = new Set()
  Object.keys(templates).forEach(k => {
    const m = k.match(/^(.+)_\d/)
    if (m) cats.add(m[1])
  })
  return Array.from(cats)
}

// Derive unique numeric durations for a given category (e.g. category="upper" → [20,30,45])
function getAvailableDurations(templates, category) {
  const prefix = category + '_'
  const seen = new Set()
  return Object.keys(templates)
    .filter(k => k.startsWith(prefix))
    .map(k => parseInt(k.slice(prefix.length), 10))
    .filter(d => !isNaN(d) && !seen.has(d) && seen.add(d))
    .sort((a, b) => a - b)
}

function categoryLabel(cat, t) {
  if (cat === 'upper') return t.upperBody
  if (cat === 'abs_legs') return t.absLegs
  return cat
}

function categoryIcon(cat) {
  if (cat === 'upper') return '💪'
  if (cat === 'abs_legs') return '🦵'
  return '🏋️'
}

function HomeScreen({ state, dispatch }) {
  const t = T[state.lang]
  const { templates, meta } = state.plan
  const categories = getAvailableCategories(templates)
  const durations = getAvailableDurations(templates, state.selectedCategory)
  const hasVariations =
    templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined &&
    templates[`${state.selectedCategory}_${state.selectedDuration}b`] !== undefined
  const planName = meta?.name ?? ''
  const fileInputRef = useRef(null)
  const [loadError, setLoadError] = useState(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (!parsed.templates || !parsed.warmup || !parsed.cooldown) {
          throw new Error(state.lang === 'he'
            ? 'קובץ לא תקין: חסרים שדות templates / warmup / cooldown'
            : 'Invalid plan: missing templates, warmup, or cooldown fields')
        }
        setLoadError(null)
        dispatch({ type: 'LOAD_PLAN', plan: parsed })
      } catch (err) {
        setLoadError(err.message)
      }
      e.target.value = ''   // allow re-selecting the same file
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col h-full items-center justify-center px-6 gap-10">
      {/* Lang toggle */}
      <div className="absolute top-5 left-5 flex gap-1 bg-zinc-800 rounded-full p-1">
        {['he', 'en'].map(l => (
          <button
            key={l}
            onClick={() => dispatch({ type: 'SET_LANG', lang: l })}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${state.lang === l ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            {l === 'he' ? 'עב' : 'EN'}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="text-6xl md:text-7xl mb-3">💪</div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">{t.appTitle}</h1>
        {planName && planName !== 'Home Workout — Upper Body' && (
          <p className="text-orange-400 mt-1 text-sm font-semibold">{planName}</p>
        )}
        <p className="text-zinc-400 mt-2 text-lg md:text-xl">{t.pickDuration}</p>
      </div>

      {/* Category picker */}
      {categories.length > 1 && (
        <div className="w-full max-w-sm space-y-2">
          <p className="text-zinc-500 text-xs font-bold text-center uppercase tracking-widest">{t.category}</p>
          <div className="flex gap-3">
            {categories.map(cat => {
              const isSelected = state.selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat })}
                  className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 font-black transition-all active:scale-95
                    ${isSelected
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                >
                  <span className="text-2xl leading-none">{categoryIcon(cat)}</span>
                  <span className={`mt-1 text-xs font-semibold text-center ${isSelected ? 'text-orange-100' : 'text-zinc-400'}`}>
                    {categoryLabel(cat, t)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Variation picker — only shown when selected duration has a/b variants */}
      {hasVariations && (
        <div className="w-full max-w-sm space-y-2">
          <p className="text-zinc-500 text-xs font-bold text-center uppercase tracking-widest">
            {state.lang === 'he' ? 'בחר וריאציה' : 'Pick Variation'}
          </p>
          <div className="flex gap-3">
            {(['a', 'b']).map(v => {
              const isSelected = state.selectedVariation === v
              const label = v === 'a' ? t.dayA : t.dayB
              const sub   = v === 'a' ? t.pushFocus : t.pullFocus
              return (
                <button
                  key={v}
                  onClick={() => dispatch({ type: 'SET_VARIATION', variation: v })}
                  className={`flex-1 flex flex-col items-center py-5 rounded-2xl border-2 font-black transition-all active:scale-95
                    ${isSelected
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                >
                  <span className="text-2xl leading-none">{label}</span>
                  <span className={`mt-2 text-xs font-medium text-center px-2 leading-tight ${isSelected ? 'text-orange-100' : 'text-zinc-500'}`}>{sub}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Duration picker — derived from plan templates */}
      <div className="w-full max-w-sm space-y-2">
        <p className="text-zinc-500 text-xs font-bold text-center uppercase tracking-widest">
          {state.lang === 'he' ? 'משך אימון' : 'Duration'}
        </p>
        <div className="flex gap-3">
          {durations.map(d => {
            const isSelected = state.selectedDuration === d
            return (
              <button
                key={d}
                onClick={() => dispatch({ type: 'SET_DURATION', duration: d })}
                className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 font-black transition-all active:scale-95
                  ${isSelected
                    ? 'bg-zinc-700 border-zinc-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
              >
                <span className="text-3xl leading-none">{d}</span>
                <span className="text-xs font-medium mt-1 text-zinc-500">{t.min}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview button */}
      <button
        onClick={() => dispatch({ type: 'GO_PREVIEW' })}
        className="w-full max-w-xs md:max-w-sm bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/30"
      >
        {t.preview}
      </button>

      {/* Load custom plan */}
      <div className="flex flex-col items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-zinc-500 hover:text-zinc-300 text-sm font-semibold underline underline-offset-4 transition-colors"
        >
          {state.lang === 'he' ? '📂 טען תוכנית אימון מקובץ JSON' : '📂 Load workout plan from JSON'}
        </button>
        {loadError && (
          <p className="text-red-400 text-xs text-center max-w-xs">{loadError}</p>
        )}
        {planName && planName !== 'Home Workout — Upper Body' && (
          <button
            onClick={() => dispatch({ type: 'LOAD_PLAN', plan: defaultPlanData })}
            className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
          >
            {state.lang === 'he' ? '↩ חזור לתוכנית ברירת המחדל' : '↩ Reset to default plan'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SCREEN: PREVIEW
// ─────────────────────────────────────────────
function PreviewScreen({ state, dispatch }) {
  const t = T[state.lang]
  const isHe = state.lang === 'he'
  const { exercises, templates } = state.plan
  const hasVariants = templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined
  const templateKey = hasVariants
    ? `${state.selectedCategory}_${state.selectedDuration}${state.selectedVariation}`
    : `${state.selectedCategory}_${state.selectedDuration}`
  const template = templates[templateKey]
  const exList = template.exercises
  const items = []
  let i = 0
  while (i < exList.length) {
    const ex = exList[i]
    const exData = exercises[ex.exerciseId]
    if (ex.supersetWith) {
      const exB = exList[i + 1]
      const exDataB = exercises[exB.exerciseId]
      items.push({ type: 'superset', ex, exData, exB, exDataB })
      i += 2
    } else {
      items.push({ type: 'single', ex, exData })
      i++
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-5 pb-3 border-b border-zinc-800 shrink-0">
        <button
          onClick={() => dispatch({ type: 'GO_HOME' })}
          className="text-zinc-400 hover:text-white text-sm font-medium px-3 py-2 bg-zinc-800 rounded-xl active:scale-95"
        >
          {t.back}
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-white font-black text-xl">{getDurationLabel(state.selectedDuration, state.selectedVariation, t)}</h2>
          <p className="text-zinc-500 text-sm">{items.length} {t.exercises}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {/* Warmup */}
        <div className="bg-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-zinc-300 font-bold">{t.warmup}</span>
          <span className="text-zinc-500 text-sm">{state.skipWarmup ? '—' : '3:00'}</span>
        </div>

        {items.map((item, idx) => {
          if (item.type === 'superset') {
            return (
              <div key={idx} className="bg-zinc-900 rounded-xl border border-orange-500/30 overflow-hidden">
                <div className="bg-orange-500/10 px-4 py-1.5 flex items-center gap-2">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-wide">{t.superset}</span>
                </div>
                {[{ex: item.ex, exData: item.exData}, {ex: item.exB, exData: item.exDataB}].map(({ex, exData}, j) => (
                  <div key={j} className={`px-4 py-3 ${j === 0 ? 'border-b border-zinc-800' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-base leading-tight">{isHe ? exData.nameHe : exData.nameEn}</p>
                        {isHe && <p className="text-zinc-500 text-xs mt-0.5">{exData.nameEn}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-orange-400 font-black text-sm">{ex.sets}×{ex.reps}</p>
                        <p className="text-zinc-500 text-xs">{ex.weight}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-1.5 bg-zinc-800/40">
                  <span className="text-zinc-500 text-xs">{t.rest}: {item.ex.rest}{t.sec}</span>
                </div>
              </div>
            )
          }
          return (
            <div key={idx} className="bg-zinc-900 rounded-xl px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-zinc-600 font-black text-lg w-6 text-center shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base leading-tight">{isHe ? item.exData.nameHe : item.exData.nameEn}</p>
                    {isHe && <p className="text-zinc-500 text-xs mt-0.5">{item.exData.nameEn}</p>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-orange-400 font-black text-sm">{item.ex.sets}×{item.ex.reps}</p>
                  <p className="text-zinc-500 text-xs">{item.ex.weight}</p>
                  <p className="text-zinc-600 text-xs">{t.rest}: {item.ex.rest}{t.sec}</p>
                </div>
              </div>
            </div>
          )
        })}

        {/* Cooldown */}
        <div className="bg-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-zinc-300 font-bold">{t.cooldown}</span>
          <span className="text-zinc-500 text-sm">2:30</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 pb-6 pt-3 shrink-0 border-t border-zinc-800 space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-zinc-300 font-bold">{t.skipWarmup}</span>
          <div
            onClick={() => dispatch({ type: 'TOGGLE_SKIP_WARMUP' })}
            className={`w-12 h-6 rounded-full relative transition-all ${state.skipWarmup ? 'bg-orange-500' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.skipWarmup ? 'right-1' : 'left-1'}`} />
          </div>
        </label>
        <button
          onClick={() => dispatch({ type: 'START_WORKOUT' })}
          className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/30"
        >
          {t.start}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SCREEN: ACTIVE WORKOUT
// ─────────────────────────────────────────────
function ActiveWorkoutScreen({ state, dispatch }) {
  const t = T[state.lang]
  const isHe = state.lang === 'he'
  const step = state.steps[state.stepIndex]
  if (!step) return null

  const totalRemaining = totalRemainingSeconds(state.steps, state.stepIndex, state.secondsRemaining)
  const progress = step.duration > 0 ? state.secondsRemaining / step.duration : 0
  const exerciseCount = state.groupStarts.length - 1 // exclude cooldown
  const currentGroup = step.groupIndex ?? 0

  const handleCenterTap = useCallback(() => {
    dispatch({ type: 'PAUSE_RESUME' })
  }, [dispatch])

  // TRANSITION screen
  if (step.type === 'transition') {
    const ex = step.previewExercise
    const instr = ex ? (isHe ? ex.instrHe : ex.instrEn) : null
    return (
      <div className="flex flex-col h-full bg-zinc-950 relative">
        {/* Top bar: countdown inline with "Get Ready" */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
          <div>
            <p className="text-orange-400 font-black text-lg leading-tight">{t.getReady}</p>
            <p className="text-zinc-600 text-xs">{currentGroup}/{exerciseCount} · ⏱ {formatTime(totalRemaining)} {t.remaining}</p>
          </div>
          <span className="text-7xl font-black text-white tabular-nums leading-none">{state.secondsRemaining}</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 flex flex-col px-4 gap-3 overflow-y-auto pb-2" onClick={handleCenterTap}>

          {/* Diagram */}
          {ex && (
            <div className="w-full rounded-xl overflow-hidden bg-zinc-900/40 border border-zinc-800/50">
              <div className="w-full" style={{ aspectRatio: '200/80' }}>
                <ExerciseSvg svgKey={ex.svg} />
              </div>
            </div>
          )}

          {/* Exercise name + sets + weight */}
          {ex && (
            <div className="bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-800">
              {step.isSuperset && (
                <p className="text-orange-400 text-xs font-black uppercase tracking-wide mb-1">{t.superset}</p>
              )}
              <p className="text-white font-black text-xl leading-tight">{isHe ? ex.nameHe : ex.nameEn}</p>
              {step.isSuperset && step.previewExB && (
                <p className="text-zinc-400 font-bold text-base mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-orange-400 font-black text-base">{step.workoutEx.sets}×{step.workoutEx.reps}</span>
                <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
                  <span className="text-orange-300 font-bold text-sm">🏋️ {step.workoutEx.weight}</span>
                </div>
                {step.isSuperset && step.workoutExB && step.workoutExB.weight !== step.workoutEx.weight && (
                  <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
                    <span className="text-orange-300 font-bold text-sm">🏋️ {step.workoutExB.weight}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form instructions */}
          {instr && (
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 border border-zinc-800/50">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">{isHe ? 'הוראות ביצוע' : 'Form cues'}</p>
              <p className="text-zinc-200 text-sm leading-relaxed">{instr}</p>
            </div>
          )}

          {/* Superset B instructions */}
          {step.isSuperset && step.previewExB && (
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 border border-zinc-800/50">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">{isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              <p className="text-zinc-200 text-sm leading-relaxed">{isHe ? step.previewExB.instrHe : step.previewExB.instrEn}</p>
            </div>
          )}
        </div>

        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} isTransition />
        <ProgressBar progress={progress} />
      </div>
    )
  }

  // WARMUP screen
  if (step.type === 'warmup') {
    const ex = step.exercise
    return (
      <div className="flex flex-col h-full bg-zinc-950">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-zinc-500 text-sm font-medium">{t.warmup}</span>
          <span className="text-zinc-500 text-sm font-medium">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          {/* Diagram */}
          <div className="h-36 md:h-48 flex items-center justify-center">
            <div className="w-32 h-32 md:w-44 md:h-44">
              <ExerciseSvg svgKey={ex.svg} />
            </div>
          </div>

          {/* Name */}
          <div className="text-center">
            <h2 className="text-white font-black text-4xl md:text-5xl leading-tight">{isHe ? ex.nameHe : ex.nameEn}</h2>
            {isHe && <p className="text-zinc-500 text-base md:text-lg mt-1">{ex.nameEn}</p>}
          </div>

          {/* Instruction */}
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed text-center px-2">
            {isHe ? ex.instrHe : ex.instrEn}
          </p>

          {/* Countdown */}
          <div className="flex flex-col items-center gap-3 mt-auto pb-4">
            <span className="text-7xl md:text-8xl font-black text-orange-400 tabular-nums">{state.secondsRemaining}</span>
            <ProgressBar progress={progress} />
          </div>
        </div>

        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // REST screen
  if (step.type === 'rest') {
    const ex = step.previewExercise
    return (
      <div className="flex flex-col h-full bg-zinc-950">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-zinc-500 text-sm font-medium">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
          <span className="text-zinc-600 text-sm">{currentGroup}/{exerciseCount}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6" onClick={handleCenterTap}>
          <p className="text-orange-400 font-black text-3xl md:text-4xl">{t.rest}</p>
          <div className="text-9xl md:text-[10rem] font-black text-white leading-none tabular-nums">
            {state.secondsRemaining}
          </div>
          {ex && (
            <div className="bg-zinc-900 rounded-2xl px-6 py-3 w-full max-w-sm border border-zinc-800 text-center">
              <p className="text-zinc-400 text-sm mb-1">{isHe ? 'הסט הבא:' : 'Next set:'}</p>
              <p className="text-white font-bold text-lg">{isHe ? ex.nameHe : ex.nameEn}</p>
              {step.isSuperset && step.previewExB && (
                <p className="text-zinc-400 text-sm mt-0.5">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
            </div>
          )}
        </div>

        <ProgressBar progress={progress} color="bg-blue-500" />
        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // COOLDOWN screen
  if (step.type === 'cooldown') {
    const ex = step.exercise
    return (
      <div className="flex flex-col h-full bg-zinc-950">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-zinc-400 font-bold text-sm">{t.cooldown}</span>
          <span className="text-zinc-500 text-sm">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        </div>

        <div className="flex-1 flex flex-col px-5 gap-4 overflow-hidden" onClick={handleCenterTap}>
          <div className="h-36 md:h-48 flex items-center justify-center">
            <div className="w-32 h-32 md:w-44 md:h-44">
              <ExerciseSvg svgKey={ex.svg} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-white font-black text-4xl md:text-5xl">{isHe ? ex.nameHe : ex.nameEn}</h2>
            {isHe && <p className="text-zinc-500 text-base md:text-lg mt-1">{ex.nameEn}</p>}
          </div>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed text-center px-2">{isHe ? ex.instrHe : ex.instrEn}</p>
          <div className="flex flex-col items-center gap-3 mt-auto pb-4">
            <span className="text-7xl md:text-8xl font-black text-orange-400 tabular-nums">{state.secondsRemaining}</span>
            <ProgressBar progress={progress} color="bg-teal-500" />
          </div>
        </div>

        <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />
      </div>
    )
  }

  // EXERCISE SET screen (main)
  const ex = step.exercise
  const wo = step.workoutEx
  const name = isHe ? ex.nameHe : ex.nameEn
  const instr = isHe ? ex.instrHe : ex.instrEn

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
        <span className="text-zinc-500 text-sm font-medium">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
        <span className="text-zinc-600 text-sm font-medium">{currentGroup}/{exerciseCount}</span>
      </div>

      {/* Superset badge */}
      {step.supersetPart && (
        <div className="px-5 shrink-0">
          <span className="text-xs text-orange-400 font-black uppercase tracking-wide bg-orange-500/10 px-3 py-1 rounded-full">
            {t.superset} · {step.supersetPart === 'A' ? 'א' : 'ב'}
          </span>
        </div>
      )}

      {/* Main content — tappable for pause */}
      <div className="flex-1 flex flex-col px-5 gap-3 md:gap-4 overflow-hidden min-h-0" onClick={handleCenterTap}>
        {/* Diagram */}
        <div className="w-full px-1 shrink-0">
          <div className="w-full" style={{ aspectRatio: '200/80' }}>
            <ExerciseSvg svgKey={ex.svg} />
          </div>
        </div>

        {/* Exercise name */}
        <div className="text-center shrink-0">
          <h2 className="text-white font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
            {name}
          </h2>
          {isHe && <p className="text-zinc-500 text-sm md:text-base mt-0.5">{ex.nameEn}</p>}
        </div>

        {/* Set / reps / weight */}
        <div className="flex items-center justify-center gap-4 md:gap-8 shrink-0">
          <div className="text-center">
            <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wide">{t.set}</p>
            <p className="text-white font-black text-3xl md:text-4xl">{step.set}{t.of}{step.totalSets}</p>
          </div>
          <div className="w-px h-10 md:h-12 bg-zinc-800" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wide">{t.reps}</p>
            <p className="text-orange-400 font-black text-3xl md:text-4xl">{wo.reps}</p>
          </div>
          <div className="w-px h-10 md:h-12 bg-zinc-800" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wide">{t.weight}</p>
            <p className="text-zinc-300 font-bold text-base md:text-lg">{wo.weight}</p>
          </div>
        </div>

        {/* Instruction */}
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed text-center px-2 shrink-0 line-clamp-3">
          {instr}
        </p>

        {/* Countdown + progress */}
        <div className="mt-auto pb-2 shrink-0 space-y-3">
          <div className="flex items-center justify-center">
            <span className={`text-7xl md:text-8xl font-black tabular-nums leading-none transition-colors ${
              state.secondsRemaining <= 10 ? 'text-red-500' : 'text-orange-400'
            }${state.secondsRemaining <= 5 ? ' animate-pulse' : ''}`}>
              {state.secondsRemaining}
            </span>
          </div>
          <ProgressBar progress={progress} color={state.secondsRemaining <= 10 ? 'bg-red-500' : 'bg-orange-500'} />
        </div>
      </div>

      {/* Nav */}
      <NavBar t={t} dispatch={dispatch} isPaused={state.isPaused} />

      {/* Pause overlay */}
      {state.isPaused && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10">
          <p className="text-white font-black text-5xl md:text-6xl">{t.paused}</p>
          <p className="text-zinc-400 text-lg md:text-xl">{t.tapResume}</p>
          <button
            onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
            className="mt-4 bg-orange-500 text-white font-black text-2xl md:text-3xl px-12 md:px-16 py-5 md:py-6 rounded-2xl active:scale-95"
          >
            {t.resume}
          </button>
        </div>
      )}
    </div>
  )
}

function NavBar({ t, dispatch, isPaused = false, isTransition = false }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 md:py-5 shrink-0 border-t border-zinc-900">
      <button
        onClick={() => dispatch({ type: 'SKIP_BACKWARD' })}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 font-bold px-5 py-3 md:px-7 md:py-4 rounded-xl active:scale-95 text-sm md:text-base"
      >
        ◀ {t.prev}
      </button>
      <button
        onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
        className={`flex items-center gap-2 font-bold px-6 py-3 md:px-8 md:py-4 rounded-xl active:scale-95 text-sm md:text-base transition-all ${
          isPaused
            ? 'bg-orange-500 hover:bg-orange-400 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300'
        }`}
      >
        {isPaused ? t.resume : t.pause}
      </button>
      <button
        onClick={() => dispatch({ type: 'SKIP_FORWARD' })}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 font-bold px-5 py-3 md:px-7 md:py-4 rounded-xl active:scale-95 text-sm md:text-base"
      >
        {isTransition ? t.skip : t.next} ▶
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// SCREEN: COMPLETE
// ─────────────────────────────────────────────
function CompleteScreen({ state, dispatch }) {
  const t = T[state.lang]
  const elapsed = state.completedSeconds
  return (
    <div className="flex flex-col h-full items-center justify-center px-8 gap-8 md:gap-10 text-center">
      <div className="text-8xl md:text-9xl">🏆</div>
      <div>
        <h1 className="text-5xl md:text-6xl font-black text-white">{t.complete}</h1>
        <p className="text-zinc-400 text-xl md:text-2xl mt-2">{getDurationLabel(state.selectedDuration, state.selectedVariation, t)} {state.lang === 'he' ? 'אימון הושלם' : 'workout done'}</p>
      </div>
      <div className="bg-zinc-900 rounded-2xl px-10 md:px-14 py-6 md:py-8 border border-zinc-800">
        <p className="text-zinc-500 text-sm md:text-base uppercase tracking-wide mb-1">{t.totalTime}</p>
        <p className="text-orange-400 font-black text-5xl md:text-6xl">{formatTime(elapsed)}</p>
      </div>
      <button
        onClick={() => dispatch({ type: 'GO_HOME' })}
        className="w-full max-w-xs md:max-w-sm bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl transition-all active:scale-95"
      >
        {t.backHome}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Timer
  useEffect(() => {
    if (state.screen !== 'active' || state.isPaused) return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.screen, state.isPaused])

  // Sound effects
  const prevStep = useRef(null)
  useEffect(() => {
    if (state.screen !== 'active') return
    const step = state.steps[state.stepIndex]
    if (!step) return

    // Beep on countdown 3-2-1 during transition or rest
    if ((step.type === 'transition' || step.type === 'rest') && state.secondsRemaining <= 3 && state.secondsRemaining > 0) {
      playBeep(state.secondsRemaining === 1 ? 1200 : 880, 0.1)
    }

    // Beep on last 5 seconds during exercise (work) sets
    if (step.type === 'exercise' && state.secondsRemaining <= 5 && state.secondsRemaining > 0) {
      playBeep(state.secondsRemaining === 1 ? 1200 : 660, 0.12, 0.2)
    }

    // Tone on new step
    if (prevStep.current !== state.stepIndex) {
      if (step.type === 'exercise') playStartTone()
      else if (step.type === 'rest') playRestTone()
      prevStep.current = state.stepIndex
    }
  }, [state.secondsRemaining, state.stepIndex, state.screen])

  const lang = state.lang

  return (
    <div
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className="h-full bg-zinc-950 text-white max-w-2xl mx-auto relative overflow-hidden"
    >
      {state.screen === 'home' && <HomeScreen state={state} dispatch={dispatch} />}
      {state.screen === 'preview' && <PreviewScreen state={state} dispatch={dispatch} />}
      {state.screen === 'active' && <ActiveWorkoutScreen state={state} dispatch={dispatch} />}
      {state.screen === 'complete' && <CompleteScreen state={state} dispatch={dispatch} />}
    </div>
  )
}
