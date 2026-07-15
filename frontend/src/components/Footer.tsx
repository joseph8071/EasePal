import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useApp } from "../context/AppStateContext";

export function Footer() {
  const { sessions, journal, feedback, clearAll } = useApp();
  const hasData = sessions.length + journal.length + feedback.length > 0;

  const reset = () => {
    if (
      window.confirm(
        "Clear all EasePal data on this device — sessions, journal, and feedback? This can't be undone."
      )
    ) {
      clearAll();
    }
  };

  return (
    <footer className="mt-24 border-t border-line bg-surface-2/60">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
              <Leaf size={18} />
            </span>
            <span className="font-display text-lg font-semibold">EasePal</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            A gentle mobility companion for recovery. Move a little, feel a
            little better, and be patient with yourself.
          </p>
        </div>

        <nav aria-label="Explore">
          <h3 className="text-sm font-semibold text-ink">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" to="/start">Start a session</Link></li>
            <li><Link className="hover:text-ink" to="/moves">Browse the moves</Link></li>
            <li><Link className="hover:text-ink" to="/progress">Progress</Link></li>
            <li><Link className="hover:text-ink" to="/journal">Recovery journal</Link></li>
            <li><Link className="hover:text-ink" to="/feedback">Share feedback</Link></li>
            <li><Link className="hover:text-ink" to="/case-study">Case study</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold text-ink">A note on safety</h3>
          <p className="mt-3 text-sm text-muted">
            EasePal is a wellness companion, not a medical device. It does not
            diagnose or treat. If you have an injury or health concern, talk to a
            doctor or physiotherapist.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Made by</h3>
          <p className="mt-3 text-sm text-muted">
            Joseph Alfartosy — built after a car accident reshaped how I think
            about movement and recovery.
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} EasePal. Move gently.</span>
          <span className="flex items-center gap-3">
            <span>Not medical advice · Your data stays on your device.</span>
            {hasData && (
              <button onClick={reset} className="link-underline hover:text-ink">
                Clear my data
              </button>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
