import { UserRepository } from '../repositories';
import { User, Role } from '../types';

export const userService = {
  getUserById: async (userId: string): Promise<User | null> => {
    return await UserRepository.getUserById(userId);
  },

  updateUser: async (userId: string, updates: { name?: string; defaultRole?: Role }): Promise<User | null> => {
    return await UserRepository.updateUser(userId, updates);
  },
};
