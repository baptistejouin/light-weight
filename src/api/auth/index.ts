"use server";
import { Users } from "@drizzle/schema";
import { redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getSession, requireUserId } from "@/api/auth/session";
import { db } from "@/api/db";
import { parseForm } from "@/api/utils";
import { tryCatchAsync } from "@/lib/try-catch";

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

  const { error } = await tryCatchAsync(async () => {
    const user = await login(data.username, data.password);
    const session = await getSession();

    await session.update((d) => {
      d.userId = user.id;
    });
  });
  if (error) return error;

  throw redirect("/");
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.userId = undefined));
  throw redirect("/login");
}

export async function getUser() {
  const userId = await requireUserId();
  const user = db.select().from(Users).where(eq(Users.id, userId)).get();
  if (!user) return logout();
  return { id: user.id, username: user.username };
}
