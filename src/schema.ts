import { z } from "zod";
import { City } from "../types";

export const citiesByTagSchema = z.object({
  tag: z.string().min(1),
  isActive: z.string().transform((val) => val === "true"),
});

export const distanceSchema = z.object({
  from: z.string().uuid("Invalid 'from' UUID"),
  to: z.string().uuid("Invalid 'to' UUID"),
});

export const areaSchema = z.object({
  from: z.string().uuid("Invalid 'from' UUID"),
  distance: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "'distance' must be a non-negative number",
    }),
});
