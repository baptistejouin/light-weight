"use server";
import {
  Exercises,
  Records,
  WorkoutExercises,
  Workouts,
} from "@drizzle/schema";
import { redirect } from "@solidjs/router";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";
import { pickTargets } from "@/lib/exercise-targets";
import { tryCatch } from "@/lib/try-catch";

export async function getWorkouts() {
  const userId = await requireUserId();

  const workouts = db
    .select()
    .from(Workouts)
    .where(eq(Workouts.userId, userId))
    .orderBy(asc(Workouts.name))
    .all();

  if (workouts.length === 0) return [];

  const steps = db
    .select({
      workoutId: WorkoutExercises.workoutId,
      exerciseId: WorkoutExercises.exerciseId,
      order: WorkoutExercises.order,
      targetSets: WorkoutExercises.targetSets,
      targetReps: WorkoutExercises.targetReps,
      targetDurationSeconds: WorkoutExercises.targetDurationSeconds,
      targetWeightKg: WorkoutExercises.targetWeightKg,
      targetDistanceM: WorkoutExercises.targetDistanceM,
      exerciseName: Exercises.name,
      exerciseType: Exercises.type,
      exerciseBuiltIn: Exercises.builtIn,
      exerciseMetrics: Exercises.metrics,
    })
    .from(WorkoutExercises)
    .innerJoin(Exercises, eq(WorkoutExercises.exerciseId, Exercises.id))
    .where(
      inArray(
        WorkoutExercises.workoutId,
        workouts.map((w) => w.id),
      ),
    )
    .orderBy(asc(WorkoutExercises.order))
    .all();

  const stepsByWorkout = Map.groupBy(steps, (s) => s.workoutId);

  return workouts.map((workout) => ({
    ...workout,
    steps: stepsByWorkout.get(workout.id) ?? [],
  }));
}

const stepSchema = z.object({
  exerciseId: z.uuid(),
  targetSets: z.number().int().positive().optional(),
  targetReps: z.number().int().positive().optional(),
  targetDurationSeconds: z.number().int().positive().optional(),
  targetWeightKg: z.number().positive().optional(),
  targetDistanceM: z.number().positive().optional(),
});

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1),
});

export async function createWorkout(formData: FormData) {
  const userId = await requireUserId();

  const { data: steps, error: stepsError } = tryCatch<unknown>(() =>
    JSON.parse(String(formData.get("steps") ?? "[]")),
  );
  if (stepsError) return new Error("Invalid steps payload");

  const data = parseForm(createWorkoutSchema, {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    steps,
  });
  if (data instanceof Error) return data;

  const exerciseMetrics = new Map(
    db
      .select({ id: Exercises.id, metrics: Exercises.metrics })
      .from(Exercises)
      .where(
        inArray(
          Exercises.id,
          data.steps.map((s) => s.exerciseId),
        ),
      )
      .all()
      .map((e) => [e.id, e.metrics]),
  );

  const values: Omit<typeof WorkoutExercises.$inferInsert, "workoutId">[] = [];
  for (const [index, { exerciseId, ...targets }] of data.steps.entries()) {
    const metrics = exerciseMetrics.get(exerciseId);
    if (!metrics) return new Error("Unknown exercise");
    values.push({ exerciseId, order: index, ...pickTargets(targets, metrics) });
  }

  const { error } = tryCatch(() =>
    db.transaction((tx) => {
      const workout = tx
        .insert(Workouts)
        .values({
          name: data.name,
          description: data.description,
          userId,
        })
        .returning()
        .get();

      tx.insert(WorkoutExercises)
        .values(values.map((v) => ({ ...v, workoutId: workout.id })))
        .run();
    }),
  );
  if (error) return error;

  throw redirect("/library?tab=workouts");
}

export async function deleteWorkout(id: string) {
  const userId = await requireUserId();

  const workout = db
    .select()
    .from(Workouts)
    .where(and(eq(Workouts.id, id), eq(Workouts.userId, userId)))
    .get();
  if (!workout) return new Error("Workout not found");

  const isUsed = db
    .select({ id: Records.id })
    .from(Records)
    .where(eq(Records.workoutId, id))
    .get();
  if (isUsed) {
    return new Error(
      `"${workout.name}" is used by a record, so it can't be deleted`,
    );
  }

  const { error } = tryCatch(() =>
    db.transaction((tx) => {
      tx.delete(WorkoutExercises)
        .where(eq(WorkoutExercises.workoutId, id))
        .run();
      tx.delete(Workouts).where(eq(Workouts.id, id)).run();
    }),
  );
  if (error) return error;
}
