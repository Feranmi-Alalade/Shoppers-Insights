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
  },
  {
    id: "2",
    store: "MegaStore",
    date: "2025-07-12T18:20:00.000Z",
    total: 120.0,
    items: 8,
    status: "success",
    imageUrl: "/receipt-sample.png",
  },
  {
    id: "3",
    store: "Corner Shop",
    date: "2025-07-13T10:05:00.000Z",
    total: 25.0,
    items: 3,
    status: "processing",
    imageUrl: "/receipt-sample.png",
  },
];

export async function GET() {
  return NextResponse.json(receipts);
}

export async function POST(request: Request) {
  const newReceiptData = await request.json();
  const newReceipt: Receipt = {
    id: (receipts.length + 1).toString(),
    status: "processing",
    ...newReceiptData,
  };
  receipts.push(newReceipt);
  return NextResponse.json(newReceipt, { status: 201 });
}
