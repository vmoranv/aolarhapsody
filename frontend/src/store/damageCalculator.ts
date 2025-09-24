import { create } from 'zustand';
import { PetConfig } from '../types/damageCalculator';

/**
 * @file damageCalculator.ts
 * @description
 * 使用 Zustand 创建的状态管理存储，用于伤害计算器功能。
 * 这个 store 负责管理伤害计算的所有相关状态，包括全局计算参数、
 * 亚比配置队列以及对这些状态进行操作的各种 actions。
 */

/**
 * 定义了伤害计算所需的全局参数。
 */
export interface CalculationParams {
  /** 威力Buff（百分比） */
  powerBuff: number;
  /** 伤害Buff（百分比） */
  damageBuff: number;
  /** 暴击伤害Buff（百分比） */
  critDamageBuff: number;
  /** 数值Buff */
  numericBuff: number;
  /** 面板攻击力 */
  panelAttack: number;
  /** 技能威力 */
  skillPower: number;
  /** 星级（属性等级） */
  attributeLevel: number;
  /** 穿透（百分比） */
  penetration: number;
  /** 克制系数 */
  restraintFactor: number;
  /** 克制倍率 */
  restraintMultiplier: number;
  /** BOSS防御 */
  bossDefense: number;
  /** 技能段数 */
  skillSegments: number;
}

/**
 * 伤害计算参数的初始状态。
 */
const initialCalculationParams: CalculationParams = {
  powerBuff: 0,
  damageBuff: 0,
  critDamageBuff: 0,
  numericBuff: 0,
  panelAttack: 0,
  skillPower: 0,
  attributeLevel: 6.25,
  penetration: 0,
  restraintFactor: 1,
  restraintMultiplier: 1,
  bossDefense: 0,
  skillSegments: 1,
};

/**
 * 创建一个不包含 'id' 的空亚比配置对象。
 * 用于初始化新的亚比或替换现有亚比时重置配置。
 * @returns {Omit<PetConfig, 'id'>} 一个新的、空的亚比配置对象。
 */
const createEmptyPetConfig = (): Omit<PetConfig, 'id'> => ({
  raceId: '',
  skills: [],
  petCardSetId: '',
  otherConfigs: [],
  finalDamage: null,
});

/**
 * 定义伤害计算器 store 的状态和 actions 的接口。
 */
interface DamageCalculatorState {
  /** 当前配置的名称 */
  configName: string;
  /** 亚比配置队列，最多6个位置 */
  petQueue: (PetConfig | null)[];
  /** 当前活动（正在编辑）的亚比ID */
  activePetId: string | null;
  /** 全局伤害计算参数 */
  calculationParams: CalculationParams;
  /** 计算出的总伤害 */
  totalDamage: number;
  /** 设置配置名称 */
  setConfigName: (name: string) => void;
  /** 设置总伤害 */
  setTotalDamage: (damage: number) => void;
  /** 设置当前活动的亚比ID */
  setActivePetId: (id: string | null) => void;
  /** 向队列中添加一个新的亚比 */
  addPetToQueue: (raceId: string) => PetConfig | undefined;
  /** 从队列中移除一个亚比 */
  removePetFromQueue: (id: string) => void;
  /** 替换队列中指定ID的亚比为新的亚比 */
  replacePetInQueue: (id: string, newRaceId: string) => void;
  /** 更新指定亚比的配置 */
  updatePetConfig: (id: string, newConfig: Partial<PetConfig>) => void;
  /** 为指定亚比添加一个空技能槽 */
  addSkill: (petId: string) => void;
  /** 移除指定亚比的某个技能 */
  removeSkill: (petId: string, skillId: string) => void;
  /** 更新指定亚比的某个技能 */
  updateSkill: (petId: string, skillId: string, newSkillId: string) => void;
  /** 更新全局伤害计算参数 */
  updateCalculationParams: (params: Partial<CalculationParams>) => void;
  /** 为指定亚比添加一个“其他配置”项 */
  addOtherConfig: (petId: string, name: string) => void;
  /** 移除指定亚比的某个“其他配置”项 */
  removeOtherConfig: (petId: string, configId: string) => void;
  /** 更新指定亚比的某个“其他配置”项 */
  updateOtherConfig: (
    petId: string,
    configId: string,
    newConfig: Partial<{ name: string; value: string }>
  ) => void;
  /** 清空整个亚比队列 */
  clearQueue: () => void;
  /** 从JSON字符串导入状态 */
  importState: (jsonString: string) => void;
}

/**
 * Zustand store for the damage calculator.
 */
export const useDamageCalculatorStore = create<DamageCalculatorState>((set) => ({
  configName: '', // Use empty string as initial state
  petQueue: Array(6).fill(null),
  activePetId: null,
  calculationParams: initialCalculationParams,
  totalDamage: 0,

  setConfigName: (name) => set({ configName: name }),
  setTotalDamage: (damage) => set({ totalDamage: damage }),
  setActivePetId: (id) => set({ activePetId: id }),

  addPetToQueue: (raceId) => {
    let newPet: PetConfig | undefined = undefined;
    set((state) => {
      const newPetQueue = [...state.petQueue];
      const emptySlotIndex = newPetQueue.findIndex((p) => p === null);
      if (emptySlotIndex !== -1) {
        newPet = {
          ...createEmptyPetConfig(),
          id: `pet-${Date.now()}`,
          raceId: raceId,
        };
        newPetQueue[emptySlotIndex] = newPet;
        return { petQueue: newPetQueue, activePetId: newPet.id };
      }
      return state;
    });
    return newPet;
  },

  removePetFromQueue: (id) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => (p?.id === id ? null : p)),
      activePetId: state.activePetId === id ? null : state.activePetId,
    })),

  replacePetInQueue: (id, newRaceId) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) =>
        p?.id === id ? { ...createEmptyPetConfig(), id: p.id, raceId: newRaceId } : p
      ),
    })),

  updatePetConfig: (id, newConfig) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => (p?.id === id ? { ...p, ...newConfig } : p)),
    })),

  addSkill: (petId) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.skills.push({ id: `skill-${Date.now()}`, skillId: '' });
        }
        return p;
      }),
    })),

  removeSkill: (petId, skillId) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.skills = p.skills.filter((skill) => skill.id !== skillId);
        }
        return p;
      }),
    })),

  updateSkill: (petId, skillId, newSkillId) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.skills = p.skills.map((skill) =>
            skill.id === skillId ? { ...skill, skillId: newSkillId } : skill
          );
        }
        return p;
      }),
    })),

  updateCalculationParams: (params) =>
    set((state) => ({
      calculationParams: { ...state.calculationParams, ...params },
    })),

  addOtherConfig: (petId, name) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId && p.otherConfigs.length < 4) {
          // 检查是否已存在相同名称的配置
          const isNameExists = p.otherConfigs.some((config) => config.name === name);
          if (!isNameExists) {
            p.otherConfigs.push({ id: `other-${Date.now()}`, name, value: '' });
          }
        }
        return p;
      }),
    })),

  removeOtherConfig: (petId, configId) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.otherConfigs = p.otherConfigs.filter((config) => config.id !== configId);
        }
        return p;
      }),
    })),

  updateOtherConfig: (petId, configId, newConfig) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.otherConfigs = p.otherConfigs.map((config) => {
            if (config.id === configId) {
              // 如果要更新名称，检查是否与其他配置冲突
              if (newConfig.name && newConfig.name !== config.name) {
                const isNameConflict = p.otherConfigs.some(
                  (c) => c.id !== configId && c.name === newConfig.name
                );
                if (!isNameConflict) {
                  return { ...config, ...newConfig };
                }
                // 如果有冲突，保持原名称不变
                return { ...config, value: newConfig.value || config.value };
              }
              return { ...config, ...newConfig };
            }
            return config;
          });
        }
        return p;
      }),
    })),

  clearQueue: () => set({ petQueue: Array(6).fill(null), activePetId: null, totalDamage: 0 }),

  importState: (jsonString) => {
    const { configName, calculationParams, petQueue } = JSON.parse(jsonString);
    // Let the UI handle validation and feedback
    set({
      configName: configName || '', // Set to empty string if undefined
      calculationParams,
      petQueue,
      activePetId: null,
      totalDamage: 0,
    });
  },
}));
