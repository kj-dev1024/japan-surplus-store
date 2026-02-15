import mongoose, { Schema, model, models } from 'mongoose';

export interface IItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: false },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Item = models.Item ?? model<IItem>('Item', ItemSchema);
