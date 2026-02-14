/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartSectionProps {
  title?: string;
  data: any[];
  type: "bar" | "line";
  dataKey: string;
  xAxisKey: string;
  yAxisKey?: string;
  color?: string;
  className?: string;
  height?: number;
}

export function ChartSection({
  title,
  data,
  type,
  dataKey,
  xAxisKey,
  color = "#2195f2",
  className,
  height = 300,
}: ChartSectionProps) {
  const primaryColorWithOpacity = `${color}20`; // 20% opacity version of primary color

  return (
    <Card
      className={cn("transition-all duration-200 hover:shadow-lg", className)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat-medium text-guardian">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={height}>
          {type === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={primaryColorWithOpacity}
              />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: primaryColorWithOpacity }}
                contentStyle={{
                  background: "white",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "8px 12px",
                }}
                labelStyle={{
                  color: "guardian",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              />
              <Bar
                dataKey={dataKey}
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={primaryColorWithOpacity}
              />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "8px 12px",
                }}
                labelStyle={{
                  color: "#1e3b93",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "white" }}
                activeDot={{
                  r: 6,
                  fill: color,
                  strokeWidth: 2,
                  stroke: "white",
                  className: "animate-pulse",
                }}
                fill="url(#lineGradient)"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
