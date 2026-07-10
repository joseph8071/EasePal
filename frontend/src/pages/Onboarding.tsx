import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Gauge,
  Sparkles,
  Target,
} from "lucide-react";
import { useApp } from "../context/AppStateContext";
import { AREA_LABEL, GOAL_LABEL, INTENSITY_LABEL } from "../lib/routines";
import type {
  BodyArea,
  Experience,
  Goal,
  Intensity,
} from "../lib/types";

type Draft = {
  area?: BodyArea;
  goal?: Goal;
  intensity?: Intensity;
  minutes?: 5 | 10 | 15 | 20;
  experience?: Experience;
  redFlags: string[];
};

const AREAS = Object.keys(AREA_LABEL) as BodyArea[];
const GOALS = Object.keys(GOAL_LABEL) as Goal[];
const INTENSITIES = Object.keys(INTENSITY_LABEL) as Intensity[];

const INTENSITY_HINT: Record<Intensity, string> = {
  gentle: "Light and easy — barely a stretch.",
  moderate: "A noticeable but comfortable stretch.",
  deeper: "A fuller stretch, still never painful.",
};

const EXP: { key: Experience; label: string; hint: string }[] = [
  { key: "new", label: "New to this", hint: "I'm just getting started." },
  { key: "some", label: "Some experience", hint: "I stretch now and then." },
  { key: "confident", label: "Confident", hint: "I move regularly." },
];

const RED_FLAGS = [
  "Recent injury or surgery",
  "Sharp or shooting pain",
  "Numbness or tingling",
  "Dizziness or feeling faint",
  "A clinician told me to limit movement",
];

const TIMES: (5 | 10 | 15 | 20)[] = [5, 10, 15, 20];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ redFlags: [] });
  const { setIntake } = useApp();
  const navigate = useNavigate();

  const steps = [
    {
      key: "area",
      icon: Target,
      title: "What feels tight today?",
      subtitle: "Pick the area you'd most like to ease.",
      valid: !!draft.area,
    },
    {
      key: "goal",
      icon: Sparkles,
      title: "What are you hoping for?",
      subtitle: "This shapes how the routine is built.",
      valid: !!draft.goal,
    },
    {
      key: "intensity",
      icon: Gauge,
      title: "How deep should we go?",
      subtitle: "You can always change this next time.",
      valid: !!draft.intensity,
    },
    {
      key: "minutes",
      icon: Clock,
      title: "How much time do you have?",
      subtitle: "Even five minutes counts.",
      valid: !!draft.minutes,
    },
    {
      key: "experience",
      icon: Activity,
      title: "How familiar is this for you?",
      subtitle: "So we can pace the cues right.",
      valid: !!draft.experience,
    },
    {
      key: "redFlags",
      icon: Check,
      title: "Any red flags to know about?",
      subtitle: "Optional — but it helps us keep you safe.",
      valid: true,
    },
  ] as const;

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    const intake = {
      area: draft.area!,
      goal: draft.goal!,
      intensity: draft.intensity!,
      minutes: draft.minutes!,
      experience: draft.experience!,
      redFlags: draft.redFlags,
      createdAt: Date.now(),
    };
    setIntake(intake);
    navigate("/routine");
  };

  const back = () => (step === 0 ? navigate("/safety") : setStep((s) => s - 1));

  const toggleFlag = (f: string) =>
    setDraft((d) => ({
      ...d,
      redFlags: d.redFlags.includes(f)
        ? d.redFlags.filter((x) => x !== f)
        : [...d.redFlags, f],
    }));

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        {/* progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div key={current.key} className="animate-fade-up">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
            <current.icon size={24} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold">
            {current.title}
          </h1>
          <p className="mt-2 text-muted">{current.subtitle}</p>

          <div className="mt-7">
            {current.key === "area" && (
              <Grid>
                {AREAS.map((a) => (
                  <OptionCard
                    key={a}
                    label={AREA_LABEL[a]}
                    active={draft.area === a}
                    onClick={() => setDraft((d) => ({ ...d, area: a }))}
                  />
                ))}
              </Grid>
            )}

            {current.key === "goal" && (
              <Grid>
                {GOALS.map((g) => (
                  <OptionCard
                    key={g}
                    label={GOAL_LABEL[g]}
                    active={draft.goal === g}
                    onClick={() => setDraft((d) => ({ ...d, goal: g }))}
                  />
                ))}
              </Grid>
            )}

            {current.key === "intensity" && (
              <div className="space-y-3">
                {INTENSITIES.map((i) => (
                  <OptionRow
                    key={i}
                    label={INTENSITY_LABEL[i]}
                    hint={INTENSITY_HINT[i]}
                    active={draft.intensity === i}
                    onClick={() => setDraft((d) => ({ ...d, intensity: i }))}
                  />
                ))}
              </div>
            )}

            {current.key === "minutes" && (
              <Grid cols={2}>
                {TIMES.map((t) => (
                  <OptionCard
                    key={t}
                    label={`${t} minutes`}
                    active={draft.minutes === t}
                    onClick={() => setDraft((d) => ({ ...d, minutes: t }))}
                  />
                ))}
              </Grid>
            )}

            {current.key === "experience" && (
              <div className="space-y-3">
                {EXP.map((e) => (
                  <OptionRow
                    key={e.key}
                    label={e.label}
                    hint={e.hint}
                    active={draft.experience === e.key}
                    onClick={() =>
                      setDraft((d) => ({ ...d, experience: e.key }))
                    }
                  />
                ))}
              </div>
            )}

            {current.key === "redFlags" && (
              <div className="space-y-3">
                {RED_FLAGS.map((f) => {
                  const on = draft.redFlags.includes(f);
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFlag(f)}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                        on
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-surface hover:bg-surface-2"
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 flex-none place-items-center rounded-md border-2 ${
                          on
                            ? "border-accent bg-accent text-white"
                            : "border-line"
                        }`}
                      >
                        {on && <Check size={15} strokeWidth={3} />}
                      </span>
                      <span className="font-medium text-ink">{f}</span>
                    </button>
                  );
                })}
                <p className="rounded-2xl bg-surface-2/60 p-4 text-sm text-muted">
                  {draft.redFlags.length > 0
                    ? "Thanks for telling us. We'll keep every movement at the gentlest level and remind you to check with a professional."
                    : "Nothing to flag? Great — leave these unchecked and continue."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* nav */}
        <div className="mt-9 flex items-center justify-between">
          <button onClick={back} className="btn-ghost h-12 px-5">
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={next}
            disabled={!current.valid}
            className="btn-primary h-12 px-6"
          >
            {step === steps.length - 1 ? "Build my routine" : "Continue"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Grid({
  children,
  cols = 3,
}: {
  children: React.ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-3 ${
        cols === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
      }`}
    >
      {children}
    </div>
  );
}

function OptionCard({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[64px] items-center justify-center rounded-2xl border p-4 text-center text-base font-semibold transition-all ${
        active
          ? "border-brand bg-brand text-white shadow-soft"
          : "border-line bg-surface text-ink hover:border-brand/50 hover:bg-brand-soft"
      }`}
    >
      {label}
    </button>
  );
}

function OptionRow({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-brand bg-brand-soft"
          : "border-line bg-surface hover:bg-surface-2"
      }`}
    >
      <span
        className={`grid h-6 w-6 flex-none place-items-center rounded-full border-2 ${
          active ? "border-brand bg-brand text-white" : "border-line"
        }`}
      >
        {active && <Check size={14} strokeWidth={3} />}
      </span>
      <span>
        <span className="block font-semibold text-ink">{label}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
    </button>
  );
}
