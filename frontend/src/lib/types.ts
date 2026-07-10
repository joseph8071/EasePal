export type BodyArea =
  | "neck"
  | "shoulders"
  | "upper-back"
  | "lower-back"
  | "hips"
  | "knees"
  | "full-body";

export type Goal =
  | "pain-relief"
  | "flexibility"
  | "posture"
  | "recovery"
  | "desk-stiffness";

export type Intensity = "gentle" | "moderate" | "deeper";

export type Experience = "new" | "some" | "confident";

export type Pose =
  | "neck-tilt"
  | "shoulder-roll"
  | "chest-open"
  | "cat-cow"
  | "child"
  | "seated-twist"
  | "knee-hug"
  | "figure-four"
  | "hamstring"
  | "calf"
  | "quad"
  | "side-bend"
  | "breathe";

export interface Exercise {
  id: string;
  name: string;
  areas: BodyArea[];
  intensity: Intensity;
  /** Recommended hold/active time in seconds. */
  durationSec: number;
  pose: Pose;
  summary: string;
  steps: string[];
  howItShouldFeel: string;
  stopIf: string;
}

/** The answers gathered during onboarding. */
export interface Intake {
  area: BodyArea;
  goal: Goal;
  intensity: Intensity;
  minutes: 5 | 10 | 15 | 20;
  experience: Experience;
  redFlags: string[];
  createdAt: number;
}

export interface RoutineStep {
  exercise: Exercise;
  /** Actual seconds allotted in this routine (may adapt to intensity). */
  seconds: number;
}

export interface Routine {
  title: string;
  subtitle: string;
  why: string[];
  totalSeconds: number;
  steps: RoutineStep[];
  intake: Intake;
}

/* ------------------------------- Persistence ------------------------------ */

export interface SessionLog {
  id: string;
  date: number;
  routineTitle: string;
  area: BodyArea;
  minutes: number;
  painBefore: number; // 0-10
  painAfter: number; // 0-10
  mobility: number; // 1-5
  note: string;
}

export interface JournalEntry {
  id: string;
  date: number;
  bodyFeel: number; // 1-5
  mood: number; // 1-5
  energy: number; // 1-5
  easier: string;
  harder: string;
  avoided: string;
  note: string;
}

export interface FeedbackEntry {
  id: string;
  date: number;
  easyToFollow: number; // 1-5
  safetyClear: "yes" | "partly" | "no";
  wouldReturn: "yes" | "maybe" | "no";
  confusing: string;
  improve: string;
}

export type ThemeMode = "light" | "dark";
export type TextScale = "normal" | "large" | "xl";

export interface Settings {
  theme: ThemeMode;
  textScale: TextScale;
  highContrast: boolean;
  reducedMotion: boolean;
  readAloud: boolean;
  reminderEnabled: boolean;
  /** "HH:MM" 24h local time. */
  reminderTime: string;
  /** Days of week to nudge, 0 = Sunday … 6 = Saturday. */
  reminderDays: number[];
}
