import { useEffect, useRef } from "react";
import {
  Accessibility,
  Contrast,
  Moon,
  Sun,
  Type,
  Volume2,
  Wind,
  X,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import type { TextScale } from "../lib/types";

function Toggle({
  checked,
  onChange,
  label,
  desc,
  icon,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-2xl border border-line bg-surface p-3 text-left transition-colors hover:bg-surface-2"
    >
      <span className="mt-0.5 text-brand">{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{desc}</span>
      </span>
      <span
        className={`relative mt-1 h-6 w-11 flex-none rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function AccessibilityPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const s = useSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const scales: { key: TextScale; label: string }[] = [
    { key: "normal", label: "A" },
    { key: "large", label: "A" },
    { key: "xl", label: "A" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Accessibility settings"
    >
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative h-full w-full max-w-sm overflow-y-auto bg-bg p-5 shadow-lift outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Accessibility className="text-brand" size={22} /> Comfort & access
          </h2>
          <button
            onClick={onClose}
            className="btn-quiet -mr-2 h-10 w-10 !p-0"
            aria-label="Close accessibility settings"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-sm text-muted">
          Adjust EasePal to feel comfortable for your body and eyes. Your choices
          are saved on this device.
        </p>

        <div className="mb-4 rounded-2xl border border-line bg-surface p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
            <Type size={18} className="text-brand" /> Text size
          </div>
          <div className="flex gap-2">
            {scales.map((sc, i) => (
              <button
                key={sc.key}
                onClick={() => s.set("textScale", sc.key)}
                aria-pressed={s.textScale === sc.key}
                className={`flex-1 rounded-xl border py-2 font-semibold transition-colors ${
                  s.textScale === sc.key
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-surface hover:bg-surface-2"
                }`}
                style={{ fontSize: `${1 + i * 0.2}rem` }}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <Toggle
            checked={s.theme === "dark"}
            onChange={() => s.toggleTheme()}
            label="Dark mode"
            desc="Softer, low-glare colors for tired eyes."
            icon={s.theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          />
          <Toggle
            checked={s.highContrast}
            onChange={(v) => s.set("highContrast", v)}
            label="High contrast"
            desc="Stronger text and borders for readability."
            icon={<Contrast size={20} />}
          />
          <Toggle
            checked={s.reducedMotion}
            onChange={(v) => s.set("reducedMotion", v)}
            label="Reduce motion"
            desc="Turn off animations and gentle transitions."
            icon={<Wind size={20} />}
          />
          <Toggle
            checked={s.readAloud}
            onChange={(v) => s.set("readAloud", v)}
            label="Read aloud"
            desc="Speak exercise instructions so you can follow hands-free."
            icon={<Volume2 size={20} />}
          />
        </div>

        <button
          onClick={s.reset}
          className="mt-5 w-full text-sm text-muted hover:text-ink link-underline"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
