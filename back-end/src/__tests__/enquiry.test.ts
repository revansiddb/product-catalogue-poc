jest.mock('../adapters/FakeStoreCatalogAdapter');
jest.mock('../adapters/EmailAdapter');
import request from 'supertest';
import app from '../app';

const validPayload = {
  productId: 1,
  productTitle: 'Test',
  name: 'Jane',
  email: 'jane@example.com',
  message: 'Hello',
};

beforeEach(() => {
  app.locals.catalog = {
    getFeaturedProducts: jest.fn(),
    getCategories: jest.fn(),
    getProductsByCategory: jest.fn(),
    searchProducts: jest.fn(),
    getProductById: jest.fn(),
  };
  app.locals.email = { sendEnquiry: jest.fn().mockResolvedValue(undefined) };
});

describe('POST /api/enquiry', () => {
  it('valid body -> 200 { message: "Enquiry sent" }', async () => {
    const res = await request(app).post('/api/enquiry').send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Enquiry sent' });
  });

  it('missing name -> 400 with error', async () => {
    const { name, ...payload } = validPayload;
    const res = await request(app).post('/api/enquiry').send(payload);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('invalid email -> 400 with error', async () => {
    const payload = { ...validPayload, email: 'not-an-email' };
    const res = await request(app).post('/api/enquiry').send(payload);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('sendEnquiry throws -> 500', async () => {
    app.locals.email = {
      sendEnquiry: jest.fn().mockRejectedValue(new Error('SMTP failure')),
    };
    const res = await request(app).post('/api/enquiry').send(validPayload);
    expect(res.status).toBe(500);
  });
});
