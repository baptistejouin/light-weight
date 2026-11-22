import {
  Exercises,
  type ExerciseType,
  type Metric,
  Records,
  WorkoutExercises,
  Workouts,
} from "@drizzle/schema";
import { ne } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { defaultMetricsByType, type Targets } from "@/lib/exercise-targets";

interface SeedExercise {
  name: string;
  type: ExerciseType;
  description?: string;
  metrics?: Metric[];
  defaultTargets?: Targets;
}

const seedExercises: SeedExercise[] = [
  {
    name: "Bench press",
    type: "strength",
    defaultTargets: { targetSets: 4, targetReps: 8, targetWeightKg: 60 },
  },
  {
    name: "Squat",
    type: "strength",
    defaultTargets: { targetSets: 4, targetReps: 6, targetWeightKg: 80 },
  },
  {
    name: "Deadlift",
    type: "strength",
    defaultTargets: { targetSets: 3, targetReps: 5, targetWeightKg: 100 },
  },
  {
    name: "Overhead press",
    type: "strength",
    defaultTargets: { targetSets: 3, targetReps: 8, targetWeightKg: 40 },
  },
  {
    name: "Pull-ups",
    type: "strength",
    description: "Bodyweight",
    metrics: ["sets", "reps"],
    defaultTargets: { targetSets: 3, targetReps: 10 },
  },
  {
    name: "Plank",
    type: "strength",
    metrics: ["sets", "duration"],
    defaultTargets: { targetSets: 3, targetDurationSeconds: 60 },
  },
  {
    name: "Farmer's walk",
    type: "strength",
    metrics: ["weight", "distance"],
    defaultTargets: { targetWeightKg: 24, targetDistanceM: 100 },
  },
  {
    name: "Running",
    type: "cardio",
    metrics: ["duration", "distance"],
    defaultTargets: { targetDistanceM: 5000 },
  },
  {
    name: "Cycling",
    type: "cardio",
    defaultTargets: { targetDurationSeconds: 3600 },
  },
  {
    name: "Rowing",
    type: "cardio",
    defaultTargets: { targetDurationSeconds: 1200 },
  },
  {
    name: "Hamstring stretch",
    type: "flexibility",
    defaultTargets: { targetSets: 2, targetDurationSeconds: 45 },
  },
  { name: "Rest", type: "rest" },
];

type SeedStep = [exercise: string, targets: Targets];

const seedWorkouts: {
  name: string;
  description?: string;
  steps: SeedStep[];
}[] = [
  {
    name: "Push day",
    description: "Chest, shoulders and core",
    steps: [
      ["Bench press", { targetSets: 4, targetReps: 8, targetWeightKg: 60 }],
      ["Rest", { targetDurationSeconds: 120 }],
      ["Overhead press", { targetSets: 3, targetReps: 8, targetWeightKg: 40 }],
      ["Rest", { targetDurationSeconds: 90 }],
      ["Plank", { targetSets: 3, targetDurationSeconds: 60 }],
    ],
  },
  {
    name: "Pull & legs",
    steps: [
      ["Squat", { targetSets: 4, targetReps: 6, targetWeightKg: 80 }],
      ["Rest", { targetDurationSeconds: 180 }],
      ["Deadlift", { targetSets: 3, targetReps: 5, targetWeightKg: 100 }],
      ["Rest", { targetDurationSeconds: 180 }],
      ["Pull-ups", { targetSets: 3, targetReps: 10 }],
      ["Farmer's walk", { targetWeightKg: 24, targetDistanceM: 100 }],
    ],
  },
  {
    name: "Easy cardio",
    description: "Low intensity, keep the heart rate steady",
    steps: [
      ["Rowing", { targetDurationSeconds: 600 }],
      ["Running", { targetDurationSeconds: 1500 }],
      ["Hamstring stretch", { targetSets: 2, targetDurationSeconds: 45 }],
    ],
  },
];

type SeedRecord = [
  daysAgo: number,
  hour: number,
  workoutOrExercise: string,
  minutes: number,
  title?: string,
];

const seedRecords: SeedRecord[] = [
  [0, 7, "Running", 32],
  [1, 18, "Push day", 55],
  [3, 18, "Pull & legs", 70],
  [4, 8, "Cycling", 60, "Commute ride"],
  [6, 10, "Easy cardio", 45],
  [8, 18, "Push day", 50],
  [9, 7, "Running", 28],
  [11, 18, "Pull & legs", 65],
  [13, 9, "Cycling", 90, "Sunday loop"],
  [15, 18, "Push day", 58],
  [17, 18, "Pull & legs", 72],
  [18, 7, "Running", 35],
  [21, 10, "Easy cardio", 40],
  [23, 18, "Push day", 52],
  [26, 18, "Pull & legs", 68],
  [28, 8, "Rowing", 20],
  [32, 18, "Push day", 49],
  [36, 7, "Running", 30],
  [40, 18, "Pull & legs", 60],
  [45, 9, "Cycling", 75],
];

function idOf(ids: Map<string, string>, name: string) {
  const id = ids.get(name);
  if (!id) throw new Error(`Unknown seed entry "${name}"`);
  return id;
}

function daysAgoAt(days: number, hour: number) {
  const now = new Date();
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date > now ? now : date;
}

export function seedDevData(db: BetterSQLite3Database, userId: string) {
  // Rest is seeded by a migration, so only other exercises mean data exists
  const hasData = db
    .select({ id: Exercises.id })
    .from(Exercises)
    .where(ne(Exercises.type, "rest"))
    .get();
  if (hasData) return;

  db.transaction((tx) => {
    const existing = tx
      .select({ id: Exercises.id, name: Exercises.name })
      .from(Exercises)
      .all();
    const existingNames = new Set(existing.map((e) => e.name));

    const inserted = tx
      .insert(Exercises)
      .values(
        seedExercises
          .filter((e) => !existingNames.has(e.name))
          .map((e) => ({
            name: e.name,
            type: e.type,
            description: e.description,
            metrics: e.metrics ?? defaultMetricsByType[e.type],
            defaultTargets: e.defaultTargets,
          })),
      )
      .returning({ id: Exercises.id, name: Exercises.name })
      .all();

    const exerciseIds = new Map(
      [...existing, ...inserted].map((e) => [e.name, e.id]),
    );

    const workoutIds = new Map<string, string>();
    for (const workout of seedWorkouts) {
      const { id } = tx
        .insert(Workouts)
        .values({
          name: workout.name,
          description: workout.description,
          userId,
        })
        .returning({ id: Workouts.id })
        .get();
      workoutIds.set(workout.name, id);

      tx.insert(WorkoutExercises)
        .values(
          workout.steps.map(([exercise, targets], order) => ({
            workoutId: id,
            exerciseId: idOf(exerciseIds, exercise),
            order,
            ...targets,
          })),
        )
        .run();
    }

    tx.insert(Records)
      .values(
        seedRecords.map(([days, hour, name, minutes, title]) => ({
          userId,
          workoutId: workoutIds.get(name) ?? null,
          exerciseId: workoutIds.has(name) ? null : idOf(exerciseIds, name),
          title: title ?? null,
          performedAt: daysAgoAt(days, hour),
          durationSeconds: minutes * 60,
        })),
      )
      .run();
  });
}
