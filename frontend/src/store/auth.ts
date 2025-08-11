import { create } from "zustand";
import { api } from "../utils/api";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  async login(email, password) {
    const res = await api.post(`${API_URL}/api/auth/login`, { email, password });
    set({ accessToken: res.data.accessToken, user: res.data.user });
  },
  async register(name, email, password) {
    await api.post(`${API_URL}/api/auth/register`, { name, email, password });
    await get().login(email, password);
  },
  async fetchMe() {
    const { accessToken } = get();
    if (!accessToken) return;
    const res = await api.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    set({ user: res.data });
  },
  async logout() {
    const { accessToken } = get();
    await api.post(`${API_URL}/api/auth/logout`, {}, { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined });
    set({ user: null, accessToken: null });
  },
}));


