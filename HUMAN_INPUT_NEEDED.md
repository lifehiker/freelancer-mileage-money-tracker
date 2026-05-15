# Human Input Needed

The app runs locally without any external credentials by using safe fallbacks:
- email sign-in shows a local verification code when no email provider is configured
- billing can be tested through local Pro preview mode
- receipt uploads are stored on the local filesystem

Provide the following only when you want live production integrations:

## 1. Transactional email via Resend
- Add `RESEND_API_KEY`
- Add `RESEND_FROM_EMAIL`
- Use a verified sending domain/address in Resend

What this unlocks:
- real emailed sign-in codes instead of the local on-screen fallback

## 2. Stripe billing
- Add `STRIPE_SECRET_KEY`
- Add `STRIPE_PRICE_MONTHLY`
- Add `STRIPE_PRICE_YEARLY`
- Add `STRIPE_WEBHOOK_SECRET`
- Point Stripe webhooks at `/api/stripe/webhook`

What this unlocks:
- live checkout, subscription upgrades, and billing portal access instead of local Pro preview mode

## 3. Production receipt storage
- Current fallback stores uploaded receipts under `public/uploads/receipts`
- For a real deployment, connect this flow to managed object storage such as S3/R2/UploadThing

What this unlocks:
- durable receipt storage outside the app container filesystem

## 4. Production database persistence
- The shipped local-safe default uses SQLite at `prisma/dev.db`
- For production, either mount persistent storage for SQLite or switch the Prisma datasource to your managed database setup

What this unlocks:
- durable user/accounting data across container rebuilds and redeploys

## Deferred integration note
- The current app does not implement live Google OAuth.
- The PRD's sign-in requirement is covered today through the working email-code flow plus a guarded Google entry point that fails gracefully.
- If you want live Google OAuth later, that requires additional implementation work beyond just adding credentials.
