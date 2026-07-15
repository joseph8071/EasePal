import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Heart, Layers, TriangleAlert } from "lucide-react";
import { EXERCISES } from "../lib/exercises";
import { AREA_LABEL, INTENSITY_LABEL } from "../lib/routines";
import { Pill, Reveal } from "../components/ui";
import { PoseArt } from "../components/PoseArt";
import type { BodyArea, Exercise } from "../lib/types";

const ALL = "all" as const;

export function Library() {
  const [area, setArea] = useState<BodyArea | typeof ALL>(ALL);
  const [openId, setOpenId] = useState<string | null>(null);

  // Only offer filters for areas that actually appear in the library.
  const areas = useMemo(() => {
    const set = new Set<BodyArea>();
    EXERCISES.forEach((e) => e.areas.forEach((a) => set.add(a)));
    return [...set];
  }, []);

  const list = useMemo(
    () =>
      area === ALL
        ? EXERCISES
        : EXERCISES.filter((e) => e.areas.includes(area)),
    [area]
  );

  return (
    <div className="container-page py-10">
      <Reveal>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
          <Layers size={24} />
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          The moves
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Every stretch EasePal draws from — each one gentle, illustrated, and
          written with a clear “how it should feel” and “stop if.” Browse freely;
          nothing here is a prescription.
        </p>
      </Reveal>

      {/* Filters */}
      <Reveal delay={0.05}>
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip
            active={area === ALL}
            onClick={() => setArea(ALL)}
            label={`All (${EXERCISES.length})`}
          />
          {areas.map((a) => (
            <FilterChip
              key={a}
              active={area === a}
              onClick={() => setArea(a)}
              label={AREA_LABEL[a]}
            />
          ))}
        </div>
      </Reveal>

      {/* Grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ex, i) => (
          <Reveal key={ex.id} delay={Math.min((i % 3) * 0.05, 0.15)}>
            <Card
              ex={ex}
              open={openId === ex.id}
              onToggle={() =>
                setOpenId((cur) => (cur === ex.id ? null : ex.id))
              }
            />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 rounded-3xl bg-brand p-8 text-center text-white sm:p-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Prefer we build the routine for you?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-white/85">
            Answer a few gentle questions and EasePal sequences these into a
            session shaped to how you feel today.
          </p>
          <Link
            to="/safety"
            className="btn mt-6 h-12 bg-white px-7 text-brand-ink hover:brightness-95"
          >
            Build my routine
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "border-brand bg-brand text-white shadow-soft"
          : "border-line bg-surface text-ink hover:border-brand/50 hover:bg-brand-soft"
      }`}
    >
      {label}
    </button>
  );
}

function Card({
  ex,
  open,
  onToggle,
}: {
  ex: Exercise;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card card-hover flex h-full flex-col overflow-hidden">
      <div className="flex items-start gap-4 p-5">
        <div className="h-20 w-20 flex-none">
          <PoseArt pose={ex.pose} className="h-full w-full" animate />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold leading-tight">
            {ex.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill tone="brand">{INTENSITY_LABEL[ex.intensity]}</Pill>
            <Pill tone="muted">{ex.durationSec}s</Pill>
          </div>
        </div>
      </div>

      <p className="px-5 text-sm text-muted">{ex.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 px-5">
        {ex.areas.map((a) => (
          <span
            key={a}
            className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted"
          >
            {AREA_LABEL[a]}
          </span>
        ))}
      </div>

      <button
        onClick={onToggle}
        aria-expanded={open}
        className="mt-4 flex items-center justify-between gap-2 border-t border-line px-5 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-surface-2"
      >
        {open ? "Hide details" : "How to do it"}
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="animate-fade-up space-y-4 border-t border-line p-5">
          <ol className="space-y-2">
            {ex.steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand-ink">
                  {i + 1}
                </span>
                <span className="text-ink/90">{s}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-xl bg-brand-soft/50 p-3 text-sm">
            <p className="flex gap-2">
              <Heart size={15} className="mt-0.5 flex-none text-brand" />
              <span>
                <span className="font-semibold text-brand-ink">Feels like: </span>
                <span className="text-ink/90">{ex.howItShouldFeel}</span>
              </span>
            </p>
          </div>
          <div className="rounded-xl bg-accent-soft p-3 text-sm">
            <p className="flex gap-2">
              <TriangleAlert size={15} className="mt-0.5 flex-none text-accent" />
              <span>
                <span className="font-semibold text-accent">Stop if </span>
                <span className="text-ink/90">{ex.stopIf}</span>
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
