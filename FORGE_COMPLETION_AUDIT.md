# Forge Completion Audit

Last updated: 2026-05-15

This audit maps the major PRD requirements to concrete implementation files, routes, and actions in the current app.

## Foundation
- App Router structure and global app chrome:
  - `src/app/layout.tsx`
  - `src/app/app/layout.tsx`
  - `src/app/globals.css`
  - `src/components/ui.tsx`
  - `src/components/app-shell.tsx`
- Standalone deployment configuration:
  - `next.config.ts`
- Database client:
  - `src/lib/db.ts`

## Data Model
- User, session, auth code, business profile, trip, expense, income, export usage, and subscription models:
  - `prisma/schema.prisma`
- Local SQLite development persistence:
  - `.env`
  - `.env.example`
  - `prisma/dev.db`

## Auth
- Email code request and verification:
  - Route: `/sign-in`
  - `src/app/sign-in/page.tsx`
  - `src/lib/actions.ts`
    - `requestEmailCodeAction`
    - `verifyEmailCodeAction`
- Session creation, lookup, and teardown:
  - `src/lib/auth.ts`
    - `createSession`
    - `destroySession`
    - `getCurrentUser`
    - `requireUser`
    - `requireOnboardedUser`
- Safe Google sign-in fallback entry point:
  - `src/lib/actions.ts`
    - `continueWithGoogleAction`
- Sign-out:
  - `src/lib/actions.ts`
    - `signOutAction`

## Onboarding
- Onboarding UI:
  - Route: `/onboarding`
  - `src/app/onboarding/page.tsx`
- Business profile persistence:
  - `src/lib/actions.ts`
    - `saveOnboardingAction`
- Default business profile and subscription creation:
  - `src/lib/auth.ts`
    - `ensureUserAndProfile`

## Dashboard
- Main app dashboard:
  - Route: `/app`
  - `src/app/app/page.tsx`
- Monthly summary cards and tax logic:
  - `src/components/record-table.tsx`
  - `src/lib/calculations.ts`
- Year-to-date tax reserve outlook:
  - `src/app/app/page.tsx`
- Six-month trend widget:
  - `src/components/trend-chart.tsx`
  - `src/lib/data.ts`
- Sticky quick actions:
  - `src/components/app-shell.tsx`

## Trips Workflow
- Trips page and form:
  - Route: `/app/trips`
  - `src/app/app/trips/page.tsx`
- Trip table and edit/delete UI:
  - `src/components/record-table.tsx`
- Trip create/update/delete actions:
  - `src/lib/actions.ts`
    - `saveTripAction`
    - `deleteTripAction`
- Trip validation, odometer-derived miles, and ownership enforcement:
  - `src/lib/actions.ts`
    - `tripSchema`
    - `ensureOwnedRecord`

## Expenses Workflow
- Expenses page and form:
  - Route: `/app/expenses`
  - `src/app/app/expenses/page.tsx`
- Expense table and edit/delete UI:
  - `src/components/record-table.tsx`
- Expense create/update/delete actions:
  - `src/lib/actions.ts`
    - `saveExpenseAction`
    - `deleteExpenseAction`
- Receipt upload fallback:
  - `src/lib/actions.ts`
    - `saveReceiptFile`

## Income Workflow
- Income page and form:
  - Route: `/app/income`
  - `src/app/app/income/page.tsx`
- Income table and edit/delete UI:
  - `src/components/record-table.tsx`
- Income create/update/delete actions:
  - `src/lib/actions.ts`
    - `saveIncomeAction`
    - `deleteIncomeAction`
- Ownership enforcement for updates:
  - `src/lib/actions.ts`
    - `ensureOwnedRecord`

## Tax Set-Aside Calculator
- Shared formula implementation:
  - `src/lib/calculations.ts`
    - `calculateSummary`
- Dashboard usage:
  - Route: `/app`
  - `src/app/app/page.tsx`
- Reports usage:
  - Route: `/app/reports`
  - `src/app/app/reports/page.tsx`

## Reports
- Reports UI, period filters, summary cards, and record tables:
  - Route: `/app/reports`
  - `src/app/app/reports/page.tsx`
- Date range helpers:
  - `src/lib/utils.ts`
    - `getMonthRange`
    - `getYearRange`
    - `getRangeFromParams`
- Shared app data loading:
  - `src/lib/data.ts`

## Exports
- Trips CSV export:
  - Route: `/api/exports/trips.csv`
  - `src/app/api/exports/[file]/route.ts`
- Expenses CSV export:
  - Route: `/api/exports/expenses.csv`
  - `src/app/api/exports/[file]/route.ts`
- Income CSV export:
  - Route: `/api/exports/income.csv`
  - `src/app/api/exports/[file]/route.ts`
- PDF summary export:
  - Route: `/api/exports/summary.pdf`
  - `src/app/api/exports/[file]/route.ts`
  - `src/lib/pdf-summary.tsx`
- Export usage tracking and free-plan gating:
  - `src/lib/export-usage.ts`
  - `src/lib/calculations.ts`
  - `src/app/api/exports/[file]/route.ts`

## Settings, Billing, And Account Management
- Settings UI:
  - Route: `/app/settings`
  - `src/app/app/settings/page.tsx`
- Business profile updates:
  - `src/lib/actions.ts`
    - `saveSettingsAction`
- Local-safe Pro preview and billing portal flow:
  - `src/lib/actions.ts`
    - `activateProPreviewAction`
    - `openBillingPortalAction`
    - `downgradeToFreeAction`
- Stripe webhook handling:
  - Route: `/api/stripe/webhook`
  - `src/app/api/stripe/webhook/route.ts`
- Delete account:
  - `src/lib/actions.ts`
    - `deleteAccountAction`

## Email And Storage Integrations
- Optional Resend email delivery with safe fallback:
  - `src/lib/actions.ts`
    - `sendEmailCode`
- Local receipt storage fallback:
  - `src/lib/actions.ts`
    - `saveReceiptFile`
- External credential guidance:
  - `HUMAN_INPUT_NEEDED.md`

## Marketing And SEO
- Homepage:
  - Route: `/`
  - `src/app/page.tsx`
  - `src/components/marketing-page.tsx`
- Pricing:
  - Route: `/pricing`
  - `src/app/pricing/page.tsx`
- FAQ:
  - Route: `/faq`
  - `src/app/faq/page.tsx`
- Privacy:
  - Route: `/privacy`
  - `src/app/privacy/page.tsx`
- Terms:
  - Route: `/terms`
  - `src/app/terms/page.tsx`
- Root SEO landing pages:
  - Routes: `/<slug>`
  - `src/app/[slug]/page.tsx`
  - `src/lib/constants.ts`
    - `ROOT_SEO_PAGES`
- Persona pages:
  - Routes: `/for/realtors`, `/for/contractors`, `/for/gig-workers`
  - `src/app/for/[persona]/page.tsx`
  - `src/lib/constants.ts`
    - `PERSONA_PAGES`
- Comparison pages:
  - Routes: `/compare/mileiq-alternative`, `/compare/stride-alternative`, `/compare/quickbooks-self-employed-alternative`
  - `src/app/compare/[slug]/page.tsx`
  - `src/lib/constants.ts`
    - `COMPARE_PAGES`
- Sitemap and robots:
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`

## Deployment
- Production Dockerfile:
  - `Dockerfile`
- Docker context exclusions:
  - `.dockerignore`
- Standalone Next build output:
  - `next.config.ts`
- Container startup schema sync:
  - `Dockerfile`
    - uses `npx --no-install prisma db push --skip-generate` before `node server.js`

## Verified In This Session
- `npm install`
- `npm run build`
- `npm run lint`
- `npm run dev`
- Standalone runtime boot path:
  - copied `.next/standalone`, `.next/static`, `public`, `prisma`, and runtime `node_modules` into a temp directory
  - ran Prisma schema sync successfully
  - launched `server.js` on `127.0.0.1:3111` and confirmed `GET /` returned `200 OK`
- Public route smoke tests:
  - `/`
  - `/pricing`
  - `/faq`
  - `/mileage-tracker-for-self-employed`
  - `/sign-in`
- Authenticated route smoke tests:
  - `/app`
  - `/app/trips`
  - `/app/expenses`
  - `/app/income`
  - `/app/reports`
  - `/app/settings`
- End-to-end local sign-in fallback:
  - requested local email code
  - verified code
  - received session cookie
  - completed onboarding
- Form submissions verified over HTTP:
  - trip create
  - expense create
  - income create
- Export verification:
  - trips CSV response and content
  - expenses CSV response and content
  - income CSV response and content
  - summary PDF response headers
  - free-plan CSV limit redirect after the monthly cap was reached

## Intentionally Deferred External-Credential Items
- Live Google OAuth:
  - deferred because it needs additional implementation plus Google OAuth credentials
  - app still runs because email-code sign-in is fully functional
- Live Resend email delivery:
  - deferred pending `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
  - app still runs because local code fallback is built in
- Live Stripe checkout and billing portal:
  - deferred pending Stripe credentials and price IDs
  - app still runs because Pro preview mode exercises gated functionality without live billing
- Managed object storage for receipts:
  - deferred pending storage provider selection and credentials
  - app still runs because local filesystem receipt storage exists for development
- Durable production database infrastructure:
  - deferred pending mounted SQLite persistence or a managed database
  - app still runs locally and in a container with mounted persistence

## Environment-Level Verification Limits
- `docker build .` could not be executed because this environment does not have permission to access `/var/run/docker.sock`.
- Full browser-driven visual QA was not possible from the current CLI-only environment, so final UI review was based on rendered HTML/CSS inspection plus route and interaction smoke tests.
