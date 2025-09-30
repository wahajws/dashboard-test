import { z } from 'zod';

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  genderId: number;
  avatar: string | null;
  createdDate: string;
  icNumber?: number;
  icTypeId?: number;
  recordStatusId?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  userData: UserData;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  icNumber: number;
  icTypeId: number;
  genderId: number;
  isVerified: boolean;
  recordStatusId: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  icNumber?: number;
  icTypeId?: number;
  genderId?: number;
  isVerified?: boolean;
  recordStatusId?: number;
}

// Zod schemas for validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  icNumber: z.number().min(100000000000, 'Invalid IC number'),
  icTypeId: z.number().min(1, 'IC type is required'),
  genderId: z.number().min(1, 'Gender is required'),
  isVerified: z.boolean(),
  recordStatusId: z.number().min(1, 'Record status is required'),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  icNumber: z.number().min(100000000000, 'Invalid IC number').optional(),
  icTypeId: z.number().min(1, 'IC type is required').optional(),
  genderId: z.number().min(1, 'Gender is required').optional(),
  isVerified: z.boolean().optional(),
  recordStatusId: z.number().min(1, 'Record status is required').optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
