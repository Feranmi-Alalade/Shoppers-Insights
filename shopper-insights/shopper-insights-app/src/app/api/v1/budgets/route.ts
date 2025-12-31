import { NextResponse } from "next/server";
import { Budget } from "@/types";

const budgets: Budget[] = [
  {
    id: "1",
    category: "Groceries",
    amount: 500,
    spent: 412.50,
    period: "monthly",
  },
  {
    id: "2",
    category: "Dining Out",
    amount: 300,
    spent: 280.00,
    period: "monthly",
  },
  {
    id: "3",
    category: "Transport",
    amount: 150,
    spent: 105.75,
    period: "monthly",
  },
  {
    id: "4",
    category: "Shopping",
    amount: 400,
    spent: 450.00,
    period: "monthly",
  },
];

export async function GET() {
  return NextResponse.json(budgets);
}

export async function POST(request: Request) {
  const newBudgetData = await request.json();
  const newBudget: Budget = {
    id: `bud-${Date.now()}`,
    ...newBudgetData,
  };
  budgets.push(newBudget);
  return NextResponse.json(newBudget, { status: 201 });
}
