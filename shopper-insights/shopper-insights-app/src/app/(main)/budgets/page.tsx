"use client";

import { useState, useEffect } from "react";
import { Budget } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const response = await fetch("/api/budgets");
        const data = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBudgets();
  }, []);

  if (loading) {
    return <div>Loading budgets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">
            Track your spending against your monthly goals.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const progress = (budget.spent / budget.amount) * 100;
          const isOverBudget = budget.spent > budget.amount;

          return (
            <Card key={budget.id}>
              <CardHeader>
                <CardTitle>{budget.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-sm">
                    <span>{formatCurrency(budget.spent)}</span>
                    <span className="text-muted-foreground">
                      / {formatCurrency(budget.amount)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(progress, 100)}
                    className={isOverBudget ? "progress-over-budget" : ""}
                  />
                </div>
                <p
                  className={`text-sm ${
                    isOverBudget
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {isOverBudget
                    ? `${formatCurrency(budget.spent - budget.amount)} over budget`
                    : `${formatCurrency(budget.amount - budget.spent)} remaining`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
