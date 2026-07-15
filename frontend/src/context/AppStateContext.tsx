import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { load, save, uid } from "../lib/storage";
import type {
  FeedbackEntry,
  Intake,
  JournalEntry,
  Routine,
  SessionLog,
} from "../lib/types";
import { buildRoutine } from "../lib/routines";

interface AppStateCtx {
  intake: Intake | null;
  routine: Routine | null;
  sessions: SessionLog[];
  journal: JournalEntry[];
  feedback: FeedbackEntry[];
  setIntake: (intake: Intake) => Routine;
  logSession: (log: Omit<SessionLog, "id" | "date">) => void;
  addJournal: (entry: Omit<JournalEntry, "id" | "date">) => void;
  addFeedback: (entry: Omit<FeedbackEntry, "id" | "date">) => void;
  clearAll: () => void;
}

const Ctx = createContext<AppStateCtx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [intake, setIntakeState] = useState<Intake | null>(() =>
    load<Intake | null>("intake", null)
  );
  const [sessions, setSessions] = useState<SessionLog[]>(() =>
    load<SessionLog[]>("sessions", [])
  );
  const [journal, setJournal] = useState<JournalEntry[]>(() =>
    load<JournalEntry[]>("journal", [])
  );
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(() =>
    load<FeedbackEntry[]>("feedback", [])
  );

  const routine = useMemo(
    () => (intake ? buildRoutine(intake) : null),
    [intake]
  );

  const setIntake = useCallback((next: Intake): Routine => {
    setIntakeState(next);
    save("intake", next);
    return buildRoutine(next);
  }, []);

  const logSession = useCallback(
    (log: Omit<SessionLog, "id" | "date">) => {
      setSessions((prev) => {
        const next = [
          ...prev,
          { ...log, id: uid(), date: Date.now() },
        ];
        save("sessions", next);
        return next;
      });
    },
    []
  );

  const addJournal = useCallback(
    (entry: Omit<JournalEntry, "id" | "date">) => {
      setJournal((prev) => {
        const next = [{ ...entry, id: uid(), date: Date.now() }, ...prev];
        save("journal", next);
        return next;
      });
    },
    []
  );

  const addFeedback = useCallback(
    (entry: Omit<FeedbackEntry, "id" | "date">) => {
      setFeedback((prev) => {
        const next = [{ ...entry, id: uid(), date: Date.now() }, ...prev];
        save("feedback", next);
        return next;
      });
    },
    []
  );

  const clearAll = useCallback(() => {
    setIntakeState(null);
    setSessions([]);
    setJournal([]);
    setFeedback([]);
    save("intake", null);
    save("sessions", []);
    save("journal", []);
    save("feedback", []);
  }, []);

  const value = useMemo<AppStateCtx>(
    () => ({
      intake,
      routine,
      sessions,
      journal,
      feedback,
      setIntake,
      logSession,
      addJournal,
      addFeedback,
      clearAll,
    }),
    [
      intake,
      routine,
      sessions,
      journal,
      feedback,
      setIntake,
      logSession,
      addJournal,
      addFeedback,
      clearAll,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppStateCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}
