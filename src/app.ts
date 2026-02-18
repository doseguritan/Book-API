import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { cacheMiddleware } from './middlewares/cache.js';
import bookRouter from './routes/book.js';

const app = express();

app.use(cacheMiddleware);
app.use(express.json());
app.use(cookieParser())
// Routes - /api/books
app.use("/api/books", bookRouter);

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'Welcome to the Book API!' });
});

export default app;