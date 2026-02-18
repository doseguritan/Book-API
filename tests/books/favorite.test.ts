import request from 'supertest';
import app from '../../src/app.js';

describe('Books API - Favorites', () => {
  it('should fetch empty favorites', async () => {
    const response = await request(app).get('/api/books/favorites');
    const compare = {data: []}
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toEqual(compare);
  });

  it('should fetch favorites', async () => {
    const addFavoriteResponse = await request(app).post('/api/books/favorite/86');
    expect(addFavoriteResponse.status).toBe(200);

    const response = await request(app).get('/api/books/favorites');
    console.log(response.body.data)
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data.results)).toBe(true);
  });

  it('should fetch favorites with only_id query parameter returns array of booking_id', async () => {
    const addFavoriteResponse = await request(app).post('/api/books/favorite/86');
    expect(addFavoriteResponse.status).toBe(200);

    const response = await request(app).get('/api/books/favorites?only_id');
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    console.log(response.body.data)
    expect(response.body.data).toContain(86);
  });
});