import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateQueryParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "Invalid query parameters",
          errors: err.errors.map((e) => ({ path: e.path, message: e.message })),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
