/**
 * The printed card's wave is a twisted ribbon rendered as a fine ruled mesh:
 * many short strokes spanning the band, long where the ribbon faces the viewer
 * and short where it turns edge-on. This rebuilds that surface in SVG.
 */

type Ribbon = {
  id: string;
  phase: number;
  freq: number;
  twist: number;
  amplitude: number;
  baseline: number;
  half: number;
  opacity: number;
  width: number;
};

const RIBBONS: Ribbon[] = [
  { id: "a", phase: 0.55, freq: 1.0, twist: 1.35, amplitude: 50, baseline: 182, half: 38, opacity: 1, width: 1.9 },
  { id: "b", phase: 3.35, freq: 1.45, twist: 1.95, amplitude: 34, baseline: 232, half: 27, opacity: 0.85, width: 1.5 },
];

const X_START = -30;
const X_END = 830;
const STEP = 3.5;

function curveY(x: number, ribbon: Ribbon) {
  const t = (x - X_START) / (X_END - X_START);
  return (
    ribbon.baseline +
    ribbon.amplitude * Math.sin(t * Math.PI * 2 * ribbon.freq + ribbon.phase) +
    ribbon.amplitude * 0.22 * Math.sin(t * Math.PI * 2 * ribbon.freq * 2.3 + ribbon.phase * 0.8)
  );
}

function halfThickness(x: number, ribbon: Ribbon) {
  const t = (x - X_START) / (X_END - X_START);
  return 2 + ribbon.half * Math.abs(Math.sin(t * Math.PI * 2 * ribbon.twist + ribbon.phase * 1.4));
}

function buildRibbon(ribbon: Ribbon) {
  const strokes: { x: number; y1: number; y2: number; o: number }[] = [];
  const top: string[] = [];
  const bottom: string[] = [];
  for (let x = X_START; x <= X_END; x += STEP) {
    const centre = curveY(x, ribbon);
    const half = halfThickness(x, ribbon);
    strokes.push({ x, y1: centre - half, y2: centre + half, o: 0.3 + 0.7 * (half / (ribbon.half + 2)) });
    top.push(`${x === X_START ? "M" : "L"}${x.toFixed(1)} ${(centre - half).toFixed(1)}`);
    bottom.push(`${x === X_START ? "M" : "L"}${x.toFixed(1)} ${(centre + half).toFixed(1)}`);
  }
  return { strokes, top: top.join(" "), bottom: bottom.join(" ") };
}

const RIBBON_STROKES = RIBBONS.map((ribbon) => ({ ribbon, ...buildRibbon(ribbon) }));

export function CardWave() {
  return (
    <svg className="nfc-card__wave" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden>
      <defs>
        {RIBBONS.map((ribbon) => (
          <linearGradient key={ribbon.id} id={`mesh-${ribbon.id}`} gradientUnits="userSpaceOnUse" x1="-30" y1="0" x2="830" y2="0">
            <stop offset="0%" stopColor="#2fa3d4" stopOpacity="0" />
            <stop offset="9%" stopColor="#1f92c6" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#08547f" stopOpacity="1" />
            <stop offset="52%" stopColor="#0f78b4" stopOpacity="1" />
            <stop offset="74%" stopColor="#2a9ed1" stopOpacity="0.95" />
            <stop offset="92%" stopColor="#7fd0ee" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#cdeefb" stopOpacity="0" />
          </linearGradient>
        ))}
        <linearGradient id="meshWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfeaf9" stopOpacity="0.03" />
          <stop offset="65%" stopColor="#9adcf4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#cdeefb" stopOpacity="0.38" />
        </linearGradient>
      </defs>

      <rect x="0" y="238" width="800" height="62" fill="url(#meshWash)" />

      {RIBBON_STROKES.map(({ ribbon, strokes, top, bottom }) => (
        <g key={ribbon.id} opacity={ribbon.opacity}>
          {/* soft body keeps the ruled surface reading as one ribbon */}
          <path
            d={`${top} L830 300 L-30 300 Z`}
            fill={`url(#mesh-${ribbon.id})`}
            opacity="0.16"
          />
          <g stroke={`url(#mesh-${ribbon.id})`} strokeWidth={ribbon.width} strokeLinecap="round">
            {strokes.map((s) => (
              <line key={`${ribbon.id}-${s.x}`} x1={s.x} y1={s.y1} x2={s.x} y2={s.y2} opacity={s.o} />
            ))}
          </g>
          <path d={top} fill="none" stroke={`url(#mesh-${ribbon.id})`} strokeWidth="1.8" strokeOpacity="0.95" />
          <path d={bottom} fill="none" stroke={`url(#mesh-${ribbon.id})`} strokeWidth="1" strokeOpacity="0.5" />
        </g>
      ))}
    </svg>
  );
}
