import type { Metadata } from "next";

import { AppNotice } from "@/components/app-notice";
import { Button, Card, Field, Input, SectionHeading } from "@/components/ui";
import {
  continueWithGoogleAction,
  requestEmailCodeAction,
  verifyEmailCodeAction,
} from "@/lib/actions";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const email = typeof params.email === "string" ? params.email : "";
  const localCode = typeof params.code === "string" ? params.code : undefined;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-[linear-gradient(145deg,#fffdf9,_#f1e6d6)]">
          <SectionHeading
            eyebrow="Sign in"
            title={`Access ${APP_NAME}`}
            description="Use email to sign in. When email delivery credentials are not configured, the local verification code is shown on-screen so the app still works end to end."
          />
          <div className="mt-6 space-y-4">
            <AppNotice notice={notice} />
            <form action={requestEmailCodeAction} className="grid gap-4">
              <Field label="Email address">
                <Input defaultValue={email} name="email" placeholder="you@example.com" type="email" />
              </Field>
              <Button type="submit">Send sign-in code</Button>
            </form>
            <form action={continueWithGoogleAction}>
              <Button type="submit" variant="secondary" className="w-full">
                Continue with Google
              </Button>
            </form>
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Verify"
            title="Enter your code"
            description="Codes expire after 15 minutes. If email is not configured locally, use the code displayed below."
          />
          <div className="mt-6 space-y-4">
            {localCode ? (
              <div className="rounded-3xl border border-[var(--color-highlight)] bg-[var(--color-highlight)]/45 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Local fallback code
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[0.24em] text-[var(--color-ink)]">
                  {localCode}
                </p>
              </div>
            ) : null}
            <form action={verifyEmailCodeAction} className="grid gap-4">
              <Field label="Email address">
                <Input defaultValue={email} name="email" placeholder="you@example.com" type="email" />
              </Field>
              <Field label="6-digit code">
                <Input inputMode="numeric" maxLength={6} name="code" placeholder="123456" />
              </Field>
              <Button type="submit">Verify and continue</Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
