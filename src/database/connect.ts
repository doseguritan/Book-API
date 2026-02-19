import sqlite3 from 'sqlite3';

const sql3 = sqlite3.verbose();
export const db = new sql3.Database(":memory:", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to the books database.');
  let create_favorites = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      UNIQUE(visitor_id, book_id)
    );
  `;
  const create_searches = `
    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      query TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.exec(`
    ${create_favorites}
    ${create_searches}
  `, (err) => {
    if (err) {
      console.error('Error creating favorites table:', err.message);
      return;
    }
    console.log('Favorites table created or already exists.');
  })
});
