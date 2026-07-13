import createHttpError from "http-errors";
import { WishlistModel, IWishlist } from "./wishlist.model";

export interface AddWishlistInput {
  movieTitle: string;
  posterUrl?: string;
}

export const wishlistService = {
  async getWishlistForUser(effectiveUserId: string): Promise<IWishlist[]> {
    const items = await WishlistModel.find().sort({ createdAt: -1 }).lean<IWishlist[]>();
    return items.filter((item) => String(item.user) === effectiveUserId);
  },

  async addToWishlist(userId: string, input: AddWishlistInput): Promise<{ item: IWishlist; created: boolean }> {
    const { movieTitle, posterUrl } = input;
    if (!movieTitle) {
      throw createHttpError(400, "Movie title is required");
    }

    const existingItems = await WishlistModel.find({ movieTitle }).lean<IWishlist[]>();
    const existing = existingItems.find((item) => String(item.user) === String(userId));
    if (existing) {
      return { item: existing, created: false };
    }

    const item = await WishlistModel.create({ user: userId, movieTitle, posterUrl });
    return { item, created: true };
  },

  async removeFromWishlist(itemId: string, requester: { id: string; role: string }): Promise<void> {
    const item = await WishlistModel.findById(itemId);
    if (!item) {
      throw createHttpError(404, "Wishlist item not found");
    }
    if (requester.role !== "admin" && String(item.user) !== requester.id) {
      throw createHttpError(403, "You do not have permission to remove this item");
    }
    await WishlistModel.findByIdAndDelete(itemId);
  },
};
