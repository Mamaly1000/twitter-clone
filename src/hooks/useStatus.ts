import { create } from "zustand";

interface useStatusStore {
  postId?: string;
  isOpen: boolean;
  onOpen: (postId: string) => void;
  onClose: () => void;
}

export const useStatus = create<useStatusStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, postId: undefined }),
  onOpen: (postId) => set({ isOpen: true, postId }),
  postId: undefined,
}));
