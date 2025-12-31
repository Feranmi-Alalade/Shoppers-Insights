// types/index.d.ts

export type ReceiptStatus = "processing" | "success" | "error";

export interface Receipt {
  id: string;
  store: string;
  date: string;
  total: number;
  items: number;
  status: ReceiptStatus;
  imageUrl?: string;
  categories?: {
    name: string;
    amount: number;
    percentage: number;
  }[];
  itemsList?: {
    name: string;
    price: number;
    quantity: number;
    category: string;
  }[];
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}
