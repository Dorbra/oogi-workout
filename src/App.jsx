import { useReducer, useEffect, useRef, useCallback } from 'react'

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
  },
}

// ─────────────────────────────────────────────
// EXERCISE LIBRARY
// ─────────────────────────────────────────────
const EXERCISES = {
  1:  { id: '1',  nameHe: 'לחיצת רצפה',          nameEn: 'Floor Press',               svg: 'bench_press',    instrHe: 'שכב על הגב, אחוז במשקולות בגובה החזה, לחץ כלפי מעלה בתנועה מבוקרת עד ישורת מרפקים.',         instrEn: 'Lie on your back, hold dumbbells at chest height, press up in a controlled motion until arms are straight.' },
  2:  { id: '2',  nameHe: 'לחיצה משופעת',         nameEn: 'Incline DB Press',          svg: 'incline_press',  instrHe: 'הטה את הספסל ל-30–45 מעלות. לחץ את המשקולות כלפי מעלה בתנועה מבוקרת.',                        instrEn: 'Set bench to 30–45°. Press dumbbells upward in a controlled motion.' },
  3:  { id: '3',  nameHe: 'מתח בטבעות (דחיפה)',   nameEn: 'Ring Dips',                 svg: 'ring_dip',       instrHe: 'אחוז בטבעות, שמור על גוף ישר, כופף מרפקים לירידה מבוקרת ולאחר מכן דחוף חזרה למעלה.',          instrEn: 'Grip rings, keep body straight, bend elbows to lower in control then push back up.' },
  4:  { id: '4',  nameHe: 'לחיצת סיחוט',          nameEn: 'DB Squeeze Press',          svg: 'squeeze_press',  instrHe: 'לחץ את שתי המשקולות יחד בחזה ושמור על לחץ לאורך כל התנועה.',                                instrEn: 'Press dumbbells together at chest and maintain squeeze throughout the movement.' },
  5:  { id: '5',  nameHe: 'לחיצה חד-צדדית',       nameEn: 'Single-Arm DB Press',       svg: 'single_press',   instrHe: 'שכב על הספסל, לחץ משקולת אחת כלפי מעלה. עבוד כל צד בנפרד.',                                  instrEn: 'Lie on bench, press one dumbbell up at a time. Work each side separately.' },
  6:  { id: '6',  nameHe: 'שכיבות סמיכה עם אפוד', nameEn: 'Weighted Push-Ups',         svg: 'push_up',        instrHe: 'שכב על כפות הידיים וקצות הרגליים עם אפוד כבד. שמור על גוף ישר ודחוף.',                        instrEn: 'Standard push-up position with weighted vest. Keep body straight and push.' },
  7:  { id: '7',  nameHe: 'מתח בטבעות',           nameEn: 'Ring Pull-Ups',             svg: 'pull_up',        instrHe: 'אחוז בטבעות, תלה בזרועות ישרות. משוך את הגוף כלפי מעלה עד שהסנטר עובר את הטבעות.',          instrEn: 'Grip rings, hang with straight arms. Pull body up until chin passes the rings.' },
  8:  { id: '8',  nameHe: 'חתירה בטבעות',         nameEn: 'Ring Rows',                 svg: 'ring_row',       instrHe: 'שכב מתחת לטבעות, גוף ישר. משוך את החזה לטבעות תוך שמירה על גוף נוקשה.',                    instrEn: 'Lie under rings, body straight. Pull chest to rings while keeping body rigid.' },
  9:  { id: '9',  nameHe: 'חתירה חד-צדדית',       nameEn: 'Single-Arm DB Row',         svg: 'single_row',     instrHe: 'הנח יד וברך על הספסל. משוך את המשקולת כלפי מעלה עם המרפק קרוב לגוף.',                         instrEn: 'Place hand and knee on bench. Row the dumbbell up with elbow close to body.' },
  10: { id: '10', nameHe: 'חתירה רחבה',           nameEn: 'Bent-Over DB Row',          svg: 'bent_row',       instrHe: 'כפוף קדימה בזווית 45 מעלות. משוך את שתי המשקולות כלפי מעלה בו-זמנית.',                      instrEn: 'Bend forward at 45°. Row both dumbbells up simultaneously.' },
  11: { id: '11', nameHe: 'חתירת רנגייד',         nameEn: 'Renegade Rows',             svg: 'renegade',       instrHe: 'עמוד בתנוחת שכיבות סמיכה עם משקולות. חתור משקולת אחת בכל פעם תוך שמירה על גוף יציב.',    instrEn: 'Push-up position with dumbbells. Row one dumbbell at a time, keep hips stable.' },
  12: { id: '12', nameHe: 'לחיצת כתפיים',         nameEn: 'DB Shoulder Press',         svg: 'shoulder_press', instrHe: 'שב על הספסל, גב ישר. לחץ משקולות מגובה האוזן כלפי מעלה.',                                     instrEn: 'Sit on bench, back straight. Press dumbbells from ear height upward.' },
  13: { id: '13', nameHe: 'הרמה צדדית',           nameEn: 'Lateral Raise',             svg: 'lateral_raise',  instrHe: 'עמוד זקוף, הרם זרועות לצדדים עד גובה הכתפיים. שמור על מרפקים מעט כפופים.',                 instrEn: 'Stand tall, raise arms to sides to shoulder height. Keep elbows slightly bent.' },
  14: { id: '14', nameHe: 'הרמה קדמית',           nameEn: 'Front Raise',               svg: 'front_raise',    instrHe: 'עמוד זקוף, הרם זרועות קדימה לגובה הכתף. תנועה מבוקרת למעלה ולמטה.',                         instrEn: 'Stand tall, raise arms forward to shoulder height. Controlled up and down.' },
  15: { id: '15', nameHe: 'לחיצת ארנולד',         nameEn: 'Arnold Press',              svg: 'arnold',         instrHe: 'החזק משקולות מול הפנים כשהאגרופים פונים אליך. סובב תוך כדי לחיצה כלפי מעלה.',              instrEn: 'Hold dumbbells in front of face, palms facing you. Rotate while pressing up.' },
  16: { id: '16', nameHe: 'פרפר אחורי',           nameEn: 'Rear Delt Fly',             svg: 'rear_fly',       instrHe: 'כפוף קדימה בקצה הספסל. הרם זרועות לצדדים תוך כיווץ שכמות אחורה.',                          instrEn: 'Bent over. Raise arms to sides while squeezing shoulder blades back.' },
  17: { id: '17', nameHe: 'כיפוף מרפק',           nameEn: 'DB Curl',                   svg: 'curl',           instrHe: 'עמוד זקוף, כף יד פונה למעלה. כופף מרפקים תוך כיווץ שרירי הכיפוף.',                        instrEn: 'Stand straight, palms up. Curl arms up squeezing biceps at the top.' },
  18: { id: '18', nameHe: 'כיפוף פטיש',           nameEn: 'Hammer Curl',               svg: 'hammer_curl',    instrHe: 'אחוז במשקולות כשהאגרופים פונים פנימה. כופף מרפקים עם אגרוף "פטיש".',                       instrEn: 'Hold dumbbells with palms facing in. Curl with hammer grip, elbows at sides.' },
  19: { id: '19', nameHe: 'כיפוף ריכוז',          nameEn: 'Concentration Curl',        svg: 'conc_curl',      instrHe: 'שב על הספסל, אמת היד נשענת על הירך. כופף מרפק במלוא הטווח.',                               instrEn: 'Sit on bench, rest upper arm on thigh. Curl through full range of motion.' },
  20: { id: '20', nameHe: 'כיפוף משופע',          nameEn: 'Incline Curl',              svg: 'incline_curl',   instrHe: 'שכב אחורה על ספסל משופע. ידיים תלויות. כופף מרפקים מנמוך מלא.',                             instrEn: 'Lie back on incline bench. Arms hanging. Curl from full stretch.' },
  21: { id: '21', nameHe: 'הארכה מעל הראש',       nameEn: 'Overhead Tricep Ext.',      svg: 'overhead_ext',   instrHe: 'אחוז במשקולת בשתי הידיים מעל הראש. כופף מרפקים לאחור הראש ואז ישר.',                      instrEn: 'Hold dumbbell overhead with both hands. Lower behind head by bending elbows.' },
  22: { id: '22', nameHe: 'בעיטה אחורית',         nameEn: 'DB Kickback',               svg: 'kickback',       instrHe: 'כפוף קדימה 45 מעלות. שמור על מרפק גבוה ותיישר זרוע לאחור.',                                instrEn: 'Bend forward 45°. Keep elbow high and extend forearm straight back.' },
  23: { id: '23', nameHe: 'שכיבות סמיכה צרות',    nameEn: 'Close-Grip Push-Up',        svg: 'close_pushup',   instrHe: 'ידיים צמודות מתחת לחזה. כופף מרפקים קרוב לגוף, שמור על מרפקים צמודים לגוף.',             instrEn: 'Hands close under chest. Bend elbows close to body through the movement.' },
  24: { id: '24', nameHe: 'הארכה בטבעות',         nameEn: 'Ring Tricep Extension',     svg: 'ring_ext',       instrHe: 'אחוז בטבעות, גוף שמוט קדימה בזווית. כופף מרפקים לאמת הידיים מגיעה לאוזניים.',              instrEn: 'Grip rings, lean forward at angle. Bend elbows until forearms reach ears.' },
}

const WARMUP = [
  { id: 'W1', nameHe: 'מעגלי זרועות',       nameEn: 'Arm Circles',          duration: 30, svg: 'warmup_circles',  instrHe: 'הרחב זרועות לצדדים, בצע מעגלים קדימה ואחורה.',                  instrEn: 'Arms out to sides, circle forward then backward.' },
  { id: 'W2', nameHe: 'סיבובי כתפיים',      nameEn: 'Shoulder Rotations',   duration: 30, svg: 'warmup_shoulder', instrHe: 'ידיים פשוטות, בצע סיבובים רחבים של כתפיים.',                     instrEn: 'Arms wide, big shoulder rotations.' },
  { id: 'W3', nameHe: 'כלב מוריד ראש',      nameEn: 'Push-Up to Down Dog',  duration: 30, svg: 'warmup_downdog',  instrHe: 'דחוף מעלה לתנוחת V הפוך, חזור לשכיבות סמיכה ושוב.',            instrEn: 'Push up to inverted V, return to push-up and repeat.' },
  { id: 'W4', nameHe: 'קפצנים',             nameEn: 'Jumping Jacks',        duration: 30, svg: 'warmup_jj',       instrHe: 'קפוץ תוך פתיחת רגליים וגבהת ידיים. קצב מהיר.',                   instrEn: 'Jump feet wide and raise arms overhead. Quick pace.' },
  { id: 'W5', nameHe: 'שכיבות שכמות',       nameEn: 'Scapular Push-Ups',    duration: 30, svg: 'warmup_scap',     instrHe: 'בתנוחת שכיבות סמיכה, כווץ ושחרר שכמות ללא כיפוף מרפקים.',      instrEn: 'In push-up position, protract and retract shoulder blades only.' },
  { id: 'W6', nameHe: 'סקוואטים בסיסיים',   nameEn: 'Bodyweight Squats',    duration: 30, svg: 'warmup_squat',    instrHe: 'רגליים ברוחב כתפיים, כפוף ברכיים לזווית 90 מעלות ועלה.',        instrEn: 'Feet shoulder-width, squat to 90° and stand.' },
]

const COOLDOWN = [
  { id: 'C1', nameHe: 'מתיחת חזה בדלת',    nameEn: 'Chest Doorway Stretch',   duration: 40, svg: 'cool_chest',     instrHe: 'הצב יד על מסגרת דלת בגובה כתף, סובב גוף החוצה. 20 שניות לכל צד.', instrEn: 'Place hand on doorframe at shoulder height, rotate body out. 20s per side.' },
  { id: 'C2', nameHe: 'מתיחת כתף צולבת',   nameEn: 'Cross-Body Stretch',      duration: 40, svg: 'cool_shoulder',   instrHe: 'משוך זרוע אחת דרך הגוף אל הכתף הנגדית. 20 שניות לכל צד.',         instrEn: 'Pull one arm across body toward opposite shoulder. 20s per side.' },
  { id: 'C3', nameHe: 'מתיחת תלת-ראשי',    nameEn: 'Tricep Overhead Stretch', duration: 40, svg: 'cool_tricep',     instrHe: 'הרם יד מעל הראש, כופף המרפק, משוך המרפק עם היד השנייה. 20 שניות.', instrEn: 'Raise arm overhead, bend elbow, pull elbow with other hand. 20s per side.' },
  { id: 'C4', nameHe: 'נשימות עמוקות',     nameEn: 'Deep Breaths',            duration: 30, svg: 'cool_breathe',    instrHe: 'נשום עמוק. נשוף לאט. נענע ידיים ורגליים בנחת.',                     instrEn: 'Breathe deeply. Exhale slowly. Shake out hands and feet.' },
]

// ─────────────────────────────────────────────
// WORKOUT TEMPLATES
// ─────────────────────────────────────────────
const TEMPLATES = {
  20: {
    duration: 20,
    warmupSecs: 3 * 30,   // 6 warmup moves × 30s
    cooldownSecs: 40 + 40 + 40 + 30,
    exercises: [
      { exerciseId: '7',  sets: 3, reps: 8,  rest: 90, setDuration: 25, weight: 'אפוד 0–16 ק"ג' },
      { exerciseId: '1',  sets: 3, reps: 10, rest: 75, setDuration: 30, weight: '2×10 ק"ג' },
      { exerciseId: '12', sets: 3, reps: 10, rest: 75, setDuration: 30, weight: '2×10 ק"ג' },
      { exerciseId: '17', sets: 3, reps: 10, rest: 60, setDuration: 30, weight: '2×10 ק"ג', supersetWith: '21' },
      { exerciseId: '21', sets: 3, reps: 10, rest: 60, setDuration: 30, weight: '17.5 ק"ג' },
    ],
  },
  30: {
    duration: 30,
    warmupSecs: 3 * 30,
    cooldownSecs: 40 + 40 + 40 + 30,
    exercises: [
      { exerciseId: '7',  sets: 3, reps: 8,      rest: 90, setDuration: 25, weight: 'אפוד 0–16 ק"ג' },
      { exerciseId: '2',  sets: 3, reps: 10,     rest: 75, setDuration: 30, weight: '2×10 ק"ג' },
      { exerciseId: '9',  sets: 3, reps: 10,     rest: 75, setDuration: 60, weight: '17.5 ק"ג' },
      { exerciseId: '6',  sets: 3, reps: 12,     rest: 60, setDuration: 35, weight: 'אפוד 10–20 ק"ג' },
      { exerciseId: '13', sets: 3, reps: 12,     rest: 45, setDuration: 35, weight: '2×5 ק"ג' },
      { exerciseId: '18', sets: 3, reps: 10,     rest: 60, setDuration: 30, weight: '2×10 ק"ג', supersetWith: '22' },
      { exerciseId: '22', sets: 3, reps: 12,     rest: 60, setDuration: 35, weight: '2×5 ק"ג' },
    ],
  },
  45: {
    duration: 45,
    warmupSecs: 3 * 30,
    cooldownSecs: 40 + 40 + 40 + 30,
    exercises: [
      { exerciseId: '7',  sets: 4, reps: 8,  rest: 90, setDuration: 25, weight: 'אפוד 0–16 ק"ג' },
      { exerciseId: '2',  sets: 4, reps: 10, rest: 75, setDuration: 30, weight: '2×10 ק"ג' },
      { exerciseId: '8',  sets: 3, reps: 10, rest: 75, setDuration: 30, weight: 'אפוד 0–10 ק"ג' },
      { exerciseId: '3',  sets: 3, reps: 8,  rest: 90, setDuration: 25, weight: 'אפוד 10–16 ק"ג' },
      { exerciseId: '15', sets: 3, reps: 10, rest: 60, setDuration: 30, weight: '2×10 ק"ג' },
      { exerciseId: '16', sets: 3, reps: 12, rest: 45, setDuration: 35, weight: '2×5 ק"ג' },
      { exerciseId: '17', sets: 3, reps: 10, rest: 60, setDuration: 30, weight: '2×10 ק"ג' },
      { exerciseId: '21', sets: 3, reps: 10, rest: 60, setDuration: 30, weight: '17.5 ק"ג' },
      { exerciseId: '6',  sets: 2, reps: 15, rest: 0,  setDuration: 40, weight: 'אפוד 10–20 ק"ג' },
    ],
  },
}

// ─────────────────────────────────────────────
// STEP FLATTENER
// ─────────────────────────────────────────────
function buildSteps(template, skipWarmup) {
  const steps = []
  let groupIndex = 0
  const groupStarts = []

  // Warmup
  if (!skipWarmup) {
    groupStarts.push(0)
    for (const wu of WARMUP) {
      steps.push({ type: 'warmup', exercise: wu, duration: wu.duration, groupIndex })
    }
    groupIndex++
  }

  // Exercise blocks
  const exList = template.exercises
  let i = 0
  while (i < exList.length) {
    const ex = exList[i]
    const exData = EXERCISES[ex.exerciseId]

    if (ex.supersetWith) {
      // Superset: current ex is A, next entry is B
      const exB = exList[i + 1]
      const exDataB = EXERCISES[exB.exerciseId]

      groupStarts.push(steps.length)
      // Transition showing exercise A
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, previewExB: exDataB, isSuperset: true, groupIndex })

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
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, groupIndex })

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
  for (const cd of COOLDOWN) {
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
  selectedDuration: 30,
  skipWarmup: false,
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
    case 'SET_DURATION':
      return { ...state, selectedDuration: action.duration }

    case 'TOGGLE_SKIP_WARMUP':
      return { ...state, skipWarmup: !state.skipWarmup }

    case 'SET_LANG':
      return { ...state, lang: action.lang }

    case 'GO_PREVIEW':
      return { ...state, screen: 'preview' }

    case 'GO_HOME':
      return { ...initialState, lang: state.lang }

    case 'START_WORKOUT': {
      const template = TEMPLATES[state.selectedDuration]
      const { steps, groupStarts } = buildSteps(template, state.skipWarmup)
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
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Bench */}
      <rect x="10" y="52" width="80" height="8" rx="2" fill="#3f3f46" />
      <line x1="20" y1="60" x2="20" y2="72" stroke="#3f3f46" strokeWidth="3" />
      <line x1="80" y1="60" x2="80" y2="72" stroke="#3f3f46" strokeWidth="3" />
      {/* Person lying */}
      <circle cx="25" cy="44" r="7" fill="#e2e8f0" />
      <line x1="32" y1="44" x2="70" y2="50" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arms pressing up */}
      <line x1="40" y1="47" x2="35" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="48" x2="65" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={30} y1={28} x2={42} y2={28} />
      <Dumbbell x1={58} y1={28} x2={70} y2={28} />
    </svg>
  ),
  incline_press: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <line x1="5" y1="70" x2="80" y2="40" stroke="#3f3f46" strokeWidth="6" strokeLinecap="round" />
      <line x1="80" y1="40" x2="80" y2="70" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="22" cy="48" r="7" fill="#e2e8f0" />
      <line x1="28" y1="50" x2="68" y2="38" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="44" x2="33" y2="26" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="40" x2="60" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={28} y1={26} x2={40} y2={26} />
      <Dumbbell x1={54} y1={22} x2={66} y2={22} />
    </svg>
  ),
  pull_up: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Rings bar */}
      <line x1="15" y1="8" x2="85" y2="8" stroke="#78716c" strokeWidth="3" />
      <circle cx="30" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="70" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      {/* Person hanging */}
      <circle cx="50" cy="32" r="8" fill="#e2e8f0" />
      <line x1="50" y1="40" x2="50" y2="62" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="44" x2="36" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="44" x2="64" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="62" x2="43" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="62" x2="57" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms up to rings */}
      <line x1="36" y1="32" x2="30" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="32" x2="70" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_row: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <line x1="15" y1="8" x2="85" y2="8" stroke="#78716c" strokeWidth="3" />
      <circle cx="30" cy="18" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="70" cy="18" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      {/* Person at angle pulling */}
      <circle cx="50" cy="35" r="8" fill="#e2e8f0" />
      <line x1="50" y1="43" x2="50" y2="62" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="62" x2="38" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="62" x2="62" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="35" x2="30" y2="23" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="35" x2="70" y2="23" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_dip: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <line x1="15" y1="8" x2="85" y2="8" stroke="#78716c" strokeWidth="3" />
      <circle cx="25" cy="18" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="75" cy="18" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      {/* Person between rings, arms bent */}
      <line x1="25" y1="23" x2="30" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="23" x2="70" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="36" r="8" fill="#e2e8f0" />
      <line x1="50" y1="44" x2="50" y2="62" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="40" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="60" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="62" x2="44" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="62" x2="56" y2="74" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
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
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="22" cy="25" r="7" fill="#e2e8f0" />
      <line x1="22" y1="32" x2="60" y2="48" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="37" x2="32" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="43" x2="47" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={27} y1={22} x2={38} y2={22} />
      <Dumbbell x1={42} y1={28} x2={53} y2={28} />
      <line x1="60" y1="48" x2="52" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="48" x2="68" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
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
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <rect x="35" y="52" width="30" height="8" rx="2" fill="#3f3f46" />
      <line x1="40" y1="60" x2="40" y2="70" stroke="#3f3f46" strokeWidth="3" />
      <line x1="60" y1="60" x2="60" y2="70" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="50" cy="22" r="8" fill="#e2e8f0" />
      <line x1="50" y1="30" x2="50" y2="52" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arms raised */}
      <line x1="50" y1="38" x2="28" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="30" x2="25" y2="14" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="38" x2="72" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="30" x2="75" y2="14" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={20} y1={14} x2={30} y2={14} />
      <Dumbbell x1={70} y1={14} x2={80} y2={14} />
    </svg>
  ),
  lateral_raise: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms out to sides */}
      <line x1="50" y1="36" x2="18" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="82" y2="36" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={13} y1={33} x2={13} y2={39} />
      <Dumbbell x1={87} y1={33} x2={87} y2={39} />
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
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="56" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="56" x2="42" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="56" x2="58" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms mid-rotation */}
      <line x1="50" y1="34" x2="30" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="38" x2="28" y2="24" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="34" x2="70" y2="38" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="38" x2="72" y2="24" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={23} y1={24} x2={33} y2={24} />
      <Dumbbell x1={67} y1={24} x2={77} y2={24} />
    </svg>
  ),
  rear_fly: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="22" cy="22" r="7" fill="#e2e8f0" />
      <line x1="22" y1="29" x2="55" y2="48" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      {/* Arms spread wide behind */}
      <line x1="35" y1="36" x2="16" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="43" x2="68" y2="30" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={11} y1={18} x2={20} y2={18} />
      <Dumbbell x1={63} y1={26} x2={73} y2={26} />
      <line x1="55" y1="48" x2="48" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="48" x2="62" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  curl: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Curl arms up */}
      <line x1="50" y1="36" x2="30" y2="40" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="40" x2="26" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={18} x2={31} y2={18} />
      <line x1="50" y1="36" x2="70" y2="40" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="40" x2={74} y2={22} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={69} y1={18} x2={79} y2={18} />
    </svg>
  ),
  hammer_curl: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="30" y2="40" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="40" x2="28" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Vertical dumbbell (hammer grip) */}
      <line x1="28" y1="16" x2="28" y2="28" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="24" y="14" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="24" y="26" width="8" height="4" rx="1" fill="#f97316" />
      <line x1="50" y1="36" x2="70" y2="40" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="40" x2="72" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="16" x2="72" y2="28" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="68" y="14" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="68" y="26" width="8" height="4" rx="1" fill="#f97316" />
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
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="#e2e8f0" />
      <line x1="50" y1="26" x2="50" y2="58" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms overhead with dumbbell */}
      <line x1="50" y1="32" x2="40" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="22" x2="50" y2="10" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="32" x2="60" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="22" x2="50" y2="10" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="44" y="5" width="12" height="6" rx="2" fill="#f97316" />
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
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="18" cy="28" r="7" fill="#e2e8f0" />
      <line x1="18" y1="35" x2="76" y2="46" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="37" x2="28" y2="52" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="42" x2="52" y2="56" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="46" x2="68" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="46" x2="82" y2="60" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Vest indicator */}
      <rect x="35" y="36" width="22" height="10" rx="3" fill="#f97316" opacity="0.6" />
      <text x="46" y="44" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">V</text>
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
    <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// SCREEN: HOME
// ─────────────────────────────────────────────
function HomeScreen({ state, dispatch }) {
  const t = T[state.lang]
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
        <div className="text-6xl mb-3">💪</div>
        <h1 className="text-5xl font-black text-white tracking-tight">{t.appTitle}</h1>
        <p className="text-zinc-400 mt-2 text-lg">{t.pickDuration}</p>
      </div>

      {/* Duration picker */}
      <div className="flex gap-4">
        {[20, 30, 45].map(d => (
          <button
            key={d}
            onClick={() => dispatch({ type: 'SET_DURATION', duration: d })}
            className={`flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 font-black transition-all active:scale-95
              ${state.selectedDuration === d
                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
          >
            <span className="text-4xl leading-none">{d}</span>
            <span className="text-sm mt-1 font-medium">{t.min}</span>
          </button>
        ))}
      </div>

      {/* Preview button */}
      <button
        onClick={() => dispatch({ type: 'GO_PREVIEW' })}
        className="w-full max-w-xs bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/30"
      >
        {t.preview}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// SCREEN: PREVIEW
// ─────────────────────────────────────────────
function PreviewScreen({ state, dispatch }) {
  const t = T[state.lang]
  const isHe = state.lang === 'he'
  const template = TEMPLATES[state.selectedDuration]
  const exList = template.exercises
  const items = []
  let i = 0
  while (i < exList.length) {
    const ex = exList[i]
    const exData = EXERCISES[ex.exerciseId]
    if (ex.supersetWith) {
      const exB = exList[i + 1]
      const exDataB = EXERCISES[exB.exerciseId]
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
          <h2 className="text-white font-black text-xl">{state.selectedDuration} {t.min}</h2>
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
          className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/30"
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
    return (
      <div className="flex flex-col h-full bg-zinc-950 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-zinc-500 text-sm font-medium">⏱ {formatTime(totalRemaining)} {t.remaining}</span>
          <span className="text-zinc-600 text-sm">{currentGroup}/{exerciseCount}</span>
        </div>

        {/* Center */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
          onClick={handleCenterTap}
        >
          <p className="text-orange-400 font-black text-2xl text-center">{t.getReady}</p>
          {state.lang === 'en' && <p className="text-zinc-500 text-lg">Get Ready</p>}
          <div className="text-9xl font-black text-white leading-none tabular-nums">
            {state.secondsRemaining}
          </div>
          {/* Next exercise preview */}
          {ex && (
            <div className="bg-zinc-900 rounded-2xl px-6 py-4 w-full max-w-sm border border-zinc-800 text-center">
              {step.isSuperset && step.previewExB && (
                <p className="text-orange-400 text-xs font-black uppercase mb-2">{t.superset}</p>
              )}
              <p className="text-white font-black text-xl">{isHe ? ex.nameHe : ex.nameEn}</p>
              {step.isSuperset && step.previewExB && (
                <p className="text-zinc-400 font-bold text-base mt-1">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
              <p className="text-zinc-500 text-sm mt-2">{step.workoutEx?.sets ?? ex.sets}×{step.workoutEx?.reps ?? ex.reps} · {step.workoutEx?.weight ?? ''}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <NavBar t={t} dispatch={dispatch} isTransition />
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
          <div className="h-36 flex items-center justify-center">
            <div className="w-32 h-32">
              <ExerciseSvg svgKey={ex.svg} />
            </div>
          </div>

          {/* Name */}
          <div className="text-center">
            <h2 className="text-white font-black text-4xl leading-tight">{isHe ? ex.nameHe : ex.nameEn}</h2>
            {isHe && <p className="text-zinc-500 text-base mt-1">{ex.nameEn}</p>}
          </div>

          {/* Instruction */}
          <p className="text-zinc-400 text-base leading-relaxed text-center px-2">
            {isHe ? ex.instrHe : ex.instrEn}
          </p>

          {/* Countdown */}
          <div className="flex flex-col items-center gap-3 mt-auto pb-4">
            <span className="text-7xl font-black text-orange-400 tabular-nums">{state.secondsRemaining}</span>
            <ProgressBar progress={progress} />
          </div>
        </div>

        <NavBar t={t} dispatch={dispatch} />
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
          <p className="text-orange-400 font-black text-3xl">{t.rest}</p>
          <div className="text-9xl font-black text-white leading-none tabular-nums">
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
        <NavBar t={t} dispatch={dispatch} />
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
          <div className="h-36 flex items-center justify-center">
            <div className="w-32 h-32">
              <ExerciseSvg svgKey={ex.svg} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-white font-black text-4xl">{isHe ? ex.nameHe : ex.nameEn}</h2>
            {isHe && <p className="text-zinc-500 text-base mt-1">{ex.nameEn}</p>}
          </div>
          <p className="text-zinc-400 text-base leading-relaxed text-center px-2">{isHe ? ex.instrHe : ex.instrEn}</p>
          <div className="flex flex-col items-center gap-3 mt-auto pb-4">
            <span className="text-7xl font-black text-orange-400 tabular-nums">{state.secondsRemaining}</span>
            <ProgressBar progress={progress} color="bg-teal-500" />
          </div>
        </div>

        <NavBar t={t} dispatch={dispatch} />
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
      <div className="flex-1 flex flex-col px-5 gap-3 overflow-hidden min-h-0" onClick={handleCenterTap}>
        {/* Diagram */}
        <div className="flex items-center justify-center" style={{ height: '30%', minHeight: 100, maxHeight: 160 }}>
          <div style={{ width: 130, height: 130 }}>
            <ExerciseSvg svgKey={ex.svg} />
          </div>
        </div>

        {/* Exercise name */}
        <div className="text-center shrink-0">
          <h2 className="text-white font-black leading-tight" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
            {name}
          </h2>
          {isHe && <p className="text-zinc-500 text-sm mt-0.5">{ex.nameEn}</p>}
        </div>

        {/* Set / reps / weight */}
        <div className="flex items-center justify-center gap-4 shrink-0">
          <div className="text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">{t.set}</p>
            <p className="text-white font-black text-3xl">{step.set}{t.of}{step.totalSets}</p>
          </div>
          <div className="w-px h-10 bg-zinc-800" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">{t.reps}</p>
            <p className="text-orange-400 font-black text-3xl">{wo.reps}</p>
          </div>
          <div className="w-px h-10 bg-zinc-800" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">{t.weight}</p>
            <p className="text-zinc-300 font-bold text-base">{wo.weight}</p>
          </div>
        </div>

        {/* Instruction */}
        <p className="text-zinc-400 text-sm leading-relaxed text-center px-2 shrink-0 line-clamp-3">
          {instr}
        </p>

        {/* Countdown + progress */}
        <div className="mt-auto pb-2 shrink-0 space-y-3">
          <div className="flex items-center justify-center">
            <span className="text-7xl font-black text-orange-400 tabular-nums leading-none">{state.secondsRemaining}</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Nav */}
      <NavBar t={t} dispatch={dispatch} />

      {/* Pause overlay */}
      {state.isPaused && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10">
          <p className="text-white font-black text-5xl">{t.paused}</p>
          <p className="text-zinc-400 text-lg">{t.tapResume}</p>
          <button
            onClick={() => dispatch({ type: 'PAUSE_RESUME' })}
            className="mt-4 bg-orange-500 text-white font-black text-2xl px-12 py-5 rounded-2xl active:scale-95"
          >
            {t.resume}
          </button>
        </div>
      )}
    </div>
  )
}

function NavBar({ t, dispatch, isTransition = false }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 shrink-0 border-t border-zinc-900">
      <button
        onClick={() => dispatch({ type: 'SKIP_BACKWARD' })}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 font-bold px-5 py-3 rounded-xl active:scale-95 text-sm"
      >
        ◀ {t.prev}
      </button>
      <button
        onClick={() => dispatch({ type: 'SKIP_FORWARD' })}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 font-bold px-5 py-3 rounded-xl active:scale-95 text-sm"
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
    <div className="flex flex-col h-full items-center justify-center px-8 gap-8 text-center">
      <div className="text-8xl">🏆</div>
      <div>
        <h1 className="text-5xl font-black text-white">{t.complete}</h1>
        <p className="text-zinc-400 text-xl mt-2">{state.selectedDuration} {t.min} {state.lang === 'he' ? 'אימון הושלם' : 'workout done'}</p>
      </div>
      <div className="bg-zinc-900 rounded-2xl px-10 py-6 border border-zinc-800">
        <p className="text-zinc-500 text-sm uppercase tracking-wide mb-1">{t.totalTime}</p>
        <p className="text-orange-400 font-black text-5xl">{formatTime(elapsed)}</p>
      </div>
      <button
        onClick={() => dispatch({ type: 'GO_HOME' })}
        className="w-full max-w-xs bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl py-5 rounded-2xl transition-all active:scale-95"
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
      className="h-full bg-zinc-950 text-white max-w-lg mx-auto relative overflow-hidden"
    >
      {state.screen === 'home' && <HomeScreen state={state} dispatch={dispatch} />}
      {state.screen === 'preview' && <PreviewScreen state={state} dispatch={dispatch} />}
      {state.screen === 'active' && <ActiveWorkoutScreen state={state} dispatch={dispatch} />}
      {state.screen === 'complete' && <CompleteScreen state={state} dispatch={dispatch} />}
    </div>
  )
}
