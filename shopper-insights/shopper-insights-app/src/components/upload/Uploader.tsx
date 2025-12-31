"use client";

import { useReceiptStore } from "@/store/receiptStore";
import { UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";

export default function Uploader() {
  const { addReceipt, updateReceiptStatus } = useReceiptStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const newReceipt = {
        id: uuidv4(),
        store: file.name, // Use filename as placeholder
        date: new Date().toISOString(),
        total: 0,
        items: 0,
        status: "processing" as const,
      };

      addReceipt(newReceipt);

      setTimeout(() => {
        const mockData = {
          store: "Mock Store",
          total: Math.random() * 100,
          items: Math.floor(Math.random() * 20) + 1,
        };
        updateReceiptStatus(newReceipt.id, "success", mockData);
      }, 3000);
    },
    [addReceipt, updateReceiptStatus],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50 hover:border-primary"}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-12 h-12 text-muted-foreground" />
      <p className="mt-4 text-lg font-semibold">
        {isDragActive
          ? "Drop the receipt here!"
          : "Click or Drag & Drop to Upload"}
      </p>
      <p className="text-sm text-muted-foreground">PNG, JPG, or JPEG</p>
    </div>
  );
}
