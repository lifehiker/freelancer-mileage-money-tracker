import type {
  BusinessProfile,
  Expense,
  IncomeEntry,
  Trip,
  User,
} from "@prisma/client";

import { FREE_LIMITS } from "@/lib/constants";

type SummaryInput = {
  trips: Trip[];
  expenses: Expense[];
  incomeEntries: IncomeEntry[];
  mileageRate: number;
  taxRate: number;
};

export function calculateSummary({
  trips,
  expenses,
  incomeEntries,
  mileageRate,
  taxRate,
}: SummaryInput) {
  const businessMiles = trips
    .filter((trip) => trip.classification === "business")
    .reduce((sum, trip) => sum + trip.miles, 0);
  const mileageDeduction = businessMiles * mileageRate;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const taxableProfit = Math.max(totalIncome - totalExpenses - mileageDeduction, 0);
  const taxReserve = taxableProfit * taxRate;
  const netCashflow = totalIncome - totalExpenses;

  return {
    businessMiles,
    mileageDeduction,
    totalExpenses,
    totalIncome,
    taxableProfit,
    taxReserve,
    netCashflow,
  };
}

export function countMonthlyRecords(dateValues: Date[], anchor = new Date()) {
  return dateValues.filter(
    (date) =>
      date.getUTCFullYear() === anchor.getUTCFullYear() &&
      date.getUTCMonth() === anchor.getUTCMonth(),
  ).length;
}

export function getPlanLabel(subscription: { plan: "FREE" | "PRO" } | null) {
  return subscription?.plan === "PRO" ? "Pro" : "Free";
}

export function isPro(subscription: { plan: "FREE" | "PRO" } | null) {
  return subscription?.plan === "PRO";
}

export function getRemainingCsvExports(
  currentCount: number,
  subscription: { plan: "FREE" | "PRO" } | null,
) {
  if (isPro(subscription)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(FREE_LIMITS.csvExportsPerMonth - currentCount, 0);
}

export function getUsageSnapshot({
  trips,
  expenses,
  incomeEntries,
  exportUsage,
  subscription,
}: {
  trips: Trip[];
  expenses: Expense[];
  incomeEntries: IncomeEntry[];
  exportUsage: { csvExports: number; pdfExports: number } | null;
  subscription: { plan: "FREE" | "PRO" } | null;
}) {
  const isProPlan = isPro(subscription);

  return {
    isPro: isProPlan,
    tripsThisMonth: countMonthlyRecords(trips.map((trip) => trip.date)),
    expensesThisMonth: countMonthlyRecords(expenses.map((expense) => expense.date)),
    incomeThisMonth: countMonthlyRecords(incomeEntries.map((entry) => entry.date)),
    csvExportsThisMonth: exportUsage?.csvExports ?? 0,
    pdfExportsThisMonth: exportUsage?.pdfExports ?? 0,
    remainingTrips: isProPlan
      ? Number.POSITIVE_INFINITY
      : Math.max(FREE_LIMITS.tripsPerMonth - countMonthlyRecords(trips.map((trip) => trip.date)), 0),
    remainingExpenses: isProPlan
      ? Number.POSITIVE_INFINITY
      : Math.max(
          FREE_LIMITS.expensesPerMonth - countMonthlyRecords(expenses.map((expense) => expense.date)),
          0,
        ),
    remainingIncome: isProPlan
      ? Number.POSITIVE_INFINITY
      : Math.max(
          FREE_LIMITS.incomePerMonth - countMonthlyRecords(incomeEntries.map((entry) => entry.date)),
          0,
        ),
    remainingCsvExports: getRemainingCsvExports(exportUsage?.csvExports ?? 0, subscription),
  };
}

export function getProfileDefaults(
  user: User,
  businessProfile: BusinessProfile | null,
) {
  return {
    businessName: businessProfile?.businessName || "",
    businessType: businessProfile?.businessType || "Freelancer",
    defaultTaxRate: businessProfile?.defaultTaxRate || 0.25,
    defaultMileageRate: businessProfile?.defaultMileageRate || 0.67,
    preferredCurrency: businessProfile?.preferredCurrency || user.currency || "USD",
    country: businessProfile?.country || user.country || "United States",
    exportPreference: businessProfile?.exportPreference || "csv-first",
  };
}
