import mongoose, { Schema, Document } from "mongoose";
import { Password } from "../utils/password";

export const USER_TABLE = "user";
export enum ERole {
  Admin = "admin",
  User = "user",
}
export interface IUser {
  name: string;
  email: string;
  password: string;
  mobile: string;
  avatar: string;
  role: string;
  active: string;
  emailVerify: boolean;
  accessToken: string;
}
export interface IUserDoc extends Document<IUser>, IUser {}

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    role: { type: String, default: ERole.User, enum: ERole },
    active: { type: Boolean, default: true },
    emailVerify: { type: Boolean, default: false },
    accessToken: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);
schema.virtual("id").get(function () {
  return this._id.toHexString();
});
schema.pre("save", function cb(done) {
  const password = this.get("password");
  if (this.isModified("password")) {
    this.set("password", Password.hash(password));
  }
  if (this.get("role") === "admin") this.set("emailVerify", true);
  done();
});

export const User = mongoose.model<IUserDoc>(USER_TABLE, schema);
