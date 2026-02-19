import express from 'express';
const router = express.Router();
import type { Request, Response } from 'express';
import type { Book, BookResponse, FavoriteBook } from '../types/book.js';
import { db } from '../database/connect.js';
import { getVisitorID } from '../helpers/visitor.js';
import { cache } from '../middlewares/cache.js';
import { fetchSearchQueryString, saveSearchQueryString } from '../database/transactions/search.js';

export const GUTENDEX_API_URL = `${process.env.BOOK_API_URL}/books`;

router.get('/', async (req: Request, res: Response) => {
  try {
    const visitorID:string = getVisitorID(req, res);
    const query = new URLSearchParams(req.query as Record<string, string>)
    const query_val = query.get('search') || false

    if(query_val)
      await saveSearchQueryString(visitorID, query_val);

    const queryStr = query.toString();
    const response = await fetch(`${GUTENDEX_API_URL}?${queryStr}`);
    const data: BookResponse = await response.json();

    res.json({data});
  } catch (error) {
    console.error('Error fetching books:', error);
    res.sendStatus(500).json({ error: 'Failed to fetch books' });
  }
});

router.get('/top-10', async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${GUTENDEX_API_URL}`);
    const data: BookResponse = await response.json();
    
    res.json({data: data?.results?.slice(0, 10)});
  } catch (error) {
    console.error('Error fetching books:', error);
    res.sendStatus(500).json({ error: 'Failed to fetch books' });
  }
});

router.get('/searches', async (req: Request, res: Response) => {
  try {
    const visitorID:string = getVisitorID(req, res);
    const fetchSearches =  await fetchSearchQueryString(visitorID);
    res.json({data: fetchSearches})
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    res.status(500).json({ error: 'Failed to fetch searches' });
  }
});

router.get('/favorites', async (req: Request, res: Response) => {
  try {
    const visitorID:string = getVisitorID(req, res);
    db.all('SELECT book_id FROM favorites where visitor_id = ?', [visitorID], async (err, rows: FavoriteBook[]) => {
      if (err) {
        console.error('Error fetching favorite book IDs:', err);
        return res.status(500).json({ error: 'Failed to fetch favorite books' });
      }
      const bookIds: number[] = rows.map((row: FavoriteBook) => parseInt(row.book_id, 10));
      if (bookIds.length === 0) {
        return res.json({data: []});
      }

      if('only_id' in req.query) {
        return res.json({data: bookIds});
      }
      
      const query = bookIds.join(',');
      const response = await fetch(`${GUTENDEX_API_URL}?ids=${query}`);
      const data: Book[] = await response.json();
      res.json({data});
    });
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    res.status(500).json({ error: 'Failed to fetch favorite books' });
  }
});


const saveDeleteFavoriteBookMessage = (to_remove: boolean): string => {
  return to_remove ? 'Book removed from favorites' : 'Book added to favorites';
}

const fetchBookByID = async (book_id: string): Promise<Book> => {
  const id: number = Number(book_id);
  if(isNaN(id)) {
    throw new Error('Invalid book ID');
  }
  const response = await fetch(`${GUTENDEX_API_URL}/${id}`);
  const data: Book = await response.json();
  return data;
}

router.post('/favorites/:id', async (req: Request, res: Response) => {
  const to_remove = 'remove' in req.query;
  const query: string = to_remove
    ? 'DELETE FROM favorites WHERE visitor_id = ? AND book_id = ?' 
    : `INSERT OR IGNORE INTO favorites (visitor_id, book_id) VALUES (?, ?) ON CONFLICT(visitor_id, book_id) DO NOTHING`;
  try {
    const book = await fetchBookByID(req.params.id as string);
    if('detail' in book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const visitorID = getVisitorID(req, res);
    db.run(
      query, 
      [visitorID, req.params.id],
      (err) => {
        if (err) {
          console.error(`Error ${to_remove ? 'removing' : 'saving'} favorite book:`, err);
          return res.status(500).json({ error: `Failed to ${to_remove ? 'remove' : 'save'} favorite book` });
        }
        console.log(`Book ${to_remove ? 'removed from' : 'added to'} favorites successfully.`);
      }
    )
    cache.del(['/api/books/favorites', '/api/books/favorites?only_id'])
    res.json({ message: saveDeleteFavoriteBookMessage(to_remove) });
  } catch (error) {
    console.error('Error removing/saving favorite book:', error);
    res.status(500).json({ error: `Failed to ${to_remove ? 'remove' : 'save'} favorite book` });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await fetchBookByID(req.params.id as string);
    res.json({data});
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

export default router;