import Dexie, { type Table } from 'dexie';
import type { DailyPlan, MealPrepSettings, ChoreSettings, BabyCycleDay, BabySettings } from '../types/fdh';
import { MEAL_PREP_KEY, CHORE_KEY } from '../types/fdh';

export class AppDatabase extends Dexie {
  dailyPlans!: Table<DailyPlan, number>;
  mealPrepSettings!: Table<MealPrepSettings, number>;
  choreSettings!: Table<ChoreSettings, number>;
  babyCycleRecords!: Table<BabyCycleDay, number>;
  babySettings!: Table<BabySettings, number>;

  constructor() {
    super('AppDatabase');
    this.version(4).stores({
      dailyPlans: '++id, date',
      mealPrepSettings: '++id, key',
      choreSettings: '++id, key',
      babyCycleRecords: '++id, date',
      babySettings: '++id, key',
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

// Baby Cycle Records
export async function getBabyCycleDay(date: string, babyId: string): Promise<BabyCycleDay | undefined> {
  return await db.babyCycleRecords.where('date').equals(date).and(item => item.babyId === babyId).first();
}

export async function saveBabyCycleDay(day: BabyCycleDay): Promise<number> {
  const existing = await db.babyCycleRecords.where('date').equals(day.date).and(item => item.babyId === day.babyId).first();
  if (existing) {
    await db.babyCycleRecords.put({ ...day, id: existing.id });
    return existing.id!;
  }
  return await db.babyCycleRecords.add(day);
}

export async function getAllBabyCycleDays(babyId: string): Promise<BabyCycleDay[]> {
  return await db.babyCycleRecords.where('babyId').equals(babyId).reverse().sortBy('date');
}

export async function deleteBabyCycleData(babyId: string): Promise<void> {
  await db.babyCycleRecords.where('babyId').equals(babyId).delete();
}

// Baby Settings
const BABY_SETTINGS_KEY = 'baby-settings';

export async function getBabySettings(): Promise<BabySettings | undefined> {
  return await db.babySettings.where('key').equals(BABY_SETTINGS_KEY).first();
}

export async function saveBabySettings(settings: BabySettings): Promise<void> {
  const existing = await db.babySettings.where('key').equals(BABY_SETTINGS_KEY).first();
  if (existing) {
    await db.babySettings.put({ ...settings, id: existing.id });
  } else {
    await db.babySettings.add({ ...settings, key: BABY_SETTINGS_KEY });
  }
}

// Legacy - keep for backward compatibility during migration
export const FDH_DB_KEY = MEAL_PREP_KEY;
export const getSettings = getMealPrepSettings;
export const saveSettings = saveMealPrepSettings;