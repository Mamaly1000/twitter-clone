import { create } from "zustand";

interface useSelectedDropdownStore {
  postId?: string;
  onSelect: (postId: string) => void;
  onClose: () => void;
}

export const useSelectedDropdown = create<useSelectedDropdownStore>((set) => ({
  onClose: () => set({ postId: undefined }),
  onSelect: (postId) => set({ postId }),
  postId: undefined,
}));
