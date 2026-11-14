"use server";
import {
  Exercises,
  exerciseTypes,
  RecordExercises,
  Records,
  WorkoutExercises,
} from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";
import { isBuiltIn } from "@/lib/built-in-exercises";
import { tryCatch } from "@/lib/try-catch";

const getExerciseSchema = z.object({ id: z.uuid() });

export async function getExercise({ id }: z.infer<typeof getExerciseSchema>) {
  await requireUserId();

  return db.select().from(Exercises).where(eq(Exercises.id, id)).get();
}

export async function getExercises() {
  await requireUserId();

  return db.select().from(Exercises).all();
}

const createExerciseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(exerciseTypes).exclude(["rest"]),
});

export async function createExercises(formData: FormData) {
  await requireUserId();

  const data = parseForm(createExerciseSchema, formData);
  if (data instanceof Error) return data;

  const { error } = tryCatch(() =>
    db
      .insert(Exercises)
      .values({
        name: data.name,
        description: data.description,
        type: data.type,
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
