import { AppNotice } from "@/components/app-notice";
import { AppShell } from "@/components/app-shell";
import { ExpensesTable } from "@/components/record-table";
import { Banner, Button, Card, EmptyState, Field, Input, Select, SectionHeading, Textarea } from "@/components/ui";
import { saveExpenseAction } from "@/lib/actions";
import { requireOnboardedUser } from "@/lib/auth";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";
import { getAppData } from "@/lib/data";
import { formatDateInput } from "@/lib/utils";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await requireOnboardedUser();
  const data = await getAppData(user.id);
  const editId = typeof params.edit === "string" ? params.edit : undefined;
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const editing = editId ? data.expenses.find((expense) => expense.id === editId) : undefined;
  const isPro = data.subscription?.plan === "PRO";

  return (
    <AppShell
      pathname="/app/expenses"
      userLabel={`${data.businessProfile?.businessName || user.email} • Expense tracking`}
    >
      <div className="space-y-6">
        <Card>
          <SectionHeading
            eyebrow="Expenses"
            title={editing ? "Edit expense" : "Log an expense"}
            description="Capture the category, vendor, amount, and payment method now so reporting is clean later."
          />
          <div className="mt-6 space-y-4">
            <AppNotice notice={notice} />
            {!isPro ? (
              <Banner tone="warn">
                Receipt uploads are a Pro feature. The rest of the expense workflow works on the free plan.
              </Banner>
            ) : null}
            <form action={saveExpenseAction} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={editing?.id || ""} />
              <input type="hidden" name="redirectTo" value="/app/expenses" />
              <Field label="Date">
                <Input defaultValue={editing ? formatDateInput(editing.date) : formatDateInput(new Date())} name="date" type="date" />
              </Field>
              <Field label="Amount">
                <Input defaultValue={editing?.amount ?? ""} min="0" name="amount" step="0.01" type="number" />
              </Field>
              <Field label="Category">
                <Select defaultValue={editing?.category || "fuel"} name="category">
                  {EXPENSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Payment method">
                <Select defaultValue={editing?.paymentMethod || "credit card"} name="paymentMethod">
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Vendor">
                  <Input defaultValue={editing?.vendor || ""} name="vendor" placeholder="Chevron, Apple, Staples" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Receipt image">
                  <Input accept="image/*,.pdf" name="receipt" type="file" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes">
                  <Textarea defaultValue={editing?.notes || ""} name="notes" placeholder="Optional vendor or project context." />
                </Field>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
                <Button type="submit">{editing ? "Update expense" : "Save expense"}</Button>
                {editing ? (
                  <Button href="/app/expenses" variant="secondary">
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </Card>

        {data.expenses.length ? (
          <ExpensesTable expenses={data.expenses} currency={data.businessProfile?.preferredCurrency || "USD"} />
        ) : (
          <EmptyState
            title="No expenses logged yet"
            description="Log deductible expenses like fuel, parking, tolls, meals, software, and supplies as they happen."
          />
        )}
      </div>
    </AppShell>
  );
}
