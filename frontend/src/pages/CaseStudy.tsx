import { Link } from "react-router-dom";
import {
  ArrowRight,
  Accessibility,
  Code2,
  Compass,
  HeartHandshake,
  Lightbulb,
  MessagesSquare,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { Pill, Reveal } from "../components/ui";
import { useApp } from "../context/AppStateContext";

const STACK = [
  ["React + TypeScript", "Typed, component-driven UI"],
  ["Tailwind CSS", "A calm, consistent design system"],
  ["Framer Motion", "Gentle, reduced-motion-aware animation"],
  ["Recharts", "Progress and comfort visualizations"],
  ["Local-first storage", "Private by default — data stays on device"],
  ["Web Speech API", "Hands-free read-aloud instructions"],
];

const NEEDS = [
  "Know what movement is actually safe right now",
  "A clear place to start, without overwhelm",
  "Support to stay consistent through slow recovery",
  "Reassurance and safety cues, not diagnosis",
  "Accessibility for stiff, tired, or limited bodies",
];

const DECISIONS = [
  {
    icon: ShieldCheck,
    title: "Safety before capability",
    body: "A required safety screen and per-exercise “stop if…” cues frame EasePal as a companion, not a clinician. Any red flag caps the whole session at the gentlest level.",
  },
  {
    icon: Lightbulb,
    title: "Explain every recommendation",
    body: "A “Why this routine?” panel turns personalization into something you can read and trust, instead of a black box that just spits out exercises.",
  },
  {
    icon: Accessibility,
    title: "Design for real bodies",
    body: "Large text, high contrast, reduced motion, read-aloud, and large touch targets are first-class — not buried in a settings menu no one finds.",
  },
  {
    icon: HeartHandshake,
    title: "Honor the emotional side",
    body: "A recovery journal and encouraging, non-judgmental language acknowledge that losing independence is hard, and consistency deserves celebration.",
  },
];

const FEEDBACK = [
  {
    q: "Was the routine easy to follow?",
    change:
      "Added a one-move-at-a-time player with a timer and progress dots, so no one loses their place.",
  },
  {
    q: "Did the safety language feel clear?",
    change:
      "Rewrote every cue in plain, warm language and made the safety screen an explicit, required step.",
  },
  {
    q: "Would you use this again?",
    change:
      "Introduced streaks, before/after comfort tracking, and a journal to make returning feel rewarding.",
  },
];

export function CaseStudy() {
  const { feedback } = useApp();
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <Reveal>
          <Pill>Case study</Pill>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            EasePal: designing software for the vulnerable moments after injury
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            After a car accident disrupted my mobility, I built EasePal to
            understand how software could support consistency, confidence, and
            gentle movement during recovery. Rebuilding it taught me to design
            around safety, accessibility, user feedback, and the emotional
            frustration of losing independence.
          </p>
        </Reveal>

        {/* Problem + origin */}
        <Section icon={Compass} eyebrow="The problem" title="Recovery is disorienting">
          <p>
            When you're recovering from an injury, the hardest question isn't
            “what's the optimal workout?” — it's “what is safe to do right now,
            and where do I even start?” Generic fitness apps assume a capable,
            confident body and push toward performance. That's exactly the wrong
            posture for someone who just lost some of their independence.
          </p>
        </Section>

        <Section
          icon={HeartHandshake}
          eyebrow="Personal origin"
          title="Why I care about this one"
        >
          <p>
            EasePal started after a car accident left me temporarily limited in
            my mobility. Recovery made me realize how frustrating it is to not
            know what movement is safe, where to start, or how to stay
            consistent. I wanted a gentle companion — not a medical tool — that
            met me at my comfort level and never pushed past it.
          </p>
        </Section>

        {/* Needs */}
        <Section icon={MessagesSquare} eyebrow="User needs" title="What people in recovery actually want">
          <ul className="grid gap-2 sm:grid-cols-2">
            {NEEDS.map((n) => (
              <li
                key={n}
                className="flex items-start gap-2 rounded-2xl border border-line bg-surface p-3 text-[15px] text-ink/90"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                {n}
              </li>
            ))}
          </ul>
        </Section>

        {/* Decisions */}
        <Section icon={Lightbulb} eyebrow="Design decisions" title="The choices that shaped it">
          <div className="grid gap-4 sm:grid-cols-2">
            {DECISIONS.map((d) => (
              <div key={d.title} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-ink">
                  <d.icon size={20} />
                </span>
                <h3 className="mt-3 font-semibold text-ink">{d.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Feedback */}
        <Section
          icon={MessagesSquare}
          eyebrow="User testing"
          title="What changed after feedback"
        >
          <p className="mb-4">
            I tested EasePal with a small group and asked what confused them,
            whether the safety language felt clear, and what would make it more
            helpful. Their answers reshaped the app:
          </p>
          <div className="space-y-3">
            {FEEDBACK.map((f) => (
              <div key={f.q} className="card p-5">
                <p className="font-semibold text-ink">“{f.q}”</p>
                <p className="mt-2 flex gap-2 text-sm text-muted">
                  <ArrowRight size={16} className="mt-0.5 flex-none text-brand" />
                  {f.change}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col items-start gap-3 rounded-2xl border border-line bg-brand-soft/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink/90">
              {feedback.length > 0
                ? `${feedback.length} ${feedback.length === 1 ? "person has" : "people have"} shared feedback so far — and it keeps shaping what's next.`
                : "Testing is ongoing — your feedback becomes part of this story."}
            </p>
            <Link to="/feedback" className="btn-primary h-11 flex-none px-5">
              <MessagesSquare size={17} /> Add your feedback
            </Link>
          </div>
        </Section>

        {/* Tech */}
        <Section icon={Code2} eyebrow="Tech stack" title="Built to be fast, private, and calm">
          <div className="grid gap-3 sm:grid-cols-2">
            {STACK.map(([name, desc]) => (
              <div
                key={name}
                className="flex items-baseline justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
              >
                <span className="font-semibold text-ink">{name}</span>
                <span className="text-right text-sm text-muted">{desc}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Next */}
        <Section icon={Rocket} eyebrow="What's next" title="What I'd improve next">
          <ul className="space-y-2">
            {[
              "Physiotherapist-reviewed routines and optional clinician sharing.",
              "Video/GIF demonstrations alongside the illustrated poses.",
              "Adaptive difficulty that responds to your comfort trend over time.",
              "Reminders and a weekly recovery summary you can export.",
            ].map((x) => (
              <li key={x} className="flex items-start gap-2 text-ink/90">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                {x}
              </li>
            ))}
          </ul>
        </Section>

        {/* CTA */}
        <Reveal>
          <div className="mt-12 rounded-3xl bg-brand p-8 text-center text-white sm:p-12">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              See it for yourself
            </h2>
            <p className="mx-auto mt-2 max-w-md text-white/85">
              The best way to understand EasePal is to feel how gentle it is.
            </p>
            <Link
              to="/safety"
              className="btn mt-6 h-12 bg-white px-7 text-brand-ink hover:brightness-95"
            >
              Try a session <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-brand">
            <Icon size={18} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {eyebrow}
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        <div className="mt-4 leading-relaxed text-ink/90 [&_p]:text-muted">
          {children}
        </div>
      </section>
    </Reveal>
  );
}
