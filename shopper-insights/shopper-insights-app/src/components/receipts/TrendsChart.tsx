"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

// Mock data for trends
const trendsData = {
  daily: [
    { name: "Today", total: 150 },
    { name: "Yesterday", total: 200 },
  ],
  weekly: [
    { name: "This Week", total: 800 },
    { name: "Last Week", total: 750 },
  ],
  monthly: [
    { name: "This Month", total: 3200 },
    { name: "Last Month", total: 3500 },
  ],
  annual: [
    { name: "This Year", total: 40000 },
    { name: "Last Year", total: 42000 },
  ],
};

export default function TrendsChart() {
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "annual"
  >("monthly");

  const data = trendsData[period];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Spending Trends</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={period === "daily" ? "default" : "outline"}
              onClick={() => setPeriod("daily")}
            >
              Daily
            </Button>
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={period === "monthly" ? "default" : "outline"}
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={period === "annual" ? "default" : "outline"}
              onClick={() => setPeriod("annual")}
            >
              Annual
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
