import { NextResponse } from "next/server";
import { Receipt } from "@/types";

const receipts: Receipt[] = [
  {
    id: "1",
    store: "SuperMart",
    date: "2025-07-10T14:48:00.000Z",
    total: 75.5,
    items: 5,
    status: "success",
    imageUrl: "/receipt-sample.png",
    categories: [
      { name: "Groceries", amount: 45.0, percentage: 60 },
      { name: "Household", amount: 15.0, percentage: 20 },
      { name: "Personal Care", amount: 7.5, percentage: 10 },
      { name: "Other", amount: 8.0, percentage: 10 },
    ],
    itemsList: [
      { name: "Milk", category: "Groceries", price: 5.0, quantity: 1 },
      { name: "Bread", category: "Groceries", price: 3.0, quantity: 2 },
      { name: "Detergent", category: "Household", price: 15.0, quantity: 1 },
      { name: "Shampoo", category: "Personal Care", price: 7.5, quantity: 1 },
      { name: "Candy", category: "Other", price: 8.0, quantity: 1 },
    ],
  },
  {
    id: "2",
    store: "MegaStore",
    date: "2025-07-12T18:20:00.000Z",
    total: 120.0,
    items: 8,
    status: "success",
    imageUrl: "/receipt-sample.png",
    categories: [
      { name: "Groceries", amount: 70.0, percentage: 58.33 },
      { name: "Household", amount: 24.0, percentage: 20 },
      { name: "Personal Care", amount: 12.0, percentage: 10 },
      { name: "Other", amount: 14.0, percentage: 11.67 },
    ],
    itemsList: [
      { name: "Eggs", category: "Groceries", price: 6.0, quantity: 2 },
      { name: "Chicken", category: "Groceries", price: 20.0, quantity: 1 },
      { name: "Soap", category: "Personal Care", price: 12.0, quantity: 2 },
      { name: "Paper Towels", category: "Household", price: 24.0, quantity: 1 },
      { name: "Snacks", category: "Other", price: 14.0, quantity: 2 },
    ],
  },
  {
    id: "3",
    store: "Corner Shop",
    date: "2025-07-13T10:05:00.000Z",
    total: 25.0,
    items: 3,
    status: "processing",
    imageUrl: "/receipt-sample.png",
    categories: [
      { name: "Groceries", amount: 15.0, percentage: 60 },
      { name: "Other", amount: 10.0, percentage: 40 },
    ],
    itemsList: [
      { name: "Juice", category: "Groceries", price: 5.0, quantity: 1 },
      { name: "Chips", category: "Other", price: 10.0, quantity: 2 },
    ],
  },
];


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = receipts.find((r) => r.id === id);
  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }
  return NextResponse.json(receipt);
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = receipts.findIndex((r) => r.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }
  receipts.splice(index, 1);
  return NextResponse.json({ message: "Receipt deleted" });
}
