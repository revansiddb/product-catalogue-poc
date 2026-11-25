import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const enquirySchema = z.object({
  productId: z.number().int().positive(),
  productTitle: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1).max(1000),
});

/**
 * Validates the JSON request body on POST /api/enquiry.
 */
export function validateEnquiryBody(req: Request, res: Response, next: NextFunction): void {
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    return;
  }

  req.body = parsed.data;
  next();
}
