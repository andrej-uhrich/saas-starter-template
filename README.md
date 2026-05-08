# SaaS Starter Template

Next.js 16 + React 19 + TypeScript + Tailwind + Supabase auth, wired up and ready to extend.

## What's included

- **Next.js 16 App Router** with route groups for `(auth)`, `(dashboard)`, and `(marketing)`
- **React 19** with strict TypeScript (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- **Supabase auth** — sign up, sign in, forgot/reset password, server + browser clients
- **Session-aware proxy** (Next 16 `proxy.ts`) that protects `/dashboard` and redirects authed users away from `/login`
- **Tailwind CSS** with a small SaaS design system (`saas-container`, `saas-card`, `saas-button-primary`, tier color tokens)
- **Permissions layer** — tier hierarchy (`PUBLIC` → `AUTHENTICATED` → `BASIC` → `PRO` → `ENTERPRISE`), `hasFeatureAccess`, `isWithinLimit`
- **`profiles` table** with RLS policies and an auto-create-on-signup trigger
- **ESLint 9 flat config** with `eslint-config-next` 16

## Quickstart

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Set up the database
# Open the Supabase SQL editor and run supabase-schema.sql

# 4. Run
npm run dev
```

Open http://localhost:3000.

## Routes

- `/` — landing page
- `/about`, `/pricing` — marketing placeholders
- `/login`, `/register`, `/forgot-password`, `/reset-password` — auth
- `/dashboard` — protected, requires sign-in
- `/profile` — edit name, change password, sign out

## Project layout

```
src/
├── app/
│   ├── (auth)/         # Login, register, password reset
│   ├── (dashboard)/    # Protected routes
│   ├── (marketing)/    # Public marketing pages
│   ├── layout.tsx      # Root layout + AuthProvider
│   └── page.tsx        # Landing page
├── components/
│   ├── auth/           # LoginButton, etc.
│   └── layout/         # Header
├── lib/
│   ├── auth/           # AuthContext, permissions
│   ├── supabase/       # Browser + server clients
│   └── utils.ts
├── types/              # Database, auth types
└── proxy.ts            # Next 16 proxy (was middleware)
```

## Customising

1. **Branding** — search-and-replace `SaaS Starter` in `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/app/(auth)/layout.tsx`, `src/app/(marketing)/layout.tsx`
2. **Database** — add tables to `supabase-schema.sql` and reflect them in `src/types/database.ts` (or replace with `supabase gen types typescript` output)
3. **Tiers / limits** — edit `src/lib/auth/permissions.ts`
4. **Tailwind tokens** — edit `tailwind.config.ts`

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — run production build
- `npm run lint` — ESLint
