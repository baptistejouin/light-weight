"use server";
import { Exercises, WorkoutExercises, Workouts } from "@drizzle/schema";
import { redirect } from "@solidjs/router";
import { asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getSessionUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";
import { pickTargets } from "@/lib/exercise-targets";

const REST_EXERCISE_NAME = "Rest";

export async function getOrCreateRestExercise() {
  const existing = db
    .select()
    .from(Exercises)
    .where(eq(Exercises.type, "rest"))
    .get();
  if (existing) return existing;

  db.insert(Exercises).values({ name: REST_EXERCISE_NAME, type: "rest" }).run();

  return db.select().from(Exercises).where(eq(Exercises.type, "rest")).get();
}

export async function getWorkouts() {
  const userId = await getSessionUserId();
  const workouts = db
    .select()
    .from(Workouts)
    .where(eq(Workouts.userId, userId))
    .all();

  if (workouts.length === 0) return [];

  const steps = db
    .select({
      workoutId: WorkoutExercises.workoutId,
      order: WorkoutExercises.order,
      targetSets: WorkoutExercises.targetSets,
      targetReps: WorkoutExercises.targetReps,
      targetDuration: WorkoutExercises.targetDuration,
      targetWeight: WorkoutExercises.targetWeight,
      exerciseName: Exercises.name,
      exerciseType: Exercises.type,
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

  return workouts.map((workout) => ({
    ...workout,
    steps: steps.filter((s) => s.workoutId === workout.id),
  }));
}

const stepSchema = z.object({
  exerciseId: z.uuid(),
  targetSets: z.number().int().positive().optional(),
  targetReps: z.number().int().positive().optional(),
  targetDuration: z.number().int().positive().optional(),
  targetWeight: z.number().positive().optional(),
});

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1),
});

export async function createWorkout(formData: FormData) {
  const userId = await getSessionUserId();

  let steps: unknown;
  try {
    steps = JSON.parse(String(formData.get("steps") ?? "[]"));
  } catch {
    return new Error("Invalid steps payload");
  }

  const data = parseForm(createWorkoutSchema, {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    steps,
  });
  if (data instanceof Error) return data;

  const exerciseTypes = new Map(
    db
      .select({ id: Exercises.id, type: Exercises.type })
      .from(Exercises)
      .where(
        inArray(
          Exercises.id,
          data.steps.map((s) => s.exerciseId),
        ),
      )
      .all()
      .map((e) => [e.id, e.type]),
  );

  const values = [];
  for (const [index, { exerciseId, ...targets }] of data.steps.entries()) {
    const type = exerciseTypes.get(exerciseId);
    if (!type) return new Error("Unknown exercise");
    values.push({ exerciseId, order: index, ...pickTargets(targets, type) });
  }

  try {
    const workout = db
      .insert(Workouts)
      .values({
        name: data.name,
        description: data.description,
        userId,
      })
      .returning()
      .get();

    db.insert(WorkoutExercises)
      .values(values.map((v) => ({ ...v, workoutId: workout.id })))
      .run();
  } catch (err) {
    return err as Error;
  }

  throw redirect("/workouts");
}
