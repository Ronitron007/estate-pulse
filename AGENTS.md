# AGENT INSTRUCTIONS

## Scope
- This file applies to the entire repository tree rooted at the project root.
- The repository is a Next.js 16.1.1 / React 19.2.3 application with Tailwind CSS 4 and Supabase-backed data.
- Follow the maintainer’s request for precision and minimal wording while keeping behavior intact; refer to `/Users/rohanmalik/.claude/CLAUDE.md` for the broader chat behavior shortcut.

## Commands

### Setup & Build
- `npm install` installs dependencies using the version lock in `package-lock.json`.
- `npm run dev` launches the Next.js Dev Server (`next dev`).
- `npm run build` performs a production build (`next build`).
- `npm start` runs the production server (`next start`).
- When verifying Docker or production changes, combine `npm run build` and `npm start` on the target host.

### Lint & Type Checks
- `npm run lint` runs `eslint` with `eslint-config-next` (core web vitals + TypeScript).
- Use `npx eslint "src/**/*.{ts,tsx}" --fix` to fix style issues before pushing, then rerun `npm run lint`.
- `npx tsc --noEmit` can be used as an ad-hoc type check if you need earlier feedback than `next build`.

### Tests
- There is no automated test suite yet in `package.json`.
- When contributors add tests, add a `test` script (Vitest, Jest, etc.) and document it here.
- For now, rely on `npm run lint` and `npm run build` for automated verification plus manual QA in `npm run dev`.

### Running a Single Test
- Once a test runner is installed, run `npm run test -- path/to/target.test.ts` to execute a single file.
- Alternatively, use the runner’s CLI directly (for example `npx vitest run src/foo.test.ts`) and pass the file path or test name.
- Keep tests fast; prefer targeted files so CI can exercise one module at a time.

## Code Style Guidelines

### Imports & Modules
- Import order: built-in packages first (Node, Next), third-party packages second (Lucide, Supabase, CVA), and internal aliases (`@/`) last.
- Use the `@/*` alias from `tsconfig.json` instead of long relative chains (e.g., `@/components`, `@/lib`).
- Prefer named imports over namespace imports unless the package exposes a common namespace (e.g., `Geist` font import).

### Formatting
- Stick to two-space indentation and keep lines under ~100 characters when possible.
- Trust `eslint-config-next` for formatting rules; run `npm run lint` to auto-detect formatting drift.
- Avoid a mixture of tabs/spaces; follow the existing whitespace style (spaces only).
- Maintain consistent double quotes for strings except where apostrophes make single quotes clearer.
- Omit semicolons when ESLint allows them but do not mix styles within the same file.

### Types & Interfaces
- Use `type` aliases for union literals (e.g., `ProjectStatus`, `PropertyType`) and `interface` for structured objects (e.g., `Project`, `Builder`).
- Suffix prop objects with `Props` (e.g., `PropertyGridProps`).
- Re-export shared type definitions from `src/types/database.ts` to keep data contracts centralized.
- Keep types strict (TS `strict: true` is enabled). Prefer `string | null` over `string | undefined` when data comes from Supabase.
- Avoid `any`; prefer `unknown` when unavoidable and narrow it immediately.

### Naming Conventions
- React components and hooks use PascalCase (e.g., `PropertyGrid`, `Header`, `PropertyCard`).
- Functions and variables use camelCase (`getProjects`, `featuredProjects`, `handleSignOut`).
- Environment variables and constants use SCREAMING_SNAKE (`NEXT_PUBLIC_SUPABASE_URL`).
- Files match their default export (e.g., `PropertyGrid.tsx` exports `PropertyGrid`).
- Prefer descriptive names in data queries (`getProjectsForMap`, `ProjectFilters`).

### Error Handling & Logging
- Supabase queries check for `error` before relying on `data`; return safe defaults such as empty arrays or `null`.
- Log failures with `console.error` and a context string; avoid throwing unless the caller expects it.
- Server utilities (e.g., `createClient` in `src/lib/supabase/server.ts`) assume required env vars and use `!` when the vars must exist.
- Use explicit fallbacks (empty arrays, `null`) when data fields are optional.

### React & Next Patterns
- Keep server components default (`app` files without `"use client"`), add the directive only when using state/hooks/browser APIs.
- Use `export default async function` for page-level components to allow data fetching inside.
- Leverage `Promise.all` to batch concurrent fetches (see `src/app/page.tsx`).
- When dealing with user state, lift logic into client components (`Header` uses `useState`/`useEffect`).
- Pass `showPrice` and other flags as props; avoid deep prop drilling by splitting into smaller components.
- Keep `Metadata` definitions near layouts (see `src/app/layout.tsx`).

### Styling & Tailwind
- Tailwind class lists should be readable—group related classes, keep `max-w`, `gap`, `p` values consistent.
- Use the shared `cn` helper from `src/lib/utils.ts` when conditionally adding classes.
- Use the `Button` component from `src/components/ui/button.tsx` to preserve consistent variants.
- Favor the Lucide icon set (e.g., `Building2`, `ArrowRight`) for UI consistency.
- Keep component structure semantic (`section`, `nav`, `footer` in `page.tsx`).

### State & Hooks
- Type state setters explicitly (e.g., `useState<SupabaseUser | null>`).
- Clean up subscriptions in `useEffect` (`subscription.unsubscribe()` in `Header`).
- Keep handler functions (`handleSignOut`) `async` when awaiting API calls.

### Data & Supabase
- Use `createServerClient`/`createBrowserClient` variants from `@supabase/ssr` depending on runtime scope.
- Follow the query pattern: `.from("table").select(...).not("published_at", "is", null)` to filter published rows.
- Transform Supabase relations after fetching (e.g., map amenities, extract unique cities).
- Return `[]` or `null` when data is missing to keep consumers from crashing.

### Routing & Navigation
- Link with `next/link` and avoid `a` tags unless necessary for external URLs.
- Keep query params encoded (`encodeURIComponent(city)`).
- Use `Button` variants to highlight primary actions (e.g., `variant="outline"`).
- Place shared layout components in `src/components/layout` and reuse them in `app/layout.tsx`.

### Assets & Public Folder
- Store static assets in `public/` when they are directly referenced in markup or `next/image`.
- Avoid `require`/`import` for files in `public`; reference them via relative URLs in components.

### Tooling Notes
- `eslint.config.mjs` extends `nextVitals`/`nextTs` and redefines default ignores; keep it synced when adding new directories.
- `tsconfig.json` has strict settings and path alias `@/*` pointing to `src`.
- Tailwind CSS 4 is configured via `tailwind.config.mjs` (if present) and PostCSS.
- `node_modules` is checked into the workspace for reproducible installs but is ignored by Git.

### Collaboration
- Keep PRs focused; smaller, reviewable commits are easier to debug.
- Mention lint failures explicitly in PR descriptions when a clean lint run is required.
- When you add new scripts or tooling (tests, formatting), document them here and update `README.md`.

## Cursor / Copilot Rules
- There are no `.cursor`, `.cursorrules`, or `.github/copilot-instructions.md` files in the repo.
- If such rules are added later, copy them verbatim into this section and mention their scope.

## Additional Notes
- Use the `cn` helper (which wraps `clsx` + `twMerge`) whenever Tailwind lists branch on logic.
- Keep shared UI elements inside `src/components/ui` and `src/components/layout` so variants stay consistent.
- Favor server components under `src/app` for data-heavy routes; add "use client" only when hooks or state are required.
- Use `@/lib/supabase/server.ts` for server data fetching and `@/lib/supabase/client.ts` for browser sessions.
- Always `await` Supabase calls, destructure `{ data, error }`, log on failure, and return typed fallbacks.
- Prefer `export async function` helpers so pages can `await` them directly instead of wiring custom wrappers.
- Place Tailwind-driven sections within semantic wrappers (`section`, `nav`, `footer`, etc.) to keep layout accessible.
- Add new data helpers to `src/lib/queries` and keep their return types tied to `src/types/database.ts`.
- Rely on Lucide icons (imported from `lucide-react`) to match the existing visual language.
- Reference assets in `public/` via relative URLs instead of bundling them through `import`/`require`.
- Document any new scripts, tests, or tooling in `README.md` so future agents know how to reproduce workflows.
- Keep `globals.css` for broad resets and prefer Tailwind utility classes for component-level styling.
- Load fonts via `next/font` inside `src/app/layout.tsx` to avoid CLS and keep the `metadata` definitions nearby.
- When introducing environment variables, respect the `NEXT_PUBLIC_` prefix for values consumed in the browser.
- Confirm every route/component cleans up subscriptions, avoids stale state, and keeps `useEffect` dependencies explicit.
- Keep `components.json` alias mapping in sync with new directories and the ShadCN UI settings.
- Add nested `AGENTS.md` when a subdirectory needs different conventions; note the scope in that file.
- Refer to `components.json` metadata (`style: new-york`, `tailwind.baseColor: neutral`, `iconLibrary: lucide`) when extending UI kits.

## References & Key Files
- `package.json`: scripts, dependencies, Next/Tailwind versions, and missing test harness.
- `components.json`: ShadCN UI configuration, alias map, and Tailwind/token hooks.
- `README.md`: quick-start instructions for dev/lint/build cycles.
- `src/app/layout.tsx`: font loading, `metadata`, and layout structure.
- `src/app/page.tsx`: example of server component layout, data fetching, and hero/features sections.
- `src/components/ui/button.tsx`: shared button variants driven by `class-variance-authority`.
- `src/lib/utils.ts`: `cn` wrapper around `clsx` + `twMerge` for class merging.
- `src/lib/queries/projects.ts`: Supabase query patterns, pagination filters, and error fallbacks.
- `src/types/database.ts`: canonical union literals, interfaces, and filter contracts.
- `eslint.config.mjs`: `nextVitals` + `nextTs` lint mix, default ignore overrides.
- `tsconfig.json`: strict settings and `@/*` path alias used throughout the repo.

