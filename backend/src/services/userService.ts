import { users } from '../models/mockData';
import { User, Role } from '../types';

export const userService = {
  getUserById: (userId: string): User | null => {
    return users.get(userId) || null;
  },

  updateUser: (userId: string, updates: { name?: string; defaultRole?: Role }): User | null => {
    const user = users.get(userId);
    if (!user) {
      return null;
    }

    if (updates.name) {
      user.name = updates.name;
    }
    if (updates.defaultRole) {
      user.defaultRole = updates.defaultRole;
    }
    user.updatedAt = new Date().toISOString();

    return user;
  },
};
