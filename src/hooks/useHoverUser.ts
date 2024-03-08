import { create } from "zustand";

interface useHoverUserStore {
  id?: string;
  postId?: string;
  isHovering: boolean;
  onHover: ({ userId, postId }: { userId: string; postId: string }) => void;
  setHover: (isHovering: boolean) => void;
  onLeave: () => void;
}
export const useHoverUser = create<useHoverUserStore>((set) => ({
  id: undefined,
  postId: undefined,
  onHover: ({ userId, postId }) =>
    set({ id: userId, postId, isHovering: true }),
  onLeave: () => set({ id: undefined, postId: undefined }),
  isHovering: false,
  setHover: (isHovering) => set({ isHovering }),
}));
