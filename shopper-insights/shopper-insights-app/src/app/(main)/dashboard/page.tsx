import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryDonut from "@/components/charts/CategoryDonut";
import BudgetOverview from "@/components/budget/BudgetOverview";
import { Wallet, ReceiptText, Landmark } from "lucide-react";
import { useReceiptStore } from "@/store/receiptStore";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockCategoryData = [
  { name: "Groceries", value: 400 },
  { name: "Dining Out", value: 250 },
  { name: "Transport", value: 150 },
];
const mockBudgetData = [
  {
    id: "1",
    category: "Groceries",
    amount: 500,
    spent: 400,
    period: "monthly" as const,
  },
  {
    id: "2",
    category: "Dining Out",
    amount: 300,
    spent: 250,
    period: "monthly" as const,
  },
];

export default function DashboardPage() {
  const receipts = useReceiptStore.getState().getHistory();
  const totalSpent = receipts.reduce((acc: number, r: { total: number }) => acc + r.total, 0);
  const averageSpending =
    receipts.length > 0 ? totalSpent / receipts.length : 0;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spending
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across all receipts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Receipts
            </CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Receipt Value
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageSpending.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average per transaction
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <CategoryDonut data={mockCategoryData} />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Budget Overview</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/budgets">
                Manage Budgets <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <BudgetOverview budgets={mockBudgetData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
