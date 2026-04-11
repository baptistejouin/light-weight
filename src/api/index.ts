import { action, query } from "@solidjs/router";
import * as server from "./server";

// Create a registry of queries
const queries = {
  getUser: query(server.getUser, "user"),
};

// Create a registry of actions
const actions = {
  validateAndLogin: action(server.validateAndLogin, "validateAndLogin"),
  logout: action(server.logout, "logout"),
};

// Export everything from the registries
export const { getUser } = queries;
export const { validateAndLogin, logout } = actions;
