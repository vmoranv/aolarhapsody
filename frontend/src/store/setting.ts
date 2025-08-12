import { create } from 'zustand';

/**
 * 系统设置store类型
 */
export interface settingsStoreType {
  isDark: boolean;
  setThemeDark: (value: boolean) => void;
  betaMode: boolean;
  setBetaMode: (value: boolean) => void;
  performanceMonitoring: boolean;
  setPerformanceMonitoring: (value: boolean) => void;
  kimiMode: boolean;
  setKimiMode: (value: boolean) => void;
}

export const useSettingStore = create<settingsStoreType>()((set) => ({
  isDark: false, // 深色模式 切换暗黑模式
  betaMode: false, // 测试版模式
  performanceMonitoring: false, // 性能监测
  kimiMode: false, // 基米模式

  // 设置暗黑模式
  setThemeDark: (value: boolean) => set({ isDark: value }),
  // 设置测试版模式
  setBetaMode: (value: boolean) => set({ betaMode: value }),
  // 设置性能监测
  setPerformanceMonitoring: (value: boolean) => set({ performanceMonitoring: value }),
  // 设置基米模式
  setKimiMode: (value: boolean) => {
    set({ kimiMode: value });
    localStorage.setItem('kimiMode', JSON.stringify(value));
  },
}));
