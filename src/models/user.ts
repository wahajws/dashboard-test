export interface User {
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

export interface UserFilters {
  search?: string;
  isVerified?: boolean;
  genderId?: number;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface UserAnalytics {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  genderDistribution: { genderId: number; count: number }[];
  newUsersLast7Days: number;
  newUsersLast30Days: number;
}

// Gender and IC Type mappings
export const GENDER_OPTIONS = [
  { value: 1, label: 'Male' },
  { value: 2, label: 'Female' },
  { value: 3, label: 'Other' },
];

export const IC_TYPE_OPTIONS = [
  { value: 1, label: 'NRIC' },
  { value: 2, label: 'Passport' },
  { value: 3, label: 'Other' },
];

export const RECORD_STATUS_OPTIONS = [
  { value: 1, label: 'Active' },
  { value: 2, label: 'Inactive' },
  { value: 3, label: 'Suspended' },
];

// Utility functions
export const getGenderLabel = (genderId: number): string => {
  return GENDER_OPTIONS.find(g => g.value === genderId)?.label || 'Unknown';
};

export const getIcTypeLabel = (icTypeId: number): string => {
  return IC_TYPE_OPTIONS.find(t => t.value === icTypeId)?.label || 'Unknown';
};

export const getRecordStatusLabel = (recordStatusId: number): string => {
  return RECORD_STATUS_OPTIONS.find(s => s.value === recordStatusId)?.label || 'Unknown';
};
