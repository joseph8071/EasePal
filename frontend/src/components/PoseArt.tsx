import type { Pose } from "../lib/types";

/**
 * Lightweight SVG illustrations for each pose. They share a soft rounded figure
 * motif so a routine reads as one calm set. Colors come from CSS tokens, so they
 * adapt to theme + high-contrast automatically. When `animate` is set, the
 * figure performs a slow, reduced-motion-safe loop that suggests the stretch —
 * used where the pose is the focal point (the player, the hero).
 */
export function PoseArt({
  pose,
  className = "",
  animate = false,
}: {
  pose: Pose;
  className?: string;
  animate?: boolean;
}) {
  const motion = animate ? `pa-fig ${MOTION[pose]}` : "";
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="pa-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-brand-soft))" />
          <stop offset="100%" stopColor="rgb(var(--c-accent-soft))" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#pa-blob)" />
      {/* grounding shadow */}
      <ellipse cx="60" cy="103" rx="30" ry="5" fill="rgb(var(--c-ink) / 0.06)" />
      <g
        className={motion}
        stroke="rgb(var(--c-brand-ink))"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {POSE_PATHS[pose]}
      </g>
    </svg>
  );
}

/** Motion archetype per pose — chosen to gesture at the actual movement. */
const MOTION: Record<Pose, string> = {
  breathe: "pa-breathe",
  "neck-tilt": "pa-tilt",
  "shoulder-roll": "pa-reach",
  "chest-open": "pa-sway",
  "cat-cow": "pa-rock",
  child: "pa-breathe",
  "seated-twist": "pa-rock",
  "knee-hug": "pa-breathe",
  "figure-four": "pa-sway",
  hamstring: "pa-reach",
  calf: "pa-lean",
  quad: "pa-reach",
  "side-bend": "pa-lean",
};

const dot = (cx: number, cy: number, r = 2.4) => (
  <circle cx={cx} cy={cy} r={r} fill="rgb(var(--c-brand-ink))" stroke="none" />
);

const head = (cx: number, cy: number, r = 7) => (
  <circle cx={cx} cy={cy} r={r} fill="rgb(var(--c-brand-ink))" stroke="none" />
);

const POSE_PATHS: Record<Pose, JSX.Element> = {
  breathe: (
    <>
      {head(60, 40)}
      <path d="M60 48 V78" />
      <path d="M60 56 C48 52 40 56 36 64" />
      <path d="M60 56 C72 52 80 56 84 64" />
      <path d="M60 78 L50 96 M60 78 L70 96" />
      {dot(60, 56)}
    </>
  ),
  "neck-tilt": (
    <>
      {head(52, 40)}
      <path d="M56 46 C60 54 60 60 60 66" />
      <path d="M60 66 V84" />
      <path d="M60 70 L44 78 M60 70 L76 78" />
      <path d="M60 84 L52 100 M60 84 L68 100" />
      {dot(60, 70)}
    </>
  ),
  "shoulder-roll": (
    <>
      {head(60, 38)}
      <path d="M60 45 V80" />
      <path d="M60 54 C50 50 44 54 42 62 C41 68 46 70 50 66" />
      <path d="M60 54 C70 50 76 54 78 62 C79 68 74 70 70 66" />
      <path d="M60 80 L51 98 M60 80 L69 98" />
      {dot(60, 54)}
    </>
  ),
  "chest-open": (
    <>
      {head(60, 38)}
      <path d="M60 45 V80" />
      <path d="M60 54 C48 52 42 46 40 40" />
      <path d="M60 54 C72 52 78 46 80 40" />
      <path d="M60 80 L51 98 M60 80 L69 98" />
      {dot(60, 54)}
    </>
  ),
  "cat-cow": (
    <>
      {head(34, 60)}
      <path d="M40 60 C56 46 74 46 92 58" />
      <path d="M46 58 V78 M62 52 V78 M78 54 V78" />
      {dot(62, 52)}
    </>
  ),
  child: (
    <>
      {head(40, 62)}
      <path d="M44 64 C58 60 74 62 86 70" />
      <path d="M46 66 C44 74 46 78 52 80" />
      <path d="M86 70 C92 66 96 68 96 74" />
    </>
  ),
  "seated-twist": (
    <>
      {head(60, 38)}
      <path d="M60 45 C58 56 66 62 72 60" />
      <path d="M60 52 C50 54 46 60 46 66" />
      <path d="M52 74 H74 M52 74 L48 90 M74 74 L78 90" />
      <path d="M52 74 C54 66 58 62 60 60" />
      {dot(60, 52)}
    </>
  ),
  "knee-hug": (
    <>
      {head(30, 66)}
      <path d="M36 66 H74" />
      <path d="M74 66 C84 66 88 58 84 50" />
      <path d="M60 66 C66 60 66 52 60 48" />
      {dot(74, 66)}
    </>
  ),
  "figure-four": (
    <>
      {head(30, 62)}
      <path d="M36 62 H70" />
      <path d="M70 62 C80 60 82 50 76 44" />
      <path d="M58 62 L74 52" />
      {dot(70, 62)}
    </>
  ),
  hamstring: (
    <>
      {head(30, 60)}
      <path d="M36 60 H60" />
      <path d="M60 60 L92 48" />
      <path d="M60 60 C68 66 72 62 74 56" />
      {dot(60, 60)}
    </>
  ),
  calf: (
    <>
      {head(46, 34)}
      <path d="M50 40 L66 62" />
      <path d="M66 62 L58 90" />
      <path d="M66 62 L84 84" />
      <path d="M50 44 L38 40 M50 44 L40 52" />
      {dot(66, 62)}
    </>
  ),
  quad: (
    <>
      {head(58, 34)}
      <path d="M60 40 V70" />
      <path d="M60 70 L54 94" />
      <path d="M60 70 C72 74 76 66 70 58 C66 62 62 64 60 64" />
      <path d="M60 50 L44 54" />
      {dot(60, 70)}
    </>
  ),
  "side-bend": (
    <>
      {head(52, 34)}
      <path d="M54 40 C58 56 56 68 50 82" />
      <path d="M55 46 L74 30" />
      <path d="M52 60 L40 66" />
      <path d="M50 82 L44 98 M50 82 L58 96" />
      {dot(54, 48)}
    </>
  ),
};
