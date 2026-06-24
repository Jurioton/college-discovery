import { z } from "zod";

export const collegeQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  city: z.string().trim().max(50).optional(),
  minFees: z.coerce.number().nonnegative().optional(),
  maxFees: z.coerce.number().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
}).refine(
  (data) => !data.minFees || !data.maxFees || data.minFees <= data.maxFees,
  { message: "minFees cannot exceed maxFees" }
);