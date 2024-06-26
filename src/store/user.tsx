import { RecordOfficer, Registra, Student, User } from "@/types";
import { create } from "zustand";

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
