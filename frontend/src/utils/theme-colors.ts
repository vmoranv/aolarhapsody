import { useTheme } from '../hooks/useTheme';

// 品质等级颜色映射
export const getQualityColor = (quality: number, isDark = false) => {
  const colors = isDark
    ? {
        1: '#3fb950', // 绿色 - 深色模式
        2: '#58a6ff', // 蓝色 - 深色模式
        3: '#a5a5ff', // 紫色 - 深色模式
        4: '#f0883e', // 橙色 - 深色模式
        5: '#f85149', // 红色 - 深色模式
      }
    : {
        1: '#52c41a', // 绿色 - 浅色模式
        2: '#1890ff', // 蓝色 - 浅色模式
        3: '#722ed1', // 紫色 - 浅色模式
        4: '#fa8c16', // 橙色 - 浅色模式
        5: '#f5222d', // 红色 - 浅色模式
      };
  return colors[quality as keyof typeof colors] || (isDark ? '#6e7681' : '#d9d9d9');
};

// 元素属性颜色映射
export const getElementColor = (element: string, isDark = false) => {
  const colors = isDark
    ? {
        火: '#f85149',
        水: '#58a6ff',
        草: '#3fb950',
        电: '#d29922',
        冰: '#39c5cf',
        地: '#f0883e',
        飞: '#a5a5ff',
        虫: '#7ce38b',
        毒: '#f692ce',
        超能: '#b392f0',
        格斗: '#ff8e00',
        岩石: '#8b949e',
        钢: '#6e7681',
        龙: '#6cb6ff',
        恶: '#484f58',
        妖精: '#ffb3d9',
      }
    : {
        火: '#f5222d',
        水: '#1890ff',
        草: '#52c41a',
        电: '#faad14',
        冰: '#13c2c2',
        地: '#fa8c16',
        飞: '#722ed1',
        虫: '#a0d911',
        毒: '#eb2f96',
        超能: '#9254de',
        格斗: '#fa541c',
        岩石: '#8c8c8c',
        钢: '#595959',
        龙: '#2f54eb',
        恶: '#434343',
        妖精: '#f759ab',
      };
  return colors[element as keyof typeof colors] || (isDark ? '#6e7681' : '#d9d9d9');
};

// 属性统计颜色映射
export const getStatColor = (
  stat: 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed',
  isDark = false
) => {
  const colors = isDark
    ? {
        hp: '#f85149', // 红色 - 体力
        attack: '#f0883e', // 橙色 - 攻击
        defense: '#3fb950', // 绿色 - 防御
        spAttack: '#a5a5ff', // 紫色 - 特攻
        spDefense: '#58a6ff', // 蓝色 - 特防
        speed: '#39c5cf', // 青色 - 速度
      }
    : {
        hp: '#f5222d', // 红色 - 体力
        attack: '#fa8c16', // 橙色 - 攻击
        defense: '#52c41a', // 绿色 - 防御
        spAttack: '#722ed1', // 紫色 - 特攻
        spDefense: '#1890ff', // 蓝色 - 特防
        speed: '#13c2c2', // 青色 - 速度
      };
  return colors[stat];
};

// 状态颜色映射
export const getStatusColor = (
  status: 'success' | 'warning' | 'error' | 'info',
  isDark = false
) => {
  const colors = isDark
    ? {
        success: '#3fb950',
        warning: '#d29922',
        error: '#f85149',
        info: '#58a6ff',
      }
    : {
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d',
        info: '#1890ff',
      };
  return colors[status];
};

// Hook 版本的颜色获取函数
export const useQualityColor = (quality: number) => {
  const { theme } = useTheme()!;
  return getQualityColor(quality, theme === 'dark');
};

export const useElementColor = (element: string) => {
  const { theme } = useTheme()!;
  return getElementColor(element, theme === 'dark');
};

export const useStatColor = (
  stat: 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed'
) => {
  const { theme } = useTheme()!;
  return getStatColor(stat, theme === 'dark');
};

export const useStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
  const { theme } = useTheme()!;
  return getStatusColor(status, theme === 'dark');
};
