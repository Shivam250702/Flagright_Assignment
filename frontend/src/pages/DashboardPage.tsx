import { FormEvent, useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { api } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Item {
  id: string;
  title: string;
  description?: string | null;
}

export function DashboardPage() {
  const { accessToken, user, fetchMe } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) fetchMe();
  }, [user, fetchMe]);

  useEffect(() => {
    if (!accessToken) return;
    loadItems();
  }, [accessToken]);

  async function loadItems() {
    try {
      const res = await api.get(`${API_URL}/api/items`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setItems(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load items");
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post(
        `${API_URL}/api/items`,
        { title, description },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setItems([res.data, ...items]);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create item");
    }
  }

  async function onDelete(id: string) {
    try {
      await api.delete(`${API_URL}/api/items/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setItems(items.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete item");
    }
  }

  if (!accessToken) {
    return <div className="py-10">Please login to access your dashboard.</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={onCreate} className="flex flex-col gap-3 max-w-xl">
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="btn">Add Item</button>
      </form>
      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="border rounded-md p-4 flex justify-between items-start">
            <div>
              <div className="font-semibold">{item.title}</div>
              {item.description && <div className="text-sm text-gray-600 dark:text-gray-300">{item.description}</div>}
            </div>
            <button className="btn" onClick={() => onDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


