import { AppNotice } from "@/components/app-notice";
import { AppShell } from "@/components/app-shell";
import { SummaryCard } from "@/components/record-table";
import { TrendChart } from "@/components/trend-chart";
import { Button, Card, EmptyState, Pill, SectionHeading } from "@/components/ui";
import { calculateSummary, getPlanLabel, getUsageSnapshot } from "@/lib/calculations";
import { seedSampleDataAction, signOutAction } from "@/lib/actions";
import { requireOnboardedUser } from "@/lib/auth";
import { getAppData, getTrendData } from "@/lib/data";
import { formatCurrency, formatNumber, getMonthRange, getYearRange } from "@/lib/utils";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await requireOnboardedUser();
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const data = await getAppData(user.id);
  const monthRange = getMonthRange();
  const yearRange = getYearRange();

  const monthTrips = data.trips.filter((trip) => trip.date >= monthRange.start && trip.date <= monthRange.end);
  const monthExpenses = data.expenses.filter(
    (expense) => expense.date >= monthRange.start && expense.date <= monthRange.end,
  );
  const monthIncome = data.incomeEntries.filter(
    (entry) => entry.date >= monthRange.start && entry.date <= monthRange.end,
  );
  const yearTrips = data.trips.filter((trip) => trip.date >= yearRange.start && trip.date <= yearRange.end);
  const yearExpenses = data.expenses.filter(
    (expense) => expense.date >= yearRange.start && expense.date <= yearRange.end,
  );
  const yearIncome = data.incomeEntries.filter(
    (entry) => entry.date >= yearRange.start && entry.date <= yearRange.end,
  );

  const summary = calculateSummary({
    trips: monthTrips,
    expenses: monthExpenses,
    incomeEntries: monthIncome,
    mileageRate: data.businessProfile?.defaultMileageRate || 0.67,
    taxRate: data.businessProfile?.defaultTaxRate || 0.25,
  });
  const yearToDateSummary = calculateSummary({
    trips: yearTrips,
    expenses: yearExpenses,
    incomeEntries: yearIncome,
    mileageRate: data.businessProfile?.defaultMileageRate || 0.67,
    taxRate: data.businessProfile?.defaultTaxRate || 0.25,
  });
  const usage = getUsageSnapshot({
    trips: data.trips,
    expenses: data.expenses,
    incomeEntries: data.incomeEntries,
    exportUsage: data.exportUsage,
    subscription: data.subscription,
  });
  const trendData = getTrendData({
    trips: data.trips,
    expenses: data.expenses,
    incomeEntries: data.incomeEntries,
    mileageRate: data.businessProfile?.defaultMileageRate || 0.67,
  });

  return (
    <AppShell
      pathname="/app"
      userLabel={`${data.businessProfile?.businessName || user.email} • ${getPlanLabel(data.subscription)} plan`}
    >
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="bg-[linear-gradient(145deg,#fffdfa,_#f1e6d6)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Pill tone={usage.isPro ? "pro" : "default"}>
                  {usage.isPro ? "Pro active" : "Free plan"}
                </Pill>
                <SectionHeading
                  title="This month at a glance"
                  description="Track profit, mileage deduction, and tax reserve without reconstructing your records later."
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/app/reports" variant="secondary">
                  Open reports
                </Button>
                <form action={signOutAction}>
                  <Button type="submit" variant="ghost">
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </Card>
          <Card>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Free-plan usage
              </p>
              <div className="grid gap-3 text-sm text-[var(--color-muted)]">
                <p>Trips this month: {usage.tripsThisMonth}</p>
                <p>Expenses this month: {usage.expensesThisMonth}</p>
                <p>Income entries this month: {usage.incomeThisMonth}</p>
                <p>
                  CSV exports remaining:{" "}
                  {Number.isFinite(usage.remainingCsvExports) ? usage.remainingCsvExports : "Unlimited"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <AppNotice notice={notice} />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Business miles" value={`${formatNumber(summary.businessMiles)} mi`} />
          <SummaryCard
            label="Mileage deduction"
            value={formatCurrency(summary.mileageDeduction, data.businessProfile?.preferredCurrency || "USD")}
          />
          <SummaryCard
            label="Expenses"
            value={formatCurrency(summary.totalExpenses, data.businessProfile?.preferredCurrency || "USD")}
          />
          <SummaryCard
            label="Income"
            value={formatCurrency(summary.totalIncome, data.businessProfile?.preferredCurrency || "USD")}
          />
          <SummaryCard
            label="Tax set-aside"
            value={formatCurrency(summary.taxReserve, data.businessProfile?.preferredCurrency || "USD")}
          />
          <SummaryCard
            label="Net cashflow"
            value={formatCurrency(summary.netCashflow, data.businessProfile?.preferredCurrency || "USD")}
          />
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <SectionHeading
              eyebrow="Trend"
              title="Six-month money trend"
              description="A lightweight trend view for income, expenses, and the mileage deduction."
            />
            <div className="mt-6">
              <TrendChart data={trendData} currency={data.businessProfile?.preferredCurrency || "USD"} />
            </div>
          </Card>

          {data.trips.length || data.expenses.length || data.incomeEntries.length ? (
            <Card>
              <SectionHeading
                eyebrow="Tax reserve"
                title="Current month and year-to-date outlook"
                description="Use the month to manage near-term cash and the year-to-date estimate to stay ahead of quarterly taxes."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-panel)]/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    This month
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                    {formatCurrency(summary.taxReserve, data.businessProfile?.preferredCurrency || "USD")}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Based on {formatCurrency(summary.taxableProfit, data.businessProfile?.preferredCurrency || "USD")} in taxable profit.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-highlight)]/35 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Year to date
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                    {formatCurrency(yearToDateSummary.taxReserve, data.businessProfile?.preferredCurrency || "USD")}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Profit after expenses and mileage deduction:{" "}
                    {formatCurrency(yearToDateSummary.taxableProfit, data.businessProfile?.preferredCurrency || "USD")}.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
                <p>Latest trip: {data.trips[0] ? data.trips[0].purpose : "No trips yet"}</p>
                <p>Latest expense: {data.expenses[0] ? data.expenses[0].vendor : "No expenses yet"}</p>
                <p>Latest income: {data.incomeEntries[0] ? data.incomeEntries[0].clientSource : "No income yet"}</p>
              </div>
            </Card>
          ) : (
            <EmptyState
              title="Start with sample data or your first real entry"
              description="This account is empty, so the dashboard has nothing to summarize yet. Load demo records for screenshots and testing, or jump straight into logging."
              action={
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <form action={seedSampleDataAction}>
                    <Button type="submit">Load sample data</Button>
                  </form>
                  <Button href="/app/trips" variant="secondary">
                    Log first trip
                  </Button>
                </div>
              }
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
