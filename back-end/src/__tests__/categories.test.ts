jest.mock('../adapters/FakeStoreCatalogAdapter');
jest.mock('../adapters/EmailAdapter');
import request from 'supertest';
import app from '../app';

beforeEach(() => {
  app.locals.catalog = {
    getCategories: jest.fn().mockResolvedValue(['electronics', 'jewelery']),
    getFeaturedProducts: jest.fn(),
    getProductsByCategory: jest.fn(),
    searchProducts: jest.fn(),
    getProductById: jest.fn(),
  };
  app.locals.email = { sendEnquiry: jest.fn() };
});

describe('GET /api/categories', () => {
  it('returns 200 with categories array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['electronics', 'jewelery']);
  });
});
