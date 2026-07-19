"use server";
import { Users } from "@drizzle/schema";
import { redirect } from "@solidjs/router";
import { useSession } from "@solidjs/start/http";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/api/db";

function getSession() {
  return useSession({
    password: import.meta.env.SESSION_SECRET,
  });
}

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

  const formDataObj = Object.fromEntries(formData.entries());

  const { data, error } = loginSchema.safeParse(formDataObj);

  if (error) return new Error(error.message);

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
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  try {
    const user = db.select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/login");
    return { id: user.id, username: user.username };
  } catch {
    throw logout();
  }
}
