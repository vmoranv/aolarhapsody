import { create } from 'zustand';
import type { GodCard } from '../types/godcard';

interface DialogState {
  detailItem: GodCard | null;
  isDetailVisible: boolean;
  isLoading: boolean;
  showDetail: (item: GodCard) => void;
  hideDetail: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  detailItem: null,
  isDetailVisible: false,
  isLoading: false,
  showDetail: (item) => set({ detailItem: item, isDetailVisible: true }),
  hideDetail: () => set({ detailItem: null, isDetailVisible: false, isLoading: false }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
