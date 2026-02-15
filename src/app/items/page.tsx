'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ItemCard from '@/components/ItemCard';
import ItemCardSkeleton from '@/components/ItemCardSkeleton';
import ItemModal from '@/components/ItemModal';
import { useCart } from '@/contexts/CartContext';
import type { ItemResponse } from '@/types';
import dummyItems from '@/data/dummy-items.json';

export default function ItemsPage() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(dummyItems as ItemResponse[]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('Failed to load items. Showing sample items.');
          setItems(dummyItems as ItemResponse[]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleAddToCart = (item: ItemResponse) => {
    addItem(item);
    toast.success(`Added "${item.name}" to cart`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
        Our Items
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-300">No items available yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onSelect={setSelectedItem}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={(item) => {
          handleAddToCart(item);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
