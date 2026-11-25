import { Request, Response, NextFunction } from 'express';
import { CatalogProvider } from '../types/domain';

/**
 * Handles GET /api/categories.
 */
export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const catalog: CatalogProvider = req.app.locals.catalog;
    const categories = await catalog.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}
