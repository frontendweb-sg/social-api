import mongoose, { Schema, Document } from "mongoose";
import { USER_TABLE } from "./user";

export const POST_TABLE = "Post";
export enum Status {
  Approved = "approved",
  Rejected = "rejected",
  Pending = "pending",
}
export interface ILike {
  user: Schema.Types.ObjectId;
  active: boolean;
}

export interface IComment {
  user: Schema.Types.ObjectId;
  message: string;
  status: Status;
}

export interface IPost {
  user: Schema.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  images: string[];
  active: boolean;
  comments: IComment[];
  likes: ILike[];
  tags: string[];
}
export interface IPostDoc extends Document<IPost>, IPost {}

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: USER_TABLE },
    title: { type: String, required: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: USER_TABLE },
        message: { type: String, default: "" },
        status: { type: String, default: Status.Pending, enum: Status },
      },
    ],
    likes: [
      {
        user: { type: Schema.Types.ObjectId, ref: USER_TABLE },
        active: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    id: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

schema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Post = mongoose.model<IPostDoc>(POST_TABLE, schema);
