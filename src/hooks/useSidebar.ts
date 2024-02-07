import { create } from "zustand";

interface useSidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
const useSidebar = create<useSidebarStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useSidebar;
