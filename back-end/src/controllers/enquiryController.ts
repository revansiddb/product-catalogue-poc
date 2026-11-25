import { Request, Response, NextFunction } from 'express';
import { EmailProvider, EnquiryRequest } from '../types/domain';

/**
 * Handles POST /api/enquiry.
 */
export async function sendEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const emailProvider: EmailProvider = req.app.locals.email;
    await emailProvider.sendEnquiry(req.body as EnquiryRequest);
    res.json({ message: 'Enquiry sent' });
  } catch (err) {
    next(err);
  }
}
