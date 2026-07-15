import { EXERCISES } from "./exercises";
import type {
  BodyArea,
  Exercise,
  Goal,
  Intake,
  Intensity,
  Routine,
  RoutineStep,
} from "./types";

export const AREA_LABEL: Record<BodyArea, string> = {
  neck: "Neck",
  shoulders: "Shoulders",
  "upper-back": "Upper back",
  "lower-back": "Lower back",
  hips: "Hips",
  knees: "Knees & legs",
  "full-body": "Full body",
};

export const GOAL_LABEL: Record<Goal, string> = {
  "pain-relief": "Pain relief",
  flexibility: "Flexibility",
  posture: "Posture",
  recovery: "Recovery",
  "desk-stiffness": "Desk stiffness",
};

export const INTENSITY_LABEL: Record<Intensity, string> = {
  gentle: "Gentle",
  moderate: "Moderate",
  deeper: "Deeper stretch",
};

const INTENSITY_RANK: Record<Intensity, number> = {
  gentle: 1,
  moderate: 2,
  deeper: 3,
};

/** How the goal colors the routine's explanation. */
const GOAL_NOTE: Record<Goal, string> = {
  "pain-relief": "prioritizes slow, low-load releases that calm tension rather than push range.",
  flexibility: "builds range gradually with holds that lengthen without forcing.",
  posture: "opens the chest and mobilizes the spine to counter a forward, rounded posture.",
  recovery: "keeps everything gentle and supported so you can rebuild confidence in movement.",
  "desk-stiffness": "targets the areas that stiffen from sitting — neck, shoulders, and back.",
};

/**
 * Build a personalized routine from the intake answers. The logic is simple and
 * fully transparent (that's the point — every choice is explainable to the user):
 *
 * 1. Keep exercises that target the chosen area (full-body always eligible).
 * 2. Respect intensity: never exceed the requested level; a red flag caps it at gentle.
 * 3. Always bookend with a calming breath to open, and a restful pose to close.
 * 4. Pack movements until the time budget is filled, favoring variety.
 */
export function buildRoutine(intake: Intake): Routine {
  const hasRedFlags = intake.redFlags.length > 0;
  const cap = hasRedFlags ? INTENSITY_RANK.gentle : INTENSITY_RANK[intake.intensity];

  const targetSeconds = intake.minutes * 60;

  const eligible = EXERCISES.filter((e) => {
    const matchesArea =
      e.areas.includes(intake.area) || e.areas.includes("full-body");
    const withinIntensity = INTENSITY_RANK[e.intensity] <= cap;
    return matchesArea && withinIntensity;
  });

  const opener = EXERCISES.find((e) => e.id === "breathe-settle")!;
  const closerPreferred = ["child-pose", "knee-hug", "breathe-settle"];
  const closer =
    eligible.find((e) => e.id === closerPreferred[0]) ??
    eligible.find((e) => e.id === closerPreferred[1]) ??
    opener;

  // Middle pool: area-relevant, not the opener/closer, sorted so the most
  // area-specific and appropriately-intense moves come first.
  const middlePool = eligible
    .filter((e) => e.id !== opener.id && e.id !== closer.id)
    .sort((a, b) => scoreExercise(b, intake) - scoreExercise(a, intake));

  const steps: RoutineStep[] = [];
  const push = (ex: Exercise) =>
    steps.push({ exercise: ex, seconds: adaptSeconds(ex, intake) });

  push(opener);
  let used = steps[0].seconds;
  const closerSeconds = adaptSeconds(closer, intake);

  for (const ex of middlePool) {
    const s = adaptSeconds(ex, intake);
    if (used + s + closerSeconds > targetSeconds && steps.length > 1) break;
    push(ex);
    used += s;
  }

  push(closer);
  used += closerSeconds;

  return {
    title: routineTitle(intake),
    subtitle: `${INTENSITY_LABEL[intake.intensity]} · ${intake.minutes} min · ${AREA_LABEL[intake.area]}`,
    why: buildWhy(intake, steps, hasRedFlags),
    totalSeconds: used,
    steps,
    intake,
  };
}

function scoreExercise(e: Exercise, intake: Intake): number {
  let score = 0;
  if (e.areas.includes(intake.area)) score += 10;
  // Prefer movements at or just below the requested intensity.
  score -= Math.abs(INTENSITY_RANK[e.intensity] - INTENSITY_RANK[intake.intensity]);
  if (intake.goal === "posture" && (e.id === "chest-open" || e.id === "cat-cow"))
    score += 4;
  if (intake.goal === "flexibility" && e.intensity !== "gentle") score += 2;
  if (intake.goal === "pain-relief" && e.intensity === "gentle") score += 3;
  return score;
}

/** Slightly shorten holds for gentle sessions, lengthen for deeper ones. */
function adaptSeconds(e: Exercise, intake: Intake): number {
  const factor =
    intake.intensity === "gentle" ? 0.85 : intake.intensity === "deeper" ? 1.2 : 1;
  return Math.round((e.durationSec * factor) / 5) * 5;
}

function routineTitle(intake: Intake): string {
  const map: Partial<Record<Goal, string>> = {
    "pain-relief": "Ease & Relief",
    flexibility: "Open & Lengthen",
    posture: "Stand Tall",
    recovery: "Gentle Recovery",
    "desk-stiffness": "Desk Reset",
  };
  return `${map[intake.goal] ?? "Your Routine"} — ${AREA_LABEL[intake.area]}`;
}

function buildWhy(
  intake: Intake,
  steps: RoutineStep[],
  hasRedFlags: boolean
): string[] {
  const why: string[] = [];
  why.push(
    `You told us your ${AREA_LABEL[intake.area].toLowerCase()} feels tight and you have about ${intake.minutes} minutes, so this is a focused, ${INTENSITY_LABEL[intake.intensity].toLowerCase()} session — not a workout.`
  );
  why.push(`Because your goal is ${GOAL_LABEL[intake.goal].toLowerCase()}, it ${GOAL_NOTE[intake.goal]}`);
  why.push(
    `We open with slow breathing to settle your nervous system, then move through ${steps.length - 2} targeted release${steps.length - 2 === 1 ? "" : "s"}, and finish with a restful pose so you end calm.`
  );
  if (hasRedFlags) {
    why.push(
      "Since you flagged an injury or health concern, we kept every movement at the gentlest level. Please check with a doctor or physiotherapist before continuing."
    );
  }
  if (intake.experience === "new") {
    why.push(
      "As you're newer to this, hold each position lightly and use the read-aloud button if it helps you follow along hands-free."
    );
  }
  return why;
}
