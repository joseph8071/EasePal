import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  RotateCcw,
  TriangleAlert,
  Volume2,
  X,
} from "lucide-react";
import { useApp } from "../context/AppStateContext";
import { useSettings } from "../context/SettingsContext";
import { AREA_LABEL } from "../lib/routines";
import { PoseArt } from "../components/PoseArt";
import { RatingScale } from "../components/ui";

type Phase = "intro" | "active" | "done";

export function RoutinePlayer() {
  const { routine, logSession } = useApp();
  const { speak, readAloud } = useSettings();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);

  const [painBefore, setPainBefore] = useState<number | null>(null);
  const [painAfter, setPainAfter] = useState<number | null>(null);
  const [mobility, setMobility] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const steps = routine?.steps ?? [];
  const step = steps[index];

  // Keep the latest values available to the interval without re-subscribing.
  const goNextRef = useRef<() => void>(() => {});

  const goTo = useCallback(
    (i: number) => {
      if (!steps[i]) return;
      setIndex(i);
      setSecondsLeft(steps[i].seconds);
      setRunning(true);
    },
    [steps]
  );

  const goNext = useCallback(() => {
    if (index < steps.length - 1) {
      goTo(index + 1);
    } else {
      setRunning(false);
      setPhase("done");
    }
  }, [index, steps.length, goTo]);
  goNextRef.current = goNext;

  // Countdown tick.
  useEffect(() => {
    if (phase !== "active" || !running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Advance on the next frame to avoid setState-in-render warnings.
          setTimeout(() => goNextRef.current(), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, running, index]);

  // Read the current move aloud when it changes (if enabled).
  useEffect(() => {
    if (phase !== "active" || !step) return;
    speak(`${step.exercise.name}. ${step.exercise.howItShouldFeel}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  if (!routine) return <Navigate to="/start" replace />;

  const begin = () => {
    setIndex(0);
    setSecondsLeft(steps[0].seconds);
    setRunning(true);
    setPhase("active");
  };

  const finish = () => {
    logSession({
      routineTitle: routine.title,
      area: routine.intake.area,
      minutes: Math.round(routine.totalSeconds / 60),
      painBefore: painBefore ?? 0,
      painAfter: painAfter ?? 0,
      mobility: mobility ?? 3,
      note: note.trim(),
    });
    navigate("/progress");
  };

  /* --------------------------------- Intro -------------------------------- */
  if (phase === "intro") {
    return (
      <Shell onExit={() => navigate("/routine")}>
        <div className="mx-auto max-w-lg text-center">
          <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
            <Heart size={26} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">
            Before we begin
          </h1>
          <p className="mt-2 text-muted">
            A quick, honest check-in so you can see how this session helps.
          </p>
          <div className="card mt-7 p-6 text-left">
            <p className="font-semibold text-ink">
              How much discomfort are you feeling right now?
            </p>
            <p className="mb-4 mt-1 text-sm text-muted">
              In your {AREA_LABEL[routine.intake.area].toLowerCase()}, from 0
              (none) to 10 (a lot).
            </p>
            <RatingScale
              ariaLabel="Discomfort before the session"
              min={0}
              max={10}
              value={painBefore}
              onChange={setPainBefore}
              lowLabel="No discomfort"
              highLabel="A lot"
            />
          </div>
          <button
            onClick={begin}
            disabled={painBefore === null}
            className="btn-primary mt-6 h-12 w-full px-6 text-base"
          >
            <Play size={18} /> Start the routine
          </button>
          <p className="mt-3 text-xs text-muted">
            You can pause or leave at any time.
          </p>
        </div>
      </Shell>
    );
  }

  /* --------------------------------- Done --------------------------------- */
  if (phase === "done") {
    const delta =
      painBefore !== null && painAfter !== null ? painBefore - painAfter : null;
    return (
      <Shell onExit={() => navigate("/progress")}>
        <div className="mx-auto max-w-lg text-center">
          <span className="grid mx-auto h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-soft">
            <Check size={30} strokeWidth={3} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">
            Beautifully done.
          </h1>
          <p className="mt-2 text-muted">
            You showed up for yourself today. Let's capture how it felt.
          </p>

          <div className="card mt-7 space-y-6 p-6 text-left">
            <div>
              <p className="font-semibold text-ink">
                How's the discomfort now?
              </p>
              <p className="mb-3 mt-1 text-sm text-muted">Same 0–10 scale.</p>
              <RatingScale
                ariaLabel="Discomfort after the session"
                min={0}
                max={10}
                value={painAfter}
                onChange={setPainAfter}
                lowLabel="No discomfort"
                highLabel="A lot"
              />
              {delta !== null && painAfter !== null && (
                <p
                  className={`mt-3 rounded-xl px-3 py-2 text-sm font-medium ${
                    delta > 0
                      ? "bg-brand-soft text-brand-ink"
                      : "bg-surface-2 text-muted"
                  }`}
                >
                  {delta > 0
                    ? `That's ${delta} point${delta === 1 ? "" : "s"} easier than when you started. 🌿`
                    : delta === 0
                      ? "No change today — and that's okay. Consistency is what moves the needle."
                      : "Feeling more tender is a signal to rest and go gentler next time."}
                </p>
              )}
            </div>

            <div>
              <p className="font-semibold text-ink">
                How mobile does the area feel? (1–5)
              </p>
              <div className="mt-3">
                <RatingScale
                  ariaLabel="Mobility after the session"
                  min={1}
                  max={5}
                  value={mobility}
                  onChange={setMobility}
                  lowLabel="Stiff"
                  highLabel="Free"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="session-note"
                className="font-semibold text-ink"
              >
                A note to future you (optional)
              </label>
              <textarea
                id="session-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="What felt good? Anything to remember for next time?"
                className="mt-2 w-full rounded-2xl border border-line bg-surface p-3 text-ink outline-none focus:border-brand"
              />
            </div>
          </div>

          <button
            onClick={finish}
            disabled={painAfter === null}
            className="btn-primary mt-6 h-12 w-full px-6 text-base"
          >
            Save & see progress <ArrowRight size={18} />
          </button>
        </div>
      </Shell>
    );
  }

  /* -------------------------------- Active -------------------------------- */
  const total = step.seconds;
  const pct = total > 0 ? ((total - secondsLeft) / total) * 100 : 0;

  return (
    <Shell onExit={() => navigate("/routine")}>
      {/* progress dots */}
      <div className="mx-auto mb-6 flex max-w-3xl items-center gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s.exercise.id + i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < index ? "bg-brand" : i === index ? "bg-brand/60" : "bg-surface-2"
            }`}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        {/* Left: timer + pose */}
        <div className="flex flex-col items-center">
          <div className="relative grid place-items-center">
            <TimerRing pct={pct} />
            <div className="absolute grid place-items-center">
              <div className="h-40 w-40 rounded-full bg-brand-soft/60 [animation:breathe_6s_ease-in-out_infinite] motion-reduce:animate-none" />
            </div>
            <div className="absolute">
              <PoseArt pose={step.exercise.pose} className="h-32 w-32" animate />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-5xl font-semibold tabular-nums">
              {secondsLeft}s
            </div>
            <p className="mt-1 text-sm text-muted">
              Move {index + 1} of {steps.length}
            </p>
          </div>

          {/* controls */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="btn-ghost h-12 w-12 !p-0"
              aria-label="Previous move"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => setRunning((r) => !r)}
              className="btn-primary h-14 w-14 !p-0"
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={() => setSecondsLeft(step.seconds)}
              className="btn-ghost h-12 w-12 !p-0"
              aria-label="Restart this move"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={goNext}
              className="btn-ghost h-12 w-12 !p-0"
              aria-label="Next move"
            >
              <ChevronRight size={22} />
            </button>
          </div>
          <button
            onClick={() =>
              speak(
                `${step.exercise.name}. ${step.exercise.steps.join(". ")}. It should feel: ${step.exercise.howItShouldFeel}`
              )
            }
            className="btn-quiet mt-3 h-10"
          >
            <Volume2 size={17} /> Read steps aloud
          </button>
          {!readAloud && (
            <p className="mt-1 text-center text-xs text-muted">
              Tip: turn on “Read aloud” in Access for hands-free sessions.
            </p>
          )}
        </div>

        {/* Right: details */}
        <div>
          <p className="text-sm font-medium text-brand-ink">
            {step.exercise.areas.map((a) => AREA_LABEL[a]).join(" · ")}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold">
            {step.exercise.name}
          </h1>

          <ol className="mt-5 space-y-2.5">
            {step.exercise.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand-ink">
                  {i + 1}
                </span>
                <span className="text-ink/90">{s}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-2xl bg-brand-soft/50 p-4">
            <p className="flex gap-2 text-sm">
              <Heart size={16} className="mt-0.5 flex-none text-brand" />
              <span>
                <span className="font-semibold text-brand-ink">
                  How it should feel:{" "}
                </span>
                <span className="text-ink/90">
                  {step.exercise.howItShouldFeel}
                </span>
              </span>
            </p>
          </div>
          <div className="mt-3 rounded-2xl bg-accent-soft p-4">
            <p className="flex gap-2 text-sm">
              <TriangleAlert size={16} className="mt-0.5 flex-none text-accent" />
              <span>
                <span className="font-semibold text-accent">Stop if </span>
                <span className="text-ink/90">{step.exercise.stopIf}</span>
              </span>
            </p>
          </div>

          {index === steps.length - 1 && (
            <button
              onClick={goNext}
              className="btn-primary mt-6 h-12 w-full"
            >
              Finish session <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({
  children,
  onExit,
}: {
  children: React.ReactNode;
  onExit: () => void;
}) {
  return (
    <div className="container-page py-8">
      <div className="mb-6 flex justify-end">
        <button onClick={onExit} className="btn-quiet h-10">
          <X size={18} /> Exit
        </button>
      </div>
      {children}
      <div className="mt-10 text-center">
        <Link to="/" className="text-sm text-muted link-underline">
          Leave without saving
        </Link>
      </div>
    </div>
  );
}

function TimerRing({ pct }: { pct: number }) {
  const r = 130;
  const c = 2 * Math.PI * r;
  return (
    <svg width="288" height="288" viewBox="0 0 288 288" className="-rotate-90">
      <circle
        cx="144"
        cy="144"
        r={r}
        fill="none"
        stroke="rgb(var(--c-line))"
        strokeWidth="8"
      />
      <circle
        cx="144"
        cy="144"
        r={r}
        fill="none"
        stroke="rgb(var(--c-brand))"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}
