import { AppNotice } from "@/components/app-notice";
import { AppShell } from "@/components/app-shell";
import { Banner, Button, Card, Field, Input, SectionHeading } from "@/components/ui";
import {
  activateProPreviewAction,
  deleteAccountAction,
  downgradeToFreeAction,
  openBillingPortalAction,
  saveSettingsAction,
} from "@/lib/actions";
import { requireOnboardedUser } from "@/lib/auth";
import { BUSINESS_TYPES } from "@/lib/constants";
import { getAppData } from "@/lib/data";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await requireOnboardedUser();
  const data = await getAppData(user.id);
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const isPro = data.subscription?.plan === "PRO";

  return (
    <AppShell
      pathname="/app/settings"
      userLabel={`${data.businessProfile?.businessName || user.email} • Settings and billing`}
    >
      <div className="space-y-6">
        <AppNotice notice={notice} />

        <Card>
          <SectionHeading
            eyebrow="Business profile"
            title="Defaults used across the app"
            description="These settings control tax reserve calculations, mileage deduction estimates, exports, and profile details."
          />
          <form action={saveSettingsAction} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Business name">
                <Input defaultValue={data.businessProfile?.businessName || ""} name="businessName" />
              </Field>
            </div>
            <Field label="Business type">
              <select
                className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
                defaultValue={data.businessProfile?.businessType || "Freelancer"}
                name="businessType"
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Preferred currency">
              <Input defaultValue={data.businessProfile?.preferredCurrency || "USD"} maxLength={3} name="preferredCurrency" />
            </Field>
            <Field label="Default tax rate">
              <Input defaultValue={data.businessProfile?.defaultTaxRate || 0.25} min="0" max="1" name="defaultTaxRate" step="0.01" type="number" />
            </Field>
            <Field label="Default mileage rate">
              <Input defaultValue={data.businessProfile?.defaultMileageRate || 0.67} min="0" name="defaultMileageRate" step="0.01" type="number" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Country">
                <Input defaultValue={data.businessProfile?.country || "United States"} name="country" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Export preference">
                <Input defaultValue={data.businessProfile?.exportPreference || "csv-first"} name="exportPreference" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Save settings</Button>
            </div>
          </form>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Subscription"
            title={isPro ? "You are on Pro" : "Upgrade to Pro"}
            description="Live Stripe billing is guarded behind credentials. Until then, the app offers a local Pro preview mode so gated features can still be tested."
          />
          <div className="mt-6 space-y-4">
            {!process.env.STRIPE_SECRET_KEY ? (
              <Banner tone="warn">
                Stripe credentials are not configured. Billing actions use a local preview mode instead of live checkout.
              </Banner>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <form action={activateProPreviewAction}>
                <input type="hidden" name="billingCycle" value="monthly" />
                <Button type="submit">{isPro ? "Refresh Pro" : "Start Pro monthly"}</Button>
              </form>
              <form action={activateProPreviewAction}>
                <input type="hidden" name="billingCycle" value="yearly" />
                <Button type="submit" variant="secondary">
                  Start Pro yearly
                </Button>
              </form>
              <form action={openBillingPortalAction}>
                <Button type="submit" variant="ghost">
                  Manage subscription
                </Button>
              </form>
              {isPro ? (
                <form action={downgradeToFreeAction}>
                  <Button type="submit" variant="ghost">
                    Return to Free
                  </Button>
                </form>
              ) : null}
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Account"
            title="Delete account"
            description="This removes your profile, sessions, and all tracked records from the local database."
          />
          <div className="mt-6">
            <form action={deleteAccountAction}>
              <Button type="submit" variant="danger">
                Delete account
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
