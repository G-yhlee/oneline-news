import { authClient } from "../lib/auth-client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}

export interface SessionData {
  user: AuthUser;
  token?: string;
  expiresAt?: string;
}

export class AuthService {
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const session = await authClient.getSession();
      return session.data ? (session.data.user as AuthUser) : null;
    } catch (error) {
      return null;
    }
  }

  static async signOut(): Promise<boolean> {
    try {
      await authClient.signOut();
      return true;
    } catch (error) {
      return false;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await authClient.getSession();
      return !!session.data;
    } catch (error) {
      return false;
    }
  }

  static async validateToken(): Promise<boolean> {
    return await this.isAuthenticated();
  }

  // 호환성을 위한 레거시 메서드들 (better-auth가 자동 관리)
  static getStoredUser(): AuthUser | null {
    return null; // better-auth가 세션 관리
  }

  static setUserData(user: AuthUser, token?: string): void {
    // better-auth가 자동으로 세션 관리
  }

  static clearUserData(): void {
    // better-auth가 자동으로 세션 관리
  }
}
