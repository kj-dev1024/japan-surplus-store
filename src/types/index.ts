export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface ItemResponse {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
