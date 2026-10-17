"use server";
import { Exercises, WorkoutHistory, Workouts } from "@drizzle/schema";
import { redirect } from "@solidjs/router";
import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { getSessionUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";

export async function getRecords() {
  const userId = await getSessionUserId();

  const exercise = alias(Exercises, "record_exercise");
  const workout = alias(Workouts, "record_workout");

  return db
    .select({
      id: WorkoutHistory.id,
      title: WorkoutHistory.title,
      notes: WorkoutHistory.notes,
      performedAt: WorkoutHistory.performedAt,
      duration: WorkoutHistory.duration,
      exerciseName: exercise.name,
      workoutName: workout.name,
    })
    .from(WorkoutHistory)
    .leftJoin(exercise, eq(WorkoutHistory.exerciseId, exercise.id))
    .leftJoin(workout, eq(WorkoutHistory.workoutId, workout.id))
    .where(eq(WorkoutHistory.userId, userId))
    .orderBy(desc(WorkoutHistory.performedAt))
    .all();
}

const createRecordSchema = z
  .object({
    kind: z.enum(["activity", "workout"]),
    exerciseId: z.uuid().optional(),
    workoutId: z.uuid().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    startedAt: z.string().min(1),
    durationMinutes: z.coerce.number().int().positive(),
  })
  .refine(
    (data) => (data.kind === "activity" ? !!data.exerciseId : !!data.workoutId),
    { message: "Select an exercise or a workout" },
  );

export async function createRecord(formData: FormData) {
  const userId = await getSessionUserId();
  const data = parseForm(createRecordSchema, formData);
  if (data instanceof Error) return data;

  const performedAt = new Date(data.startedAt);
  if (Number.isNaN(performedAt.getTime())) {
    return new Error("Invalid start date/time");
  }

  try {
    db.insert(WorkoutHistory)
      .values({
        userId,
        exerciseId: data.kind === "activity" ? data.exerciseId : null,
        workoutId: data.kind === "workout" ? data.workoutId : null,
        title: data.title || null,
        notes: data.description || null,
        performedAt,
        duration: data.durationMinutes * 60,
      })
      .run();
  } catch (err) {
    return err as Error;
  }

  throw redirect("/");
}
