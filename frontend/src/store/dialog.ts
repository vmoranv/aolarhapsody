import { create } from 'zustand';
import { DataItem } from '../components/DataView';

interface DialogState {
  detailItem: DataItem | null;
  isDetailVisible: boolean;
  isLoading: boolean;
  showDetail: (item: DataItem) => void;
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
