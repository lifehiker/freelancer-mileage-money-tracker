import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import Papa from "papaparse";
import { NextRequest, NextResponse } from "next/server";

import { calculateSummary, isPro } from "@/lib/calculations";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordExportUsage } from "@/lib/export-usage";
import { SummaryPdf } from "@/lib/pdf-summary";
import { formatDate, formatDateInput, getMonthRange } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  const user = await getCurrentUser();

  if (!user || !user.onboardingCompleted) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { file } = await params;
  const appData = await Promise.all([
    db.trip.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    db.expense.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    db.incomeEntry.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    db.exportUsage.findUnique({
      where: {
        userId_monthKey: {
          userId: user.id,
          monthKey: new Date().toISOString().slice(0, 7),
        },
      },
    }),
  ]);

  const [trips, expenses, incomeEntries, exportUsage] = appData;
  const requestedStart = request.nextUrl.searchParams.get("start");
  const requestedEnd = request.nextUrl.searchParams.get("end");
  const monthRange = getMonthRange();
  const pro = isPro(user.subscription);
  const start = pro && requestedStart ? new Date(requestedStart) : monthRange.start;
  const end = pro && requestedEnd ? new Date(requestedEnd) : monthRange.end;

  const filteredTrips = trips.filter((trip) => trip.date >= start && trip.date <= end);
  const filteredExpenses = expenses.filter((expense) => expense.date >= start && expense.date <= end);
  const filteredIncome = incomeEntries.filter((entry) => entry.date >= start && entry.date <= end);

  if (file.endsWith(".csv")) {
    if (!pro && (exportUsage?.csvExports ?? 0) >= 3) {
      return NextResponse.redirect(
        new URL("/app/reports?notice=You have used all free CSV exports for this month.", request.url),
      );
    }
  }

  if (file === "trips.csv") {
    await recordExportUsage(user.id, "csv");
    const csv = Papa.unparse(
      filteredTrips.map((trip) => ({
        date: formatDateInput(trip.date),
        purpose: trip.purpose,
        startLocation: trip.startLocation,
        endLocation: trip.endLocation,
        miles: trip.miles,
        classification: trip.classification,
      })),
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="mileage-log.csv"',
      },
    });
  }

  if (file === "expenses.csv") {
    await recordExportUsage(user.id, "csv");
    const csv = Papa.unparse(
      filteredExpenses.map((expense) => ({
        date: formatDateInput(expense.date),
        vendor: expense.vendor,
        amount: expense.amount,
        category: expense.category,
        paymentMethod: expense.paymentMethod,
        notes: expense.notes || "",
      })),
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="expenses.csv"',
      },
    });
  }

  if (file === "income.csv") {
    await recordExportUsage(user.id, "csv");
    const csv = Papa.unparse(
      filteredIncome.map((entry) => ({
        date: formatDateInput(entry.date),
        clientSource: entry.clientSource,
        amount: entry.amount,
        category: entry.category,
        status: entry.status,
        notes: entry.notes || "",
      })),
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="income.csv"',
      },
    });
  }

  if (file === "summary.pdf") {
    await recordExportUsage(user.id, "pdf");
    const summary = calculateSummary({
      trips: filteredTrips,
      expenses: filteredExpenses,
      incomeEntries: filteredIncome,
      mileageRate: user.businessProfile?.defaultMileageRate || 0.67,
      taxRate: user.businessProfile?.defaultTaxRate || 0.25,
    });
    const pdfBuffer = await renderToBuffer(
      React.createElement(SummaryPdf, {
        title: "Freelancer Mileage & Money Summary",
        rangeLabel: `${formatDate(start)} to ${formatDate(end)}`,
        summary,
        currency: user.businessProfile?.preferredCurrency || "USD",
        showWatermark: !pro,
      }),
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="summary.pdf"',
      },
    });
  }

  return new NextResponse("Not found", { status: 404 });
}
