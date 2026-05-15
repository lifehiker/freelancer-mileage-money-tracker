import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing-page";
import { Button, Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-4 sm:px-6">
      <section className="rounded-[36px] border border-[var(--color-border)] bg-[linear-gradient(145deg,#fffdf9,_#f2e8db)] px-6 py-12 sm:px-10">
        <SectionHeading
          eyebrow="Pricing"
          title="Free to start, simple when you need more"
          description="The free tier is intentionally usable. Pro removes limits, unlocks clean PDFs and flexible reporting, and adds receipt uploads."
        />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-white">
          <SectionHeading
            eyebrow="Free"
            title="$0"
            description="For freelancers who want a reliable monthly log and some export access before upgrading."
          />
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <li>Up to 30 trips per month</li>
            <li>Up to 20 expenses per month</li>
            <li>Up to 20 income entries per month</li>
            <li>3 CSV exports per month</li>
            <li>Watermarked PDF summary</li>
            <li>1 business profile and current-month dashboard</li>
          </ul>
          <div className="mt-6">
            <Button href="/sign-in">Start free</Button>
          </div>
        </Card>
        <Card className="bg-[var(--color-highlight)]">
          <SectionHeading
            eyebrow="Pro"
            title="$6/month or $49/year"
            description="For self-employed operators who want unlimited records and tax-ready reports."
          />
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-ink)]">
            <li>Unlimited trips, expenses, and income entries</li>
            <li>Unlimited CSV exports</li>
            <li>Clean PDF summaries</li>
            <li>Year-to-date and custom range reporting</li>
            <li>Receipt uploads</li>
            <li>Priority support and future features included</li>
          </ul>
          <div className="mt-6">
            <Button href="/sign-in">Try Pro workflow</Button>
          </div>
        </Card>
      </section>
      <Card>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          Need more context first? Compare the app against{" "}
          <Link className="text-[var(--color-accent)] underline-offset-2 hover:underline" href="/compare/mileiq-alternative">
            MileIQ
          </Link>
          ,{" "}
          <Link className="text-[var(--color-accent)] underline-offset-2 hover:underline" href="/compare/stride-alternative">
            Stride
          </Link>
          , and{" "}
          <Link
            className="text-[var(--color-accent)] underline-offset-2 hover:underline"
            href="/compare/quickbooks-self-employed-alternative"
          >
            QuickBooks Self-Employed
          </Link>
          .
        </p>
      </Card>
      <MarketingFooter />
    </div>
  );
}
