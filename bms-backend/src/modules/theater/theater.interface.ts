import { Types } from "mongoose";

export interface IThreater {
  _id?: Types.ObjectId | string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  logo?: string;
}
