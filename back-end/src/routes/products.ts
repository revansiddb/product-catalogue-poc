import { Router } from 'express';
import { validateProductsQuery, validateProductIdParam } from '../validators/productsValidator';
import { getProducts, getProductById } from '../controllers/productsController';

const router = Router();

router.get('/', validateProductsQuery, getProducts);
router.get('/:id', validateProductIdParam, getProductById);

export default router;
