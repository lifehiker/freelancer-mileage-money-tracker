"use client";

import { useSyncExternalStore } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { formatCurrency } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function TrendChart({
  data,
  currency,
}: {
  data: Array<{ label: string; income: number; expenses: number; deduction: number }>;
  currency: string;
}) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return <div className="h-72 w-full rounded-[24px] bg-[var(--color-panel)]/45" />;
  }

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#136f63" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#136f63" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e7ddd1" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#4f5d6b", fontSize: 12 }} />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value ?? 0), currency)}
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid #e7ddd1",
              background: "#fffdfa",
            }}
          />
          <Area dataKey="income" stroke="#136f63" fill="url(#incomeGradient)" strokeWidth={2} />
          <Area dataKey="expenses" stroke="#f97316" fill="url(#expenseGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
