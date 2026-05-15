import { AppNotice } from "@/components/app-notice";
import { AppShell } from "@/components/app-shell";
import { ExpensesTable, IncomeTable, SummaryCard, TripsTable } from "@/components/record-table";
import { Banner, Button, Card, EmptyState, Field, Input, SectionHeading } from "@/components/ui";
import { calculateSummary } from "@/lib/calculations";
import { requireOnboardedUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { formatCurrency, formatDateInput, formatNumber, getRangeFromParams } from "@/lib/utils";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await requireOnboardedUser();
  const data = await getAppData(user.id);
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const range = getRangeFromParams(params);
  const isPro = data.subscription?.plan === "PRO";

  const effectiveRange =
    !isPro && range.period !== "month"
      ? { period: "month", start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() }
      : range;

  const filteredTrips = data.trips.filter((trip) => trip.date >= effectiveRange.start && trip.date <= effectiveRange.end);
  const filteredExpenses = data.expenses.filter(
    (expense) => expense.date >= effectiveRange.start && expense.date <= effectiveRange.end,
  );
  const filteredIncome = data.incomeEntries.filter(
    (entry) => entry.date >= effectiveRange.start && entry.date <= effectiveRange.end,
  );

  const summary = calculateSummary({
    trips: filteredTrips,
    expenses: filteredExpenses,
    incomeEntries: filteredIncome,
    mileageRate: data.businessProfile?.defaultMileageRate || 0.67,
    taxRate: data.businessProfile?.defaultTaxRate || 0.25,
  });
  const currency = data.businessProfile?.preferredCurrency || "USD";
  const query = `start=${formatDateInput(effectiveRange.start)}&end=${formatDateInput(effectiveRange.end)}`;

  return (
    <AppShell
      pathname="/app/reports"
      userLabel={`${data.businessProfile?.businessName || user.email} • Reports and exports`}
    >
      <div className="space-y-6">
        <Card>
          <SectionHeading
            eyebrow="Reports"
            title="Monthly, yearly, and custom summaries"
            description="Free accounts stay on current-month reporting. Pro unlocks flexible ranges, clean PDF summaries, and unlimited exports."
          />
          <div className="mt-6 space-y-4">
            <AppNotice notice={notice} />
            {!isPro ? (
              <Banner tone="warn">
                You are on the free plan. Yearly and custom date range reporting are locked to the current month until you upgrade.
              </Banner>
            ) : null}
            <form action="/app/reports" className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-1">
                <Field label="Start date">
                  <Input defaultValue={formatDateInput(effectiveRange.start)} name="start" type="date" />
                </Field>
              </div>
              <div className="sm:col-span-1">
                <Field label="End date">
                  <Input defaultValue={formatDateInput(effectiveRange.end)} name="end" type="date" />
                </Field>
              </div>
              <div className="sm:col-span-1">
                <Field label="Period">
                  <select
                    className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
                    defaultValue={effectiveRange.period}
                    name="period"
                  >
                    <option value="month">Current month</option>
                    <option value="year">Current year</option>
                    <option value="custom">Custom range</option>
                  </select>
                </Field>
              </div>
              <div className="sm:col-span-1 flex items-end">
                <Button type="submit" className="w-full">
                  Update report
                </Button>
              </div>
            </form>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={`/api/exports/trips.csv?${query}`} variant="secondary">
                Export trips CSV
              </Button>
              <Button href={`/api/exports/expenses.csv?${query}`} variant="secondary">
                Export expenses CSV
              </Button>
              <Button href={`/api/exports/income.csv?${query}`} variant="secondary">
                Export income CSV
              </Button>
              <Button href={`/api/exports/summary.pdf?${query}`}>Export summary PDF</Button>
            </div>
          </div>
        </Card>

        {filteredTrips.length || filteredExpenses.length || filteredIncome.length ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SummaryCard label="Business miles" value={`${formatNumber(summary.businessMiles)} mi`} />
              <SummaryCard label="Mileage deduction" value={formatCurrency(summary.mileageDeduction, currency)} />
              <SummaryCard label="Expenses" value={formatCurrency(summary.totalExpenses, currency)} />
              <SummaryCard label="Income" value={formatCurrency(summary.totalIncome, currency)} />
              <SummaryCard label="Tax set-aside" value={formatCurrency(summary.taxReserve, currency)} />
              <SummaryCard label="Net cashflow" value={formatCurrency(summary.netCashflow, currency)} />
            </section>
            <TripsTable trips={filteredTrips} currency={currency} />
            <ExpensesTable expenses={filteredExpenses} currency={currency} />
            <IncomeTable incomeEntries={filteredIncome} currency={currency} />
          </>
        ) : (
          <EmptyState
            title="No data in this report range"
            description="Try a broader period or start by logging trips, expenses, or income."
          />
        )}
      </div>
    </AppShell>
  );
}
