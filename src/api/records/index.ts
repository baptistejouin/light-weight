"use server";
import { Exercises, Records, Workouts } from "@drizzle/schema";
import { redirect } from "@solidjs/router";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";
import { tryCatch } from "@/lib/try-catch";

export async function getRecords() {
  const userId = await requireUserId();

  return db
    .select({
      id: Records.id,
      title: Records.title,
      notes: Records.notes,
      performedAt: Records.performedAt,
      durationSeconds: Records.durationSeconds,
      exerciseName: Exercises.name,
      workoutName: Workouts.name,
    })
    .from(Records)
    .leftJoin(Exercises, eq(Records.exerciseId, Exercises.id))
    .leftJoin(Workouts, eq(Records.workoutId, Workouts.id))
    .where(eq(Records.userId, userId))
    .orderBy(desc(Records.performedAt))
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
    durationSeconds: z.coerce
      .number()
      .int()
      .positive("Duration must be longer than zero"),
  })
  .refine(
    (data) => (data.kind === "activity" ? !!data.exerciseId : !!data.workoutId),
    { message: "Select an exercise or a workout" },
  );

export async function createRecord(formData: FormData) {
  const userId = await requireUserId();
  const data = parseForm(createRecordSchema, formData);
  if (data instanceof Error) return data;

  const performedAt = new Date(data.startedAt);
  if (Number.isNaN(performedAt.getTime())) {
    return new Error("Invalid start date/time");
  }

  if (data.kind === "workout" && data.workoutId) {
    const workout = db
      .select({ id: Workouts.id })
      .from(Workouts)
      .where(and(eq(Workouts.id, data.workoutId), eq(Workouts.userId, userId)))
      .get();
    if (!workout) return new Error("Workout not found");
  }

  const { error } = tryCatch(() =>
    db
      .insert(Records)
      .values({
        userId,
        exerciseId: data.kind === "activity" ? data.exerciseId : null,
        workoutId: data.kind === "workout" ? data.workoutId : null,
        title: data.title || null,
        notes: data.description || null,
        performedAt,
        durationSeconds: data.durationSeconds,
      })
      .run(),
  );
  if (error) return error;

  throw redirect("/");
}

export async function deleteRecord(id: string) {
  const userId = await requireUserId();

  const { data: result, error } = tryCatch(() =>
    db
      .delete(Records)
      .where(and(eq(Records.id, id), eq(Records.userId, userId)))
      .run(),
  );
  if (error) return error;
  if (result.changes === 0) return new Error("Record not found");
}
