'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import AdminItemForm from '@/components/admin/AdminItemForm';
import type { ItemResponse } from '@/types';

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ItemResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = () => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setItems(data))
      .catch(() => toast.error('Failed to load items'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/items/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? 'Failed to delete');
        return;
      }
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success('Item deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out');
  };

  const handleFormSuccess = (updated?: ItemResponse) => {
    setFormOpen(false);
    setEditingItem(null);
    if (updated) {
      setItems((prev) =>
        prev.some((i) => i._id === updated._id)
          ? prev.map((i) => (i._id === updated._id ? updated : i))
          : [updated, ...prev]
      );
    } else {
      fetchItems();
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Admin — Inventory
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setFormOpen(true);
            }}
            className="rounded-xl bg-primary-500 px-4 py-2.5 font-medium text-white transition hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            Add Item
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-300">No items yet. Add your first item.</p>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="mt-3 text-primary-600 hover:underline dark:text-primary-400"
          >
            Add Item
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Image</th>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Category</th>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Price</th>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Stock</th>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {item.category ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      ₱{item.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {item.stock ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setFormOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formOpen && (
        <AdminItemForm
          item={editingItem}
          token={token!}
          onClose={() => {
            setFormOpen(false);
            setEditingItem(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete item?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed.`
            : ''
        }
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
