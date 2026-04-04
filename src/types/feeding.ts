// Baby Feeding Cycle Types

export interface CycleStep {
  id: number;
  nameZh: string;
  nameEn: string;
  icon: string;
}

export interface NailTrim {
  leftHand: boolean;
  rightHand: boolean;
  leftFoot: boolean;
  rightFoot: boolean;
}

export interface DiaperChange {
  urine: number;
  popo: number;
  manyPopo: number;
}

export interface StepRecord {
  time: string;
  skipped: boolean;
  skipReason: string;
  diaperChanges: DiaperChange;
  burpDone: boolean;
  bathDone: boolean;
  nailTrim: NailTrim;
  playOptions: string[];
  milkAmount: number;
  massageDone: boolean;
  remark: string;
}

export const CYCLE_STEPS: CycleStep[] = [
  { id: 0, nameZh: '叫醒BB', nameEn: 'Wake Up', icon: '🌅' },
  { id: 1, nameZh: '按摩及清潔', nameEn: 'Massage & Clean', icon: '✋' },
  { id: 2, nameZh: '餵奶及掃風', nameEn: 'Feeding & Burp', icon: '🍼' },
  { id: 3, nameZh: '玩耍', nameEn: 'Playing', icon: '🎨' },
  { id: 4, nameZh: '睡覺', nameEn: 'Sleeping', icon: '💤' },
  { id: 5, nameZh: '修剪指甲', nameEn: 'Trim Nails', icon: '💅' },
  { id: 6, nameZh: '備註', nameEn: 'Remark', icon: '📝' },
];

// Required steps (excluding optional steps 5 and 6)
export const REQUIRED_STEPS = [0, 1, 2, 3, 4];
export type RequiredStep = number;

export const NAV_REQUIRED_STEPS = [0, 2, 4];
export const SKIP_ALLOWED_STEPS = [1, 3];
export const NO_TIME_STEPS = [1, 3, 5, 6];
export const OPTIONAL_STEPS = [5, 6];
export const DIAPER_ALLOWED_STEPS = [1, 2, 3];
export const BURP_ALLOWED_STEPS = [2];
export const BATH_ALLOWED_STEPS = [1];
export const PLAY_ALLOWED_STEPS = [3];
export const NAIL_TRIM_ALLOWED_STEPS = [5];
export const REMARK_ALLOWED_STEPS = [6];

// Step options for playing
export interface PlayOption {
  id: string;
  icon: string;
  labelZh: string;
  labelEn: string;
}

export const DEFAULT_PLAY_OPTIONS: PlayOption[] = [
  { id: 'tummy_time', icon: '🤸', labelZh: '趴趴時間', labelEn: 'Tummy Time' },
  { id: 'toys', icon: '🧸', labelZh: '玩玩具', labelEn: 'Play Toys' },
  { id: 'music', icon: '🎵', labelZh: '聽歌曲', labelEn: 'Listen to Music' },
  { id: 'outdoor', icon: '🌳', labelZh: '戶外', labelEn: 'Outdoor' },
];

// Create empty step record
export const createEmptyStepRecord = (): StepRecord => ({
  time: '',
  skipped: false,
  skipReason: '',
  diaperChanges: { urine: 0, popo: 0, manyPopo: 0 },
  burpDone: false,
  bathDone: false,
  nailTrim: { leftHand: false, rightHand: false, leftFoot: false, rightFoot: false },
  playOptions: [],
  milkAmount: 0,
  massageDone: false,
  remark: '',
});