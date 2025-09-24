import { create } from 'zustand';
import { DataItem } from '../components/DataView';

/**
 * @description 对话框状态接口
 * @property {DataItem | null} detailItem - 详情项目
 * @property {boolean} isDetailVisible - 详情是否可见
 * @property {boolean} isLoading - 是否正在加载
 * @property {(item: DataItem) => void} showDetail - 显示详情
 * @property {() => void} hideDetail - 隐藏详情
 * @property {(loading: boolean) => void} setIsLoading - 设置加载状态
 */
interface DialogState {
  detailItem: DataItem | null;
  isDetailVisible: boolean;
  isLoading: boolean;
  showDetail: (item: DataItem) => void;
  hideDetail: () => void;
  setIsLoading: (loading: boolean) => void;
}

/**
 * @description 对话框状态管理
 */
export const useDialogStore = create<DialogState>((set) => ({
  detailItem: null,
  isDetailVisible: false,
  isLoading: false,
  showDetail: (item) => set({ detailItem: item, isDetailVisible: true }),
  hideDetail: () => set({ detailItem: null, isDetailVisible: false, isLoading: false }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
