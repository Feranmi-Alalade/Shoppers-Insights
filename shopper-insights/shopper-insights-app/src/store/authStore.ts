// Zustand store for auth
import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    role: "admin", // Change to 'user' for non-admin
  },
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
