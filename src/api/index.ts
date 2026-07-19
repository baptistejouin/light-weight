import { action, query } from "@solidjs/router";
import * as auth from "./auth";
import * as exercises from "./exercises";

// Create a registry of queries
const queries = {
  getUser: query(auth.getUser, "user"),
  getExercise: query(exercises.getExercise, "exercise"),
  getExercises: query(exercises.getExercises, "exercises"),
};

// Create a registry of actions
const actions = {
  validateAndLogin: action(auth.validateAndLogin, "validateAndLogin"),
  logout: action(auth.logout, "logout"),
  createExercises: action(exercises.createExercises, "createExercises"),
};

// Export everything from the registries
export const { getUser, getExercise, getExercises } = queries;
export const { validateAndLogin, logout, createExercises } = actions;
