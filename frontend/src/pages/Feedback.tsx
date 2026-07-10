import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, MessagesSquare, Sparkles } from "lucide-react";
import { useApp } from "../context/AppStateContext";
import { RatingScale, Reveal } from "../components/ui";
import type { FeedbackEntry } from "../lib/types";

type Choice = "yes" | "partly" | "no" | "maybe";

const empty = {
  easyToFollow: null as number | null,
  safetyClear: null as FeedbackEntry["safetyClear"] | null,
  wouldReturn: null as FeedbackEntry["wouldReturn"] | null,
  confusing: "",
  improve: "",
};

export function Feedback() {
  const { feedback, addFeedback } = useApp();
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);

  const canSave =
    form.easyToFollow !== null &&
    form.safetyClear !== null &&
    form.wouldReturn !== null;

  const submit = () => {
    if (!canSave) return;
    addFeedback({
      easyToFollow: form.easyToFollow!,
      safetyClear: form.safetyClear!,
      wouldReturn: form.wouldReturn!,
      confusing: form.confusing.trim(),
      improve: form.improve.trim(),
    });
    setForm(empty);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  // --- live summary ---
  const n = feedback.length;
  const avgEase =
    n > 0
      ? feedback.reduce((a, f) => a + f.easyToFollow, 0) / n
      : 0;
  const pctReturn =
    n > 0
      ? Math.round(
          (feedback.filter((f) => f.wouldReturn === "yes").length / n) * 100
        )
      : 0;
  const pctSafety =
    n > 0
      ? Math.round(
          (feedback.filter((f) => f.safetyClear === "yes").length / n) * 100
        )
      : 0;
  const comments = feedback
    .filter((f) => f.improve || f.confusing)
    .slice(0, 5);

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
            <MessagesSquare size={24} />
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            Help shape EasePal
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            You tried it — now tell me the truth. It takes about 30 seconds and
            genuinely changes what gets built next.
          </p>
        </Reveal>

        {n > 0 && (
          <Reveal delay={0.05}>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Mini value={avgEase.toFixed(1)} label="avg. ease (of 5)" />
              <Mini value={`${pctReturn}%`} label="would use again" />
              <Mini value={`${pctSafety}%`} label="safety felt clear" />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <div className="card mt-6 space-y-7 p-6">
            <div>
              <p className="font-semibold text-ink">
                Was the routine easy to follow?
              </p>
              <p className="mb-3 mt-1 text-sm text-muted">
                1 = confusing, 5 = effortless.
              </p>
              <RatingScale
                ariaLabel="Ease of following the routine"
                min={1}
                max={5}
                value={form.easyToFollow}
                onChange={(v) => setForm((f) => ({ ...f, easyToFollow: v }))}
                lowLabel="Confusing"
                highLabel="Effortless"
              />
            </div>

            <ChoiceRow
              label="Did the safety language feel clear?"
              options={[
                { key: "yes", label: "Yes, clear" },
                { key: "partly", label: "Somewhat" },
                { key: "no", label: "Not really" },
              ]}
              value={form.safetyClear}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  safetyClear: v as FeedbackEntry["safetyClear"],
                }))
              }
            />

            <ChoiceRow
              label="Would you use EasePal again?"
              options={[
                { key: "yes", label: "Yes" },
                { key: "maybe", label: "Maybe" },
                { key: "no", label: "No" },
              ]}
              value={form.wouldReturn}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  wouldReturn: v as FeedbackEntry["wouldReturn"],
                }))
              }
            />

            <Field
              label="Did anything feel confusing?"
              value={form.confusing}
              onChange={(v) => setForm((f) => ({ ...f, confusing: v }))}
              placeholder="Be honest — what tripped you up?"
            />
            <Field
              label="What would make it more helpful?"
              value={form.improve}
              onChange={(v) => setForm((f) => ({ ...f, improve: v }))}
              placeholder="Anything you wish it did…"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={submit}
                disabled={!canSave}
                className="btn-primary h-12 px-6"
              >
                <Check size={18} /> Submit feedback
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-brand-ink animate-fade-up">
                  <Sparkles size={16} /> Thank you — this really helps.
                </span>
              )}
              {!canSave && (
                <span className="text-sm text-muted">
                  Answer the first three to submit.
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {comments.length > 0 && (
          <>
            <Reveal delay={0.1}>
              <h2 className="mt-10 font-display text-2xl font-semibold">
                What testers said
              </h2>
            </Reveal>
            <div className="mt-4 space-y-3">
              {comments.map((f) => (
                <Reveal key={f.id}>
                  <blockquote className="card p-5">
                    {f.improve && (
                      <p className="text-ink/90">“{f.improve}”</p>
                    )}
                    {f.confusing && (
                      <p className="mt-2 text-sm text-muted">
                        Confusing: {f.confusing}
                      </p>
                    )}
                    <footer className="mt-3 text-xs text-muted">
                      {new Date(f.date).toLocaleDateString()} · ease{" "}
                      {f.easyToFollow}/5 · would return: {f.wouldReturn}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </>
        )}

        <Reveal delay={0.12}>
          <p className="mt-8 text-center text-sm text-muted">
            Responses are stored on your device.{" "}
            <Link to="/case-study" className="link-underline">
              See how feedback shaped the app →
            </Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="font-display text-2xl font-semibold text-brand-ink">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

function ChoiceRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: Choice; label: string }[];
  value: string | null;
  onChange: (v: Choice) => void;
}) {
  return (
    <div>
      <p className="mb-3 font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.key;
          return (
            <button
              key={o.key}
              onClick={() => onChange(o.key)}
              aria-pressed={active}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                active
                  ? "border-brand bg-brand text-white shadow-soft"
                  : "border-line bg-surface text-ink hover:border-brand/50 hover:bg-brand-soft"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold text-ink">{label}</span>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-surface p-3 text-ink outline-none focus:border-brand"
      />
    </label>
  );
}
