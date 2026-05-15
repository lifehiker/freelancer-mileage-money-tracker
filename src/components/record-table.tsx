import Link from "next/link";
import type { ReactNode } from "react";

import { Button, Card, Pill } from "@/components/ui";
import { deleteExpenseAction, deleteIncomeAction, deleteTripAction } from "@/lib/actions";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

export function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[var(--color-muted)]">{hint}</p> : null}
    </Card>
  );
}

export function TableCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{title}</h3>
        <div className="overflow-x-auto">{children}</div>
      </div>
    </Card>
  );
}

export function TripsTable({
  trips,
  currency,
}: {
  trips: Array<{
    id: string;
    date: Date;
    purpose: string;
    startLocation: string;
    endLocation: string;
    miles: number;
    classification: string;
  }>;
  currency: string;
}) {
  void currency;

  return (
    <TableCard title="Trip log">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <tr>
            <th className="pb-3">Date</th>
            <th className="pb-3">Purpose</th>
            <th className="pb-3">Route</th>
            <th className="pb-3">Miles</th>
            <th className="pb-3">Type</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id} className="border-t border-[var(--color-border)]">
              <td className="py-3">{formatDate(trip.date)}</td>
              <td className="py-3">{trip.purpose}</td>
              <td className="py-3">
                {trip.startLocation} to {trip.endLocation}
              </td>
              <td className="py-3">{formatNumber(trip.miles)} mi</td>
              <td className="py-3">
                <Pill tone={trip.classification === "business" ? "pro" : "default"}>
                  {trip.classification}
                </Pill>
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <Button href={`/app/trips?edit=${trip.id}`} variant="secondary" className="h-9 px-4">
                    Edit
                  </Button>
                  <form action={deleteTripAction}>
                    <input type="hidden" name="id" value={trip.id} />
                    <Button type="submit" variant="ghost" className="h-9 px-4">
                      Delete
                    </Button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}

export function ExpensesTable({
  expenses,
  currency,
}: {
  expenses: Array<{
    id: string;
    date: Date;
    amount: number;
    category: string;
    vendor: string;
    paymentMethod: string;
    receiptPath: string | null;
  }>;
  currency: string;
}) {
  return (
    <TableCard title="Expense log">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <tr>
            <th className="pb-3">Date</th>
            <th className="pb-3">Vendor</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Receipt</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-t border-[var(--color-border)]">
              <td className="py-3">{formatDate(expense.date)}</td>
              <td className="py-3">{expense.vendor}</td>
              <td className="py-3 capitalize">{expense.category}</td>
              <td className="py-3">{formatCurrency(expense.amount, currency)}</td>
              <td className="py-3">
                {expense.receiptPath ? (
                  <Link className="text-[var(--color-accent)] underline-offset-2 hover:underline" href={expense.receiptPath}>
                    View
                  </Link>
                ) : (
                  "None"
                )}
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <Button href={`/app/expenses?edit=${expense.id}`} variant="secondary" className="h-9 px-4">
                    Edit
                  </Button>
                  <form action={deleteExpenseAction}>
                    <input type="hidden" name="id" value={expense.id} />
                    <Button type="submit" variant="ghost" className="h-9 px-4">
                      Delete
                    </Button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}

export function IncomeTable({
  incomeEntries,
  currency,
}: {
  incomeEntries: Array<{
    id: string;
    date: Date;
    amount: number;
    category: string;
    clientSource: string;
    status: string;
  }>;
  currency: string;
}) {
  return (
    <TableCard title="Income log">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <tr>
            <th className="pb-3">Date</th>
            <th className="pb-3">Client / Source</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomeEntries.map((entry) => (
            <tr key={entry.id} className="border-t border-[var(--color-border)]">
              <td className="py-3">{formatDate(entry.date)}</td>
              <td className="py-3">{entry.clientSource}</td>
              <td className="py-3 capitalize">{entry.category}</td>
              <td className="py-3">{formatCurrency(entry.amount, currency)}</td>
              <td className="py-3">
                <Pill tone={entry.status === "paid" ? "pro" : "warn"}>{entry.status}</Pill>
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <Button href={`/app/income?edit=${entry.id}`} variant="secondary" className="h-9 px-4">
                    Edit
                  </Button>
                  <form action={deleteIncomeAction}>
                    <input type="hidden" name="id" value={entry.id} />
                    <Button type="submit" variant="ghost" className="h-9 px-4">
                      Delete
                    </Button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}
