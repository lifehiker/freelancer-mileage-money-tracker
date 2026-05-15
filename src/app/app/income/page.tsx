import { AppNotice } from "@/components/app-notice";
import { AppShell } from "@/components/app-shell";
import { IncomeTable } from "@/components/record-table";
import { Button, Card, EmptyState, Field, Input, Select, SectionHeading, Textarea } from "@/components/ui";
import { saveIncomeAction } from "@/lib/actions";
import { requireOnboardedUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { INCOME_CATEGORIES, INCOME_STATUSES } from "@/lib/constants";
import { formatDateInput } from "@/lib/utils";

export default async function IncomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await requireOnboardedUser();
  const data = await getAppData(user.id);
  const editId = typeof params.edit === "string" ? params.edit : undefined;
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const editing = editId ? data.incomeEntries.find((entry) => entry.id === editId) : undefined;

  return (
    <AppShell
      pathname="/app/income"
      userLabel={`${data.businessProfile?.businessName || user.email} • Income tracking`}
    >
      <div className="space-y-6">
        <Card>
          <SectionHeading
            eyebrow="Income"
            title={editing ? "Edit income entry" : "Log income"}
            description="Capture client or platform payouts next to your expenses and mileage so the tax reserve estimate stays grounded."
          />
          <div className="mt-6 space-y-4">
            <AppNotice notice={notice} />
            <form action={saveIncomeAction} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={editing?.id || ""} />
              <input type="hidden" name="redirectTo" value="/app/income" />
              <Field label="Date">
                <Input defaultValue={editing ? formatDateInput(editing.date) : formatDateInput(new Date())} name="date" type="date" />
              </Field>
              <Field label="Amount">
                <Input defaultValue={editing?.amount ?? ""} min="0" name="amount" step="0.01" type="number" />
              </Field>
              <Field label="Category">
                <Select defaultValue={editing?.category || "invoice payment"} name="category">
                  {INCOME_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Status">
                <Select defaultValue={editing?.status || "paid"} name="status">
                  {INCOME_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Client or source">
                  <Input defaultValue={editing?.clientSource || ""} name="clientSource" placeholder="Client name, marketplace, or cash sale" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes">
                  <Textarea defaultValue={editing?.notes || ""} name="notes" placeholder="Optional invoice number or payout note." />
                </Field>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
                <Button type="submit">{editing ? "Update income" : "Save income"}</Button>
                {editing ? (
                  <Button href="/app/income" variant="secondary">
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </Card>

        {data.incomeEntries.length ? (
          <IncomeTable incomeEntries={data.incomeEntries} currency={data.businessProfile?.preferredCurrency || "USD"} />
        ) : (
          <EmptyState
            title="No income entries logged yet"
            description="Track invoice payments, cash payments, platform payouts, and reimbursements in the same place as mileage and expenses."
          />
        )}
      </div>
    </AppShell>
  );
}
