"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit2,
  Trash2,
  Target,
  TrendingUp,
  // AlertTriangle, // Unused
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
// import { useReceiptStore } from "@/store/receiptStore"; // Unused

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  color: string;
}

export default function BudgetPage() {
  // const receipts = useReceiptStore((state) => state.getHistory());
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: "1",
      category: "Groceries",
      amount: 500,
      spent: 350,
      period: "monthly",
      color: "#8884d8",
    },
    {
      id: "2",
      category: "Dining Out",
      amount: 300,
      spent: 280,
      period: "monthly",
      color: "#82ca9d",
    },
    {
      id: "3",
      category: "Shopping",
      amount: 200,
      spent: 150,
      period: "monthly",
      color: "#ffc658",
    },
    {
      id: "4",
      category: "Transportation",
      amount: 150,
      spent: 120,
      period: "monthly",
      color: "#ff7300",
    },
  ]);

  const [newBudget, setNewBudget] = useState<{
    category: string;
    amount: string;
    period: "weekly" | "monthly" | "yearly";
  }>({
    category: "",
    amount: "",
    period: "monthly",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalBudget = budgets.reduce(
    (sum, b) => sum + (typeof b.amount === "number" ? b.amount : 0),
    0,
  );
  const totalSpent = budgets.reduce(
    (sum, b) => sum + (typeof b.spent === "number" ? b.spent : 0),
    0,
  );
  const totalRemaining = totalBudget - totalSpent;

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "text-green-600";
    if (percentage < 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getBudgetStatus = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return { status: "over", color: "destructive" };
    if (percentage >= 80) return { status: "warning", color: "secondary" };
    return { status: "good", color: "default" };
  };

  const handleCreateBudget = () => {
    if (!newBudget.category || !newBudget.amount) return;

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      spent: 0,
      period: newBudget.period,
      color: "#8884d8",
    };

    setBudgets([...budgets, budget]);
    setNewBudget({ category: "", amount: "", period: "monthly" });
    setIsDialogOpen(false);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  const categories = [
    "Groceries",
    "Dining Out",
    "Shopping",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Other",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Budget Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Set spending limits and track your financial goals.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBudget.category}
                  onValueChange={(value) =>
                    setNewBudget({ ...newBudget, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and decimals
                    if (/^\d*\.?\d*$/.test(value)) {
                      setNewBudget({ ...newBudget, amount: value });
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="period">Period</Label>
                <Select
                  value={newBudget.period}
                  onValueChange={(value) =>
                    setNewBudget({
                      ...newBudget,
                      period: value as "weekly" | "monthly" | "yearly",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateBudget} className="w-full">
                Create Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Monthly allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRemaining.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budgets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budgets">Current Budgets</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.amount) * 100;
              const status = getBudgetStatus(budget.spent, budget.amount);
              const remaining = budget.amount - budget.spent;

              return (
                <Card key={budget.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {budget.category}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.color as "default" | "secondary" | "destructive"}>
                        {status.status === "over"
                          ? "Over Budget"
                          : status.status === "warning"
                            ? "Warning"
                            : "On Track"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${budget.spent.toFixed(2)}</span>
                        <span>Budget: ${budget.amount.toFixed(2)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className={getProgressColor(percentage)}>
                          {percentage.toFixed(1)}% used
                        </span>
                        <span>${remaining.toFixed(2)} remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Performance History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track how well you&apos;ve stuck to your budgets over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["June 2025", "May 2025", "April 2025"].map((month) => (
                  <div
                    key={month}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{month}</h4>
                      <p className="text-sm text-muted-foreground">
                        Budget: $1,150 | Spent: $1,050
                      </p>
                    </div>
                    <Badge variant="default">Under Budget</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set and track your saving and spending goals
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Emergency Fund</h4>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Save $5,000 for emergencies
                  </p>
                  <Progress value={60} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>$3,000 saved</span>
                    <span>$2,000 remaining</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Reduce Dining Out</h4>
                    <Badge variant="default">On Track</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spend less than $250/month on dining out
                  </p>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>$187.50 spent</span>
                    <span>$62.50 remaining</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
