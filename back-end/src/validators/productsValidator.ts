import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const nonEmptyString = z.string().min(1);
const positiveIntParam = z.coerce.number().int().positive();

/**
 * Validates optional `category` and `q` query parameters on GET /api/products.
 */
export function validateProductsQuery(req: Request, res: Response, next: NextFunction): void {
  if (req.query.category !== undefined) {
    const parsed = nonEmptyString.safeParse(req.query.category);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }
  }

  if (req.query.q !== undefined) {
    const parsed = nonEmptyString.safeParse(req.query.q);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }
  }

  next();
}

/**
 * Validates the `:id` route parameter on GET /api/products/:id.
 */
export function validateProductIdParam(req: Request, res: Response, next: NextFunction): void {
  const parsed = positiveIntParam.safeParse(req.params.id);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid product id', details: parsed.error.errors });
    return;
  }

  next();
}
