# Project guide for Claude

This is a SaaS starter template — Next.js 16, React 19, TypeScript, Tailwind, Supabase auth.

## Stack notes

- **Next.js 16** uses the `proxy.ts` convention (formerly `middleware.ts`). Export a function named `proxy`, not `middleware`.
- **React 19** with `react-hooks/set-state-in-effect` lint rule. Prefer lazy `useState` initializers over synchronous `setState` calls inside `useEffect` bodies.
- **TypeScript** is strict, including `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`. When writing optional fields on object literals, use conditional spread (`...(value != null && { key: value })`) rather than assigning `undefined`.
- **ESLint 9** uses flat config (`eslint.config.mjs`). The npm `lint` script calls `eslint` directly — `next lint` was removed in Next 16.
- **`@supabase/ssr` ≥ 0.10** is required for compatibility with `@supabase/supabase-js` ≥ 2.105 generic typings. The `Database` type must include `Relationships: []` on each table.

## Key files

- `src/proxy.ts` — auth gating
- `src/lib/auth/AuthContext.tsx` — client-side auth state, lazy loading init
- `src/lib/supabase/{client,server}.ts` — Supabase client factories
- `src/lib/auth/permissions.ts` — feature gates and tier limits
- `src/types/database.ts` — replace with `supabase gen types typescript` output once your schema is finalised
- `supabase-schema.sql` — run in Supabase SQL editor

## When extending

- Adding a Supabase table: update `supabase-schema.sql` AND `src/types/database.ts` (don't forget `Relationships: []`)
- Gating a feature: add it to `FeaturePermissions` in `src/types/auth.ts` and `FEATURE_PERMISSIONS` in `src/lib/auth/permissions.ts`
- New protected route: add it under `src/app/(dashboard)/` — the proxy already redirects unauthed users
