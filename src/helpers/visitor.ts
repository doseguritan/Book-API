import type { Request, Response } from "express";
export const getVisitorID = (req: Request, res: Response): string => {
  let visitorID = req.cookies['visitor_id'];
  if (visitorID) {
    return visitorID;
  }
  visitorID = crypto.randomUUID();
  res.cookie('visitor_id', visitorID, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 }); // Expires in 1 year
  return visitorID;
}