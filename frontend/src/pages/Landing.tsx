import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookHeart,
  Flame,
  HeartPulse,
  LineChart,
  ListChecks,
  Play,
  ShieldCheck,
  Sparkles,
  Accessibility,
} from "lucide-react";
import { Pill, Reveal } from "../components/ui";
import { PoseArt } from "../components/PoseArt";
import { useApp } from "../context/AppStateContext";
import { computeStreak } from "../lib/storage";
import type { Pose } from "../lib/types";

const HERO_POSES: Pose[] = ["breathe", "cat-cow", "child", "side-bend"];

const FEATURES = [
  {
    icon: ListChecks,
    title: "A guided, gentle flow",
    body: "Answer a few kind questions — where you feel tight, how much time you have, how deep to go — and get a routine shaped to today, not a generic list.",
  },
  {
    icon: Sparkles,
    title: "“Why this routine?”",
    body: "Every session explains itself in plain language, so the personalization feels real and you always know what you're doing and why.",
  },
  {
    icon: HeartPulse,
    title: "A premium, calm player",
    body: "One move at a time, with a timer, how it should feel, a clear “stop if…” cue, and read-aloud so you can follow hands-free.",
  },
  {
    icon: LineChart,
    title: "Progress you can feel",
    body: "Track comfort before and after, mobility over time, sessions and streaks — proof that patience is working.",
  },
  {
    icon: BookHeart,
    title: "A recovery journal",
    body: "A soft daily check-in for how your body feels, what got easier, and what you avoided. Recovery is emotional too.",
  },
  {
    icon: Accessibility,
    title: "Built for real bodies",
    body: "Large text, high contrast, reduced motion, read-aloud, and big touch targets — because comfort shouldn't be an afterthought.",
  },
];

export function Landing() {
  const { sessions, routine } = useApp();
  const returning = sessions.length > 0;
  const streak = computeStreak(sessions.map((s) => s.date));

  return (
    <>
      {returning && (
        <section className="container-page pt-6">
          <Reveal>
            <div className="card card-hover flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-ink">
                  <Flame size={22} />
                </span>
                <div>
                  <p className="font-semibold text-ink">
                    Welcome back
                    {streak > 0 ? ` — ${streak}-day streak` : ""}.
                  </p>
                  <p className="text-sm text-muted">
                    {streak > 0
                      ? "A few gentle minutes keeps it going."
                      : "Pick up where you left off, no pressure."}
                  </p>
                </div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Link to="/progress" className="btn-ghost h-11 flex-1 px-4 sm:flex-none">
                  View progress
                </Link>
                <Link
                  to={routine ? "/routine" : "/safety"}
                  className="btn-primary h-11 flex-1 px-5 sm:flex-none"
                >
                  <Play size={16} /> {routine ? "Resume routine" : "Begin"}
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute -left-24 top-[-10%] h-96 w-96 rounded-full bg-brand-soft blur-3xl" />
          <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-accent-soft blur-3xl" />
        </div>

        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Reveal>
              <Pill>
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                A gentle mobility companion
              </Pill>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Recovery is hard.
                <br />
                <span className="text-brand">Starting shouldn't be.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                EasePal helps you build simple stretching routines, track your
                comfort, and approach movement with patience — so you always know
                what feels safe and where to begin.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/safety" className="btn-primary h-12 px-6 text-base">
                  Begin a session <ArrowRight size={18} />
                </Link>
                <Link to="/case-study" className="btn-ghost h-12 px-6 text-base">
                  Read the story
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                <ShieldCheck size={16} className="text-brand" />
                Not a medical tool. No account needed. Your data stays on your
                device.
              </p>
            </Reveal>
          </div>

          {/* Breathing visual */}
          <Reveal delay={0.15}>
            <div className="relative mx-auto max-w-md">
              <div className="card relative overflow-hidden p-8">
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="h-56 w-56 rounded-full bg-brand-soft/70 [animation:breathe_6s_ease-in-out_infinite] motion-reduce:animate-none" />
                </div>
                <div className="relative grid grid-cols-2 gap-4">
                  {HERO_POSES.map((p) => (
                    <div
                      key={p}
                      className="rounded-2xl border border-line bg-surface/70 p-3 backdrop-blur"
                    >
                      <PoseArt pose={p} className="h-24 w-full" animate />
                    </div>
                  ))}
                </div>
                <div className="relative mt-6 rounded-2xl bg-ink/90 p-4 text-center text-sm text-white">
                  Breathe in for 4 · out for 6
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Origin story */}
      <section className="container-page py-8">
        <Reveal>
          <div className="card relative overflow-hidden p-8 sm:p-12">
            <div className="mx-auto max-w-3xl">
              <span className="eyebrow">Why EasePal exists</span>
              <p className="mt-5 font-display text-2xl leading-relaxed text-ink sm:text-3xl">
                EasePal started after a car accident left me temporarily limited
                in my mobility. Recovery made me realize how frustrating it is to
                not know what movement is safe, where to start, or how to stay
                consistent.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                So I built a gentle companion — not a medical tool — that helps
                you create simple stretching routines, track your comfort, and
                approach recovery with patience instead of pressure.
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm font-medium text-brand-ink">
                <span className="h-px w-8 bg-brand" />
                Joseph Alfartosy, founder
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="container-page py-16">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Three calm steps
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Check in safely",
              d: "A short safety screen, then a few gentle questions about how your body feels today.",
            },
            {
              n: "02",
              t: "Follow your routine",
              d: "A calm, one-move-at-a-time player with timing, comfort cues, and clear stop signals.",
            },
            {
              n: "03",
              t: "Notice the change",
              d: "Log how you feel, watch mobility improve, and keep a gentle recovery journal.",
            },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="card card-hover h-full p-6">
                <div className="font-display text-4xl font-semibold text-brand/30">
                  {s.n}
                </div>
                <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Thoughtful by design</span>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Everything is built around care
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className="card card-hover h-full p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-ink">
                  <f.icon size={22} />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand p-10 text-center text-white sm:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              aria-hidden="true"
            >
              <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/40 blur-2xl" />
              <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/30 blur-2xl" />
            </div>
            <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">
              Start where you are today
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/85">
              Five minutes is enough. EasePal meets you at your comfort level and
              never pushes you past it.
            </p>
            <Link
              to="/safety"
              className="btn relative mt-8 h-12 bg-white px-7 text-base text-brand-ink shadow-lift hover:brightness-95"
            >
              Begin gently <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
