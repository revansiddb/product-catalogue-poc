jest.mock('../adapters/FakeStoreCatalogAdapter');
jest.mock('../adapters/EmailAdapter');
import request from 'supertest';
import app from '../app';

const mockProduct = (id = 1) => ({
  id,
  title: 'Test Product ' + id,
  price: 9.99,
  description: 'A great product',
  category: 'electronics',
  imageUrl: 'https://example.com/img.jpg',
  rating: { rate: 4.5, count: 100 },
});

const mockCatalog = {
  getFeaturedProducts: jest.fn(),
  getCategories: jest.fn(),
  getProductsByCategory: jest.fn(),
  searchProducts: jest.fn(),
  getProductById: jest.fn(),
};

beforeEach(() => {
  app.locals.catalog = mockCatalog;
  app.locals.email = { sendEnquiry: jest.fn() };
});

describe('GET /api/products', () => {
  it('no params -> getFeaturedProducts returns 5 products -> 200 array length 5', async () => {
    const products = [1, 2, 3, 4, 5].map(mockProduct);
    mockCatalog.getFeaturedProducts.mockResolvedValue(products);

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(5);
  });

  it('?category=electronics -> getProductsByCategory returns 4 products -> 200 { featured: len 2, rest: len 2 }', async () => {
    const products = [1, 2, 3, 4].map(mockProduct);
    mockCatalog.getProductsByCategory.mockResolvedValue(products);

    const res = await request(app).get('/api/products?category=electronics');
    expect(res.status).toBe(200);
    expect(res.body.featured).toHaveLength(2);
    expect(res.body.rest).toHaveLength(2);
  });

  it('?q=jacket -> searchProducts returns [mockProduct()] -> 200 array', async () => {
    mockCatalog.searchProducts.mockResolvedValue([mockProduct()]);

    const res = await request(app).get('/api/products?q=jacket');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  it('?q= (empty) -> 400 with error field', async () => {
    const res = await request(app).get('/api/products?q=');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/products/1 -> getProductById returns mockProduct(1) -> 200 body.id === 1', async () => {
    mockCatalog.getProductById.mockResolvedValue(mockProduct(1));

    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('GET /api/products/abc -> 400', async () => {
    const res = await request(app).get('/api/products/abc');
    expect(res.status).toBe(400);
  });

  it('GET /api/products/999 -> getProductById rejects Error("NOT_FOUND") -> 404', async () => {
    mockCatalog.getProductById.mockRejectedValue(new Error('NOT_FOUND'));

    const res = await request(app).get('/api/products/999');
    expect(res.status).toBe(404);
  });
});
