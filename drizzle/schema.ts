import { relations } from "drizzle-orm";
import { integer, primaryKey, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  // "strength" | "cardio" | "flexibility"
  type: text("type").notNull().default("strength"),
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
export const WorkoutExercises = sqliteTable(
  "workout_exercises",
  {
    workoutId: text("workout_id")
      .notNull()
      .references(() => Workouts.id),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => Exercises.id),
    order: integer("order").notNull().default(0),
    targetSets: integer("target_sets"),
    targetReps: integer("target_reps"),
    targetDuration: integer("target_duration"), // seconds
  },
  (t) => ({
    pk: primaryKey({ columns: [t.workoutId, t.exerciseId] }),
  }),
);

// One entry per workout session performed by a user
export const WorkoutHistory = sqliteTable("workout_history", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => Users.id),
  workoutId: text("workout_id")
    .notNull()
    .references(() => Workouts.id),
  performedAt: integer("performed_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  duration: integer("duration"), // seconds
  notes: text("notes"),
});

// Each exercise done within a session
export const WorkoutSessionExercises = sqliteTable("workout_session_exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  historyId: text("history_id")
    .notNull()
    .references(() => WorkoutHistory.id),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => Exercises.id),
  order: integer("order").notNull().default(0),
  notes: text("notes"),
});

// Each set within a session exercise (actual performance)
export const WorkoutSessionSets = sqliteTable("workout_session_sets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  sessionExerciseId: text("session_exercise_id")
    .notNull()
    .references(() => WorkoutSessionExercises.id),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),         // strength
  weight: real("weight"),        // kg, strength
  duration: integer("duration"), // seconds, cardio/timed
  distance: real("distance"),    // meters, cardio
});

// Relations
export const UsersRelations = relations(Users, ({ many }) => ({
  workouts: many(Workouts),
  workoutHistory: many(WorkoutHistory),
}));

export const WorkoutsRelations = relations(Workouts, ({ one, many }) => ({
  user: one(Users, { fields: [Workouts.userId], references: [Users.id] }),
  workoutExercises: many(WorkoutExercises),
  history: many(WorkoutHistory),
}));

export const ExercisesRelations = relations(Exercises, ({ many }) => ({
  workoutExercises: many(WorkoutExercises),
  sessionExercises: many(WorkoutSessionExercises),
}));

export const WorkoutExercisesRelations = relations(WorkoutExercises, ({ one }) => ({
  workout: one(Workouts, { fields: [WorkoutExercises.workoutId], references: [Workouts.id] }),
  exercise: one(Exercises, { fields: [WorkoutExercises.exerciseId], references: [Exercises.id] }),
}));

export const WorkoutHistoryRelations = relations(WorkoutHistory, ({ one, many }) => ({
  user: one(Users, { fields: [WorkoutHistory.userId], references: [Users.id] }),
  workout: one(Workouts, { fields: [WorkoutHistory.workoutId], references: [Workouts.id] }),
  sessionExercises: many(WorkoutSessionExercises),
}));

export const WorkoutSessionExercisesRelations = relations(WorkoutSessionExercises, ({ one, many }) => ({
  history: one(WorkoutHistory, { fields: [WorkoutSessionExercises.historyId], references: [WorkoutHistory.id] }),
  exercise: one(Exercises, { fields: [WorkoutSessionExercises.exerciseId], references: [Exercises.id] }),
  sets: many(WorkoutSessionSets),
}));

export const WorkoutSessionSetsRelations = relations(WorkoutSessionSets, ({ one }) => ({
  sessionExercise: one(WorkoutSessionExercises, {
    fields: [WorkoutSessionSets.sessionExerciseId],
    references: [WorkoutSessionExercises.id],
  }),
}));
