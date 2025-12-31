"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Store,
  Target,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { useMemo } from "react";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function AnalyticsPage() {
  const analytics = useMemo(() => {
    const receipts: {
      id: string;
      store: string;
      date: string;
      total: number;
      items: number;
      status: string;
    }[] = [];

    const totalSpent = receipts.reduce((sum, r) => sum + r.total, 0);
    const avgSpent = receipts.length > 0 ? totalSpent / receipts.length : 0;
    const totalItems = receipts.reduce((sum, r) => sum + r.items, 0);

    // Mock category data (in real app, this would come from receipt analysis)
    const categoryData = [
      { name: "Groceries", value: totalSpent * 0.45 },
      { name: "Dining Out", value: totalSpent * 0.25 },
      { name: "Shopping", value: totalSpent * 0.2 },
      { name: "Other", value: totalSpent * 0.1 },
    ];

    // Store analysis
    const storeData = receipts.reduce(
      (acc, receipt) => {
        acc[receipt.store] = (acc[receipt.store] || 0) + receipt.total;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topStores = Object.entries(storeData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([store, total]) => ({ store, total }));

    // Monthly trend (mock data)
    const monthlyData = [
      { month: "Jan", total: 650 },
      { month: "Feb", total: 720 },
      { month: "Mar", total: 580 },
      { month: "Apr", total: 800 },
      { month: "May", total: 920 },
      { month: "Jun", total: 850 },
      { month: "Jul", total: totalSpent },
    ];

    return {
      totalSpent,
      avgSpent,
      totalItems,
      categoryData,
      topStores,
      monthlyData,
      totalReceipts: receipts.length,
    };
  }, []); // receipts is now inside useMemo, so dependency array is empty

  const insights = [
    {
      title: "Top Spending Category",
      value: "Groceries",
      change: "+12%",
      trend: "up",
      description: "Your largest expense category this month",
    },
    {
      title: "Average Receipt Value",
      value: `$${analytics.avgSpent.toFixed(2)}`,
      change: "-3%",
      trend: "down",
      description: "Lower than last month - great job!",
    },
    {
      title: "Most Frequent Store",
      value: analytics.topStores[0]?.store || "N/A",
      change: "8 visits",
      trend: "neutral",
      description: "Your go-to shopping destination",
    },
    {
      title: "Monthly Savings Goal",
      value: "85%",
      change: "+15%",
      trend: "up",
      description: "You&apos;re on track to meet your goal!",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics & Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          Deep dive into your spending patterns and get personalized insights.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {insight.title}
                  </CardTitle>
                  {insight.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : insight.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Target className="h-4 w-4 text-blue-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insight.value}</div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        insight.trend === "up"
                          ? "default"
                          : insight.trend === "down"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {insight.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Total Spent"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed view of your spending across different categories
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.categoryData.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        ${category.value.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(
                          (category.value / analytics.totalSpent) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Stores</CardTitle>
              <p className="text-sm text-muted-foreground">
                Where you spend the most money
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topStores.map((store, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{store.store}</span>
                    </div>
                    <span className="font-bold">${store.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Patterns</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Total Spent"]}
                  />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                💡 Spending Tip
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                You&apos;ve spent 15% less on dining out this month. Consider
                allocating some of those savings to your emergency fund!
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">
                ✅ Great Job!
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Your grocery spending is consistent with your budget. You&apos;re
                maintaining good spending discipline!
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                ⚠️ Watch Out
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Your shopping category spending has increased by 25% this month.
                Consider reviewing recent purchases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
