"use client";

import { Receipt } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface RecentReceiptsProps {
  receipts: Receipt[];
}

export default function RecentReceipts({ receipts }: RecentReceiptsProps) {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">
          No receipts found. Upload your first receipt!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {receipts.map((receipt) => (
        <ReceiptCard key={receipt.id} receipt={receipt} />
      ))}
    </div>
  );
}

function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{receipt.store}</CardTitle>
          <Badge variant="outline" className="text-sm">
            ${receipt.total.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{format(new Date(receipt.date), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShoppingCart className="h-4 w-4" />
          <span>{receipt.items} items</span>
        </div>
        <div className="pt-2">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/receipts/${receipt.id}`}>
              View Details <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
