import { User } from '../types';

const STORAGE_KEY = 'lambda_forge_user';

export const mockAuthService = {
  login: async (provider: 'google' | 'github'): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: provider === 'google' ? 'Jane Doe' : 'Dev Wizard',
      email: provider === 'google' ? 'jane.doe@gmail.com' : 'wizard@github.com',
      avatar: provider === 'google' 
        ? 'https://picsum.photos/seed/jane/200/200' 
        : 'https://picsum.photos/seed/wizard/200/200',
      provider
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};