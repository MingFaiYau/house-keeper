import { create } from 'zustand';
import type { DailyPlan, MealPrepSettings, ChoreTask, DishItem } from '../types/fdh';
import { DEFAULT_MEAL_PREP_SETTINGS, DEFAULT_CHORES, DEFAULT_DISHES, createDefaultDailyPlan, CHORE_KEY } from '../types/fdh';
import { getMealPrepSettings, saveMealPrepSettings, getDailyPlan, saveDailyPlan, getChoreSettings, saveChoreSettings } from '../services/fdhStorage';

// Meal Prep Store
interface MealPrepState {
  settings: MealPrepSettings;
  currentPlan: DailyPlan | null;
  isLoading: boolean;

  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<MealPrepSettings>) => Promise<void>;
  loadDailyPlan: (date: string) => Promise<void>;
  updateDailyPlan: (plan: Partial<DailyPlan>) => Promise<void>;
  resetDailyPlan: () => Promise<void>;
  getAllDishes: () => DishItem[];
}

export const useMealPrepStore = create<MealPrepState>((set, get) => ({
  settings: DEFAULT_MEAL_PREP_SETTINGS,
  currentPlan: null,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await getMealPrepSettings();
      console.log('[MealPrepStore] loadSettings - from DB:', settings);
      if (settings) {
        set({ settings });
      } else {
        console.log('[MealPrepStore] loadSettings - no settings found, using defaults');
        set({ settings: DEFAULT_MEAL_PREP_SETTINGS });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (newSettings: Partial<MealPrepSettings>) => {
    const current = get().settings;
    const updated = { ...current, ...newSettings };
    console.log('[MealPrepStore] updateSettings - current:', current, 'new:', newSettings, 'updated:', updated);
    set({ settings: updated });
    await saveMealPrepSettings(updated);
  },

  loadDailyPlan: async (date: string) => {
    set({ isLoading: true });
    try {
      const existing = await getDailyPlan(date);
      const defaultPlan = createDefaultDailyPlan(date, get().settings);
      set({ currentPlan: existing || defaultPlan });
    } catch (error) {
      console.error('Failed to load daily plan:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateDailyPlan: async (planUpdate: Partial<DailyPlan>) => {
    const current = get().currentPlan;
    if (!current) return;

    const updated = {
      ...current,
      ...planUpdate,
      lastUpdated: new Date().toISOString(),
    };
    set({ currentPlan: updated });
    await saveDailyPlan(updated);
  },

  getAllDishes: () => {
    const { settings } = get();
    return [...DEFAULT_DISHES, ...settings.customDishes];
  },

  resetDailyPlan: async () => {
    const { currentPlan, settings } = get();
    if (!currentPlan) return;

    const resetPlan = createDefaultDailyPlan(currentPlan.date, settings);
    set({ currentPlan: resetPlan });
    await saveDailyPlan(resetPlan);
  },
}));

// Chores Store
interface ChoresState {
  tasks: ChoreTask[];
  isLoading: boolean;

  loadTasks: () => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  addCustomTask: (task: ChoreTask) => Promise<void>;
  removeCustomTask: (taskId: string) => Promise<void>;
  getTasksByCategory: (category: string) => ChoreTask[];
}

export const useChoresStore = create<ChoresState>((set, get) => ({
  tasks: DEFAULT_CHORES,
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const settings = await getChoreSettings();
      const customTasks = settings?.customTasks || [];
      set({ tasks: [...DEFAULT_CHORES, ...customTasks] });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTask: async (taskId: string) => {
    const tasks = get().tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          lastCompleted: !task.completed ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });
    set({ tasks });

    // Save custom tasks only
    const customTasks = tasks.filter(t => t.id.startsWith('custom-'));
    await saveChoreSettings({ key: CHORE_KEY, customTasks });
  },

  addCustomTask: async (task: ChoreTask) => {
    const tasks = [...get().tasks, task];
    set({ tasks });
    const customTasks = tasks.filter(t => t.id.startsWith('custom-'));
    await saveChoreSettings({ key: CHORE_KEY, customTasks });
  },

  removeCustomTask: async (taskId: string) => {
    const tasks = get().tasks.filter(t => t.id !== taskId);
    set({ tasks });
    const customTasks = tasks.filter(t => t.id.startsWith('custom-'));
    await saveChoreSettings({ key: CHORE_KEY, customTasks });
  },

  getTasksByCategory: (category: string) => {
    return get().tasks.filter(t => t.category === category);
  },
}));