import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { ArrowLeft } from "lucide-react";

import { getReceiptById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryDonut from "@/components/charts/CategoryDonut";
import ClientActions from "@/components/receipts/ClientActions";

const getChartColors = () => [
  "var(--chart-color-1)",
  "var(--chart-color-2)",
  "var(--chart-color-3)",
  "var(--chart-color-4)",
  "var(--chart-color-5)",
];

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = await getReceiptById(id);

  if (!receipt) {
    notFound();
  }

  const chartColors = getChartColors();
  const categoryData =
    receipt.categories?.map((c, i) => ({
      name: c.name,
      value: c.amount,
      fill: chartColors[i % chartColors.length],
    })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/receipts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Receipts
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{receipt.store}</h1>
        </div>
        <ClientActions store={receipt.store} total={receipt.total} />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Receipt Image */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={receipt.imageUrl || "/receipt-placeholder.jpg"}
                  alt={`Receipt from ${receipt.store}`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items Purchased */}
          <Card>
            <CardHeader>
              <CardTitle>Items Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receipt.itemsList?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {item.quantity}x
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Store</p>
                <p className="font-medium">{receipt.store}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(new Date(receipt.date), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">${receipt.total.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="font-medium">{receipt.items}</p>
              </div>
            </CardContent>
          </Card>

          {/* Spending Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CategoryDonut data={categoryData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}