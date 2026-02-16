"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ItemCard from "@/components/ItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import ItemModal from "@/components/ItemModal";
import { useCart } from "@/contexts/CartContext";
import type { ItemResponse } from "@/types";

const ITEMS_PER_PAGE = 8;

export default function ItemsPage() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { addItem } = useCart();

  // Fetch items for a given page
  const fetchItems = async (pageToLoad: number) => {
    try {
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(
        `/api/items?page=${pageToLoad}&limit=${ITEMS_PER_PAGE}`
      );
      const data: ItemResponse[] = await res.json();

      if (data.length < ITEMS_PER_PAGE) setHasMore(false); // No more items

      setItems((prev) => (pageToLoad === 1 ? data : [...prev, ...data]));
    } catch (err) {
      toast.error("Failed to load items.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchItems(1);
  }, []);
  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage);
  };

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
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-300">
            No items available yet. Check back later!
          </p>
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
      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-xl bg-primary-500 py-3 px-6 font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
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
