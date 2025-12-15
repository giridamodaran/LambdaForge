import { GeneratedCode } from '../types';

const HISTORY_KEY = 'lambda_forge_history';

export const historyService = {
  save: (item: GeneratedCode) => {
    const history = historyService.getAll();
    // Add to beginning
    const newHistory = [item, ...history];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  },

  getAll: (): GeneratedCode[] => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getById: (id: string): GeneratedCode | undefined => {
    const history = historyService.getAll();
    return history.find(h => h.id === id);
  },
  
  clear: () => {
    localStorage.removeItem(HISTORY_KEY);
  }
};