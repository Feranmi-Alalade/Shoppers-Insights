// Zod schemas
import { z } from "zod";

export const receiptSchema = z.object({
  store: z.string(),
  amount: z.number(),
  date: z.string(),
});
