import { create } from 'zustand';

/**
 * @description 搜索状态的接口
 * @interface SearchState
 * @property {string} searchValue - 搜索值
 * @property {string} filterType - 筛选类型
 * @property {number} resultCount - 结果数量
 * @property {(value: string) => void} setSearchValue - 设置搜索值
 * @property {(value: string) => void} setFilterType - 设置筛选类型
 * @property {(count: number) => void} setResultCount - 设置结果数量
 * @property {() => void} reset - 重置状态
 */
interface SearchState {
  searchValue: string;
  filterType: string;
  resultCount: number;
  setSearchValue: (value: string) => void;
  setFilterType: (value: string) => void;
  setResultCount: (count: number) => void;
  reset: () => void;
}

/**
 * @description 搜索状态的 Zustand store
 */
export const useSearchStore = create<SearchState>((set) => ({
  searchValue: '',
  filterType: 'all',
  resultCount: 0,
  setSearchValue: (value) => set({ searchValue: value }),
  setFilterType: (value) => set({ filterType: value }),
  setResultCount: (count) => set({ resultCount: count }),
  reset: () => set({ searchValue: '', filterType: 'all', resultCount: 0 }),
}));
