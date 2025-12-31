import { Receipt } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function getReceiptById(id: string): Promise<Receipt | null> {
  const res = await fetch(`${BASE_URL}/api/receipts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getUserProfile(): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function logout(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}
