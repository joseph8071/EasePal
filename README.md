# EasePal

**A gentle mobility companion for recovery.**

EasePal helps you build simple stretching routines, track your comfort, and
approach movement with patience — so you always know what feels safe and where
to begin. It is **not a medical tool**; it's a calm, supportive companion for the
vulnerable stretch of time after an injury.

> EasePal started after a car accident left me temporarily limited in my
> mobility. Recovery made me realize how frustrating it is to not know what
> movement is safe, where to start, or how to stay consistent. So I built a
> gentle companion that meets you at your comfort level and never pushes past it.

## What it does

- **Safety first** — a required safety screen before any routine, and a clear
  “stop if…” cue on every movement. Any red flag caps the whole session at the
  gentlest level.
- **Guided, personalized flow** — a short, kind onboarding (area, goal,
  intensity, time, experience, red flags) builds a routine shaped to *today*.
- **“Why this routine?”** — every session explains its own reasoning in plain
  language, so the personalization feels real and trustworthy.
- **A premium, calm player** — one move at a time, with a timer, how it should
  feel, a “stop if…” warning, prev/next controls, and hands-free read-aloud.
- **Progress you can feel** — comfort before/after each session, mobility over
  time, sessions and streaks, visualized with gentle charts.
- **A recovery journal** — a soft daily check-in for body, mood, and energy,
  because recovery is emotional too.
- **Built for real bodies** — large text, high contrast, reduced motion,
  read-aloud, big touch targets, keyboard navigation, and a light/dark theme.

## Tech

- **React + TypeScript + Vite**
- **Tailwind CSS** for the design system (themeable via CSS variables)
- **Framer Motion** for reduced-motion-aware animation
- **Recharts** for progress visualizations
- **Web Speech API** for read-aloud instructions
- **Local-first** — everything is stored on-device in `localStorage`. No account,
  no backend, no data leaves your browser.

## Run it

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build    # outputs to frontend/dist
npm run preview
```

## Project structure

```
frontend/src
├─ lib/            # exercises, routine-matching engine, storage, types
├─ context/        # SettingsContext (accessibility) + AppStateContext (progress/journal)
├─ components/     # layout, UI primitives, accessibility panel, pose illustrations
└─ pages/          # Landing, Safety, Onboarding, RoutinePreview, RoutinePlayer,
                   # Progress, Journal, CaseStudy, NotFound
```

The routine engine (`src/lib/routines.ts`) is intentionally simple and fully
transparent: it filters the curated exercise library by area and intensity,
respects any red flags, bookends the session with breathing and rest, and packs
movements to fit your time budget — then explains each choice back to you.

> The earlier version was a MongoDB + OpenAI chat app. EasePal is now a
> self-contained, offline-capable wellness companion. The legacy `backend/`
> folder is kept for reference but is no longer required to run the app.

## Safety

EasePal does not diagnose or treat any condition. People with injuries or chronic
conditions may need adjusted stretching techniques and should talk to a doctor or
physiotherapist about any health concerns.

## Author

Joseph Alfartosy — [josephalfartosy.ca](https://josephalfartosy.ca)

## License

MIT — see [MIT-LICENCE](MIT-LICENCE).
