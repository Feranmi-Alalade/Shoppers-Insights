import { Receipt } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface ReceiptStatusCardProps {
  receipt: Receipt;
}

const ProcessingState = ({ receipt }: { receipt: Receipt }) => (
  <>
    <div className="flex items-center gap-4">
      <Loader className="w-6 h-6 text-blue-500 animate-spin" />
      <div>
        <p className="font-semibold text-blue-800 dark:text-blue-300">
          Analyzing Receipt...
        </p>
        <p className="text-sm text-muted-foreground truncate max-w-xs">
          {receipt.store}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-16 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </>
);

const SuccessState = ({ receipt }: { receipt: Receipt }) => (
  <>
    <div className="flex items-center gap-4">
      <CheckCircle2 className="w-6 h-6 text-green-500" />
      <div>
        <p className="font-semibold">{receipt.store}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(receipt.date).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-bold text-lg">${receipt.total.toFixed(2)}</span>
      <Button size="sm" asChild>
        <Link href={`/receipts/${receipt.id}`}>
          Insights <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
    </div>
  </>
);

const ErrorState = () => (
  <>
    <div className="flex items-center gap-4">
      <AlertCircle className="w-6 h-6 text-red-500" />
      <div>
        <p className="font-semibold text-red-800 dark:text-red-300">
          Processing Failed
        </p>
        <p className="text-sm text-muted-foreground">
          Could not read the receipt.
        </p>
      </div>
    </div>
    <Button variant="ghost" size="sm">
      Retry
    </Button>
  </>
);

export default function ReceiptStatusCard({ receipt }: ReceiptStatusCardProps) {
  const renderState = () => {
    switch (receipt.status) {
      case "processing":
        return <ProcessingState receipt={receipt} />;
      case "success":
        return <SuccessState receipt={receipt} />;
      case "error":
        return <ErrorState />;
      default:
        return null;
    }
  };
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        {renderState()}
      </CardContent>
    </Card>
  );
}
