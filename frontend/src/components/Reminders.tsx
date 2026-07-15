import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BellRing, X } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useApp } from "../context/AppStateContext";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function doneToday(dates: number[]): boolean {
  const now = new Date();
  return dates.some((d) => {
    const x = new Date(d);
    return (
      x.getFullYear() === now.getFullYear() &&
      x.getMonth() === now.getMonth() &&
      x.getDate() === now.getDate()
    );
  });
}

/** Is a reminder due right now (enabled, today is a chosen day, past the time)? */
function isDue(
  enabled: boolean,
  time: string,
  days: number[]
): boolean {
  if (!enabled) return false;
  const now = new Date();
  if (!days.includes(now.getDay())) return false;
  const [h, m] = time.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  return now >= target;
}

/* --------------------------- Settings card ------------------------------- */

export function ReminderCard() {
  const s = useSettings();

  const enable = async (on: boolean) => {
    s.set("reminderEnabled", on);
    if (on && "Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        /* permission flow unavailable */
      }
    }
  };

  const toggleDay = (d: number) => {
    const has = s.reminderDays.includes(d);
    s.set(
      "reminderDays",
      has
        ? s.reminderDays.filter((x) => x !== d)
        : [...s.reminderDays, d].sort()
    );
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-ink">
            <Bell size={20} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">
              Gentle reminders
            </h3>
            <p className="text-sm text-muted">
              A soft daily nudge to move — consistency, not pressure.
            </p>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={s.reminderEnabled}
          aria-label="Enable gentle reminders"
          onClick={() => enable(!s.reminderEnabled)}
          className={`relative mt-1 h-6 w-11 flex-none rounded-full transition-colors ${
            s.reminderEnabled ? "bg-brand" : "bg-line"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              s.reminderEnabled ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {s.reminderEnabled && (
        <div className="mt-5 animate-fade-up space-y-4">
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink">Remind me at</span>
            <input
              type="time"
              value={s.reminderTime}
              onChange={(e) => s.set("reminderTime", e.target.value)}
              className="rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-brand"
            />
          </label>
          <div>
            <span className="text-sm font-medium text-ink">On these days</span>
            <div className="mt-2 flex gap-1.5">
              {DAY_LABELS.map((lbl, d) => {
                const on = s.reminderDays.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    aria-pressed={on}
                    aria-label={`Toggle day ${d}`}
                    className={`h-10 flex-1 rounded-xl border text-sm font-semibold transition-all ${
                      on
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-surface text-muted hover:bg-surface-2"
                    }`}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-muted">
            {"Notification" in window && Notification.permission === "granted"
              ? "Browser notifications are on — you'll get a gentle ping while EasePal is open."
              : "Reminders show as a soft banner in EasePal. Allow notifications for a browser ping too."}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Global nudge ----------------------------- */

export function ReminderNudge() {
  const s = useSettings();
  const { sessions } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [, tick] = useState(0);
  const notified = useRef(false);

  // Re-evaluate every minute so the nudge appears when the time arrives.
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const due =
    isDue(s.reminderEnabled, s.reminderTime, s.reminderDays) &&
    !doneToday(sessions.map((x) => x.date));

  // Best-effort browser notification, once per due window while open.
  useEffect(() => {
    if (
      due &&
      !notified.current &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification("EasePal", {
          body: "A gentle nudge — ready for a few minutes of movement?",
        });
        notified.current = true;
      } catch {
        /* ignore */
      }
    }
    if (!due) notified.current = false;
  }, [due]);

  if (!due || dismissed) return null;

  return (
    <div className="border-b border-brand/20 bg-brand-soft">
      <div className="container-page flex items-center gap-3 py-3">
        <BellRing size={18} className="flex-none text-brand-ink" />
        <p className="flex-1 text-sm text-brand-ink">
          A gentle nudge — you haven't moved today. Even five minutes counts.
        </p>
        <Link to="/safety" className="btn-primary h-9 flex-none px-4 text-xs">
          Start now
        </Link>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss reminder"
          className="flex-none rounded-full p-1.5 text-brand-ink/70 hover:bg-brand/10"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
