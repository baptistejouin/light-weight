"use server";
import { Users } from "@drizzle/schema";
import { redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getSession, getSessionUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";

async function login(username: string, password: string) {
  const user = db
    .select()
    .from(Users)
    .where(eq(Users.username, username))
    .get();
  if (!user || password !== user.password) throw new Error("Invalid login");
  return user;
}

export async function validateAndLogin(formData: FormData) {
  const loginSchema = z.object({
    username: z.string().min(3).max(25),
    password: z.string().min(3).max(25),
  });

  const data = parseForm(loginSchema, formData);
  if (data instanceof Error) return data;

  try {
    const user = await login(data.username, data.password);
    const session = await getSession();

    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect("/");
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.userId = undefined));
  throw redirect("/login");
}

export async function getUser() {
  const userId = await getSessionUserId();

  try {
    const user = db.select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/login");
    return { id: user.id, username: user.username };
  } catch {
    throw logout();
  }
}
