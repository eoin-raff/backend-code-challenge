import { z } from "zod";
import { City } from "../types";

export const citiesByTagSchema = z.object({
  tag: z.string().min(1),
  isActive: z.string().transform((val) => val === "true"),
});

export const distanceSchemaFactory = (cities: City[]) =>
  z
    .object({
      from: z.string().uuid("Invalid 'from' UUID"),
      to: z.string().uuid("Invalid 'to' UUID"),
    })
    .refine((data) => cities.some((city) => city.guid === data.from), {
      message: `No city was found with 'from' uuid`,
      path: ["from"],
    })
    .refine((data) => cities.some((city) => city.guid === data.to), {
      message: `No city was found with 'to' uuid`,
      path: ["to"],
    });

export const areaSchemaFactory = (cities: City[]) =>
  z
    .object({
      from: z.string().uuid("Invalid 'from' UUID"),
      distance: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
          message: "'distance' must be a non-negative number",
        }),
    })
    .refine((data) => cities.some((city) => city.guid === data.from), {
      message: `No city was found with 'from' uuid`,
      path: ["from"],
    });
