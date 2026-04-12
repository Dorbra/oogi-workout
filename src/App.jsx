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
    dayA: 'יום א׳',
    dayB: 'יום ב׳',
    pushFocus: 'דחיפה + משיכה אנכית',
    pullFocus: 'משיכה אופקית + דחיפה',
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
  },
}

// ─────────────────────────────────────────────
// EXERCISE LIBRARY
// ─────────────────────────────────────────────
const EXERCISES = {
  1:  { id: '1',  nameHe: 'לחיצת רצפה',          nameEn: 'Floor Press',               svg: 'bench_press',    instrHe: 'שכב על הגב על הספסל השטוח. החזק משקולת בכל יד בגובה החזה, כפות ידיים קדימה. דחוף למעלה עד שהזרועות ישרות, ואז הורד לאט חזרה. אל תנעל מרפקים למעלה.',         instrEn: 'Lie flat on your back on the bench. Hold one dumbbell in each hand at chest level, palms facing forward (toward your feet). Push straight up until arms are extended, then lower slowly back down. Don\'t lock your elbows at the top.' },
  2:  { id: '2',  nameHe: 'לחיצה משופעת',         nameEn: 'Incline DB Press',          svg: 'incline_press',  instrHe: 'הגבה את משענת הספסל כלפי מעלה (ראש גבוה מהירכיים) לזווית 30–45 מעלות. שכב עם הגב צמוד לספסל. דחוף את המשקולות מהחזה כלפי מעלה ואז הורד לאט.',                        instrEn: 'Raise the bench backrest upward (head higher than hips) to about 30–45°. Lie back with your back flat against the bench. Press dumbbells up from chest level, then lower them slowly. Keep your feet flat on the floor.' },
  3:  { id: '3',  nameHe: 'מתח בטבעות (דחיפה)',   nameEn: 'Ring Dips',                 svg: 'ring_dip',       instrHe: 'אחוז בטבעות ותלה את עצמך עם זרועות ישרות. כופף מרפקים לאט עד שהזרועות בזווית 90 מעלות, ואז דחוף חזרה למעלה. שמור גוף ישר, אל תתנדנד.',          instrEn: 'Grab the rings and hold yourself up with straight arms. Slowly bend your elbows until your upper arms are roughly parallel to the floor (90° bend), then push back up. Keep your body straight and avoid swinging.' },
  4:  { id: '4',  nameHe: 'לחיצת סיחוט',          nameEn: 'DB Squeeze Press',          svg: 'squeeze_press',  instrHe: 'שכב על הספסל, החזק שתי משקולות צמודות זו לזו מעל החזה. לחץ אותן יחד בכוח לאורך כל התנועה — דחוף למעלה והורד לאט תוך שמירה על לחץ.',                                instrEn: 'Lie on the bench, hold two dumbbells touching each other above your chest. Press them firmly together throughout the entire movement — push up and lower slowly while keeping the dumbbells squeezed together.' },
  5:  { id: '5',  nameHe: 'לחיצה חד-צדדית',       nameEn: 'Single-Arm DB Press',       svg: 'single_press',   instrHe: 'שכב על הספסל עם משקולת אחת ביד. דחוף למעלה עד שהזרוע ישרה, הורד לאט. בצע את כל החזרות ביד אחת ואז החלף.',                                  instrEn: 'Lie on the bench holding one dumbbell. Press it up until your arm is straight, then lower it slowly. Complete all reps with one arm, then switch to the other.' },
  6:  { id: '6',  nameHe: 'שכיבות סמיכה עם אפוד', nameEn: 'Weighted Push-Ups',         svg: 'push_up',        instrHe: 'לבש את האפוד המשוקלל. תנוחת שכיבות סמיכה: ידיים ברוחב כתפיים, גוף ישר מהראש ועד הרגליים. כופף מרפקים עד שהחזה כמעט נוגע ברצפה, ודחוף חזרה למעלה.',                        instrEn: 'Wear the weighted vest. Get into push-up position: hands shoulder-width apart, body in a straight line from head to toes. Bend your elbows until your chest nearly touches the floor, then push back up.' },
  7:  { id: '7',  nameHe: 'מתח בטבעות',           nameEn: 'Ring Pull-Ups',             svg: 'pull_up',        instrHe: 'אחוז בטבעות ותלה עם זרועות ישרות לגמרי. משוך את עצמך כלפי מעלה עד שהסנטר מעל הטבעות. הורד לאט חזרה לתלייה מלאה. אל תבעט ברגליים.',          instrEn: 'Grab the rings and hang with arms fully extended. Pull yourself up until your chin is above the rings. Lower slowly back to a full hang. Don\'t kick your legs — use only your arms and back.' },
  8:  { id: '8',  nameHe: 'חתירה בטבעות',         nameEn: 'Ring Rows',                 svg: 'ring_row',       instrHe: 'אחוז בטבעות, הרגליים על הרצפה, הגוף באלכסון (כמו שכיבת סמיכה הפוכה). משוך את החזה לכיוון הטבעות, שמור על גוף ישר כמו קרש. הורד לאט.',                    instrEn: 'Grab the rings with your feet on the floor, body at an angle (like an upside-down push-up). Pull your chest toward the rings while keeping your body stiff like a plank. Lower slowly back down.' },
  9:  { id: '9',  nameHe: 'חתירה חד-צדדית',       nameEn: 'Single-Arm DB Row',         svg: 'single_row',     instrHe: 'הנח יד שמאל וברך שמאל על הספסל. ביד ימין אחוז במשקולת, הורד את הזרוע למטה, ומשוך למעלה עד שהמרפק עובר את הגב. שמור גב ישר. בצע את כל החזרות ואז החלף צד.',                         instrEn: 'Place your left hand and left knee on the bench for support. Hold the dumbbell in your right hand, let it hang straight down, then pull it up until your elbow passes your back. Keep your back flat. Do all reps, then switch sides.' },
  10: { id: '10', nameHe: 'חתירה רחבה',           nameEn: 'Bent-Over DB Row',          svg: 'bent_row',       instrHe: 'עמוד עם רגליים ברוחב כתפיים, כופף את הגוף קדימה (מותניים) בזווית 45 מעלות. החזק משקולת בכל יד, משוך שתיהן כלפי מעלה אל הבטן, ואז הורד לאט.',                      instrEn: 'Stand with feet shoulder-width apart, bend forward at the waist to about 45° (halfway between standing and horizontal). Hold a dumbbell in each hand, pull both up toward your belly, then lower slowly.' },
  11: { id: '11', nameHe: 'חתירת רנגייד',         nameEn: 'Renegade Rows',             svg: 'renegade',       instrHe: 'תנוחת שכיבות סמיכה כשהידיים אוחזות במשקולות. משוך משקולת אחת למעלה (מרפק כלפי התקרה), הורד, ואז החלף צד. שמור על הירכיים יציבות — אל תסתובב.',    instrEn: 'Get in push-up position with your hands gripping the dumbbells on the floor. Row one dumbbell up (elbow toward ceiling), lower it, then do the other side. Keep your hips level — don\'t rotate your body.' },
  12: { id: '12', nameHe: 'לחיצת כתפיים',         nameEn: 'DB Shoulder Press',         svg: 'shoulder_press', instrHe: 'שב על הספסל עם הגב ישר וצמוד למשענת. החזק משקולת בכל יד בגובה האוזניים, כפות ידיים קדימה. דחוף למעלה עד שהזרועות ישרות מעל הראש, ואז הורד לאט.',                                     instrEn: 'Sit on the bench with your back straight against the backrest. Hold a dumbbell in each hand at ear height, palms facing forward. Press up until arms are straight overhead, then lower slowly back to ear level.' },
  13: { id: '13', nameHe: 'הרמה צדדית',           nameEn: 'Lateral Raise',             svg: 'lateral_raise',  instrHe: 'עמוד זקוף, משקולת בכל יד לצד הגוף. הרם את הזרועות לצדדים עד גובה הכתפיים (כמו ציפור פורשת כנפיים). שמור על מרפקים מעט כפופים. הורד לאט.',                 instrEn: 'Stand tall with a dumbbell in each hand at your sides. Raise your arms out to the sides until they reach shoulder height (like a bird spreading its wings). Keep a slight bend in your elbows. Lower slowly.' },
  14: { id: '14', nameHe: 'הרמה קדמית',           nameEn: 'Front Raise',               svg: 'front_raise',    instrHe: 'עמוד זקוף, משקולת בכל יד מול הירכיים. הרם זרוע אחת ישר קדימה עד גובה הכתף, הורד לאט, ואז החלף. אל תתנדנד — תנועה איטית ומבוקרת.',                         instrEn: 'Stand tall with dumbbells in front of your thighs. Raise one arm straight forward to shoulder height, lower it slowly, then switch. Don\'t swing — keep the movement slow and controlled.' },
  15: { id: '15', nameHe: 'לחיצת ארנולד',         nameEn: 'Arnold Press',              svg: 'arnold',         instrHe: 'שב על הספסל. החזק משקולות מול הפנים עם כפות ידיים כלפיך (כמו שאתה מסתכל במראה). תוך כדי דחיפה למעלה, סובב את כפות הידיים החוצה עד שהן פונות קדימה למעלה. הורד וסובב חזרה.',              instrEn: 'Sit on the bench. Hold dumbbells in front of your face with palms facing you (like you\'re looking in a mirror). As you press up, rotate your palms outward so they face forward at the top. Reverse the rotation on the way down.' },
  16: { id: '16', nameHe: 'פרפר אחורי',           nameEn: 'Rear Delt Fly',             svg: 'rear_fly',       instrHe: 'שב על קצה הספסל, כופף את הגוף קדימה עד שהחזה כמעט נוגע בברכיים. החזק משקולות מתחת לרגליים. הרם זרועות לצדדים תוך כיווץ שכמות (שכמות) אחורה. הורד לאט.',                          instrEn: 'Sit on the edge of the bench, bend forward until your chest nearly touches your knees. Hold dumbbells under your legs. Raise arms out to the sides while squeezing your shoulder blades together. Lower slowly.' },
  17: { id: '17', nameHe: 'כיפוף מרפק',           nameEn: 'DB Curl',                   svg: 'curl',           instrHe: 'עמוד זקוף, משקולת בכל יד, ידיים למטה עם כפות ידיים כלפי מעלה. כופף את המרפקים והרם את המשקולות לכתפיים. כווץ את הביצפס למעלה, הורד לאט. המרפקים צמודים לגוף.',                        instrEn: 'Stand straight, a dumbbell in each hand with arms down and palms facing forward. Bend your elbows and curl the weights up to your shoulders. Squeeze the biceps at the top, then lower slowly. Keep elbows pinned to your sides.' },
  18: { id: '18', nameHe: 'כיפוף פטיש',           nameEn: 'Hammer Curl',               svg: 'hammer_curl',    instrHe: 'כמו כיפוף רגיל, אבל כפות הידיים פונות פנימה (זו לזו) — כמו אחיזה בפטיש. כופף מרפקים, הרם לכתפיים, הורד לאט. מרפקים צמודים לגוף.',                       instrEn: 'Like a regular curl, but palms face inward (toward each other) — like holding a hammer. Curl up to your shoulders and lower slowly. Keep elbows at your sides throughout.' },
  19: { id: '19', nameHe: 'כיפוף ריכוז',          nameEn: 'Concentration Curl',        svg: 'conc_curl',      instrHe: 'שב על הספסל עם רגליים פשוקות. הנח את גב המרפק על פנים הירך. כופף את המשקולת לכתף ואז הורד לאט. זה מבודד את הביצפס — אל תזוז עם הגוף.',                               instrEn: 'Sit on the bench with legs apart. Brace the back of your elbow against your inner thigh. Curl the dumbbell up to your shoulder and lower slowly. This isolates the bicep — don\'t use body momentum.' },
  20: { id: '20', nameHe: 'כיפוף משופע',          nameEn: 'Incline Curl',              svg: 'incline_curl',   instrHe: 'הגבה את משענת הספסל לזווית 45 מעלות כלפי מעלה. שכב עם הגב צמוד לספסל, ידיים תלויות למטה עם משקולות. כופף מרפקים, הרם לכתפיים, הורד לאט. תרגיש מתיחה בביצפס.',                             instrEn: 'Set the bench to about 45° incline (head higher than hips). Sit back with your back against the bench, arms hanging straight down holding dumbbells. Curl up to your shoulders and lower slowly. You\'ll feel a deep stretch in your biceps at the bottom.' },
  21: { id: '21', nameHe: 'הארכה מעל הראש',       nameEn: 'Overhead Tricep Ext.',      svg: 'overhead_ext',   instrHe: 'עמוד או שב. אחוז במשקולת אחת בשתי הידיים מעל הראש, זרועות ישרות. כופף את המרפקים והורד את המשקולת מאחורי הראש. ישר חזרה למעלה. המרפקים פונים קדימה, קרובים לראש.',                      instrEn: 'Stand or sit. Hold one dumbbell with both hands above your head, arms straight. Bend your elbows to lower the weight behind your head. Straighten back up. Keep elbows pointing forward and close to your head.' },
  22: { id: '22', nameHe: 'בעיטה אחורית',         nameEn: 'DB Kickback',               svg: 'kickback',       instrHe: 'כופף את הגוף קדימה 45 מעלות (או הישען על הספסל). אחוז משקולת, הרם את המרפק לגובה הגב. ישר את הזרוע לאחור עד שהיא ישרה, ואז כופף חזרה. רק האמה זזה — המרפק קבוע.',                                instrEn: 'Bend forward about 45° (or lean on the bench). Hold a dumbbell and raise your elbow to back height. Straighten your arm back until it\'s fully extended, then bend it back. Only your forearm moves — keep your elbow locked in place.' },
  23: { id: '23', nameHe: 'שכיבות סמיכה צרות',    nameEn: 'Close-Grip Push-Up',        svg: 'close_pushup',   instrHe: 'תנוחת שכיבות סמיכה, אבל הידיים קרובות זו לזו מתחת לאמצע החזה (מרחק כ-15 ס"מ). כופף מרפקים קרוב לגוף (לא לצדדים). זה מעביר עבודה לתלת-ראשי.',             instrEn: 'Push-up position, but place your hands close together under the center of your chest (about 15 cm apart). Bend elbows close to your body (not flared out). This shifts the work to your triceps.' },
  24: { id: '24', nameHe: 'הארכה בטבעות',         nameEn: 'Ring Tricep Extension',     svg: 'ring_ext',       instrHe: 'אחוז בטבעות ונטה קדימה עם גוף ישר (כמו נפילה מבוקרת). כופף מרפקים עד שהידיים מגיעות ליד האוזניים, ואז ישר חזרה. ככל שנוטים יותר קדימה — יותר קשה.',              instrEn: 'Grip the rings and lean forward with a straight body (like a controlled fall). Bend your elbows until your hands reach near your ears, then straighten back. The more you lean forward, the harder it gets.' },
}

const WARMUP = [
  { id: 'W1', nameHe: 'מעגלי זרועות',       nameEn: 'Arm Circles',          duration: 30, svg: 'warmup_circles',  instrHe: 'עמוד זקוף, פרוש זרועות לצדדים. בצע מעגלים קטנים קדימה 15 שניות, ואז אחורה 15 שניות. הגדל את המעגלים בהדרגה.',                  instrEn: 'Stand tall, arms out to sides. Make small circles forward for 15s, then backward for 15s. Gradually make the circles bigger.' },
  { id: 'W2', nameHe: 'סיבובי כתפיים',      nameEn: 'Shoulder Rotations',   duration: 30, svg: 'warmup_shoulder', instrHe: 'עמוד זקוף, הנח ידיים על הכתפיים. בצע סיבובים גדולים עם המרפקים — קדימה 15 שניות, אחורה 15 שניות.',                     instrEn: 'Stand tall, place hands on shoulders. Make big circles with your elbows — forward 15s, then backward 15s.' },
  { id: 'W3', nameHe: 'כלב מוריד ראש',      nameEn: 'Push-Up to Down Dog',  duration: 30, svg: 'warmup_downdog',  instrHe: 'התחל בתנוחת שכיבות סמיכה. דחוף את הישבן למעלה ליצירת צורת V הפוך (כף רגל שטוחה, ראש בין הזרועות). חזור לשכיבות סמיכה. חזור על התנועה.',            instrEn: 'Start in push-up position. Push your hips up to form an upside-down V shape (feet flat, head between arms). Return to push-up. Repeat the movement.' },
  { id: 'W4', nameHe: 'קפצנים',             nameEn: 'Jumping Jacks',        duration: 30, svg: 'warmup_jj',       instrHe: 'עמוד עם רגליים צמודות, ידיים לצד הגוף. קפוץ — פתח רגליים לרוחב ובו-זמנית הרם ידיים מעל הראש. קפוץ חזרה. קצב מהיר.',                   instrEn: 'Stand with feet together, arms at sides. Jump — spread your legs wide while raising your arms overhead. Jump back to start. Keep a quick pace.' },
  { id: 'W5', nameHe: 'שכיבות שכמות',       nameEn: 'Scapular Push-Ups',    duration: 30, svg: 'warmup_scap',     instrHe: 'תנוחת שכיבות סמיכה עם זרועות ישרות. בלי לכופף מרפקים — רק קרב את השכמות זו לזו (הגב שוקע) ואז רחק אותן (הגב עולה). תנועה קטנה אך חשובה.',      instrEn: 'Push-up position with straight arms. Without bending elbows — only squeeze shoulder blades together (back dips down) then push them apart (back rises up). Small but important movement.' },
  { id: 'W6', nameHe: 'סקוואטים בסיסיים',   nameEn: 'Bodyweight Squats',    duration: 30, svg: 'warmup_squat',    instrHe: 'עמוד עם רגליים ברוחב כתפיים, כפות רגליים מופנות מעט החוצה. כופף ברכיים ושב למטה כאילו אתה מתיישב על כיסא. ירד עד שהירכיים מקבילות לרצפה, ואז עלה.',        instrEn: 'Stand with feet shoulder-width apart, toes slightly outward. Bend your knees and sit down as if sitting into a chair. Go down until thighs are parallel to the floor, then stand back up.' },
]

const COOLDOWN = [
  { id: 'C1', nameHe: 'מתיחת חזה בדלת',    nameEn: 'Chest Doorway Stretch',   duration: 40, svg: 'cool_chest',     instrHe: 'עמוד ליד קיר או מסגרת דלת. הנח יד אחת על הקיר בגובה כתף, כף יד על הקיר. סובב את הגוף הצידה השני עד שמרגישים מתיחה בחזה. 20 שניות, ואז החלף צד.', instrEn: 'Stand next to a wall or doorframe. Place one hand on the wall at shoulder height. Rotate your body away until you feel a stretch across your chest. Hold 20s, then switch sides.' },
  { id: 'C2', nameHe: 'מתיחת כתף צולבת',   nameEn: 'Cross-Body Stretch',      duration: 40, svg: 'cool_shoulder',   instrHe: 'הושט זרוע ישרה לפניך. עם היד השנייה, משוך אותה לרוחב הגוף לכיוון הכתף הנגדית. תרגיש מתיחה בכתף האחורית. 20 שניות לכל צד.',         instrEn: 'Extend one arm straight in front of you. With your other hand, pull it across your body toward the opposite shoulder. Feel the stretch in the back of your shoulder. 20s each side.' },
  { id: 'C3', nameHe: 'מתיחת תלת-ראשי',    nameEn: 'Tricep Overhead Stretch', duration: 40, svg: 'cool_tricep',     instrHe: 'הרם יד אחת מעל הראש, כופף את המרפק כך שהיד נופלת מאחורי הראש. עם היד השנייה, לחץ בעדינות על המרפק כלפי מטה. תרגיש מתיחה בגב הזרוע. 20 שניות לכל צד.', instrEn: 'Raise one arm overhead and bend the elbow so your hand drops behind your head. With the other hand, gently push the elbow down. Feel the stretch in the back of your arm. 20s each side.' },
  { id: 'C4', nameHe: 'נשימות עמוקות',     nameEn: 'Deep Breaths',            duration: 30, svg: 'cool_breathe',    instrHe: 'עצום עיניים. נשום עמוק דרך האף — 4 שניות. עצור — 2 שניות. נשוף לאט דרך הפה — 6 שניות. נענע ידיים ורגליים בנחת בין נשימות.',                     instrEn: 'Close your eyes. Breathe in deeply through your nose — 4 seconds. Hold — 2 seconds. Exhale slowly through your mouth — 6 seconds. Gently shake out your hands and feet between breaths.' },
]

// ─────────────────────────────────────────────
// WORKOUT TEMPLATES
// ─────────────────────────────────────────────
const TEMPLATES = {
  20: {
    duration: 20,
    warmupSecs: 3 * 30,
    cooldownSecs: 40 + 40 + 40 + 30,
    exercises: [
      { exerciseId: '7',  sets: 3, reps: 8,  rest: 90,  setDuration: 35, weight: 'אפוד 0–16 ק"ג' },
      { exerciseId: '1',  sets: 3, reps: 10, rest: 75,  setDuration: 35, weight: '2×10 ק"ג' },
      { exerciseId: '12', sets: 3, reps: 10, rest: 75,  setDuration: 35, weight: '2×10 ק"ג' },
      { exerciseId: '17', sets: 3, reps: 10, rest: 75,  setDuration: 30, weight: '2×10 ק"ג', supersetWith: '21' },
      { exerciseId: '21', sets: 3, reps: 10, rest: 75,  setDuration: 30, weight: '17.5 ק"ג' },
    ],
  },
  '30a': {
    duration: 30,
    warmupSecs: 3 * 30,
    cooldownSecs: 40 + 40 + 40 + 30,
    exercises: [
      { exerciseId: '7',  sets: 4, reps: 6,  rest: 90, setDuration: 35, weight: 'אפוד 8–16 ק"ג' },
      { exerciseId: '2',  sets: 3, reps: 10, rest: 75, setDuration: 35, weight: '2×10 ק"ג' },
      { exerciseId: '15', sets: 3, reps: 10, rest: 75, setDuration: 35, weight: '2×8 ק"ג' },
      { exerciseId: '3',  sets: 3, reps: 8,  rest: 90, setDuration: 35, weight: 'אפוד / משקל גוף' },
      { exerciseId: '13', sets: 2, reps: 12, rest: 45, setDuration: 30, weight: '2×5 ק"ג', supersetWith: '16' },
      { exerciseId: '16', sets: 2, reps: 12, rest: 45, setDuration: 30, weight: '2×5 ק"ג' },
    ],
  },
  '30b': {
    duration: 30,
    warmupSecs: 3 * 30,
    cooldownSecs: 40 + 40 + 40 + 30,
    exercises: [
      { exerciseId: '8',  sets: 4, reps: 10, rest: 60, setDuration: 35, weight: 'אפוד 8–16 ק"ג' },
      { exerciseId: '1',  sets: 3, reps: 10, rest: 75, setDuration: 35, weight: '2×12.5 ק"ג' },
      { exerciseId: '10', sets: 3, reps: 12, rest: 75, setDuration: 40, weight: '2×12.5 ק"ג' },
      { exerciseId: '6',  sets: 3, reps: 12, rest: 60, setDuration: 40, weight: 'אפוד 10–20 ק"ג' },
      { exerciseId: '18', sets: 3, reps: 10, rest: 75, setDuration: 30, weight: '2×10 ק"ג', supersetWith: '21' },
      { exerciseId: '21', sets: 3, reps: 10, rest: 75, setDuration: 30, weight: '17.5 ק"ג' },
    ],
  },
  45: {
    duration: 45,
    warmupSecs: 3 * 30,
    cooldownSecs: 40 + 40 + 40 + 30,
    exercises: [
      { exerciseId: '7',  sets: 4, reps: 8,  rest: 90,  setDuration: 35, weight: 'אפוד 0–16 ק"ג' },
      { exerciseId: '2',  sets: 4, reps: 10, rest: 75,  setDuration: 35, weight: '2×10 ק"ג' },
      { exerciseId: '8',  sets: 3, reps: 10, rest: 75,  setDuration: 35, weight: 'אפוד 0–10 ק"ג' },
      { exerciseId: '3',  sets: 3, reps: 8,  rest: 90,  setDuration: 35, weight: 'אפוד 10–16 ק"ג' },
      { exerciseId: '15', sets: 3, reps: 10, rest: 75,  setDuration: 35, weight: '2×10 ק"ג' },
      { exerciseId: '16', sets: 3, reps: 12, rest: 45,  setDuration: 35, weight: '2×5 ק"ג' },
      { exerciseId: '17', sets: 3, reps: 10, rest: 60,  setDuration: 30, weight: '2×10 ק"ג' },
      { exerciseId: '21', sets: 3, reps: 10, rest: 60,  setDuration: 30, weight: '17.5 ק"ג' },
      { exerciseId: '6',  sets: 2, reps: 15, rest: 0,   setDuration: 45, weight: 'אפוד 10–20 ק"ג' },
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
  selectedDuration: '30a',
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
    <div className="w-full bg-zinc-800 rounded-full h-4 md:h-5 overflow-hidden">
      <div
        className={`h-4 md:h-5 rounded-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
      />
    </div>
  )
}

function getDurationLabel(selectedDuration, t) {
  if (selectedDuration === '30a') return t.dayA
  if (selectedDuration === '30b') return t.dayB
  return `${selectedDuration} ${t.min}`
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
        <div className="text-6xl md:text-7xl mb-3">💪</div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">{t.appTitle}</h1>
        <p className="text-zinc-400 mt-2 text-lg md:text-xl">{t.pickDuration}</p>
      </div>

      {/* Duration picker */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {[20, '30a', '30b', 45].map(d => {
          const isDay = d === '30a' || d === '30b'
          const label = isDay ? (d === '30a' ? t.dayA : t.dayB) : String(d)
          const sub   = isDay ? (d === '30a' ? t.pushFocus : t.pullFocus) : t.min
          const isSelected = state.selectedDuration === d
          return (
            <button
              key={d}
              onClick={() => dispatch({ type: 'SET_DURATION', duration: d })}
              className={`flex flex-col items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 font-black transition-all active:scale-95
                ${isSelected
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
            >
              <span className={`leading-none ${isDay ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>
                {label}
              </span>
              <span className={`mt-1 font-medium text-center px-1 ${isDay ? 'text-xs leading-tight' : 'text-sm md:text-base'}`}>
                {sub}
              </span>
            </button>
          )
        })}
      </div>

      {/* Preview button */}
      <button
        onClick={() => dispatch({ type: 'GO_PREVIEW' })}
        className="w-full max-w-xs md:max-w-sm bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/30"
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
          <h2 className="text-white font-black text-xl">{getDurationLabel(state.selectedDuration, t)}</h2>
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
          <p className="text-orange-400 font-black text-2xl md:text-3xl text-center">{t.getReady}</p>
          {state.lang === 'en' && <p className="text-zinc-500 text-lg md:text-xl">Get Ready</p>}
          <div className="text-9xl md:text-[10rem] font-black text-white leading-none tabular-nums">
            {state.secondsRemaining}
          </div>
          {/* Next exercise preview */}
          {ex && (
            <div className="bg-zinc-900 rounded-2xl px-6 py-4 md:px-8 md:py-5 w-full max-w-sm md:max-w-md border border-zinc-800 text-center">
              {step.isSuperset && step.previewExB && (
                <p className="text-orange-400 text-xs md:text-sm font-black uppercase mb-2">{t.superset}</p>
              )}
              <p className="text-white font-black text-xl md:text-2xl">{isHe ? ex.nameHe : ex.nameEn}</p>
              {step.isSuperset && step.previewExB && (
                <p className="text-zinc-400 font-bold text-base md:text-lg mt-1">+ {isHe ? step.previewExB.nameHe : step.previewExB.nameEn}</p>
              )}
              <p className="text-zinc-400 text-sm md:text-base mt-2">
                {step.workoutEx.sets}×{step.workoutEx.reps}
              </p>
              <div className="mt-3 flex flex-col items-center gap-1.5">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2 md:px-5 md:py-2.5">
                  <span className="text-orange-400 text-sm md:text-base">🏋️</span>
                  <span className="text-orange-300 font-bold text-sm md:text-base">{step.workoutEx.weight}</span>
                </div>
                {step.isSuperset && step.workoutExB && step.workoutExB.weight !== step.workoutEx.weight && (
                  <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2 md:px-5 md:py-2.5">
                    <span className="text-orange-400 text-sm md:text-base">🏋️</span>
                    <span className="text-orange-300 font-bold text-sm md:text-base">{step.workoutExB.weight}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
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
        <div className="flex items-center justify-center" style={{ height: '30%', minHeight: 100, maxHeight: 200 }}>
          <div className="w-[130px] h-[130px] md:w-[180px] md:h-[180px]">
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
            <span className="text-7xl md:text-8xl font-black text-orange-400 tabular-nums leading-none">{state.secondsRemaining}</span>
          </div>
          <ProgressBar progress={progress} />
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
        <p className="text-zinc-400 text-xl md:text-2xl mt-2">{getDurationLabel(state.selectedDuration, t)} {state.lang === 'he' ? 'אימון הושלם' : 'workout done'}</p>
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
