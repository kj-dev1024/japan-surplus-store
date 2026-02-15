'use client';

import Image from 'next/image';
import type { ItemResponse } from '@/types';

interface ItemCardProps {
  item: ItemResponse;
  onSelect: (item: ItemResponse) => void;
  onAddToCart: (item: ItemResponse) => void;
}

export default function ItemCard({ item, onSelect, onAddToCart }: ItemCardProps) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
      onClick={() => onSelect(item)}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {item.category && (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {item.category}
          </span>
        )}
        <h3 className="font-semibold text-slate-800 line-clamp-1 dark:text-slate-100">
          {item.name}
        </h3>
        <p className="mt-0.5 text-primary-600 dark:text-primary-400">
          ₱{item.price.toLocaleString()}
        </p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
          {item.description}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {item.stock != null && item.stock > 0 ? `In stock: ${item.stock}` : 'Out of stock'}
        </p>
        <button
          type="button"
          disabled={item.stock != null && item.stock <= 0}
          onClick={(e) => {
            e.stopPropagation();
            if (item.stock == null || item.stock > 0) onAddToCart(item);
          }}
          className="mt-3 w-full rounded-xl bg-primary-500 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
