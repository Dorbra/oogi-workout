// SVG stick-figure primitives and diagram map
// Each entry in SVGS is keyed to the svg field in exercises.json

// ─────────────────────────────────────────────
// SVG DIAGRAMS
// ─────────────────────────────────────────────
// Shared stick figure primitives
function Head({ cx = 50, cy = 18, r = 8 }) {
  return <circle cx={cx} cy={cy} r={r} fill="var(--svg-figure)" />
}
function Body({ x1 = 50, y1 = 26, x2 = 50, y2 = 60 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
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
      <rect x="5" y="52" width="82" height="6" rx="2" fill="var(--svg-equipment)" />
      <line x1="14" y1="58" x2="14" y2="70" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      <line x1="79" y1="58" x2="79" y2="70" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      <circle cx="14" cy="44" r="6" fill="var(--svg-figure)" />
      <line x1="20" y1="44" x2="72" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="46" x2="28" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="48" x2="58" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={23} y1={33} x2={33} y2={33} />
      <Dumbbell x1={53} y1={35} x2={63} y2={35} />
      <line x1="72" y1="50" x2="80" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="50" x2="84" y2="57" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms extended */}
      <rect x="115" y="52" width="82" height="6" rx="2" fill="var(--svg-equipment)" />
      <line x1="124" y1="58" x2="124" y2="70" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      <line x1="189" y1="58" x2="189" y2="70" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      <circle cx="124" cy="44" r="6" fill="var(--svg-figure)" />
      <line x1="130" y1="44" x2="182" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="142" y1="46" x2="136" y2="21" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="165" y1="48" x2="171" y2="21" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={131} y1={21} x2={141} y2={21} />
      <Dumbbell x1={166} y1={21} x2={176} y2={21} />
      <line x1="182" y1="50" x2="190" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="182" y1="50" x2="194" y2="57" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  incline_press: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: incline bench — HEAD AT HIGH END (right), dumbbells at chest */}
      <line x1="5" y1="70" x2="85" y2="42" stroke="var(--svg-equipment)" strokeWidth="5" strokeLinecap="round" />
      <line x1="85" y1="42" x2="85" y2="70" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      <circle cx="78" cy="34" r="6" fill="var(--svg-figure)" />
      <line x1="72" y1="40" x2="28" y2="62" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="44" x2="55" y2="27" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="50" x2="49" y2="33" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={50} y1={24} x2={60} y2={24} />
      <Dumbbell x1={44} y1={30} x2={54} y2={30} />
      <line x1="28" y1="62" x2="18" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="62" x2="22" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: same bench, arms extended upward */}
      <line x1="115" y1="70" x2="195" y2="42" stroke="var(--svg-equipment)" strokeWidth="5" strokeLinecap="round" />
      <line x1="195" y1="42" x2="195" y2="70" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      <circle cx="188" cy="34" r="6" fill="var(--svg-figure)" />
      <line x1="182" y1="40" x2="138" y2="62" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="170" y1="44" x2="162" y2="12" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="156" y1="50" x2="162" y2="15" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={157} y1={9} x2={167} y2={9} />
      <line x1="138" y1="62" x2="128" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="138" y1="62" x2="132" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  pull_up: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms fully extended, hanging */}
      <line x1="10" y1="6" x2="88" y2="6" stroke="var(--svg-bar)" strokeWidth="3" />
      <circle cx="28" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="70" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <line x1="28" y1="19" x2="49" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="19" x2="49" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="49" cy="43" r="6" fill="var(--svg-figure)" />
      <line x1="49" y1="49" x2="49" y2="67" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="49" y1="55" x2="40" y2="66" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="49" y1="55" x2="58" y2="66" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: chin above rings, arms bent */}
      <line x1="120" y1="6" x2="198" y2="6" stroke="var(--svg-bar)" strokeWidth="3" />
      <circle cx="138" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="180" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="159" cy="20" r="6" fill="var(--svg-figure)" />
      <line x1="153" y1="26" x2="138" y2="19" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="165" y1="26" x2="180" y2="19" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="159" y1="26" x2="159" y2="56" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="159" y1="56" x2="150" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="159" y1="56" x2="168" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_row: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: leaning back, arms fully extended */}
      <line x1="10" y1="6" x2="88" y2="6" stroke="var(--svg-bar)" strokeWidth="3" />
      <circle cx="28" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="70" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="22" cy="52" r="6" fill="var(--svg-figure)" />
      <line x1="28" y1="48" x2="64" y2="32" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="36" y1="44" x2="28" y2="19" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="37" x2="70" y2="19" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="32" x2="74" y2="18" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="32" x2="80" y2="26" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: chest pulled to rings, elbows back */}
      <line x1="120" y1="6" x2="198" y2="6" stroke="var(--svg-bar)" strokeWidth="3" />
      <circle cx="138" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="180" cy="14" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="135" cy="28" r="6" fill="var(--svg-figure)" />
      <line x1="141" y1="30" x2="175" y2="42" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="34" x2="138" y2="19" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="162" y1="38" x2="180" y2="19" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="175" y1="42" x2="185" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="175" y1="42" x2="190" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_dip: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms straight, top position */}
      <line x1="5" y1="6" x2="88" y2="6" stroke="var(--svg-bar)" strokeWidth="3" />
      <circle cx="22" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="75" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <line x1="22" y1="21" x2="32" y2="32" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="21" x2="65" y2="32" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="49" cy="32" r="6" fill="var(--svg-figure)" />
      <line x1="49" y1="38" x2="49" y2="60" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="49" y1="46" x2="40" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="49" y1="46" x2="58" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms bent ~90°, body dropped */}
      <line x1="115" y1="6" x2="198" y2="6" stroke="var(--svg-bar)" strokeWidth="3" />
      <circle cx="132" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="185" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <line x1="132" y1="21" x2="138" y2="32" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="138" y1="32" x2="159" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="185" y1="21" x2="179" y2="32" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="179" y1="32" x2="159" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="159" cy="44" r="6" fill="var(--svg-figure)" />
      <line x1="159" y1="50" x2="159" y2="68" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="159" y1="56" x2="150" y2="66" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="159" y1="56" x2="168" y2="66" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  single_row: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Bench */}
      <rect x="10" y="44" width="45" height="7" rx="2" fill="var(--svg-equipment)" />
      <line x1="18" y1="51" x2="18" y2="62" stroke="var(--svg-equipment)" strokeWidth="3" />
      <line x1="47" y1="51" x2="47" y2="62" stroke="var(--svg-equipment)" strokeWidth="3" />
      {/* Person kneeling on bench */}
      <circle cx="30" cy="30" r="7" fill="var(--svg-figure)" />
      <line x1="30" y1="37" x2="30" y2="44" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="39" x2="18" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rowing arm */}
      <line x1="30" y1="39" x2="72" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={68} y1={30} x2={80} y2={30} />
    </svg>
  ),
  bent_row: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: bent over, arms hanging down */}
      <circle cx="18" cy="22" r="6" fill="var(--svg-figure)" />
      <line x1="18" y1="28" x2="56" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="33" x2="26" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="40" x2="40" y2="62" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={56} x2={31} y2={56} />
      <Dumbbell x1={35} y1={62} x2={45} y2={62} />
      <line x1="56" y1="46" x2="47" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="46" x2="65" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: bent over, elbows pulled up to ribs */}
      <circle cx="128" cy="22" r="6" fill="var(--svg-figure)" />
      <line x1="128" y1="28" x2="166" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="138" y1="33" x2="134" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="152" y1="40" x2="148" y2="26" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={129} y1={17} x2={139} y2={17} />
      <Dumbbell x1={143} y1={23} x2={153} y2={23} />
      <line x1="166" y1="46" x2="157" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="166" y1="46" x2="175" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  renegade: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Push-up position */}
      <circle cx="20" cy="30" r="7" fill="var(--svg-figure)" />
      <line x1="20" y1="37" x2="72" y2="48" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="36" x2="25" y2="52" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={52} x2={29} y2={52} />
      {/* One arm rowing up */}
      <line x1="55" y1="42" x2="52" y2="26" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={48} y1={22} x2={56} y2={22} />
      <line x1="72" y1="48" x2="68" y2="62" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="48" x2="78" y2="62" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  shoulder_press: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: dumbbells at ear/shoulder height */}
      <rect x="28" y="57" width="32" height="5" rx="2" fill="var(--svg-equipment)" />
      <circle cx="44" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="44" y1="20" x2="44" y2="57" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="57" x2="34" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="57" x2="54" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="28" x2="22" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="28" x2="20" y2="16" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="28" x2="66" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="28" x2="68" y2="16" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={15} y1={15} x2={25} y2={15} />
      <Dumbbell x1={63} y1={15} x2={73} y2={15} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms fully extended overhead */}
      <rect x="138" y="57" width="32" height="5" rx="2" fill="var(--svg-equipment)" />
      <circle cx="154" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="154" y1="20" x2="154" y2="57" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="154" y1="57" x2="144" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="57" x2="164" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="142" y2="10" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="166" y2="10" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={137} y1={7} x2={147} y2={7} />
      <Dumbbell x1={161} y1={7} x2={171} y2={7} />
    </svg>
  ),
  lateral_raise: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms at sides */}
      <circle cx="45" cy="16" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="22" x2="45" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="30" x2="32" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="30" x2="58" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={27} y1={44} x2={27} y2={52} />
      <Dumbbell x1={62} y1={44} x2={62} y2={52} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms at shoulder height */}
      <circle cx="155" cy="16" r="6" fill="var(--svg-figure)" />
      <line x1="155" y1="22" x2="155" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="54" x2="147" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="54" x2="163" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="30" x2="124" y2="30" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="30" x2="186" y2="30" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={119} y1={27} x2={119} y2={33} />
      <Dumbbell x1={190} y1={27} x2={190} y2={33} />
    </svg>
  ),
  front_raise: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="28" x2="50" y2="60" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="60" x2="42" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="60" x2="58" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* One arm raised forward */}
      <line x1="50" y1="38" x2="36" y2="52" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="38" x2="38" y2="18" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={33} y1={14} x2={43} y2={14} />
      <line x1="50" y1="38" x2="62" y2="52" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  arnold: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: dumbbells at shoulder, palms facing in */}
      <rect x="28" y="58" width="32" height="5" rx="2" fill="var(--svg-equipment)" />
      <circle cx="44" cy="16" r="6" fill="var(--svg-figure)" />
      <line x1="44" y1="22" x2="44" y2="58" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="58" x2="34" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="58" x2="54" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="30" x2="28" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="34" x2="26" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="30" x2="60" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="34" x2="62" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={17} x2={31} y2={17} />
      <Dumbbell x1={57} y1={17} x2={67} y2={17} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms fully extended overhead */}
      <rect x="138" y="58" width="32" height="5" rx="2" fill="var(--svg-equipment)" />
      <circle cx="154" cy="16" r="6" fill="var(--svg-figure)" />
      <line x1="154" y1="22" x2="154" y2="58" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="154" y1="58" x2="144" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="58" x2="164" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="142" y2="12" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="28" x2="166" y2="12" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={137} y1={8} x2={147} y2={8} />
      <Dumbbell x1={161} y1={8} x2={171} y2={8} />
    </svg>
  ),
  rear_fly: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: hinged forward, arms hanging down */}
      <circle cx="18" cy="20" r="6" fill="var(--svg-figure)" />
      <line x1="18" y1="26" x2="56" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="32" x2="26" y2="54" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="40" x2="40" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={21} y1={54} x2={31} y2={54} />
      <Dumbbell x1={35} y1={60} x2={45} y2={60} />
      <line x1="56" y1="46" x2="47" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="46" x2="65" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms spread wide, shoulder blades squeezed */}
      <circle cx="128" cy="20" r="6" fill="var(--svg-figure)" />
      <line x1="128" y1="26" x2="166" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="138" y1="32" x2="116" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="152" y1="40" x2="174" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={111} y1={16} x2={120} y2={16} />
      <Dumbbell x1={169} y1={24} x2={178} y2={24} />
      <line x1="166" y1="46" x2="157" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="166" y1="46" x2="175" y2="63" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  curl: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms down, palms forward */}
      <circle cx="45" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="20" x2="45" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="36" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="54" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="30" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="34" x2="28" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="60" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="34" x2="62" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={23} y1={53} x2={33} y2={53} />
      <Dumbbell x1={57} y1={53} x2={67} y2={53} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms curled to shoulders */}
      <circle cx="155" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="155" y1="20" x2="155" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="54" x2="146" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="54" x2="164" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="140" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="34" x2="136" y2="16" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="170" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="34" x2="174" y2="16" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={131} y1={13} x2={141} y2={13} />
      <Dumbbell x1={169} y1={13} x2={179} y2={13} />
    </svg>
  ),
  hammer_curl: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms down, neutral (hammer) grip */}
      <circle cx="45" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="20" x2="45" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="36" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="54" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="30" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="34" x2="28" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="60" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="34" x2="62" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="50" x2="28" y2="62" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="24" y="48" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="24" y="60" width="8" height="4" rx="1" fill="#f97316" />
      <line x1="62" y1="50" x2="62" y2="62" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="58" y="48" width="8" height="4" rx="1" fill="#f97316" />
      <rect x="58" y="60" width="8" height="4" rx="1" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms curled to shoulders */}
      <circle cx="155" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="155" y1="20" x2="155" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="54" x2="146" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="54" x2="164" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="140" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="34" x2="136" y2="16" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="28" x2="170" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="34" x2="174" y2="16" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
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
      <rect x="25" y="50" width="30" height="7" rx="2" fill="var(--svg-equipment)" />
      <line x1="30" y1="57" x2="30" y2="68" stroke="var(--svg-equipment)" strokeWidth="3" />
      <line x1="50" y1="57" x2="50" y2="68" stroke="var(--svg-equipment)" strokeWidth="3" />
      <circle cx="42" cy="22" r="7" fill="var(--svg-figure)" />
      <line x1="42" y1="29" x2="40" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Arm curling on thigh */}
      <line x1="40" y1="36" x2="25" y2="42" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="25" y1="42" x2="22" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={17} y1={24} x2={27} y2={24} />
    </svg>
  ),
  incline_curl: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <line x1="10" y1="70" x2="75" y2="35" stroke="var(--svg-equipment)" strokeWidth="6" strokeLinecap="round" />
      <line x1="75" y1="35" x2="75" y2="70" stroke="var(--svg-equipment)" strokeWidth="3" />
      <circle cx="25" cy="42" r="7" fill="var(--svg-figure)" />
      <line x1="25" y1="49" x2="60" y2="38" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms hanging down from incline */}
      <line x1="35" y1="44" x2="28" y2="62" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={23} y1={62} x2={33} y2={62} />
      <line x1="48" y1="41" x2={42} y2={58} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={37} y1={58} x2={47} y2={58} />
    </svg>
  ),
  overhead_ext: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: arms bent, dumbbell lowered behind head */}
      <circle cx="45" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="20" x2="45" y2="56" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="56" x2="36" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="56" x2="54" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="26" x2="32" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="20" x2="38" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="26" x2="58" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="20" x2="52" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="39" y="36" width="12" height="5" rx="2" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms straight overhead */}
      <circle cx="155" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="155" y1="20" x2="155" y2="56" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="56" x2="146" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="56" x2="164" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="26" x2="147" y2="12" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="26" x2="163" y2="12" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="149" y="5" width="12" height="5" rx="2" fill="#f97316" />
    </svg>
  ),
  kickback: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="20" cy="22" r="7" fill="var(--svg-figure)" />
      <line x1="20" y1="29" x2="55" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Elbow up, arm extending back */}
      <line x1="35" y1="36" x2="40" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="28" x2="70" y2="24" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={65} y1={20} x2={75} y2={20} />
      <line x1="55" y1="46" x2="48" y2="62" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="46" x2="62" y2="62" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  close_pushup: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="20" cy="26" r="7" fill="var(--svg-figure)" />
      <line x1="20" y1="33" x2="75" y2="44" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms close together */}
      <line x1="28" y1="34" x2="36" y2="48" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="37" x2={44} y2={48} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="48" x2={44} y2={48} stroke="var(--svg-figure)" strokeWidth="2" />
      <line x1="75" y1="44" x2="67" y2="58" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="44" x2="80" y2="58" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ring_ext: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <line x1="20" y1="8" x2="80" y2="8" stroke="var(--svg-bar)" strokeWidth="3" />
      <circle cx="32" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="68" cy="16" r="5" fill="none" stroke="#f97316" strokeWidth="2.5" />
      {/* Person leaning into rings, arms bent */}
      <circle cx="50" cy="40" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="48" x2="50" y2="66" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="66" x2="42" y2="76" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="66" x2="58" y2="76" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="37" y1="40" x2="32" y2="21" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="63" y1="40" x2="68" y2="21" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  squeeze_press: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="46" r="7" fill="var(--svg-figure)" />
      <line x1="50" y1="53" x2="50" y2="70" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="53" x2="38" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="53" x2="62" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Dumbbells squeezed together */}
      <Dumbbell x1={35} y1={28} x2={65} y2={28} />
      <line x1="50" y1="28" x2="50" y2="14" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  single_press: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <rect x="10" y="52" width="80" height="8" rx="2" fill="var(--svg-equipment)" />
      <line x1="20" y1="60" x2="20" y2="72" stroke="var(--svg-equipment)" strokeWidth="3" />
      <line x1="80" y1="60" x2="80" y2="72" stroke="var(--svg-equipment)" strokeWidth="3" />
      <circle cx="25" cy="44" r="7" fill="var(--svg-figure)" />
      <line x1="32" y1="44" x2="70" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* One arm pressing up */}
      <line x1="45" y1="47" x2="42" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={37} y1={28} x2={47} y2={28} />
      {/* Other arm down */}
      <line x1="58" y1="48" x2="62" y2="52" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  push_up: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: chest near floor, arms bent */}
      <circle cx="12" cy="28" r="6" fill="var(--svg-figure)" />
      <line x1="18" y1="30" x2="80" y2="44" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="32" x2="24" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="38" x2="48" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="44" x2="70" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="44" x2="86" y2="58" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="30" y="34" width="20" height="8" rx="2" fill="#f97316" opacity="0.7" />
      <text x="40" y="41" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">V</text>
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: arms extended, top position */}
      <circle cx="122" cy="20" r="6" fill="var(--svg-figure)" />
      <line x1="128" y1="24" x2="190" y2="42" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="136" y1="26" x2="136" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="158" y1="33" x2="158" y2="52" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="190" y1="42" x2="180" y2="58" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="190" y1="42" x2="196" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="140" y="31" width="20" height="8" rx="2" fill="#f97316" opacity="0.7" />
      <text x="150" y="38" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">V</text>
    </svg>
  ),
  // Warmup SVGs
  warmup_circles: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="26" x2="50" y2="55" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="42" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms in circle motion */}
      <path d="M 22 30 Q 15 20 22 12 Q 30 4 38 12" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="3 2" />
      <path d="M 78 30 Q 85 20 78 12 Q 70 4 62 12" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="3 2" />
      <line x1="50" y1="36" x2="24" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="76" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  warmup_shoulder: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="26" x2="50" y2="55" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="42" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="55" x2="58" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="22" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="78" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 18 28 A 12 12 0 0 1 18 44" stroke="#f97316" strokeWidth="2" fill="none" />
      <path d="M 82 28 A 12 12 0 0 0 82 44" stroke="#f97316" strokeWidth="2" fill="none" />
    </svg>
  ),
  warmup_downdog: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="7" fill="var(--svg-figure)" />
      {/* Inverted V shape */}
      <line x1="50" y1="27" x2="22" y2="52" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="27" x2="78" y2="52" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="52" x2="16" y2="66" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="52" x2="28" y2="64" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="78" y1="52" x2="72" y2="64" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="78" y1="52" x2="84" y2="66" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  warmup_jj: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="16" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="24" x2="50" y2="52" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms up */}
      <line x1="50" y1="34" x2="22" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="34" x2="78" y2="20" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs spread */}
      <line x1="50" y1="52" x2="34" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="52" x2="66" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  warmup_scap: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="20" cy="28" r="7" fill="var(--svg-figure)" />
      <line x1="20" y1="35" x2="76" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="37" x2="28" y2="52" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="42" x2="52" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="46" x2="68" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="46" x2="82" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 36 35 Q 44 28 52 35" stroke="#f97316" strokeWidth="2" fill="none" />
    </svg>
  ),
  warmup_squat: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="16" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="24" x2="50" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="34" x2="34" y2="42" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="34" x2="66" y2="42" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs bent in squat */}
      <line x1="50" y1="46" x2="36" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="56" x2="30" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="46" x2="64" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="56" x2="70" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  // Cooldown SVGs
  cool_chest: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="22" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="30" x2="50" y2="60" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="60" x2="42" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="60" x2="58" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* One arm on doorframe */}
      <line x1="50" y1="38" x2="80" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="80" y="10" width="6" height="60" rx="2" fill="var(--svg-equipment)" />
      {/* Other arm relaxed */}
      <line x1="50" y1="38" x2="34" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  cool_shoulder: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="28" x2="50" y2="58" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arm across body */}
      <line x1="50" y1="36" x2="22" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="68" y2="26" stroke="var(--svg-figure)" strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  ),
  cool_tricep: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="26" x2="50" y2="58" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arm up, bent at elbow */}
      <line x1="50" y1="34" x2="66" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="28" x2="60" y2="12" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Other hand pulling */}
      <line x1="50" y1="34" x2="38" y2="26" stroke="var(--svg-figure)" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="38" y1="26" x2="60" y2="12" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  ),
  cool_breathe: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <circle cx="50" cy="20" r="8" fill="var(--svg-figure)" />
      <line x1="50" y1="28" x2="50" y2="58" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="42" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="58" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="28" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="72" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Breath waves */}
      <path d="M 36 10 Q 40 6 44 10 Q 48 14 52 10 Q 56 6 60 10" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M 40 5 Q 44 1 48 5 Q 52 9 56 5" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  ),

  // ── ABS ──────────────────────────────────────
  plank: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Forearm plank — single position */}
      <circle cx="12" cy="27" r="6" fill="var(--svg-figure)" />
      <line x1="18" y1="30" x2="80" y2="43" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Left forearm on floor */}
      <line x1="22" y1="32" x2="20" y2="43" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="43" x2="28" y2="43" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right forearm on floor */}
      <line x1="44" y1="37" x2="42" y2="48" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="48" x2="50" y2="48" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <line x1="80" y1="43" x2="72" y2="57" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="43" x2="86" y2="57" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hold-timer arc */}
      <path d="M56 18 A9 9 0 1 1 56.1 18" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="4 3" strokeLinecap="round" />
    </svg>
  ),
  crunch: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: lying flat, knees bent */}
      <circle cx="10" cy="50" r="5" fill="var(--svg-figure)" />
      <line x1="15" y1="50" x2="55" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="46" x2="10" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="46" x2="30" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="50" x2="65" y2="42" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="65" y1="42" x2="76" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="50" x2="63" y2="57" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="63" y1="57" x2="76" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: upper body crunched up */}
      <circle cx="120" cy="33" r="5" fill="var(--svg-figure)" />
      <line x1="125" y1="36" x2="154" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="28" x2="113" y2="21" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="125" y1="31" x2="130" y2="23" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="50" x2="164" y2="42" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="164" y1="42" x2="175" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="50" x2="162" y2="57" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="162" y1="57" x2="175" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  leg_raise: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: lying flat, legs low */}
      <circle cx="10" cy="46" r="5" fill="var(--svg-figure)" />
      <line x1="15" y1="46" x2="60" y2="48" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="44" x2="22" y2="55" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="45" x2="40" y2="55" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="48" x2="80" y2="47" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="50" x2="80" y2="51" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: legs raised ~90° */}
      <circle cx="115" cy="46" r="5" fill="var(--svg-figure)" />
      <line x1="120" y1="46" x2="164" y2="48" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="128" y1="44" x2="128" y2="55" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="146" y1="45" x2="146" y2="55" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="164" y1="48" x2="158" y2="14" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="164" y1="48" x2="170" y2="14" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  russian_twist: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Seated, leaning back 45°, dumbbell to side */}
      <circle cx="46" cy="20" r="6" fill="var(--svg-figure)" />
      <line x1="46" y1="26" x2="58" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms extended to right */}
      <line x1="50" y1="34" x2="70" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={66} y1={24} x2={76} y2={24} />
      {/* Bent legs */}
      <line x1="58" y1="50" x2="44" y2="62" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="62" x2="36" y2="72" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="50" x2="72" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="60" x2="80" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rotation arc */}
      <path d="M40 30 A14 14 0 0 1 56 20" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  mountain_climber: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* High plank, one knee driven forward */}
      <circle cx="14" cy="22" r="6" fill="var(--svg-figure)" />
      <line x1="20" y1="25" x2="76" y2="38" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="27" x2="24" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="32" x2="46" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Driven knee under chest */}
      <line x1="76" y1="38" x2="58" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="46" x2="50" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Back leg straight */}
      <line x1="76" y1="38" x2="84" y2="52" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="84" y1="52" x2="90" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Knee-drive arrow */}
      <path d="M66 38 L56 46 M58 42 L56 46 L60 47" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dead_bug: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Lying on back — arm + opposite leg extended */}
      <circle cx="12" cy="44" r="5" fill="var(--svg-figure)" />
      <line x1="17" y1="44" x2="65" y2="44" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Left arm extended overhead (orange = the moving limb) */}
      <line x1="22" y1="41" x2="14" y2="22" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right arm up (static, tabletop) */}
      <line x1="36" y1="41" x2="40" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="28" x2="50" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right leg tabletop (bent) */}
      <line x1="55" y1="44" x2="56" y2="30" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="30" x2="68" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leg extended (orange = opposite to extended arm) */}
      <line x1="65" y1="44" x2="84" y2="43" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  // ── LEGS ─────────────────────────────────────
  goblet_squat: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing, DB at chest */}
      <circle cx="45" cy="12" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="30" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="60" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="30" y="32" width="30" height="6" rx="2" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: deep squat, DB at chest */}
      <circle cx="155" cy="26" r="6" fill="var(--svg-figure)" />
      <line x1="155" y1="32" x2="155" y2="52" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="40" x2="140" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="40" x2="170" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="140" y="44" width="30" height="6" rx="2" fill="#f97316" />
      <line x1="155" y1="52" x2="140" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="60" x2="134" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="52" x2="170" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="60" x2="176" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  reverse_lunge: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing, DBs at sides */}
      <circle cx="45" cy="12" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="28" y2="34" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={24} y1={34} x2={24} y2={46} />
      <line x1="45" y1="28" x2="62" y2={34} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={66} y1={34} x2={66} y2={46} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: back lunge — front knee 90°, rear knee near floor */}
      <circle cx="148" cy="18" r="6" fill="var(--svg-figure)" />
      <line x1="148" y1="24" x2="148" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="148" y1="32" x2="132" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={128} y1={38} x2={128} y2={50} />
      <line x1="148" y1="32" x2="164" y2={38} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={168} y1={38} x2={168} y2={50} />
      {/* Front leg bent 90° */}
      <line x1="148" y1="50" x2="136" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="136" y1="60" x2="130" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Back leg, knee near floor */}
      <line x1="148" y1="50" x2="166" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="166" y1="56" x2="172" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  rdl: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing, DBs at hips */}
      <circle cx="45" cy="12" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="37" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="53" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="32" x2="26" y2="38" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={22} y1={38} x2={22} y2={50} />
      <line x1="45" y1="32" x2="64" y2={38} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={68} y1={38} x2={68} y2={50} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: hinged forward, back straight, DBs near shins */}
      <circle cx="130" cy="30" r="6" fill="var(--svg-figure)" />
      <line x1="136" y1="32" x2="170" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="148" y1="38" x2="140" y2="18" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={134} y1={14} x2={146} y2={14} />
      <line x1="158" y1="44" x2={152} y2={26} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={146} y1={22} x2={158} y2={22} />
      <line x1="170" y1="50" x2="162" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="50" x2="178" y2="68" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  glute_bridge: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: lying on back, knees bent, hips on floor */}
      <circle cx="10" cy="44" r="5" fill="var(--svg-figure)" />
      <line x1="15" y1="44" x2="48" y2="46" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="43" x2="22" y2="54" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="44" x2="38" y2="54" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="46" x2="60" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="36" x2="72" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="46" x2="56" y2="54" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="54" x2="72" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: hips raised, body like a ramp */}
      <circle cx="115" cy="44" r="5" fill="var(--svg-figure)" />
      <line x1="120" y1="44" x2="148" y2="28" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="126" y1="42" x2="126" y2="53" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="138" y1="36" x2="138" y2="47" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
      <line x1="148" y1="28" x2="158" y2="40" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="158" y1="40" x2="170" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="148" y1="28" x2="154" y2="46" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="154" y1="46" x2="170" y2="28" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  split_squat: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Bulgarian split squat — down position, rear foot on bench */}
      {/* Bench */}
      <rect x="54" y="44" width="38" height="6" rx="2" fill="var(--svg-equipment)" />
      <line x1="60" y1="50" x2="60" y2="60" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      <line x1="86" y1="50" x2="86" y2="60" stroke="var(--svg-equipment)" strokeWidth="2.5" />
      {/* Person */}
      <circle cx="38" cy="18" r="6" fill="var(--svg-figure)" />
      <line x1="38" y1="24" x2="38" y2="52" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      {/* Front leg bent ~90° */}
      <line x1="38" y1="52" x2="26" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26" y1="60" x2="20" y2="74" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rear leg — foot on bench */}
      <line x1="38" y1="52" x2="56" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rear knee near floor */}
      <line x1="38" y1="52" x2="52" y2="62" stroke="var(--svg-figure)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  sumo_squat: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: wide stance standing, DB between legs */}
      <circle cx="45" cy="12" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="18" x2="45" y2="50" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="28" x2="28" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="36" x2="45" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="28" x2="62" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="62" y1="36" x2="45" y2="50" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="50" x2="28" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="50" x2="62" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="39" y="48" width="12" height="5" rx="2" fill="#f97316" />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: wide squat, thighs parallel */}
      <circle cx="155" cy="22" r="6" fill="var(--svg-figure)" />
      <line x1="155" y1="28" x2="155" y2="48" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="36" x2="136" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="136" y1="44" x2="128" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="36" x2="174" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="174" y1="44" x2="182" y2="60" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="48" x2="136" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="48" x2="174" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="149" y="46" width="12" height="5" rx="2" fill="#f97316" />
    </svg>
  ),
  step_up: (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Step/box */}
      <rect x="42" y="44" width="50" height="20" rx="2" fill="var(--svg-equipment)" />
      {/* Person stepping up — one foot on box, one on floor */}
      <circle cx="44" cy="14" r="6" fill="var(--svg-figure)" />
      <line x1="44" y1="20" x2="44" y2="44" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="30" x2="28" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={24} y1={36} x2={24} y2={48} />
      <line x1="44" y1="30" x2="60" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={64} y1={36} x2={64} y2={48} />
      {/* Front foot on box */}
      <line x1="44" y1="44" x2="52" y2="44" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Back foot on floor */}
      <line x1="44" y1="44" x2="30" y2="56" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="56" x2="18" y2="64" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Up arrow */}
      <path d="M44 40 L44 28 M40 32 L44 28 L48 32" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calf_raise: (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      {/* START: standing flat */}
      <circle cx="45" cy="12" r="6" fill="var(--svg-figure)" />
      <line x1="45" y1="18" x2="45" y2="54" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="54" x2="36" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="54" x2="54" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="30" x2="26" y2="36" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={22} y1={36} x2={22} y2={48} />
      <line x1="45" y1="30" x2="64" y2={36} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={68} y1={36} x2={68} y2={48} />
      {/* Arrow */}
      <path d="M93,39 L107,39 M102,34 L108,39 L102,44" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* END: raised on toes */}
      <circle cx="155" cy="6" r="6" fill="var(--svg-figure)" />
      <line x1="155" y1="12" x2="155" y2="48" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
      <line x1="155" y1="48" x2="148" y2="58" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="148" y1="58" x2="144" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="48" x2="162" y2="58" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="162" y1="58" x2="166" y2="70" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="24" x2="136" y2="30" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={132} y1={30} x2={132} y2={42} />
      <line x1="155" y1="24" x2="174" y2={30} stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      <Dumbbell x1={178} y1={30} x2={178} y2={42} />
    </svg>
  ),
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

export function ExerciseSvg({ svgKey }) {
  const svg = SVGS[svgKey]
  if (!svg) {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <circle cx="50" cy="25" r="10" fill="var(--svg-figure)" />
        <line x1="50" y1="35" x2="50" y2="62" stroke="var(--svg-figure)" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="45" x2="34" y2="55" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="45" x2="66" y2="55" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="62" x2="42" y2="76" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="62" x2="58" y2="76" stroke="var(--svg-figure)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  return svg
}
