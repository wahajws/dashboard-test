import { userService } from '@/services/userService';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { User, CreateUserRequest, UpdateUserRequest, UserAnalytics } from '@/models/user';
import { formatDate } from '@/utils/date';

export class UserController {
  async getUsers(): Promise<User[]> {
    try {
      const users = await userService.getUsers();
      const result = Array.isArray(users) ? users : [];
      return result;
    } catch (error: any) {
      console.error('Controller error:', error);
      showErrorToast('Failed to fetch users', error.message || 'Unable to load users');
      throw error;
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      const user = await userService.getUser(id);
      return user;
    } catch (error: any) {
      showErrorToast('Failed to fetch user', error.message || 'Unable to load user details');
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const newUser = await userService.createUser(userData);
      showSuccessToast('User Created', 'User has been successfully created');
      return newUser;
    } catch (error: any) {
      showErrorToast('Failed to create user', error.message || 'Unable to create user');
      throw error;
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      showSuccessToast('User Updated', 'User has been successfully updated');
      return updatedUser;
    } catch (error: any) {
      showErrorToast('Failed to update user', error.message || 'Unable to update user');
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await userService.deleteUser(id);
      showSuccessToast('User Deleted', 'User has been successfully deleted');
    } catch (error: any) {
      showErrorToast('Failed to delete user', error.message || 'Unable to delete user');
      throw error;
    }
  }

  async getUserAnalytics(): Promise<UserAnalytics> {
    try {
      const users = await userService.getUsers();
      
      // Ensure users is an array
      const safeUsers = Array.isArray(users) ? users : [];
      
      const totalUsers = safeUsers.length;
      const verifiedUsers = safeUsers.filter(user => user.isVerified).length;
      const unverifiedUsers = totalUsers - verifiedUsers;
      
      // Gender distribution
      const genderDistribution = safeUsers.reduce((acc, user) => {
        const existing = acc.find(item => item.genderId === user.genderId);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ genderId: user.genderId, count: 1 });
        }
        return acc;
      }, [] as { genderId: number; count: number }[]);

      // New users in last 7 days
      const newUsersLast7Days = safeUsers.filter(user => {
        const createdDate = new Date(user.createdDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate >= weekAgo;
      }).length;

      // New users in last 30 days
      const newUsersLast30Days = safeUsers.filter(user => {
        const createdDate = new Date(user.createdDate);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return createdDate >= monthAgo;
      }).length;

      return {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        genderDistribution,
        newUsersLast7Days,
        newUsersLast30Days,
      };
    } catch (error: any) {
      showErrorToast('Failed to fetch analytics', error.message || 'Unable to load analytics');
      throw error;
    }
  }

  async getRecentUsers(limit: number = 5): Promise<User[]> {
    try {
      const users = await userService.getUsers();
      const safeUsers = Array.isArray(users) ? users : [];
      return safeUsers
        .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
        .slice(0, limit);
    } catch (error: any) {
      showErrorToast('Failed to fetch recent users', error.message || 'Unable to load recent users');
      throw error;
    }
  }

  formatUserForDisplay(user: User): User & { 
    formattedCreatedDate: string;
    fullName: string;
  } {
    return {
      ...user,
      formattedCreatedDate: formatDate(user.createdDate),
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }

  validateUserData(userData: Partial<CreateUserRequest | UpdateUserRequest>): string[] {
    const errors: string[] = [];

    if (userData.firstName && userData.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (userData.lastName && userData.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Invalid email address');
    }

    if (userData.password && userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (userData.icNumber && userData.icNumber < 100000000000) {
      errors.push('Invalid IC number');
    }

    return errors;
  }
}

export const userController = new UserController();
