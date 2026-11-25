import { Request, Response, NextFunction } from 'express';
import { CatalogProvider } from '../types/domain';

/**
 * Handles GET /api/products (supports ?category= and ?q= filters, or featured top-5).
 */
export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const catalog: CatalogProvider = req.app.locals.catalog;
    const { category, q } = req.query;

    if (typeof category === 'string') {
      const products = await catalog.getProductsByCategory(category);
      res.json({ featured: products.slice(0, 2), rest: products.slice(2) });
      return;
    }

    if (typeof q === 'string') {
      const products = await catalog.searchProducts(q);
      res.json(products);
      return;
    }

    const products = await catalog.getFeaturedProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles GET /api/products/:id.
 */
export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const catalog: CatalogProvider = req.app.locals.catalog;
    const product = await catalog.getProductById(id);
    res.json(product);
  } catch (err) {
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    next(err);
  }
}
