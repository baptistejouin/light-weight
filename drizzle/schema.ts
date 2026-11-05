import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exerciseTypes = [
  "strength",
  "cardio",
  "flexibility",
  "rest",
] as const;

export type ExerciseType = (typeof exerciseTypes)[number];

export const Users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  username: text("username").notNull().default(""),
  password: text("password").notNull().default(""),
});

export const Session = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
});

export const Exercises = sqliteTable("exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type", { enum: exerciseTypes }).notNull().default("strength"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const Workouts = sqliteTable("workouts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => Users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
});

// Workout template: ordered exercises with target sets/reps
export const WorkoutExercises = sqliteTable("workout_exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  workoutId: text("workout_id")
    .notNull()
    .references(() => Workouts.id),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => Exercises.id),
  order: integer("order").notNull().default(0),
  targetSets: integer("target_sets"),
  targetReps: integer("target_reps"),
  targetDurationSeconds: integer("target_duration_seconds"),
  targetWeightKg: real("target_weight_kg"),
});

// One entry per logged session: a workout or a single exercise
export const Records = sqliteTable("records", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => Users.id),
  workoutId: text("workout_id").references(() => Workouts.id),
  exerciseId: text("exercise_id").references(() => Exercises.id),
  title: text("title"),
  performedAt: integer("performed_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  durationSeconds: integer("duration_seconds"),
  notes: text("notes"),
});

// Each exercise done within a record
export const RecordExercises = sqliteTable("record_exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  recordId: text("record_id")
    .notNull()
    .references(() => Records.id),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => Exercises.id),
  order: integer("order").notNull().default(0),
  notes: text("notes"),
});

// Each set within a record exercise (actual performance)
export const RecordSets = sqliteTable("record_sets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  recordExerciseId: text("record_exercise_id")
    .notNull()
    .references(() => RecordExercises.id),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"), // strength
  weightKg: real("weight_kg"), // strength
  durationSeconds: integer("duration_seconds"), // cardio/timed
  distanceM: real("distance_m"), // cardio
});

// Relations
export const UsersRelations = relations(Users, ({ many }) => ({
  workouts: many(Workouts),
  records: many(Records),
}));

export const WorkoutsRelations = relations(Workouts, ({ one, many }) => ({
  user: one(Users, { fields: [Workouts.userId], references: [Users.id] }),
  workoutExercises: many(WorkoutExercises),
  records: many(Records),
}));

export const ExercisesRelations = relations(Exercises, ({ many }) => ({
  workoutExercises: many(WorkoutExercises),
  recordExercises: many(RecordExercises),
  records: many(Records),
}));

export const WorkoutExercisesRelations = relations(
  WorkoutExercises,
  ({ one }) => ({
    workout: one(Workouts, {
      fields: [WorkoutExercises.workoutId],
      references: [Workouts.id],
    }),
    exercise: one(Exercises, {
      fields: [WorkoutExercises.exerciseId],
      references: [Exercises.id],
    }),
  }),
);

export const RecordsRelations = relations(Records, ({ one, many }) => ({
  user: one(Users, {
    fields: [Records.userId],
    references: [Users.id],
  }),
  workout: one(Workouts, {
    fields: [Records.workoutId],
    references: [Workouts.id],
  }),
  exercise: one(Exercises, {
    fields: [Records.exerciseId],
    references: [Exercises.id],
  }),
  recordExercises: many(RecordExercises),
}));

export const RecordExercisesRelations = relations(
  RecordExercises,
  ({ one, many }) => ({
    record: one(Records, {
      fields: [RecordExercises.recordId],
      references: [Records.id],
    }),
    exercise: one(Exercises, {
      fields: [RecordExercises.exerciseId],
      references: [Exercises.id],
    }),
    sets: many(RecordSets),
  }),
);

export const RecordSetsRelations = relations(RecordSets, ({ one }) => ({
  recordExercise: one(RecordExercises, {
    fields: [RecordSets.recordExerciseId],
    references: [RecordExercises.id],
  }),
}));
