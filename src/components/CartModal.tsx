'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (!isOpen) return null;

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
        aria-labelledby="cart-title"
        className="fixed inset-x-4 top-20 z-50 mx-auto max-h-[calc(100vh-6rem)] max-w-lg animate-slide-up overflow-hidden rounded-2xl bg-white shadow-modal dark:bg-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 id="cart-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Your Cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="py-8 text-center text-slate-500 dark:text-slate-400">
              Your cart is empty. Browse items to add some!
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800 dark:text-slate-100">
                      {item.name}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      ₱{item.price.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item._id)}
                        className="ml-2 text-sm text-red-600 hover:underline dark:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-slate-700 dark:text-slate-200">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex justify-between text-lg font-semibold">
              <span className="text-slate-700 dark:text-slate-200">Total</span>
              <span className="text-primary-600 dark:text-primary-400">
                ₱{total.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-xl bg-primary-500 py-3 text-center font-medium text-white transition hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
