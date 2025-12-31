import { NextResponse } from "next/server";
import { Receipt } from "@/types";

const receipts: Receipt[] = [
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const receipt = receipts.find((r) => r.id === id);

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  // Simulate processing completion
  if (receipt.status === "processing" && Math.random() > 0.5) {
    receipt.status = "success";
  }

  return NextResponse.json({ status: receipt.status });
}
