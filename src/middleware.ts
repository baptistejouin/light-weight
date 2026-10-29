import { Users } from "@drizzle/schema";
import { createMiddleware } from "@solidjs/start/middleware";
import { eq } from "drizzle-orm";
import { getSession } from "@/api/auth/session";
import { db } from "@/api/db";

const PUBLIC_PATHS = new Set(["/login"]);

export default createMiddleware({
  onRequest: async (event) => {
    const { request } = event;
    const { pathname } = new URL(request.url);
    const isPageLoad =
      request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html");
    if (!isPageLoad || PUBLIC_PATHS.has(pathname)) return;

    const session = await getSession();
    const userId = session.data.userId;
    const user =
      userId !== undefined &&
      db.select({ id: Users.id }).from(Users).where(eq(Users.id, userId)).get();
    if (user) return;

    return new Response(null, { status: 302, headers: { Location: "/login" } });
  },
});
