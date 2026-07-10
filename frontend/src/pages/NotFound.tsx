import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <span className="grid mx-auto h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
        <Compass size={28} />
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold">
        Let's find your footing
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-muted">
        This page wandered off. Let's get you back to somewhere gentle.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-ghost h-12 px-6">
          Go home
        </Link>
        <Link to="/safety" className="btn-primary h-12 px-6">
          Start a session
        </Link>
      </div>
    </div>
  );
}
