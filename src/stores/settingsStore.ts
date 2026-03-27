import { create } from 'zustand';
import i18n from '../i18n';

interface AppSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
}

interface SettingsState {
  settings: AppSettings;
  setLanguage: (lang: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
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
  },

  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang);
    set((state) => ({
      settings: { ...state.settings, language: lang },
    }));
    // Save to localStorage
    localStorage.setItem('app-settings', JSON.stringify({ ...get().settings, language: lang }));
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    console.log('[SettingsStore] setTheme called:', theme);
    set((state) => ({
      settings: { ...state.settings, theme },
    }));
    // Save to localStorage
    localStorage.setItem('app-settings', JSON.stringify({ ...get().settings, theme }));
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
      useSettingsStore.setState({ settings: parsed });
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