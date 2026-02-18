import { db } from '../connect.js';
export async function saveSearchQueryString(visitorID: string, query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO searches (visitor_id, query) VALUES (?, ?)', 
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