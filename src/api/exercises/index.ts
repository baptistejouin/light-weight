"use server";
import {
  Exercises,
  WorkoutExercises,
  WorkoutHistory,
  WorkoutSessionExercises,
} from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getSessionUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";
import { isBuiltIn } from "@/lib/built-in-exercises";

const getExerciseSchema = z.object({ id: z.uuid() });

export async function getExercise({ id }: z.infer<typeof getExerciseSchema>) {
  return db.select().from(Exercises).where(eq(Exercises.id, id)).get();
}

export async function getExercises() {
  return db.select().from(Exercises).all();
}

const createExerciseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["strength", "cardio", "flexibility"]),
});

export async function createExercises(formData: FormData) {
  const data = parseForm(createExerciseSchema, formData);
  if (data instanceof Error) return data;

  try {
    db.insert(Exercises)
      .values({
        name: data.name,
        description: data.description,
        type: data.type,
      })
      .run();

    return { success: true };
  } catch (err) {
    return err as Error;
  }
}

export async function deleteExercise(id: string) {
  await getSessionUserId();

  const exercise = db
    .select()
    .from(Exercises)
    .where(eq(Exercises.id, id))
    .get();
  if (!exercise) return new Error("Exercise not found");
  if (isBuiltIn(exercise.type)) {
    return new Error(`"${exercise.name}" is built-in and can't be deleted`);
  }

  const isUsed = [
    WorkoutExercises,
    WorkoutHistory,
    WorkoutSessionExercises,
  ].some((table) =>
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

  try {
    db.delete(Exercises).where(eq(Exercises.id, id)).run();
  } catch (err) {
    return err as Error;
  }
}
