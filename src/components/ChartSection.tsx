
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartSectionProps {
  title: string;
  data: any[];
  type: "bar" | "line";
  dataKey: string;
  xAxisKey: string;
  yAxisKey?: string;
  color?: string;
}

export function ChartSection({
  title,
  data,
  type,
  dataKey,
  xAxisKey,
  color = "#9b87f5"
}: ChartSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={300}>
          {type === "bar" ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "white" }}
                activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: "white" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
