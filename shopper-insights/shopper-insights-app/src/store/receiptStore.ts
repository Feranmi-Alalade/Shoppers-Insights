// Zustand store for receipts
import { create } from "zustand";

import { Receipt, ReceiptStatus } from "@/types";

const initialReceipts: Receipt[] = [
  {
    id: "1",
    store: "Whole Foods Market",
    total: 87.43,
    date: "2025-07-13",
    items: 14,
    status: "success",
    categories: [
      { name: "Groceries", amount: 52.45, percentage: 60 },
      { name: "Household", amount: 17.49, percentage: 20 },
      { name: "Personal Care", amount: 8.75, percentage: 10 },
      { name: "Other", amount: 8.74, percentage: 10 },
    ],
    itemsList: [
      {
        name: "Organic Bananas",
        price: 2.99,
        quantity: 2,
        category: "Groceries",
      },
      { name: "Almond Milk", price: 3.49, quantity: 1, category: "Groceries" },
      // ... more items
    ],
  },
  // ... more receipts
];

interface ReceiptState {
  receipts: Receipt[];
  addReceipt: (receipt: Receipt) => void;
  updateReceiptStatus: (
    receiptId: string,
    status: ReceiptStatus,
    data?: Partial<Receipt>,
  ) => void;
  getHistory: () => Receipt[];
}

export const useReceiptStore = create<ReceiptState>((set, get) => ({
  receipts: initialReceipts,
  addReceipt: (receipt) => {
    set((state) => ({ receipts: [receipt, ...state.receipts] }));
  },
  updateReceiptStatus: (receiptId, status, data) => {
    set((state) => ({
      receipts: state.receipts.map((r) =>
        r.id === receiptId ? { ...r, status, ...data } : r,
      ),
    }));
  },
  getHistory: () => get().receipts.filter((r) => r.status === "success"),
}));
