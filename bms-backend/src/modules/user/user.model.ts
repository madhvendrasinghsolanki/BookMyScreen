import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  avatar?: string;
  createdAt?: Date;
}

export type IUserDocument = Document & IUser;

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);
