'use client';

import Image from 'next/image';
import type { ItemResponse } from '@/types';

interface ItemModalProps {
  item: ItemResponse | null;
  onClose: () => void;
  onAddToCart: (item: ItemResponse) => void;
}

export default function ItemModal({ item, onClose, onAddToCart }: ItemModalProps) {
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-lg -translate-y-1/2 animate-slide-up overflow-hidden rounded-2xl bg-white shadow-modal dark:bg-slate-900"
      >
        <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {item.category && (
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {item.category}
            </span>
          )}
          <h2 id="item-modal-title" className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {item.name}
          </h2>
          <p className="mt-1 text-lg font-medium text-primary-600 dark:text-primary-400">
            ₱{item.price.toLocaleString()}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {item.description}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {item.stock != null && item.stock > 0 ? `In stock: ${item.stock}` : 'Out of stock'}
          </p>
          <button
            type="button"
            disabled={item.stock != null && item.stock <= 0}
            onClick={() => (item.stock == null || item.stock > 0) && onAddToCart(item)}
            className="mt-4 w-full rounded-xl bg-primary-500 py-3 font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
