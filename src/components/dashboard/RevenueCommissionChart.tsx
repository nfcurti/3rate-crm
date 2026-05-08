"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type RevenueCommissionPoint = {
  label: string;
  revenue: number;
  commission: number;
};

export function RevenueCommissionChart({ data }: { data: RevenueCommissionPoint[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full" aria-hidden />;

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
      <ComposedChart data={data} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#6b746c", fontSize: 11, fontWeight: 600 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(0,0,0,0.10)" }}
        />
        <YAxis
          tick={{ fill: "#6b746c", fontSize: 11, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          width={38}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          domain={[0, "dataMax"]}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
          contentStyle={{
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.10)",
            boxShadow: "0 18px 40px rgba(16,24,16,0.12)",
          }}
          labelStyle={{ fontWeight: 700, color: "#1f2b20" }}
          formatter={(v, name) => {
            const label = name === "revenue" ? "Vendite" : "Commissioni";
            return [`€${v}`, label];
          }}
        />
        <Bar dataKey="commission" fill="#a7dd7b" radius={[6, 6, 0, 0]} maxBarSize={56} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#214e3a"
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

