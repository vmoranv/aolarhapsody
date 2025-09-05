import { create } from 'zustand';
import { PetConfig } from '../types/damageCalculator';

export interface CalculationParams {
  powerBuff: number;
  damageBuff: number;
  critDamageBuff: number;
  numericBuff: number;
  panelAttack: number;
  skillPower: number;
  attributeLevel: number;
  penetration: number;
  restraintFactor: number;
  restraintMultiplier: number;
  bossDefense: number;
  skillSegments: number;
}

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

const createEmptyPetConfig = (): Omit<PetConfig, 'id'> => ({
  raceId: '',
  skills: [],
  petCardSetId: '',
  otherConfigs: [],
  finalDamage: null,
});

interface DamageCalculatorState {
  configName: string;
  petQueue: (PetConfig | null)[];
  activePetId: string | null;
  calculationParams: CalculationParams;
  totalDamage: number;
  setConfigName: (name: string) => void;
  setTotalDamage: (damage: number) => void;
  setActivePetId: (id: string | null) => void;
  addPetToQueue: (raceId: string) => PetConfig | undefined;
  removePetFromQueue: (id: string) => void;
  replacePetInQueue: (id: string, newRaceId: string) => void;
  updatePetConfig: (id: string, newConfig: Partial<PetConfig>) => void;
  addSkill: (petId: string) => void;
  removeSkill: (petId: string, skillId: string) => void;
  updateSkill: (petId: string, skillId: string, newSkillId: string) => void;
  updateCalculationParams: (params: Partial<CalculationParams>) => void;
  addOtherConfig: (petId: string, name: string) => void;
  removeOtherConfig: (petId: string, configId: string) => void;
  updateOtherConfig: (
    petId: string,
    configId: string,
    newConfig: Partial<{ name: string; value: string }>
  ) => void;
  clearQueue: () => void;
  importState: (jsonString: string) => void;
}

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
