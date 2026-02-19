import type { Search } from 'src/types/search.js';
import { db } from '../connect.js';
export async function saveSearchQueryString(visitorID: string, query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO searches (visitor_id, query) VALUES (?, ?) ON CONFLICT (visitor_id, query) DO NOTHING', 
      [visitorID, query],
      (err) => {
        if (err) {
          console.error('Error saving search query string:', err);
          return reject(new Error('Failed to save search query'));
        }
        console.log('Search query saved successfully.');
        resolve();
      }
    );
  });
}

export async function fetchSearchQueryString(visitorID: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT query FROM searches where visitor_id = ? ORDER BY created_at DESC LIMIT 5;', 
      [visitorID],
      (err, rows:Search[]) => {
        if (err) {
          console.error('Error saving search query string:', err);
          return reject(new Error('Failed to save search query'));
        }
        console.log(rows)
        console.log('Search query fetch successfully.');
        const queries = rows.map((row: Search) => row.query);
        resolve(queries);
      }
    );
  });
}