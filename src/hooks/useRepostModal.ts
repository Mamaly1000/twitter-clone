import { create } from "zustand";

interface useRepostModalStore {
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  id?: string;
}

export const useRepostModal = create<useRepostModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, id: undefined }),
  onOpen: (id) => set({ isOpen: true, id }),
  id: undefined,
}));
