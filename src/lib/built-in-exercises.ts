interface BuiltInExercise {
  description: string;
}

const builtInExercises: Record<string, BuiltInExercise> = {
  rest: { description: "Pause between workout steps" },
};

export const getBuiltInExercise = (exerciseType: string) =>
  builtInExercises[exerciseType];

export const isBuiltIn = (exerciseType: string) =>
  exerciseType in builtInExercises;
