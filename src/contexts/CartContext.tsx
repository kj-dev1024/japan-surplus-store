'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { CartItem } from '@/types';
import type { ItemResponse } from '@/types';

const CART_KEY = 'japan_surplus_cart';

interface CartContextType {
  items: CartItem[];
  count: number;
  addItem: (item: ItemResponse, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    saveCart(next);
  }, []);

  const addItem = useCallback(
    (item: ItemResponse, quantity = 1) => {
      const existing = items.find((i) => i._id === item._id);
      let next: CartItem[];
      if (existing) {
        next = items.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        next = [
          ...items,
          {
            _id: item._id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity,
          },
        ];
      }
      persist(next);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(items.filter((i) => i._id !== id));
    },
    [items, persist]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(id);
        return;
      }
      persist(
        items.map((i) => (i._id === id ? { ...i, quantity } : i))
      );
    },
    [items, persist, removeItem]
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const value: CartContextType = {
    items,
    count,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
