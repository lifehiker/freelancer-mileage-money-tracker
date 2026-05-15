import Link from "next/link";

import { Button, Card, SectionHeading } from "@/components/ui";
import { APP_NAME, APP_TAGLINE, FAQS } from "@/lib/constants";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[var(--color-border)] bg-[radial-gradient(circle_at_top_left,_rgba(237,201,115,0.35),_transparent_38%),linear-gradient(140deg,#fffdf9,_#f6efe2)] px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(19,111,99,0.16),_transparent_55%)] lg:block" />
      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-accent)]">
            Mobile-first freelance finance tracker
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Track trips, expenses, income, and tax set-asides without heavy accounting software.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              {APP_TAGLINE} Built for freelancers, contractors, realtors, and gig workers who need
              IRS-ready records and clean exports.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/sign-in">Start free</Button>
            <Button href="/pricing" variant="secondary">
              View pricing
            </Button>
          </div>
        </div>
        <Card className="bg-[rgba(255,255,255,0.78)]">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">This month</p>
                <p className="text-3xl font-semibold tracking-tight text-[var(--color-ink)]">$4,820</p>
              </div>
              <span className="rounded-full bg-[var(--color-highlight)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
                Estimated reserve $918
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Business miles", "362.4 mi"],
                ["Mileage deduction", "$242.81"],
                ["Expenses", "$1,140"],
                ["Income", "$5,960"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-[var(--color-border)] bg-white px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">{label}</p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function FeatureGrid() {
  const features = [
    {
      title: "Manual mileage logging that stays clean",
      description:
        "Log the exact fields you need for business mileage instead of cleaning up auto-detected trips later.",
    },
    {
      title: "Expenses and income in the same workflow",
      description:
        "Capture fuel, tolls, invoices, payouts, and reimbursements in one app built for self-employed work.",
    },
    {
      title: "Tax reserve estimates by default",
      description:
        "See how much profit to set aside using your tax rate and mileage deduction, month by month.",
    },
    {
      title: "Reports and exports without hostage pricing",
      description:
        "Free users still get limited exports. Pro unlocks unlimited CSV, clean PDFs, uploads, and flexible reporting.",
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {features.map((feature) => (
        <Card key={feature.title}>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
              {feature.title}
            </h3>
            <p className="text-sm leading-7 text-[var(--color-muted)]">{feature.description}</p>
          </div>
        </Card>
      ))}
    </section>
  );
}

export function PricingTeaser() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="bg-[var(--color-panel)]">
        <SectionHeading
          eyebrow="Free"
          title="Useful before you pay"
          description="Monthly logging, a current-month dashboard, limited CSV exports, and a watermarked PDF summary."
        />
      </Card>
      <Card className="bg-[var(--color-highlight)]">
        <SectionHeading
          eyebrow="Pro"
          title="$6/month or $49/year"
          description="Unlimited records, unlimited exports, clean PDFs, receipt uploads, and custom date range reporting."
        />
      </Card>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="space-y-4">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions freelancers ask before switching"
        description="The product is intentionally narrow: fast capture, clean exports, simple reporting."
      />
      <div className="grid gap-4">
        {FAQS.map((faq) => (
          <Card key={faq.question}>
            <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
              {faq.question}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function MarketingFooter() {
  return (
    <footer className="rounded-[32px] border border-[var(--color-border)] bg-white px-6 py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{APP_NAME}</p>
          <p className="text-sm text-[var(--color-muted)]">
            Simple mileage, expense, income, and tax tracking for self-employed work.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

export function FocusPage({
  title,
  hero,
  intro,
  bullets,
}: {
  title: string;
  hero: string;
  intro?: string;
  bullets: readonly string[];
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-[var(--color-border)] bg-[linear-gradient(145deg,#fffdf9,_#f4ede1)] px-6 py-12 sm:px-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            {APP_NAME}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">{hero}</p>
          {intro ? <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">{intro}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/sign-in">Try the app</Button>
            <Button href="/pricing" variant="secondary">
              Compare plans
            </Button>
          </div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {bullets.map((bullet) => (
          <Card key={bullet}>
            <p className="text-base leading-8 text-[var(--color-ink)]">{bullet}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
