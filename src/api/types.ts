import type { getExercises } from "@/api/exercises";
import type { getRecords } from "@/api/records";
import type { getWorkouts } from "@/api/workouts";

export type Exercise = Awaited<ReturnType<typeof getExercises>>[number];
export type Workout = Awaited<ReturnType<typeof getWorkouts>>[number];
export type WorkoutRecord = Awaited<ReturnType<typeof getRecords>>[number];
