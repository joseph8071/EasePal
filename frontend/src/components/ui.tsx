import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useSettings } from "../context/SettingsContext";

/** Fade-up on mount, but instant when reduced motion is on. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { reducedMotion } = useSettings();
  if (reducedMotion) return <div className={className}>{children}</div>;
  const variants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function Pill({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "accent" | "muted";
}) {
  const tones = {
    brand: "bg-brand-soft text-brand-ink",
    accent: "bg-accent-soft text-accent",
    muted: "bg-surface-2 text-muted",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** A row of choice buttons used for numeric ratings. */
export function RatingScale({
  min,
  max,
  value,
  onChange,
  lowLabel,
  highLabel,
  ariaLabel,
}: {
  min: number;
  max: number;
  value: number | null;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
  ariaLabel: string;
}) {
  const options = [];
  for (let i = min; i <= max; i++) options.push(i);
  return (
    <div role="group" aria-label={ariaLabel}>
      <div className="flex flex-wrap gap-2">
        {options.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(n)}
              className={`h-11 min-w-11 rounded-xl border px-3 text-base font-semibold transition-all ${
                active
                  ? "border-brand bg-brand text-white shadow-soft"
                  : "border-line bg-surface text-ink hover:border-brand/50 hover:bg-brand-soft"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      {(lowLabel || highLabel) && (
        <div className="mt-1.5 flex justify-between text-xs text-muted">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-2 font-display text-3xl font-semibold text-ink">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}
