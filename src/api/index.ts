import { action, query } from "@solidjs/router";
import * as auth from "./auth";
import * as exercises from "./exercises";
import * as records from "./records";
import * as workouts from "./workouts";

// Create a registry of queries
const queries = {
  getUser: query(auth.getUser, "user"),
  getExercise: query(exercises.getExercise, "exercise"),
  getExercises: query(exercises.getExercises, "exercises"),
  getWorkouts: query(workouts.getWorkouts, "workouts"),
  getOrCreateRestExercise: query(
    workouts.getOrCreateRestExercise,
    "restExercise",
  ),
  getRecords: query(records.getRecords, "records"),
};

// Create a registry of actions
const actions = {
  validateAndLogin: action(auth.validateAndLogin, "validateAndLogin"),
  logout: action(auth.logout, "logout"),
  createExercises: action(exercises.createExercises, "createExercises"),
  createWorkout: action(workouts.createWorkout, "createWorkout"),
  createRecord: action(records.createRecord, "createRecord"),
};

// Export everything from the registries
export const {
  getUser,
  getExercise,
  getExercises,
  getWorkouts,
  getOrCreateRestExercise,
  getRecords,
} = queries;
export const {
  validateAndLogin,
  logout,
  createExercises,
  createWorkout,
  createRecord,
} = actions;
