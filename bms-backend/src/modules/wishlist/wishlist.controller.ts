import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { wishlistService } from "./wishlist.service";

export const wishlistController = {
  getWishlist: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const effectiveUserId = req.auth!.role === "admin" && userId ? String(userId) : req.auth!.sub;
    const items = await wishlistService.getWishlistForUser(effectiveUserId);
    res.json(items);
  }),

  addToWishlist: catchAsync(async (req: Request, res: Response) => {
    // The wishlist item always belongs to the authenticated caller.
    const { item, created } = await wishlistService.addToWishlist(req.auth!.sub, req.body || {});
    res.status(created ? 201 : 200).json(item);
  }),

  removeFromWishlist: catchAsync(async (req: Request, res: Response) => {
    await wishlistService.removeFromWishlist(String(req.params.id), { id: req.auth!.sub, role: req.auth!.role });
    res.json({ success: true });
  }),
};
