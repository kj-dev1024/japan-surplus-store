"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import type { ItemResponse } from "@/types";

interface AdminItemFormProps {
  item: ItemResponse | null;
  token: string;
  onClose: () => void;
  onSuccess: (updated?: ItemResponse) => void;
}

export default function AdminItemForm({
  item,
  token,
  onClose,
  onSuccess,
}: AdminItemFormProps) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [stock, setStock] = useState(item?.stock?.toString() ?? "0");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoryItems, setcategoryItems] = useState([
    "Furniture",
    "Storage Boxes",
    "Kitchenware",
    "Cookware",
    "Tableware",
    "Home Decor",
    "Microwaves",
    "Rice Cookers",
    "Induction Cookers",
    "Mattresses",
    "Clothes",
    "Bags",
    "Toys",
    "Tools",
    "Gardening Items",
    "Fitness Equipment",
    "Car Accessories",
    "Office Supplies",
  ]);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(String(item.price));
      setDescription(item.description);
      setImageUrl(item.imageUrl);
      setCategory(item.category ?? "");
      setStock(String(item.stock ?? 0));
    }
  }, [item]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image (JPEG, PNG, GIF, or WebP).");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      setImageUrl(data.url);
      toast.success("Image uploaded to R2");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (Number.isNaN(numPrice) || numPrice < 0) {
      toast.error("Enter a valid price");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!imageUrl.trim()) {
      toast.error("Image URL is required");
      return;
    }
    const stockNum = parseInt(stock, 10);
    if (Number.isNaN(stockNum) || stockNum < 0) {
      toast.error("Enter a valid stock (0 or more)");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        price: numPrice,
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        category: category.trim() || undefined,
        stock: stockNum,
      };
      const url = isEdit ? `/api/items/${item._id}` : "/api/items";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Request failed");
        return;
      }
      toast.success(isEdit ? "Item updated" : "Item added");
      onSuccess(data);
    } catch {
      toast.error("Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-slide-up overflow-auto rounded-2xl bg-white p-6 shadow-modal dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {isEdit ? "Edit Item" : "Add Item"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Price (₱)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Select Category</option>

              {categoryItems.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Image
            </label>
            <div className="mt-1 flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {uploading ? "Uploading..." : "Upload image"}
              </button>
            </div>

            {imageUrl && (
              <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-primary-500 py-2.5 font-medium text-white hover:bg-primary-600 disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              {submitting ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
