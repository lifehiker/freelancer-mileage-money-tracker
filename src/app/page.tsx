import Link from "next/link";

import {
  FAQSection,
  FeatureGrid,
  MarketingFooter,
  MarketingHero,
  PricingTeaser,
} from "@/components/marketing-page";
import { Button, Card, SectionHeading } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
      <header className="rounded-[28px] border border-[var(--color-border)] bg-white px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
              Freelancer Mileage & Money Tracker
            </Link>
            <p className="text-sm text-[var(--color-muted)]">
              Mileage, expenses, income, and tax set-asides for self-employed work.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Button href="/pricing" variant="secondary">
              Pricing
            </Button>
            <Button href="/sign-in">Start free</Button>
          </nav>
        </div>
      </header>

      <MarketingHero />

      <section className="grid gap-8">
        <SectionHeading
          eyebrow="Why this app"
          title="Purpose-built for daily logging, not full bookkeeping"
          description="The product focuses on one job: capture deductible business activity quickly, keep the records clean, and export them later without friction."
        />
        <FeatureGrid />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-[var(--color-ink)] text-white">
          <SectionHeading
            eyebrow="Daily workflow"
            title="Open the app, log the activity, move on"
            description="Trips, expenses, and income each use a single-column mobile form with large tap targets and explicit IRS-ready fields."
          />
        </Card>
        <PricingTeaser />
      </section>

      <FAQSection />
      <MarketingFooter />
    </div>
  );
}
