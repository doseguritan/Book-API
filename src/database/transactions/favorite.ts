import type { Book, FavoriteBook } from 'src/types/book.js';
import { db } from '../connect.js';

export async function addFavorite(visitorID: string, bookID: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO favorites (visitor_id, book_id) VALUES (?, ?)', 
      [visitorID, bookID],
      (err) => {
        if (err) {
          console.error('Error saving favorite book:', err);
          return reject(new Error('Failed to save favorite book'));
        }
        console.log('Book added to favorites successfully.');
        resolve();
      }
    );
  });
}

export async function removeFavorite(visitorID: string, bookID: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM favorites WHERE visitor_id = ? AND book_id = ?', 
      [visitorID, bookID],
      (err) => {
        if (err) {
          console.error('Error removing favorite book:', err);
          return reject(new Error('Failed to remove favorite book'));
        }
        console.log('Book removed from favorites successfully.');
        resolve();
      }
    );
  });
}

export async function getFavoriteBookIDs(visitorID: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT book_id FROM favorites WHERE visitor_id = ?', 
      [visitorID],
      (err, rows:FavoriteBook[]) => {
        if (err) {
          console.error('Error fetching favorite books:', err);
          return reject(new Error('Failed to fetch favorite books'));
        }
        const bookIDs = rows.map((row: FavoriteBook) => row.book_id);
        resolve(bookIDs);
      }
    );
  });
}