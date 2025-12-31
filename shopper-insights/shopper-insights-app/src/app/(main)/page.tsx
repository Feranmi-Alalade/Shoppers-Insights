"use client";

import Uploader from "@/components/upload/Uploader";
import ReceiptProcessingList from "@/components/receipts/ReceiptProcessingList";
import { useReceiptStore } from "@/store/receiptStore";

export default function UploadPage() {
  const receipts = useReceiptStore((state) => state.receipts);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload a Receipt</h1>
        <p className="text-muted-foreground mt-1">
          Let&apos;s get insights from your latest purchase. Drag a file or click to
          upload.
        </p>
      </div>
      <Uploader />
      <ReceiptProcessingList receipts={receipts} />
    </div>
  );
}
