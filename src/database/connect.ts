import path from 'node:path';
import sqlite3 from 'sqlite3';

const  __dirname = path.dirname(new URL(import.meta.url).pathname);
const db_path = path.join(__dirname, 'book.sqlite');

const sql3 = sqlite3.verbose();
export const db = new sql3.Database(db_path, sqlite3.OPEN_READWRITE, (err) => {
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
