"use client";
import { Receipt } from "@/types";
import TrendsChart from "@/components/receipts/TrendsChart";
import RecentReceipts from "@/components/receipts/RecentReceipts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReceiptsHistoryPage() {
  const [receiptHistory, setReceiptHistory] = useState<Receipt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const response = await fetch("/api/receipts");
        const data = await response.json();
        setReceiptHistory(data);
      } catch (error) {
        console.error("Failed to fetch receipts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReceipts();
  }, []);

  // Poll for status updates on processing receipts
  useEffect(() => {
    const processingReceipts = receiptHistory.filter(
      (r) => r.status === "processing",
    );
    if (processingReceipts.length === 0) return;

    const interval = setInterval(async () => {
      let updated = false;
      const updatedReceipts = await Promise.all(
        receiptHistory.map(async (receipt) => {
          if (receipt.status === "processing") {
            const response = await fetch(`/api/receipts/${receipt.id}/status`);
            const { status } = await response.json();
            if (status !== "processing") {
              updated = true;
              return { ...receipt, status };
            }
          }
          return receipt;
        }),
      );

      if (updated) {
        setReceiptHistory(updatedReceipts);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [receiptHistory]);

  const filteredReceipts = receiptHistory
    .filter((receipt) =>
      receipt.store.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date-desc")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date-asc")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "amount-desc") return b.total - a.total;
      if (sortBy === "amount-asc") return a.total - b.total;
      return 0;
    });

  if (loading) {
    return <div>Loading receipts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receipt History</h1>
          <p className="text-muted-foreground mt-1">
            Browse and search all your successfully processed receipts.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Receipt
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by store..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (Newest)</SelectItem>
            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
            <SelectItem value="amount-desc">Amount (High)</SelectItem>
            <SelectItem value="amount-asc">Amount (Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        <TrendsChart />
      </div>

      <div className="mt-4">
        <RecentReceipts receipts={filteredReceipts} />
      </div>
    </div>
  );
}
