import type { Metadata } from "next";

import { MarketingFooter } from "@/components/marketing-page";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <Card>
        <SectionHeading
          eyebrow="Terms"
          title="Terms of use"
          description="Use the app to maintain your own business records. You remain responsible for reviewing exports and tax filings before submission."
        />
        <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
          <p>The app is provided as a recordkeeping tool for freelancers and self-employed users.</p>
          <p>Tax reserve estimates are informational only and depend on the completeness and accuracy of the entries you provide.</p>
          <p>Live billing, email, and storage integrations may require third-party credentials configured by the deployer.</p>
          <p>If you no longer want to use the service, you can delete your account from the settings page.</p>
        </div>
      </Card>
      <MarketingFooter />
    </div>
  );
}
