import type { getExercises, getRecords, getWorkouts } from "@/api";

export type Exercise = Awaited<ReturnType<typeof getExercises>>[number];
export type Workout = Awaited<ReturnType<typeof getWorkouts>>[number];
export type WorkoutRecord = Awaited<ReturnType<typeof getRecords>>[number];
