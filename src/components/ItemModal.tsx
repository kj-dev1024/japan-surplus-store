"use client";

import Image from "next/image";
import type { ItemResponse } from "@/types";
import { useState } from "react";

interface ItemModalProps {
  item: ItemResponse | null;
  onClose: () => void;
  onAddToCart: (item: ItemResponse) => void;
}

export default function ItemModal({
  item,
  onClose,
  onAddToCart,
}: ItemModalProps) {
  if (!item) return null;
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () => {
    if (!item?.imageUrl?.length) return;

    setCurrentIndex((prev) =>
      prev === item.imageUrl.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!item?.imageUrl?.length) return;

    setCurrentIndex((prev) =>
      prev === 0 ? item.imageUrl.length - 1 : prev - 1
    );
  };
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
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-lg -translate-y-1/2 animate-slide-up overflow-y-auto rounded-2xl bg-white shadow-modal dark:bg-slate-900"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800 group">
          <Image
            src={item.imageUrl[currentIndex]}
            alt={`${item.name}-${currentIndex}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Left Button */}
          {item.imageUrl.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the parent onClick
                  prevSlide();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white hover:bg-black/70"
              >
                ‹
              </button>

              {/* Right Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white hover:bg-black/70"
              >
                ›
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
                {item.imageUrl.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          {item.category && (
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {item.category}
            </span>
          )}
          <h2
            id="item-modal-title"
            className="text-xl font-semibold text-slate-800 dark:text-slate-100"
          >
            {item.name}
          </h2>
          <p className="mt-1 text-lg font-medium text-primary-600 dark:text-primary-400">
            ₱{item.price.toLocaleString()}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {item.description}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {item.stock != null && item.stock > 0
              ? `In stock: ${item.stock}`
              : "Out of stock"}
          </p>
          <button
            type="button"
            disabled={item.stock != null && item.stock <= 0}
            onClick={() =>
              (item.stock == null || item.stock > 0) && onAddToCart(item)
            }
            className="mt-4 w-full rounded-xl bg-primary-500 py-3 font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
