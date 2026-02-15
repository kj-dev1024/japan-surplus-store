'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';

const FACEBOOK_USERNAME = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME ?? '';

function buildOrderMessage(items: { name: string; quantity: number; price: number }[], total: number): string {
  const lines = [
    '🛒 *Order Summary*',
    '',
    ...items.map((i) => `• ${i.name} x${i.quantity} — ₱${(i.price * i.quantity).toLocaleString()}`),
    '',
    `*Total: ₱${total.toLocaleString()}*`,
    '',
    '---',
    'Customer message: (your instructions or notes here)',
  ];
  return lines.join('\n');
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const messengerUrl = useMemo(() => {
    if (!FACEBOOK_USERNAME || items.length === 0) return null;
    const message = buildOrderMessage(
      items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total
    );
    return `https://m.me/${FACEBOOK_USERNAME}?text=${encodeURIComponent(message)}`;
  }, [items, total]);

  useEffect(() => {
    if (items.length === 0 && !messengerUrl) {
      router.replace('/items');
    }
  }, [items.length, messengerUrl, router]);

  const handleCheckout = () => {
    if (messengerUrl) {
      clearCart();
      window.location.href = messengerUrl;
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600 dark:text-slate-300">Your cart is empty. Redirecting...</p>
      </div>
    );
  }

  if (!FACEBOOK_USERNAME) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600 dark:text-slate-300">
          Checkout is not configured. Please set NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME in environment.
        </p>
        <button
          type="button"
          onClick={() => router.push('/items')}
          className="mt-4 text-primary-600 hover:underline dark:text-primary-400"
        >
          Back to Items
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100">
        Checkout via Messenger
      </h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <ul className="space-y-3 border-b border-slate-100 pb-4 dark:border-slate-700">
          {items.map((i) => (
            <li key={i._id} className="flex justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-200">
                {i.name} × {i.quantity}
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-100">
                ₱{(i.price * i.quantity).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between py-4 text-lg font-semibold">
          <span className="text-slate-700 dark:text-slate-200">Total</span>
          <span className="text-primary-600 dark:text-primary-400">
            ₱{total.toLocaleString()}
          </span>
        </div>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          You will be redirected to Facebook Messenger to send this order. Payment will be arranged with you there.
        </p>
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full rounded-xl bg-[#1877F2] py-3 font-medium text-white transition hover:bg-[#166FE5]"
        >
          Continue to Messenger
        </button>
        <button
          type="button"
          onClick={() => router.push('/items')}
          className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          Back to shopping
        </button>
      </div>
    </div>
  );
}
