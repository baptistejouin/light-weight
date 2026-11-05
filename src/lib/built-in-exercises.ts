import type { ExerciseType } from "@drizzle/schema";

interface BuiltInExercise {
  description: string;
}

const builtInExercises: Partial<Record<ExerciseType, BuiltInExercise>> = {
  rest: { description: "Pause between workout steps" },
};

export const getBuiltInExercise = (exerciseType: ExerciseType) =>
  builtInExercises[exerciseType];

export const isBuiltIn = (exerciseType: ExerciseType) =>
  exerciseType in builtInExercises;
