import path from 'node:path';
import sqlite3 from 'sqlite3';

const  __dirname = path.dirname(new URL(import.meta.url).pathname);
const db_path = path.join(__dirname, 'book.sqlite');

const db_ = process.env.NODE_ENV === 'development' ? db_path : ':memory:'
const sql3 = sqlite3.verbose();
export const db = new sql3.Database(db_, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to the books database.');
  let create_favorites = `
    DROP TABLE IF EXISTS favorites;
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      UNIQUE(visitor_id, book_id)
    );
  `;
  const create_searches = `
    DROP TABLE IF EXISTS searches;
    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      query TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT UQ_visitor_id_query UNIQUE (visitor_id, query)
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
