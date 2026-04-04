import { create } from 'zustand';
import i18n from '../i18n';

interface PlayOption {
  id: string;
  icon: string;
  labelZh: string;
  labelEn: string;
}

interface AppSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  modules: {
    household: boolean;
    baby: boolean;
  };
  defaultBabySection?: string;
  baby: {
    defaultMilkAmount: number;
    feedingCycleMinTime: number;
    playOptions: string[];
    customPlayOptions: PlayOption[];
  };
}

interface SettingsState {
  settings: AppSettings;
  setLanguage: (lang: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setModuleEnabled: (module: 'household' | 'baby', enabled: boolean) => void;
  setDefaultBabySection: (section: string | undefined) => void;
  setBabyDefaults: (babySettings: Partial<AppSettings['baby']>) => void;
  addCustomPlayOption: (option: PlayOption) => void;
  updateCustomPlayOption: (id: string, updates: Partial<PlayOption>) => void;
  deleteCustomPlayOption: (id: string) => void;
  isModuleEnabled: (module: 'household' | 'baby') => boolean;
  getEffectiveTheme: () => 'light' | 'dark';
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    language: 'zh-TW',
    theme: 'light',
    modules: {
      household: false,
      baby: true,
    },
    defaultBabySection: 'feeding',
    baby: {
      defaultMilkAmount: 150,
      feedingCycleMinTime: 180, // 3 hours in minutes
      playOptions: ['tummy_time', 'toys', 'music', 'outdoor'],
      customPlayOptions: [],
    },
  },

  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang);
    set((state) => ({
      settings: { ...state.settings, language: lang },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    console.log('[SettingsStore] setTheme called:', theme);
    set((state) => ({
      settings: { ...state.settings, theme },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  setModuleEnabled: (module: 'household' | 'baby', enabled: boolean) => {
    // Household is always disabled for now
    if (module === 'household') return;
    set((state) => ({
      settings: {
        ...state.settings,
        modules: {
          ...state.settings.modules,
          [module]: enabled,
        },
      },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  setDefaultBabySection: (section: string | undefined) => {
    set((state) => ({
      settings: { ...state.settings, defaultBabySection: section },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  setBabyDefaults: (babySettings: Partial<AppSettings['baby']>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        baby: {
          ...state.settings.baby,
          ...babySettings,
        },
      },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  addCustomPlayOption: (option: PlayOption) => {
    set((state) => ({
      settings: {
        ...state.settings,
        baby: {
          ...state.settings.baby,
          customPlayOptions: [...state.settings.baby.customPlayOptions, option],
        },
      },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  updateCustomPlayOption: (id: string, updates: Partial<PlayOption>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        baby: {
          ...state.settings.baby,
          customPlayOptions: state.settings.baby.customPlayOptions.map((opt) =>
            opt.id === id ? { ...opt, ...updates } : opt
          ),
        },
      },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  deleteCustomPlayOption: (id: string) => {
    set((state) => ({
      settings: {
        ...state.settings,
        baby: {
          ...state.settings.baby,
          customPlayOptions: state.settings.baby.customPlayOptions.filter((opt) => opt.id !== id),
        },
      },
    }));
    localStorage.setItem('app-settings', JSON.stringify(get().settings));
  },

  isModuleEnabled: (module: 'household' | 'baby') => {
    return get().settings.modules?.[module] ?? true;
  },

  getEffectiveTheme: () => {
    const { theme } = get().settings;
    const result = theme === 'system' ? getSystemTheme() : theme;
    console.log('[SettingsStore] getEffectiveTheme - theme:', theme, 'result:', result);
    return result;
  },
}));

// Load settings from localStorage on init
export const loadSettings = () => {
  try {
    const saved = localStorage.getItem('app-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.language) {
        i18n.changeLanguage(parsed.language);
      }
      // Merge with defaults, always disable household for now
      useSettingsStore.setState({
        settings: {
          language: 'zh-TW',
          theme: 'light',
          modules: {
            household: false, // Always disabled for now
            baby: true,
            ...parsed.modules,
          },
          defaultBabySection: 'feeding',
          baby: {
            defaultMilkAmount: 150,
            feedingCycleMinTime: 180,
            playOptions: ['tummy_time', 'toys', 'music', 'outdoor'],
            customPlayOptions: [],
            ...parsed.baby,
          },
          ...parsed,
        },
      });
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
};

// Listen for system theme changes
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Force re-render when system theme changes
    useSettingsStore.setState((state) => ({ settings: { ...state.settings } }));
  });
}