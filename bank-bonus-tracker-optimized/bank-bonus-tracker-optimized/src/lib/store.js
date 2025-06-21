import { create } from 'zustand';
import api from './api';

// Create the store
const useStore = create((set, get) => ({
  // State
  banks: [],
  bonuses: [],
  trackedBonuses: [],
  isLoading: false,
  error: null,

  // Bank actions
  fetchBanks: async () => {
    set({ isLoading: true });
    try {
      const banks = await api.getBanks();
      set({ banks, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addBank: async (bank) => {
    set({ isLoading: true });
    try {
      const newBank = await api.createBank(bank);
      set((state) => ({
        banks: [...state.banks, newBank],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateBank: async (id, updatedBank) => {
    set({ isLoading: true });
    try {
      const bank = await api.updateBank(id, updatedBank);
      set((state) => ({
        banks: state.banks.map(b => b.id === id ? bank : b),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteBank: async (id) => {
    set({ isLoading: true });
    try {
      await api.deleteBank(id);
      set((state) => ({
        banks: state.banks.filter(bank => bank.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Bonus actions
  fetchBonuses: async () => {
    set({ isLoading: true });
    try {
      const bonuses = await api.getBonuses();
      set({ bonuses, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addBonus: async (bonus) => {
    set({ isLoading: true });
    try {
      const newBonus = await api.createBonus(bonus);
      set((state) => ({
        bonuses: [...state.bonuses, newBonus],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateBonus: async (id, updatedBonus) => {
    set({ isLoading: true });
    try {
      const bonus = await api.updateBonus(id, updatedBonus);
      set((state) => ({
        bonuses: state.bonuses.map(b => b.id === id ? bonus : b),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteBonus: async (id) => {
    set({ isLoading: true });
    try {
      await api.deleteBonus(id);
      set((state) => ({
        bonuses: state.bonuses.filter(bonus => bonus.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Tracked bonus actions
  fetchTrackedBonuses: async () => {
    set({ isLoading: true });
    try {
      const trackedBonuses = await api.getTrackedBonuses();
      set({ trackedBonuses, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTrackedBonus: async (trackedBonus) => {
    set({ isLoading: true });
    try {
      const newTrackedBonus = await api.createTrackedBonus(trackedBonus);
      set((state) => ({
        trackedBonuses: [...state.trackedBonuses, newTrackedBonus],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateTrackedBonus: async (id, updatedTrackedBonus) => {
    set({ isLoading: true });
    try {
      const trackedBonus = await api.updateTrackedBonus(id, updatedTrackedBonus);
      set((state) => ({
        trackedBonuses: state.trackedBonuses.map(tb => tb.id === id ? trackedBonus : tb),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteTrackedBonus: async (id) => {
    set({ isLoading: true });
    try {
      await api.deleteTrackedBonus(id);
      set((state) => ({
        trackedBonuses: state.trackedBonuses.filter(tb => tb.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Selectors
  getTrackedBonusesByPlayer: async (playerId) => {
    try {
      return await api.getPlayerTrackedBonuses(playerId);
    } catch (error) {
      set({ error: error.message });
      return [];
    }
  },

  getBonusById: async (id) => {
    try {
      return await api.getBonus(id);
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },

  // Dashboard data
  getDashboardData: async () => {
    try {
      return await api.getDashboardData();
    } catch (error) {
      set({ error: error.message });
      return {
        players: [],
        household: {
          totalEarned: 0,
          completedBonuses: 0,
          pendingBonusAmount: 0,
          pendingBonuses: 0
        },
        upcomingDates: []
      };
    }
  }
}));

export default useStore;

