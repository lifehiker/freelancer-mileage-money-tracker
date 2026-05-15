import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { calculateSummary } from "@/lib/calculations";
import { db } from "@/lib/db";

export async function getAppData(userId: string) {
  const [businessProfile, subscription, trips, expenses, incomeEntries, exportUsage] =
    await Promise.all([
      db.businessProfile.findUnique({ where: { userId } }),
      db.subscription.findUnique({ where: { userId } }),
      db.trip.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      db.expense.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      db.incomeEntry.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      db.exportUsage.findFirst({
        where: {
          userId,
          monthKey: new Date().toISOString().slice(0, 7),
        },
      }),
    ]);

  return {
    businessProfile,
    subscription,
    trips,
    expenses,
    incomeEntries,
    exportUsage,
  };
}

export function getTrendData({
  trips,
  expenses,
  incomeEntries,
  mileageRate,
}: {
  trips: Array<{ date: Date; miles: number; classification: string }>;
  expenses: Array<{ date: Date; amount: number }>;
  incomeEntries: Array<{ date: Date; amount: number }>;
  mileageRate: number;
}) {
  return Array.from({ length: 6 }, (_, index) => {
    const anchor = subMonths(new Date(), 5 - index);
    const start = startOfMonth(anchor);
    const end = endOfMonth(anchor);
    const monthTrips = trips.filter((trip) => trip.date >= start && trip.date <= end);
    const monthExpenses = expenses.filter((expense) => expense.date >= start && expense.date <= end);
    const monthIncome = incomeEntries.filter((entry) => entry.date >= start && entry.date <= end);
    const summary = calculateSummary({
      trips: monthTrips as never[],
      expenses: monthExpenses as never[],
      incomeEntries: monthIncome as never[],
      mileageRate,
      taxRate: 0,
    });

    return {
      label: anchor.toLocaleString("en-US", { month: "short" }),
      income: summary.totalIncome,
      expenses: summary.totalExpenses,
      deduction: summary.mileageDeduction,
    };
  });
}
