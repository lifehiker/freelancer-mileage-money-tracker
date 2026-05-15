import type { ReactElement } from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 12,
    color: "#1b2631",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: "#5d6b77",
  },
  section: {
    marginBottom: 16,
    padding: 14,
    border: "1 solid #e7ddd1",
    borderRadius: 12,
  },
  label: {
    fontSize: 10,
    color: "#5d6b77",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    marginBottom: 2,
  },
  watermark: {
    position: "absolute",
    top: "45%",
    left: 80,
    fontSize: 32,
    color: "rgba(155, 34, 38, 0.18)",
    transform: "rotate(-25deg)",
  },
});

export function SummaryPdf({
  title,
  rangeLabel,
  summary,
  currency,
  showWatermark,
}: {
  title: string;
  rangeLabel: string;
  summary: {
    businessMiles: number;
    mileageDeduction: number;
    totalExpenses: number;
    totalIncome: number;
    taxReserve: number;
    netCashflow: number;
  };
  currency: string;
  showWatermark: boolean;
}): ReactElement {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  const items = [
    ["Business miles", `${summary.businessMiles.toFixed(1)} mi`],
    ["Mileage deduction", formatter.format(summary.mileageDeduction)],
    ["Expenses", formatter.format(summary.totalExpenses)],
    ["Income", formatter.format(summary.totalIncome)],
    ["Tax set-aside", formatter.format(summary.taxReserve)],
    ["Net cashflow", formatter.format(summary.netCashflow)],
  ];

  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        {showWatermark ? <Text style={styles.watermark}>Free plan preview</Text> : null}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{rangeLabel}</Text>
        </View>
        {items.map(([label, value]) => (
          <View key={label} style={styles.section}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
