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
  skillId: '',
  petCards: [],
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
  updateCalculationParams: (params: Partial<CalculationParams>) => void;
  addPetCard: (petId: string) => void;
  removePetCard: (petId: string, cardId: string) => void;
  updatePetCard: (petId: string, cardId: string, value: string) => void;
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

  updateCalculationParams: (params) =>
    set((state) => ({
      calculationParams: { ...state.calculationParams, ...params },
    })),

  addPetCard: (petId) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.petCards.push({ id: `petcard-${Date.now()}`, value: '' });
        }
        return p;
      }),
    })),

  removePetCard: (petId, cardId) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.petCards = p.petCards.filter((card) => card.id !== cardId);
        }
        return p;
      }),
    })),

  updatePetCard: (petId, cardId, value) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId) {
          p.petCards = p.petCards.map((card) => (card.id === cardId ? { ...card, value } : card));
        }
        return p;
      }),
    })),

  addOtherConfig: (petId, name) =>
    set((state) => ({
      petQueue: state.petQueue.map((p) => {
        if (p?.id === petId && p.otherConfigs.length < 8) {
          p.otherConfigs.push({ id: `other-${Date.now()}`, name, value: '' });
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
          p.otherConfigs = p.otherConfigs.map((config) =>
            config.id === configId ? { ...config, ...newConfig } : config
          );
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
