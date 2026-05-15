import { redirect } from "next/navigation";

import { AppNotice } from "@/components/app-notice";
import { Button, Card, Field, Input, Select, SectionHeading } from "@/components/ui";
import { saveOnboardingAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import {
  BUSINESS_TYPES,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_MILEAGE_RATE,
  DEFAULT_TAX_RATE,
} from "@/lib/constants";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.onboardingCompleted) {
    redirect("/app");
  }

  const params = await searchParams;
  const notice = typeof params.notice === "string" ? params.notice : undefined;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-6">
      <Card className="w-full">
        <SectionHeading
          eyebrow="Onboarding"
          title="Set up your business profile"
          description="These defaults power the dashboard, mileage deduction estimate, and tax reserve calculator. You can edit them later in settings."
        />
        <div className="mt-6 space-y-4">
          <AppNotice notice={notice} />
          <form action={saveOnboardingAction} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Business name">
                <Input defaultValue={user.businessProfile?.businessName || ""} name="businessName" placeholder="Northside Studio LLC" />
              </Field>
            </div>
            <Field label="Business type">
              <Select defaultValue={user.businessProfile?.businessType || "Freelancer"} name="businessType">
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Preferred currency">
              <Input defaultValue={user.businessProfile?.preferredCurrency || DEFAULT_CURRENCY} maxLength={3} name="preferredCurrency" />
            </Field>
            <Field label="Default tax rate">
              <Input defaultValue={user.businessProfile?.defaultTaxRate || DEFAULT_TAX_RATE} min="0" max="1" name="defaultTaxRate" step="0.01" type="number" />
            </Field>
            <Field label="Default mileage rate">
              <Input defaultValue={user.businessProfile?.defaultMileageRate || DEFAULT_MILEAGE_RATE} min="0" name="defaultMileageRate" step="0.01" type="number" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Country">
                <Input defaultValue={user.businessProfile?.country || DEFAULT_COUNTRY} name="country" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Finish setup</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
