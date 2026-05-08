"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type SalesPoint = { day: string; value: number };

export function SalesChart({ data }: { data: SalesPoint[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full" aria-hidden />;

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
      <BarChart data={data} margin={{ top: 10, right: 18, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: "#6b746c", fontSize: 12, fontWeight: 600 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(0,0,0,0.12)" }}
        />
        <YAxis
          tick={{ fill: "#6b746c", fontSize: 12, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v) => `€${v}`}
          domain={[0, "dataMax"]}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
          contentStyle={{
            borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.10)",
            boxShadow: "0 18px 40px rgba(16,24,16,0.12)",
          }}
          labelStyle={{ fontWeight: 700, color: "#1f2b20" }}
          formatter={(v) => [`€${v}`, "Vendite"]}
        />
        <Bar
          dataKey="value"
          fill="#214e3a"
          radius={[6, 6, 0, 0]}
          maxBarSize={54}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

