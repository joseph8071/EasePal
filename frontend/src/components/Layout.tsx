import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReminderNudge } from "./Reminders";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <ReminderNudge />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
