import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { load, save } from "../lib/storage";
import type { Settings, TextScale, ThemeMode } from "../lib/types";

const DEFAULTS: Settings = {
  theme: "light",
  textScale: "normal",
  highContrast: false,
  reducedMotion:
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  readAloud: false,
  reminderEnabled: false,
  reminderTime: "09:00",
  reminderDays: [1, 2, 3, 4, 5],
};

const SCALE_VALUE: Record<TextScale, string> = {
  normal: "1",
  large: "1.15",
  xl: "1.3",
};

interface SettingsCtx extends Settings {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  toggleTheme: () => void;
  reset: () => void;
  speak: (text: string) => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULTS,
    ...load<Partial<Settings>>("settings", {}),
  }));

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", settings.theme);
    root.setAttribute("data-contrast", settings.highContrast ? "high" : "normal");
    root.setAttribute("data-motion", settings.reducedMotion ? "reduced" : "full");
    root.style.setProperty("--text-scale", SCALE_VALUE[settings.textScale]);
    save("settings", settings);
  }, [settings]);

  const value = useMemo<SettingsCtx>(
    () => ({
      ...settings,
      set: (key, val) => setSettings((s) => ({ ...s, [key]: val })),
      toggleTheme: () =>
        setSettings((s) => ({
          ...s,
          theme: (s.theme === "light" ? "dark" : "light") as ThemeMode,
        })),
      reset: () => setSettings(DEFAULTS),
      speak: (text: string) => {
        if (!settings.readAloud) return;
        try {
          const synth = window.speechSynthesis;
          if (!synth) return;
          synth.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.rate = 0.95;
          u.pitch = 1;
          synth.speak(u);
        } catch {
          /* speech synthesis unavailable */
        }
      },
    }),
    [settings]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
