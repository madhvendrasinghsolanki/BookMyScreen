import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist {
  _id?: mongoose.Types.ObjectId | string;
  user?: mongoose.Types.ObjectId | string;
  movieTitle: string;
  posterUrl?: string;
  createdAt?: Date;
}

export type IWishlistDocument = Document & IWishlist;

const wishlistSchema = new Schema<IWishlistDocument>({
  user: { type: Schema.Types.Mixed },
  movieTitle: { type: String, required: true },
  posterUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const WishlistModel = mongoose.models.Wishlist || mongoose.model<IWishlistDocument>("Wishlist", wishlistSchema);
