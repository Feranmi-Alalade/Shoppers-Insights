// components/budget/BudgetOverview.tsx
"use client";

import { Progress } from "@/components/ui/progress";
import { Budget } from "@/types";

interface BudgetOverviewProps {
  budgets: Budget[];
}

const getProgressColor = (value: number) => {
  if (value < 50) return "bg-green-500";
  if (value < 85) return "bg-yellow-500";
  return "bg-red-500";
};

export default function BudgetOverview({ budgets }: BudgetOverviewProps) {
  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const progress = (budget.spent / budget.amount) * 100;
        return (
          <div key={budget.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                {budget.category}
              </span>
              <span className="text-sm font-medium">
                ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
              </span>
            </div>
            <Progress
              value={progress}
              className={`h-2 ${getProgressColor(progress)}`}
            />
          </div>
        );
      })}
    </div>
  );
}
