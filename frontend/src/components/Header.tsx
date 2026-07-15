import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Accessibility, Leaf, Menu, X } from "lucide-react";
import { AccessibilityPanel } from "./AccessibilityPanel";

const NAV = [
  { to: "/start", label: "Start" },
  { to: "/moves", label: "Moves" },
  { to: "/progress", label: "Progress" },
  { to: "/journal", label: "Journal" },
  { to: "/case-study", label: "Case study" },
];

export function Header() {
  const [a11y, setA11y] = useState(false);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="EasePal home"
            onClick={() => setMenu(false)}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-soft">
              <Leaf size={20} />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              EasePal
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-soft text-brand-ink"
                      : "text-muted hover:bg-surface-2 hover:text-ink"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setA11y(true)}
              className="btn-ghost h-10 px-3"
              aria-label="Open accessibility settings"
            >
              <Accessibility size={18} />
              <span className="hidden sm:inline">Access</span>
            </button>
            <Link
              to="/safety"
              className="btn-primary hidden h-10 sm:inline-flex"
            >
              Begin
            </Link>
            <button
              className="btn-ghost h-10 w-10 !p-0 md:hidden"
              onClick={() => setMenu((m) => !m)}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menu && (
          <nav
            className="border-t border-line bg-bg px-5 py-3 md:hidden"
            aria-label="Mobile"
          >
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenu(false)}
                className={`block rounded-xl px-4 py-3 text-base font-medium ${
                  pathname === n.to
                    ? "bg-brand-soft text-brand-ink"
                    : "text-ink hover:bg-surface-2"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/safety"
              onClick={() => setMenu(false)}
              className="btn-primary mt-2 w-full"
            >
              Begin a session
            </Link>
          </nav>
        )}
      </header>

      <AccessibilityPanel open={a11y} onClose={() => setA11y(false)} />
    </>
  );
}
