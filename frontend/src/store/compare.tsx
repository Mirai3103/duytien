import { create } from "zustand";

interface ICompareProductState {
  variantIds: number[]; // max 3 products
  addVariantId: (variantId: number) => void;
  removeVariantId: (variantId: number) => void;
  clearVariantIds: () => void;
  isVariantIdSelected: (variantId: number) => boolean;
}

export const useCompareStore = create<ICompareProductState>((set, get) => ({
  variantIds: [],
  addVariantId: (variantId) =>
    set((state) => {
      // Max 3 products
      if (state.variantIds.length >= 3) {
        return state;
      }
      // Don't add if already exists
      if (state.variantIds.includes(variantId)) {
        return state;
      }
      return { variantIds: [...state.variantIds, variantId] };
    }),
  removeVariantId: (variantId) =>
    set((state) => ({
      variantIds: state.variantIds.filter((id) => id !== variantId),
    })),
  clearVariantIds: () => set({ variantIds: [] }),
  isVariantIdSelected: (variantId) => get().variantIds.includes(variantId),
}));
