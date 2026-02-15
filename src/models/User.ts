import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  role: "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin"], default: "admin" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>("User", UserSchema);
