import { redirect } from "@solidjs/router";
import { useSession } from "@solidjs/start/http";

export function getSession() {
  const password = process.env.SESSION_SECRET;
  if (!password) throw new Error("Missing SESSION_SECRET env var");

  return useSession({ password });
}

export async function getSessionUserId() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");
  return userId;
}
