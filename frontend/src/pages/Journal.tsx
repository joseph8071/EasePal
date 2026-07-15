import { useState } from "react";
import { BookHeart, Check, Sparkles } from "lucide-react";
import { useApp } from "../context/AppStateContext";
import { Reveal } from "../components/ui";

const FACE = ["😔", "😕", "😐", "🙂", "😊"];
const ENERGY = ["🪫", "🔅", "🔆", "⚡", "🌟"];

const emptyForm = {
  bodyFeel: null as number | null,
  mood: null as number | null,
  energy: null as number | null,
  easier: "",
  harder: "",
  avoided: "",
  note: "",
};

export function Journal() {
  const { journal, addJournal } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  const canSave =
    form.bodyFeel !== null && form.mood !== null && form.energy !== null;

  const submit = () => {
    if (!canSave) return;
    addJournal({
      bodyFeel: form.bodyFeel!,
      mood: form.mood!,
      energy: form.energy!,
      easier: form.easier.trim(),
      harder: form.harder.trim(),
      avoided: form.avoided.trim(),
      note: form.note.trim(),
    });
    setForm(emptyForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
            <BookHeart size={24} />
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            Recovery journal
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            A soft daily check-in. Recovery is emotional too — noticing how you
            feel is part of getting better.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="card mt-8 space-y-7 p-6">
            <Scale
              label="How does your body feel today?"
              faces={FACE}
              value={form.bodyFeel}
              onChange={(v) => setForm((f) => ({ ...f, bodyFeel: v }))}
              low="Rough"
              high="Great"
            />
            <Scale
              label="Mood"
              faces={FACE}
              value={form.mood}
              onChange={(v) => setForm((f) => ({ ...f, mood: v }))}
              low="Low"
              high="Bright"
            />
            <Scale
              label="Energy"
              faces={ENERGY}
              value={form.energy}
              onChange={(v) => setForm((f) => ({ ...f, energy: v }))}
              low="Drained"
              high="Energized"
            />

            <Field
              label="What felt easier today?"
              value={form.easier}
              onChange={(v) => setForm((f) => ({ ...f, easier: v }))}
              placeholder="e.g. Getting out of bed, reaching overhead…"
            />
            <Field
              label="What felt harder?"
              value={form.harder}
              onChange={(v) => setForm((f) => ({ ...f, harder: v }))}
              placeholder="e.g. Sitting for long, turning my neck…"
            />
            <Field
              label="Any movement you avoided?"
              value={form.avoided}
              onChange={(v) => setForm((f) => ({ ...f, avoided: v }))}
              placeholder="It's okay to avoid — noticing helps."
            />
            <Field
              label="Anything else on your mind?"
              value={form.note}
              onChange={(v) => setForm((f) => ({ ...f, note: v }))}
              placeholder="A thought for future you…"
              multiline
            />

            <div className="flex items-center gap-3">
              <button
                onClick={submit}
                disabled={!canSave}
                className="btn-primary h-12 px-6"
              >
                <Check size={18} /> Save entry
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-brand-ink animate-fade-up">
                  <Sparkles size={16} /> Saved. Be proud of showing up.
                </span>
              )}
              {!canSave && (
                <span className="text-sm text-muted">
                  Set the three ratings to save.
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {journal.length > 0 && (
          <>
            <Reveal delay={0.08}>
              <h2 className="mt-10 font-display text-2xl font-semibold">
                Your entries
              </h2>
            </Reveal>
            <div className="mt-4 space-y-3">
              {journal.map((e) => (
                <Reveal key={e.id}>
                  <article className="card p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted">
                        {new Date(e.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-3 text-xl">
                        <span title="Body">{FACE[e.bodyFeel - 1]}</span>
                        <span title="Mood">{FACE[e.mood - 1]}</span>
                        <span title="Energy">{ENERGY[e.energy - 1]}</span>
                      </span>
                    </div>
                    {(e.easier || e.harder || e.avoided || e.note) && (
                      <dl className="mt-3 space-y-2 text-sm">
                        {e.easier && (
                          <Row term="Easier" desc={e.easier} />
                        )}
                        {e.harder && <Row term="Harder" desc={e.harder} />}
                        {e.avoided && <Row term="Avoided" desc={e.avoided} />}
                        {e.note && <Row term="Note" desc={e.note} />}
                      </dl>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Scale({
  label,
  faces,
  value,
  onChange,
  low,
  high,
}: {
  label: string;
  faces: string[];
  value: number | null;
  onChange: (v: number) => void;
  low: string;
  high: string;
}) {
  return (
    <div>
      <p className="mb-3 font-semibold text-ink">{label}</p>
      <div className="flex items-end justify-between gap-2">
        {faces.map((face, i) => {
          const n = i + 1;
          const active = value === n;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              aria-pressed={active}
              aria-label={`${label} ${n} of 5`}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-3 transition-all ${
                active
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-surface hover:bg-surface-2"
              }`}
            >
              <span className={`text-2xl transition-transform ${active ? "scale-110" : ""}`}>
                {face}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-muted">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold text-ink">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-line bg-surface p-3 text-ink outline-none focus:border-brand"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-line bg-surface p-3 text-ink outline-none focus:border-brand"
        />
      )}
    </label>
  );
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 flex-none font-semibold text-brand-ink">{term}</dt>
      <dd className="text-ink/90">{desc}</dd>
    </div>
  );
}
