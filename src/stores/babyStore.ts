import { create } from 'zustand';
import type { BabyProfile } from '../types/fdh';
import { DEFAULT_BABY_SETTINGS } from '../types/fdh';
import { getBabySettings, saveBabySettings } from '../services/fdhStorage';

interface BabyState {
  profiles: BabyProfile[];
  defaultBabyId: string | null;
  isLoading: boolean;

  loadSettings: () => Promise<void>;
  addProfile: (profile: BabyProfile) => Promise<void>;
  updateProfile: (profile: BabyProfile) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  setDefaultBaby: (id: string) => Promise<void>;
  getDefaultBaby: () => BabyProfile | null;
}

export const useBabyStore = create<BabyState>((set, get) => ({
  profiles: [],
  defaultBabyId: null,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await getBabySettings();
      if (settings) {
        set({
          profiles: settings.profiles,
          defaultBabyId: settings.defaultBabyId || null,
        });
      } else {
        set({ profiles: [], defaultBabyId: null });
      }
    } catch (error) {
      console.error('Failed to load baby settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addProfile: async (profile: BabyProfile) => {
    const { profiles } = get();
    const newProfiles = [...profiles, profile];
    const newDefault = get().defaultBabyId || profile.id;

    set({ profiles: newProfiles, defaultBabyId: newDefault });

    await saveBabySettings({
      ...DEFAULT_BABY_SETTINGS,
      profiles: newProfiles,
      defaultBabyId: newDefault,
    });
  },

  updateProfile: async (profile: BabyProfile) => {
    const { profiles, defaultBabyId } = get();
    const newProfiles = profiles.map(p => p.id === profile.id ? profile : p);

    set({ profiles: newProfiles });

    await saveBabySettings({
      ...DEFAULT_BABY_SETTINGS,
      profiles: newProfiles,
      defaultBabyId: defaultBabyId || undefined,
    });
  },

  deleteProfile: async (id: string) => {
    const { profiles, defaultBabyId } = get();
    const newProfiles = profiles.filter(p => p.id !== id);

    let newDefault = defaultBabyId;
    if (defaultBabyId === id) {
      newDefault = newProfiles.length > 0 ? newProfiles[0].id : null;
    }

    set({ profiles: newProfiles, defaultBabyId: newDefault });

    await saveBabySettings({
      ...DEFAULT_BABY_SETTINGS,
      profiles: newProfiles,
      defaultBabyId: newDefault || undefined,
    });
  },

  setDefaultBaby: async (id: string) => {
    const { profiles } = get();
    set({ defaultBabyId: id });

    await saveBabySettings({
      ...DEFAULT_BABY_SETTINGS,
      profiles,
      defaultBabyId: id,
    });
  },

  getDefaultBaby: () => {
    const { profiles, defaultBabyId } = get();
    if (!defaultBabyId && profiles.length > 0) {
      return profiles[0];
    }
    return profiles.find(p => p.id === defaultBabyId) || null;
  },
}));