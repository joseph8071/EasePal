import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Heart, ShieldCheck } from "lucide-react";
import { Reveal } from "../components/ui";

const ITEMS = [
  {
    id: "not-medical",
    text: "I understand EasePal is not medical advice and does not diagnose or treat any condition.",
  },
  {
    id: "stop",
    text: "I will stop right away if pain becomes sharp, worsening, or unsafe.",
  },
  {
    id: "consult",
    text: "I will consult a doctor or physiotherapist if I have an injury or medical concern.",
  },
  {
    id: "listen",
    text: "I'll move gently, breathe, and listen to my body — this is about comfort, not pushing.",
  },
];

export function Safety() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const allChecked = ITEMS.every((i) => checked[i.id]);

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div className="text-center">
            <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
              <ShieldCheck size={26} />
            </span>
            <h1 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
              A gentle check before we start
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              Because this touches how your body feels, let's agree on a few
              things first. Please read and confirm each one.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card mt-8 divide-y divide-line">
            {ITEMS.map((item) => {
              const on = !!checked[item.id];
              return (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-4 p-5 transition-colors hover:bg-surface-2/60"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() =>
                      setChecked((c) => ({ ...c, [item.id]: !c[item.id] }))
                    }
                  />
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg border-2 transition-all ${
                      on
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-surface"
                    }`}
                  >
                    {on && <Check size={18} strokeWidth={3} />}
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink">
                    {item.text}
                  </span>
                </label>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-6 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm text-muted">
            <p className="flex gap-2">
              <Heart size={16} className="mt-0.5 flex-none text-accent" />
              <span>
                People with injuries or chronic conditions may need adjusted
                stretching techniques and should talk to a doctor or
                physiotherapist about any health concerns
                <span className="text-muted/70"> (Mayo Clinic)</span>.
              </span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
            <Link to="/" className="text-sm text-muted link-underline">
              Not now — take me back
            </Link>
            <button
              disabled={!allChecked}
              onClick={() => navigate("/start")}
              className="btn-primary h-12 w-full px-6 text-base sm:w-auto"
            >
              I understand — continue <ArrowRight size={18} />
            </button>
          </div>
          {!allChecked && (
            <p className="mt-3 text-center text-xs text-muted sm:text-right">
              Please confirm all four to continue.
            </p>
          )}
        </Reveal>
      </div>
    </div>
  );
}
