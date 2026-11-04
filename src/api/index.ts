import { action, query } from "@solidjs/router";
import * as auth from "./auth";
import * as exercises from "./exercises";
import * as records from "./records";
import * as workouts from "./workouts";

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

const actions = {
  validateAndLogin: action(auth.validateAndLogin, "validateAndLogin"),
  logout: action(auth.logout, "logout"),
  createExercises: action(exercises.createExercises, "createExercises"),
  deleteExercise: action(exercises.deleteExercise, "deleteExercise"),
  createWorkout: action(workouts.createWorkout, "createWorkout"),
  deleteWorkout: action(workouts.deleteWorkout, "deleteWorkout"),
  createRecord: action(records.createRecord, "createRecord"),
  deleteRecord: action(records.deleteRecord, "deleteRecord"),
};

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
  deleteExercise,
  createWorkout,
  deleteWorkout,
  createRecord,
  deleteRecord,
} = actions;
