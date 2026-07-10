import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Gauge,
  Lightbulb,
  Play,
  RefreshCw,
  Target,
} from "lucide-react";
import { useApp } from "../context/AppStateContext";
import { AREA_LABEL, INTENSITY_LABEL } from "../lib/routines";
import { Pill, Reveal } from "../components/ui";
import { PoseArt } from "../components/PoseArt";

function mins(sec: number) {
  const m = Math.round(sec / 60);
  return `${m} min`;
}

export function RoutinePreview() {
  const { routine } = useApp();
  if (!routine) return <Navigate to="/start" replace />;

  const { intake } = routine;

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="eyebrow">Your routine is ready</span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {routine.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>
              <Target size={14} /> {AREA_LABEL[intake.area]}
            </Pill>
            <Pill tone="muted">
              <Gauge size={14} /> {INTENSITY_LABEL[intake.intensity]}
            </Pill>
            <Pill tone="muted">
              <Clock size={14} /> {mins(routine.totalSeconds)} ·{" "}
              {routine.steps.length} moves
            </Pill>
          </div>
        </Reveal>

        {/* Why this routine */}
        <Reveal delay={0.06}>
          <div className="card mt-7 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line bg-brand-soft/50 px-6 py-4">
              <Lightbulb size={18} className="text-brand-ink" />
              <h2 className="font-display text-lg font-semibold text-brand-ink">
                Why this routine?
              </h2>
            </div>
            <div className="space-y-3 p-6">
              {routine.why.map((line, i) => (
                <p key={i} className="leading-relaxed text-ink/90">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal delay={0.1}>
          <h2 className="mt-10 font-display text-2xl font-semibold">
            Your sequence
          </h2>
        </Reveal>
        <ol className="mt-5 space-y-3">
          {routine.steps.map((s, i) => (
            <Reveal key={s.exercise.id + i} delay={Math.min(i * 0.04, 0.3)}>
              <li className="card flex items-center gap-4 p-4">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-surface-2 font-semibold text-muted">
                  {i + 1}
                </span>
                <div className="h-16 w-16 flex-none">
                  <PoseArt pose={s.exercise.pose} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-ink">
                    {s.exercise.name}
                  </h3>
                  <p className="truncate text-sm text-muted">
                    {s.exercise.summary}
                  </p>
                </div>
                <span className="flex-none rounded-full bg-surface-2 px-3 py-1 text-sm font-medium text-muted">
                  {s.seconds}s
                </span>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* CTA */}
        <Reveal delay={0.12}>
          <div className="sticky bottom-4 z-10 mt-8">
            <div className="card flex flex-col items-center gap-3 p-4 shadow-lift sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-ink">Ready when you are</p>
                <p className="text-sm text-muted">
                  Find a comfortable, clear space. You can pause anytime.
                </p>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Link to="/start" className="btn-ghost h-12 flex-1 px-5 sm:flex-none">
                  <RefreshCw size={17} /> Adjust
                </Link>
                <Link
                  to="/routine/play"
                  className="btn-primary h-12 flex-1 px-6 sm:flex-none"
                >
                  <Play size={18} /> Start routine <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
