import 'dotenv/config';
import request from 'supertest';
import app from '../../src/app.js';

describe('Books API', () => {
  it('should fetch books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.status).toBe(200);
    expect(response.body.data.results).toBeDefined();
    expect(Array.isArray(response.body.data.results)).toBe(true);
  });

  it('should fetch books with query parameters', async () => {
    const response = await request(app).get('/api/books?search=pride');
    expect(response.status).toBe(200);
    expect(response.body.data.results).toBeDefined();
    expect(Array.isArray(response.body.data.results)).toBe(true);
  });
});