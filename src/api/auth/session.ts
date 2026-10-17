import { redirect } from "@solidjs/router";
import { useSession } from "@solidjs/start/http";

export function getSession() {
  const password = process.env.SESSION_SECRET;
  if (!password) throw new Error("Missing SESSION_SECRET env var");

  // Secure cookies are dropped over http (e.g. LAN testing), so only in prod
  return useSession({ password, cookie: { secure: import.meta.env.PROD } });
}

export async function getSessionUserId() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");
  return userId;
}
