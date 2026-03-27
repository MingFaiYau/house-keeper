import Dexie, { type Table } from 'dexie';
import type { DailyPlan, MealPrepSettings, ChoreSettings } from '../types/fdh';
import { MEAL_PREP_KEY, CHORE_KEY } from '../types/fdh';

export class AppDatabase extends Dexie {
  dailyPlans!: Table<DailyPlan, number>;
  mealPrepSettings!: Table<MealPrepSettings, number>;
  choreSettings!: Table<ChoreSettings, number>;

  constructor() {
    super('AppDatabase');
    this.version(2).stores({
      dailyPlans: '++id, date',
      mealPrepSettings: '++id, key',
      choreSettings: '++id, key',
    });
  }
}

export const db = new AppDatabase();

// Meal Prep Settings
export async function getMealPrepSettings(): Promise<MealPrepSettings | undefined> {
  const result = await db.mealPrepSettings.where('key').equals(MEAL_PREP_KEY).first();
  console.log('[FDH Storage] getMealPrepSettings:', result);
  return result;
}

export async function saveMealPrepSettings(settings: MealPrepSettings): Promise<void> {
  console.log('[FDH Storage] saveMealPrepSettings:', settings);
  const existing = await db.mealPrepSettings.where('key').equals(MEAL_PREP_KEY).first();
  if (existing) {
    await db.mealPrepSettings.put({ ...settings, id: existing.id });
  } else {
    await db.mealPrepSettings.add({ ...settings, key: MEAL_PREP_KEY });
  }
}

// Chores Settings
export async function getChoreSettings(): Promise<ChoreSettings | undefined> {
  return await db.choreSettings.where('key').equals(CHORE_KEY).first();
}

export async function saveChoreSettings(settings: ChoreSettings): Promise<void> {
  const existing = await db.choreSettings.where('key').equals(CHORE_KEY).first();
  if (existing) {
    await db.choreSettings.put({ ...settings, id: existing.id });
  } else {
    await db.choreSettings.add({ ...settings, key: CHORE_KEY });
  }
}

// Daily Plans
export async function getDailyPlan(date: string): Promise<DailyPlan | undefined> {
  return await db.dailyPlans.where('date').equals(date).first();
}

export async function saveDailyPlan(plan: DailyPlan): Promise<number> {
  const existing = await db.dailyPlans.where('date').equals(plan.date).first();
  if (existing) {
    await db.dailyPlans.put({ ...plan, id: existing.id });
    return existing.id!;
  }
  return await db.dailyPlans.add(plan);
}

export async function getAllDailyPlans(): Promise<DailyPlan[]> {
  return await db.dailyPlans.orderBy('date').reverse().toArray();
}

// Legacy - keep for backward compatibility during migration
export const FDH_DB_KEY = MEAL_PREP_KEY;
export const getSettings = getMealPrepSettings;
export const saveSettings = saveMealPrepSettings;