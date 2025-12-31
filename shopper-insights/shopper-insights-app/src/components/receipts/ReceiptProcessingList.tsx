import { Receipt } from "@/types";
import ReceiptStatusCard from "./ReceiptStatusCard";

interface ReceiptProcessingListProps {
  receipts: Receipt[];
}

export default function ReceiptProcessingList({
  receipts = [],
}: ReceiptProcessingListProps) {
  const safeReceipts = Array.isArray(receipts) ? receipts : [];
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight mb-4">
        Recent Activity
      </h2>
      {safeReceipts.length > 0 ? (
        <div className="space-y-3">
          {safeReceipts.map((receipt) => (
            <ReceiptStatusCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            Your uploaded receipts will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
