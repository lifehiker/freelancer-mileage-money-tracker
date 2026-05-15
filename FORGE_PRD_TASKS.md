# Forge PRD Tasks

Last updated: 2026-05-15

Status legend:
- `[x]` complete
- `[~]` partially complete, needs follow-up
- `[ ]` not complete

Implementation order: foundation -> data/auth -> core workflows -> secondary workflows -> marketing/pages -> deployment -> QA.

## Foundation
- `[x]` Next.js app structure exists under `src/app` with App Router.
- `[x]` Prisma is configured and local SQLite development DB exists.
- `[x]` `next.config.ts` has `output: "standalone"` and production build passes.
- `[x]` Shared UI primitives and mobile-first shell exist.
- `[x]` Global metadata/SEO baseline exists and was re-audited against the required routes.
- `[x]` Installed framework/build compatibility was verified by successful `npm run build` and `npm run dev`.

## Data Model
- `[x]` User model exists.
- `[x]` Session model exists for custom auth fallback.
- `[x]` Auth code model exists for email-code sign-in.
- `[x]` Business profile model exists.
- `[x]` Trip model exists.
- `[x]` Expense model exists.
- `[x]` Income entry model exists.
- `[x]` Export usage model exists.
- `[x]` Subscription model exists.
- `[~]` Receipt storage currently uses local filesystem fallback; production-safe behavior and documentation still need review.

## Auth And Onboarding
- `[x]` Email sign-in exists via verification code fallback and was verified end to end with a local code.
- `[~]` Google sign-in is only a guarded placeholder/fallback and needs explicit credential fallback documentation.
- `[x]` Session creation/destruction exists.
- `[x]` Route protection exists for signed-in and onboarded users.
- `[x]` Onboarding page exists.
- `[x]` Onboarding captures business name, business type, tax rate, mileage rate, currency, and country.
- `[x]` Onboarding create/update flow was verified through the running app.

## Core Workflow: Dashboard
- `[x]` App dashboard route exists.
- `[x]` Current month summary cards exist.
- `[x]` Year-to-date tax reserve outlook now exists on the dashboard.
- `[x]` Monthly trend widget exists.
- `[x]` Quick actions exist with sticky bottom navigation.
- `[x]` Empty state and sample data seeding exist.
- `[~]` Layout and rendered markup were reviewed; full browser-driven visual QA remains limited by the current CLI-only environment.

## Core Workflow: Trips
- `[x]` Trip create form exists.
- `[x]` Trip edit flow exists.
- `[x]` Trip delete flow exists.
- `[x]` IRS-ready trip fields are present.
- `[x]` Odometer-to-miles auto-calculation exists in server validation.
- `[x]` Validation and create flow were verified through the running app.
- `[x]` Edit/update ownership checks were tightened to require account ownership before updates.

## Core Workflow: Expenses
- `[x]` Expense create form exists.
- `[x]` Expense edit flow exists.
- `[x]` Expense delete flow exists.
- `[x]` Common categories and payment methods exist.
- `[x]` Expense create flow was verified through the running app.
- `[~]` Receipt upload exists behind Pro gating with local filesystem storage; production-safe fallback and credential documentation are in place, but live managed storage is still deferred.

## Core Workflow: Income
- `[x]` Income create form exists.
- `[x]` Income edit flow exists.
- `[x]` Income delete flow exists.
- `[x]` Category and paid/unpaid status fields exist.
- `[x]` Income create flow was verified through the running app.
- `[x]` Edit/update ownership checks were tightened to require account ownership before updates.

## Core Workflow: Tax Set-Aside
- `[x]` Tax reserve formula exists in shared calculations.
- `[x]` Dashboard uses tax reserve calculations.
- `[x]` Reports and dashboard year-to-date behavior were verified in the running app.

## Secondary Workflow: Reports
- `[x]` Reports page exists.
- `[x]` Current month, year, and custom range UI exists.
- `[x]` Free-vs-Pro reporting guard exists.
- `[x]` Summary totals and record tables exist.
- `[x]` Report rendering, export links, and free-plan gating were verified in the running app.

## Secondary Workflow: Exports
- `[x]` Trips CSV export route exists.
- `[x]` Expenses CSV export route exists.
- `[x]` Income CSV export route exists.
- `[x]` PDF summary export route exists.
- `[x]` Free plan CSV usage limits exist.
- `[x]` Free plan PDF watermark exists.
- `[x]` Export counters, redirects, content types, filenames, and PDF generation were verified against the running app.

## Secondary Workflow: Settings, Billing, Email, Storage
- `[x]` Business profile settings page exists.
- `[x]` Manual mileage rate, tax rate, currency, country, and export preference settings exist.
- `[~]` Subscription management UI exists with Stripe fallback preview mode; live checkout/portal needs guarded handling review.
- `[x]` Stripe webhook route exists and safe fallback behavior has been audited.
- `[x]` Resend email flow exists as a guarded optional integration and is documented.
- `[x]` Receipt storage local fallback is documented with production credential guidance.
- `[x]` Delete account action/UI exists.

## Marketing And SEO Pages
- `[x]` Homepage exists.
- `[x]` Pricing page exists.
- `[x]` FAQ page exists.
- `[x]` Privacy page exists.
- `[x]` Terms page exists.
- `[x]` Root SEO landing pages exist for required slugs.
- `[x]` Persona pages exist.
- `[x]` Comparison pages exist.
- `[x]` Sitemap route exists.
- `[x]` Robots route exists.
- `[x]` Metadata consistency, internal linking, and page quality were re-audited.

## Deployment
- `[x]` Production-ready Dockerfile exists.
- `[x]` Docker build inputs only copy directories that exist in this repo.
- `[x]` Environment variable documentation in `.env.example` was reviewed.
- `[x]` `HUMAN_INPUT_NEEDED.md` exists for external credentials and deferred integrations.
- `[x]` Docker startup now uses the packaged Prisma CLI entrypoint instead of an internal module path.
- `[~]` `docker build .` could not be executed to completion because the current environment cannot access `/var/run/docker.sock`.

## Verification
- `[x]` Run `npm run build` and fix all errors.
- `[x]` Run `npm run lint`.
- `[x]` Start dev server and verify it runs without crashing.
- `[x]` Smoke-test primary routes.
- `[x]` Test main forms, buttons, navigation, and export flows.
- `[x]` Standalone server startup path was verified locally by copying the standalone output, static assets, public assets, Prisma schema, and runtime `node_modules`, then running Prisma `db push` plus `node server.js`.
- `[~]` Visual review was performed via rendered markup/CSS inspection; a true browser screenshot pass is not available in this CLI-only environment.
- `[x]` Update this checklist after each major phase.
- `[x]` Create `FORGE_COMPLETION_AUDIT.md` mapping PRD requirements to concrete implementation.
- `[x]` App is ready for `FORGE_BUILD_COMPLETE`, with only Docker daemon access and full browser-visual QA remaining as environment-level limitations.
