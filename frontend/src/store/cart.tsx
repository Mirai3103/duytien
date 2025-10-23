import { create } from "zustand";

interface CartStore {
  selectedIds: number[];
  select: (id: number) => void;
  unselect: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isSelected: (id: number) => boolean;
  isAny: boolean;
  isNone: boolean;
  isAll: (totalItems: number) => boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  selectedIds: [],

  select: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds
        : [...state.selectedIds, id],
    })),

  unselect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((x) => x !== id),
    })),

  toggle: (id) =>
    get().isSelected(id) ? get().unselect(id) : get().select(id),

  clear: () => set({ selectedIds: [] }),

  isSelected: (id) => get().selectedIds.includes(id),

  get isAny() {
    return get().selectedIds.length > 0;
  },

  get isNone() {
    return get().selectedIds.length === 0;
  },

  isAll: (total) => get().selectedIds.length === total,
}));
