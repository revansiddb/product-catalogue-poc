import express from 'express';
import cors from 'cors';
import { FakeStoreCatalogAdapter } from './adapters/FakeStoreCatalogAdapter';
import { EmailAdapter } from './adapters/EmailAdapter';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import enquiryRouter from './routes/enquiry';

const app = express();
app.use(cors());
app.use(express.json());

app.locals.catalog = new FakeStoreCatalogAdapter(
  process.env.FAKESTORE_BASE_URL ?? 'https://fakestoreapi.com',
  Number(process.env.CACHE_TTL_SECONDS ?? 300)
);
app.locals.email = new EmailAdapter();

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/enquiry', enquiryRouter);

app.use((_req, res) => { res.status(404).json({ error: 'Not found' }); });

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
