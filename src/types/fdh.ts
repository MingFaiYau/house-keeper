// Meal Preparation & Household Chores Module Types

export const MEAL_PREP_KEY = 'meal-prep-settings';
export const CHORE_KEY = 'chore-settings';

// Dish with quantity/portion for ingredients
export interface DishItem {
  id: string;
  nameZh: string;
  nameEn: string;
  icon: string;
  category: 'breakfast' | 'main' | 'side' | 'dessert';
}

// Dish course (1st dish, 2nd dish, etc.) with ingredient details
export interface DishCourse {
  id: string;
  courseNumber: number; // 1, 2, 3...
  dish: DishItem | null;
  ingredients: string; // quantity/portion suggestions
}

// Single meal (lunch or dinner)
export interface Meal {
  time: string;
  courses: DishCourse[];
  extraGuests: boolean;
  extraGuestCount: number;
  notes: string;
}

// Daily meal plan
export interface DailyPlan {
  id?: number;
  date: string;
  lunch: Meal;
  dinner: Meal;
  lastUpdated: string;
}

// Household chores task
export type ChoreCategory = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'adhoc';

export interface ChoreTask {
  id: string;
  nameZh: string;
  nameEn: string;
  category: ChoreCategory;
  completed: boolean;
  lastCompleted?: string;
}

// Household chores settings
export interface ChoreSettings {
  id?: number;
  key: string;
  customTasks: ChoreTask[];
}

// Meal Preparation settings (formerly FDHSettings)
export interface MealPrepSettings {
  id?: number;
  key: string;
  customDishes: DishItem[];
  defaultLunchTime: string;
  defaultDinnerTime: string;
}

// Default dishes
export const DEFAULT_DISHES: DishItem[] = [
  // 蔬菜類 Vegetables
  { id: 'oil-mustard', nameZh: '油麥菜', nameEn: 'Oil Mustard', icon: '🥬', category: 'side' },
  { id: 'spinach', nameZh: '菠菜', nameEn: 'Spinach', icon: '🥬', category: 'side' },
  { id: 'sweet-potato-leaf', nameZh: '番薯葉', nameEn: 'Sweet Potato Leaf', icon: '🥬', category: 'side' },
  { id: 'cucumber', nameZh: '黃瓜', nameEn: 'Cucumber', icon: '🥒', category: 'side' },
  { id: 'loofah', nameZh: '脆肉瓜', nameEn: 'Loofah', icon: '🥒', category: 'side' },
  { id: 'cabbage', nameZh: '椰菜', nameEn: 'Cabbage', icon: '🥬', category: 'side' },
  { id: 'broccoli', nameZh: '西蘭花', nameEn: 'Broccoli', icon: '🥦', category: 'side' },
  { id: 'cauliflower', nameZh: '花菜', nameEn: 'Cauliflower', icon: '🥦', category: 'side' },
  { id: 'white-radish', nameZh: '白蘿蔔', nameEn: 'White Radish', icon: '🥕', category: 'side' },
  { id: 'carrot', nameZh: '胡蘿蔔', nameEn: 'Carrot', icon: '🥕', category: 'side' },
  { id: 'enoki-mushroom', nameZh: '金針菇', nameEn: 'Enoki Mushroom', icon: '🍄', category: 'side' },
  { id: 'choy-sum', nameZh: '菜心', nameEn: 'Choy Sum', icon: '🥬', category: 'side' },

  // 肉蛋類 Meat & Eggs
  { id: 'pork-ribs', nameZh: '排骨', nameEn: 'Pork Ribs', icon: '🍖', category: 'main' },
  { id: 'pork-slice', nameZh: '豬肉片', nameEn: 'Pork Slice', icon: '🥓', category: 'main' },
  { id: 'chicken-breast', nameZh: '雞胸肉', nameEn: 'Chicken Breast', icon: '🍗', category: 'main' },
  { id: 'chicken-wing', nameZh: '雞翅', nameEn: 'Chicken Wing', icon: '🍗', category: 'main' },
  { id: 'minced-pork', nameZh: '豬肉碎', nameEn: 'Minced Pork', icon: '🥩', category: 'main' },
  { id: 'beef', nameZh: '牛肉', nameEn: 'Beef', icon: '🥩', category: 'main' },
  { id: 'lamb', nameZh: '羊肉', nameEn: 'Lamb', icon: '🍖', category: 'main' },
  { id: 'meatball', nameZh: '肉丸', nameEn: 'Meatball', icon: '🍡', category: 'main' },
  { id: 'egg', nameZh: '雞蛋', nameEn: 'Egg', icon: '🥚', category: 'side' },
  { id: 'scrambled-egg', nameZh: '炒蛋', nameEn: 'Scrambled Egg', icon: '🍳', category: 'breakfast' },

  // 主食 Others
  { id: 'rice', nameZh: '白飯', nameEn: 'Rice', icon: '🍚', category: 'main' },
  { id: 'congee', nameZh: '粥', nameEn: 'Congee', icon: '🥣', category: 'breakfast' },
  { id: 'noodles', nameZh: '麵', nameEn: 'Noodles', icon: '🍜', category: 'main' },
  { id: 'pasta', nameZh: '意粉', nameEn: 'Pasta', icon: '🍝', category: 'main' },
  { id: 'toast', nameZh: '吐司', nameEn: 'Toast', icon: '🍞', category: 'breakfast' },
  { id: 'dumplings', nameZh: '雲吞', nameEn: 'Dumplings', icon: '🥟', category: 'main' },

  // 湯類 Soup
  { id: 'soup', nameZh: '湯', nameEn: 'Soup', icon: '🍲', category: 'side' },

  // 水果甜品 Fruit & Dessert
  { id: 'fruit', nameZh: '水果', nameEn: 'Fruit', icon: '🍎', category: 'dessert' },
  { id: 'dessert', nameZh: '甜品', nameEn: 'Dessert', icon: '🧁', category: 'dessert' },
];

// Default chores
export const DEFAULT_CHORES: ChoreTask[] = [
  // Daily
  { id: 'clean-living-room', nameZh: '打掃客廳', nameEn: 'Clean living room', category: 'daily', completed: false },
  { id: 'wash-dishes', nameZh: '洗碗', nameEn: 'Wash dishes', category: 'daily', completed: false },
  { id: 'make-bed', nameZh: '整理床鋪', nameEn: 'Make bed', category: 'daily', completed: false },
  // Weekly
  { id: 'clean-bedroom', nameZh: '打掃睡房', nameEn: 'Clean bedroom', category: 'weekly', completed: false },
  { id: 'wash-clothes', nameZh: '洗衣服', nameEn: 'Wash clothes', category: 'weekly', completed: false },
  { id: 'clean-kitchen', nameZh: '清潔廚房', nameEn: 'Clean kitchen', category: 'weekly', completed: false },
  // Biweekly
  { id: 'change-sheets', nameZh: '更換床單', nameEn: 'Change bed sheets', category: 'biweekly', completed: false },
  { id: 'clean-windows', nameZh: '清潔窗戶', nameEn: 'Clean windows', category: 'biweekly', completed: false },
  // Monthly
  { id: 'deep-clean', nameZh: '深層清潔', nameEn: 'Deep clean', category: 'monthly', completed: false },
  { id: 'clean-wardrobe', nameZh: '清潔衣櫃', nameEn: 'Clean wardrobe', category: 'monthly', completed: false },
  // Adhoc
  { id: 'buy-groceries', nameZh: '買菜', nameEn: 'Buy groceries', category: 'adhoc', completed: false },
  { id: 'iron-clothes', nameZh: '燙衣服', nameEn: 'Iron clothes', category: 'adhoc', completed: false },
];

export const DEFAULT_MEAL_PREP_SETTINGS: MealPrepSettings = {
  key: MEAL_PREP_KEY,
  customDishes: [],
  defaultLunchTime: '12:00',
  defaultDinnerTime: '19:00',
};

export const DEFAULT_CHORE_SETTINGS: ChoreSettings = {
  key: CHORE_KEY,
  customTasks: [],
};

// Helper to create empty meal
export const createEmptyMeal = (time: string): Meal => ({
  time,
  courses: [
    { id: '1', courseNumber: 1, dish: null, ingredients: '' },
  ],
  extraGuests: false,
  extraGuestCount: 0,
  notes: '',
});

// Helper to create default daily plan
export const createDefaultDailyPlan = (date: string, settings: MealPrepSettings): DailyPlan => ({
  date,
  lunch: createEmptyMeal(settings.defaultLunchTime || '12:00'),
  dinner: createEmptyMeal(settings.defaultDinnerTime || '19:00'),
  lastUpdated: new Date().toISOString(),
});