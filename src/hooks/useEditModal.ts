import { create } from "zustand";

interface useEditModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const useEditModal = create<useEditModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
