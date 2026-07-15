import { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";

const NAMES = [
  "brand",
  "accent",
  "ink",
  "muted",
  "line",
  "surface",
] as const;

type Token = (typeof NAMES)[number];

/**
 * Recharts needs concrete color strings, but our palette lives in CSS variables
 * that change with theme + contrast. Resolve them to rgb() strings and refresh
 * whenever the relevant settings change.
 */
export function useTokens(): Record<Token, string> {
  const { theme, highContrast } = useSettings();
  const [colors, setColors] = useState<Record<Token, string>>(() =>
    read()
  );
  useEffect(() => {
    // Wait a frame so the data-* attributes are applied before reading.
    const id = requestAnimationFrame(() => setColors(read()));
    return () => cancelAnimationFrame(id);
  }, [theme, highContrast]);
  return colors;
}

function read(): Record<Token, string> {
  const style = getComputedStyle(document.documentElement);
  const out = {} as Record<Token, string>;
  for (const name of NAMES) {
    const raw = style.getPropertyValue(`--c-${name}`).trim();
    out[name] = raw ? `rgb(${raw})` : "#128577";
  }
  return out;
}
