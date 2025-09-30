import { httpService } from './http';
import { User, CreateUserRequest, UpdateUserRequest } from '@/models/user';

export class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await httpService.get<any>('/users');
      
      // Extract users from the response object
      const users = response?.data || response || [];
      const result = Array.isArray(users) ? users : [];
      return result;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      const response = await httpService.get<any>(`/users/${id}`);
      // Extract user from the response object
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await httpService.post<any>('/users', userData);
      // Extract user from the response object
      return response?.data || response;
    } catch (error: any) {
      console.error('UserService.createUser error:', error);
      // Re-throw with more specific error information
      throw {
        code: error.status || error.code,
        message: error.message || 'Failed to create user',
        originalError: error
      };
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await httpService.put<any>(`/users/${id}`, userData);
      // Extract user from the response object
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await httpService.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
