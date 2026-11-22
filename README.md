# Light Weight

This project was started as a side project to learn SolidJS, very similar to React but with some changes made for performance and a better development experience, so I just wanted to give it a try. I also need a gym app tailored for my needs, so it's a solid decision.

This project is voluntarily made for mobile usage and will be available as PWA. Not deployed yet, local only for now.

## Stack
- [SolidStart](https://start.solidjs.com) (Solid + Router + server functions) on Vite and Nitro
- SQLite with [Drizzle](https://orm.drizzle.team) (better-sqlite3)
- Tailwind CSS v4
- Zod for form validation, Temporal polyfill for dates
- [@use-gesture](https://use-gesture.netlify.app) for drag and swipe
- Biome for lint and format

## Choices
- **No UI library**: every component (wheel picker, drawer, swipe actions, select, drag-to-reorder...) is hand made. It's a good way to really learn Solid, keep full control on the mobile feel, and (re)discover native HTML/JS APIs along the way.
- **SQLite**: one file, no infra, fastest way to start locally.

## Core architecture
- **Server functions only**: no REST API. Each domain (`auth`, `exercises`, `workouts`, `records`) lives in `src/api`, and `src/api/index.ts` wraps them once with Solid's `query` / `action`, so caching and revalidation keys stay in one place. Routes preload their queries.
- **Auth on two levels**: a middleware redirects page loads to `/login`, and every query/action still calls `requireUserId()` itself. Session is a signed cookie, simple username/password for now.
- **Data model**: the exercise library is shared by everyone, workouts and records belong to a user. A workout is an ordered list of steps with targets, a record is what was really done (exercises, sets).
- **Exercises describe their own metrics** (sets, reps, weight, duration, distance), and targets are derived from them, so the UI never hardcodes fields per exercise type. Built-in ones (like Rest) are seeded by a migration and flagged in the database.
- **Errors are values**: actions validate with Zod and return an `Error` instead of throwing, the UI shows it inline. Unexpected errors go to one app-level `ErrorBoundary`.

## Code design
- `src/components/ui` holds the generic primitives, `src/components/pages/<page>` the page-specific parts, `src/lib` the pure logic (targets, durations, dates, gestures).
- Inputs work controlled or uncontrolled (`value` / `defaultValue`) through one small helper, and submit through native forms and `FormData`.
- Mobile first: swipe and drag to dismiss go through @use-gesture (touch events on touch screens, iOS Safari cancels pointer events when it scrolls). Long press to reorder stays hand made, the lib doesn't fit it.
- Logic stays out of JSX: derived values and named handlers sit above the `return`.
- Few comments, only for the *why*. Biome for lint and format.

## Developing
```bash
pnpm i
echo "SESSION_SECRET=$(openssl rand -hex 32)" > .env
pnpm run dev

# optional database UI
pnpm studio
```

In dev, a `dev` / `dev` user is created with some seeded exercises, workouts and records.

Web UI available at `https://local.drizzle.studio` for the database at `./drizzle/db.sqlite`

## Goals
- [x] simple data record (in during the session live)
- [x] simple week/month analysis and history
- [ ] year analysis
- [ ] strong visual identity
  - https://fonts.google.com/specimen/Bitcount+Single
- [ ] support running / gym
- [ ] add strava connection for running sync
- [ ] support multiple gym type of training (pyramid...)
- [ ] user and account support (simple connect button with classic provider github/google?)
- [ ] PWA
