import type { Metadata } from "next";

import { MarketingFooter } from "@/components/marketing-page";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <Card>
        <SectionHeading
          eyebrow="Privacy"
          title="Privacy policy"
          description="This project stores the data you enter to power reports, exports, and account features."
        />
        <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
          <p>Business activity you enter, including mileage, expenses, income, and profile settings, is stored for your account.</p>
          <p>In local development, receipt uploads are stored on the local filesystem. Production deployments should move receipt storage to managed object storage.</p>
          <p>Authentication can use local verification codes when transactional email is not configured. When a mail provider is configured, sign-in codes are sent through that provider.</p>
          <p>You can delete your account at any time from the settings page, which removes your stored records from the local database.</p>
        </div>
      </Card>
      <MarketingFooter />
    </div>
  );
}
