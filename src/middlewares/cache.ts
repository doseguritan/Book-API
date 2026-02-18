import nodecache from "node-cache";

import type { Request, Response, NextFunction } from 'express';
const DURATION:number = 3600;
export const cache = new nodecache({ stdTTL: DURATION }); // Cache for 1 hour

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if(req.method !== 'GET') return next();

  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
      return res.json(cachedResponse);
  }
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) {
      cache.set(key, body, DURATION);
    }
    return originalJson(body);
  }
  next();
};
