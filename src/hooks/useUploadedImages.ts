import { create } from "zustand";

interface useUploadedImagesStore {
  isOpen: boolean;
  images: { url: string; desc?: string }[];
  selectedImage?: { url: string; desc?: string };
  onSelect: (imageUrl: { url: string; desc?: string }) => void;
  onReset: () => void;
  onAdd: (images: { url: string; desc?: string }[]) => void;
  onRemove: (images: { url: string; desc?: string }[]) => void;
}
export const useUploadedImages = create<useUploadedImagesStore>((set) => ({
  onReset: () => set({ isOpen: false, selectedImage: undefined }),
  onSelect: (imageUrl) => set({ isOpen: true, selectedImage: imageUrl }),
  images: [],
  isOpen: false,
  onAdd: (images) => set({ images: images }),
  onRemove: (images) => set({ images: images }),
  selectedImage: undefined,
}));
