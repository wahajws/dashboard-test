import { httpService } from './http';
import { AuthResponse, LoginRequest } from '@/models/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('mb_access_token');
    localStorage.removeItem('mb_user_data');
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  getStoredToken(): string | null {
    return localStorage.getItem('mb_access_token');
  }

  getStoredUserData(): any | null {
    const userData = localStorage.getItem('mb_user_data');
    return userData ? JSON.parse(userData) : null;
  }

  storeAuthData(token: string, userData: any): void {
    localStorage.setItem('mb_access_token', token);
    localStorage.setItem('mb_user_data', JSON.stringify(userData));
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();
