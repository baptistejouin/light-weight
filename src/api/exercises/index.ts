"use server";
import {
  Exercises,
  exerciseTypes,
  metrics,
  RecordExercises,
  Records,
  WorkoutExercises,
} from "@drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";
import { isBuiltIn } from "@/lib/built-in-exercises";
import { pickTargets, sortMetrics } from "@/lib/exercise-targets";
import { tryCatch } from "@/lib/try-catch";

const getExerciseSchema = z.object({ id: z.uuid() });

export async function getExercise({ id }: z.infer<typeof getExerciseSchema>) {
  await requireUserId();

  return db.select().from(Exercises).where(eq(Exercises.id, id)).get();
}

export async function getExercises() {
  await requireUserId();

  return db.select().from(Exercises).orderBy(asc(Exercises.name)).all();
}

// Pickers submit "0" when left untouched
const unsetWhenZero = (value: unknown) =>
  value === "" || value === "0" ? undefined : value;

const optionalPositive = z.preprocess(
  unsetWhenZero,
  z.coerce.number().positive().optional(),
);
const optionalPositiveInt = z.preprocess(
  unsetWhenZero,
  z.coerce.number().int().positive().optional(),
);

const createExerciseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(exerciseTypes).exclude(["rest"]),
  metrics: z.array(z.enum(metrics)).min(1, "Pick at least one thing to track"),
  targetSets: optionalPositiveInt,
  targetReps: optionalPositiveInt,
  targetWeightKg: optionalPositive,
  targetDurationSeconds: optionalPositiveInt,
  targetDistanceM: optionalPositive,
});

export async function createExercises(formData: FormData) {
  await requireUserId();

  const data = parseForm(createExerciseSchema, {
    ...Object.fromEntries(formData),
    metrics: formData.getAll("metrics"),
  });
  if (data instanceof Error) return data;

  const exerciseMetrics = sortMetrics(data.metrics);
  const defaultTargets = pickTargets(data, exerciseMetrics);
  const hasDefaults = Object.values(defaultTargets).some(Boolean);

  const { error } = tryCatch(() =>
    db
      .insert(Exercises)
      .values({
        name: data.name,
        description: data.description,
        type: data.type,
        metrics: exerciseMetrics,
        defaultTargets: hasDefaults ? defaultTargets : null,
      })
      .run(),
  );
  if (error) return error;

  return { success: true };
}

export async function deleteExercise(id: string) {
  await requireUserId();

  const exercise = db
    .select()
    .from(Exercises)
    .where(eq(Exercises.id, id))
    .get();
  if (!exercise) return new Error("Exercise not found");
  if (isBuiltIn(exercise.type)) {
    return new Error(`"${exercise.name}" is built-in and can't be deleted`);
  }

  const isUsed = [WorkoutExercises, Records, RecordExercises].some((table) =>
    db
      .select({ id: table.id })
      .from(table)
      .where(eq(table.exerciseId, id))
      .get(),
  );
  if (isUsed) {
    return new Error(
      `"${exercise.name}" is used by a workout or a record, so it can't be deleted`,
    );
  }

  const { error } = tryCatch(() =>
    db.delete(Exercises).where(eq(Exercises.id, id)).run(),
  );
  if (error) return error;
}
