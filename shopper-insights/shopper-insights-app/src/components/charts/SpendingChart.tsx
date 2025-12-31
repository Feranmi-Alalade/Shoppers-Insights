"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface StoreSpendingData {
  store: string;
  total: number;
  fill: string;
}

interface MonthlySpendingData {
  month: string;
  total: number;
  fill: string;
}

interface SpendingChartProps {
  storeData: StoreSpendingData[];
  monthlyData: MonthlySpendingData[];
}

export default function SpendingChart({
  storeData,
  monthlyData,
}: SpendingChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={storeData}>
            <XAxis dataKey="store" />
            <YAxis />
            <Bar dataKey="total">
              {storeData.map((entry, index) => (
                <Cell key={`cell-store-${index}`} fill={entry.fill} />
              ))}
            </Bar>
            <ChartTooltip />
            <ChartLegend />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={monthlyData}
              dataKey="total"
              nameKey="month"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              labelLine={false}
            >
              {monthlyData.map((entry, index) => (
                <Cell key={`cell-month-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip />
            <ChartLegend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
