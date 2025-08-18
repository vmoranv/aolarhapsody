import { create } from 'zustand';

interface SearchState {
  searchValue: string;
  filterType: string;
  resultCount: number;
  setSearchValue: (value: string) => void;
  setFilterType: (value: string) => void;
  setResultCount: (count: number) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchValue: '',
  filterType: 'all',
  resultCount: 0,
  setSearchValue: (value) => set({ searchValue: value }),
  setFilterType: (value) => set({ filterType: value }),
  setResultCount: (count) => set({ resultCount: count }),
  reset: () => set({ searchValue: '', filterType: 'all', resultCount: 0 }),
}));
