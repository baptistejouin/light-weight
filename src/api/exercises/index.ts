"use server";
import { Exercises } from "@drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";

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
