"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MiniPoint = { x: string; y: number };

export function MiniLineChart({
  data,
  color,
  tone = "green",
}: {
  data: MiniPoint[];
  color: string;
  tone?: "green" | "blue";
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full" aria-hidden />;

  const gradientId = tone === "blue" ? "miniFillBlue" : "miniFillGreen";
  const yDomain = [
    Math.min(...data.map((d) => d.y)) * 0.9,
    Math.max(...data.map((d) => d.y)) * 1.1,
  ] as const;

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={120}>
      <AreaChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={tone === "blue" ? "#60a5fa" : "#76C043"}
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor={tone === "blue" ? "#60a5fa" : "#76C043"}
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis
          dataKey="x"
          tick={{ fill: "#6b746c", fontSize: 10, fontWeight: 600 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(0,0,0,0.10)" }}
          interval={0}
        />
        <YAxis
          domain={yDomain}
          tick={{ fill: "#6b746c", fontSize: 10, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          width={32}
          tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
        />
        <Tooltip
          cursor={{ stroke: "rgba(0,0,0,0.08)" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.10)",
            boxShadow: "0 18px 40px rgba(16,24,16,0.12)",
          }}
          labelStyle={{ fontWeight: 700, color: "#1f2b20" }}
          formatter={(v) => [v, ""]}
        />
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

