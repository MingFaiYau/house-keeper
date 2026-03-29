import { create } from 'zustand';
import type { BabyCycleRecords } from '../types/fdh';
import { getBabyCycleDay, saveBabyCycleDay } from '../services/fdhStorage';
import { format } from 'date-fns';

interface BabyCycleState {
  cycleRecords: BabyCycleRecords;
  currentDate: string;
  currentBabyId: string | null;
  isLoading: boolean;

  loadDay: (date: string, babyId: string) => Promise<void>;
  setBabyId: (babyId: string) => void;
  updateCycles: (records: BabyCycleRecords) => Promise<void>;
}

export const useBabyCycleStore = create<BabyCycleState>((set, get) => ({
  cycleRecords: {},
  currentDate: format(new Date(), 'yyyy-MM-dd'),
  currentBabyId: null,
  isLoading: false,

  loadDay: async (date: string, babyId: string) => {
    set({ isLoading: true, currentDate: date, currentBabyId: babyId });
    try {
      const dayData = await getBabyCycleDay(date, babyId);
      if (dayData) {
        set({ cycleRecords: { [date]: dayData.cycles } });
      } else {
        set({ cycleRecords: { [date]: {} } });
      }
    } catch (error) {
      console.error('Failed to load baby cycle day:', error);
      set({ cycleRecords: { [date]: {} } });
    } finally {
      set({ isLoading: false });
    }
  },

  setBabyId: (babyId: string) => {
    set({ currentBabyId: babyId });
  },

  updateCycles: async (records: BabyCycleRecords) => {
    const { currentDate, currentBabyId } = get();
    if (!currentBabyId) return;

    set({ cycleRecords: records });

    try {
      await saveBabyCycleDay({
        date: currentDate,
        babyId: currentBabyId,
        cycles: records[currentDate] || {},
      });
    } catch (error) {
      console.error('Failed to save baby cycle day:', error);
    }
  },
}));