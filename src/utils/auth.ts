import { authClient } from "../lib/auth-client";

// Better Auth 사용자 타입 확장
interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified: boolean;
  image?: string | null;
  isAnonymous?: boolean | null;
  isValid?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  isValid?: boolean;
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
      if (session.data?.user) {
        const user = session.data.user as BetterAuthUser;
        
        // 백엔드에서 최신 사용자 정보 가져오기 (isValid 상태 포함)
        let isValid = user.isValid || false;
        if (user.email) {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
            const response = await fetch(`${apiUrl}/users/validation-status/${encodeURIComponent(user.email)}`);
            if (response.ok) {
              const data = await response.json();
              isValid = data.data?.isValid || false;
            }
          } catch (error) {
            console.warn('Failed to fetch validation status:', error);
          }
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt?.toString() || '',
          updatedAt: user.updatedAt?.toString() || '',
          emailVerified: user.emailVerified,
          isValid: isValid
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  static async signOut(): Promise<boolean> {
    try {
      await authClient.signOut();
      return true;
    } catch {
      return false;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await authClient.getSession();
      return !!session.data;
    } catch {
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

  static setUserData(): void {
    // better-auth가 자동으로 세션 관리
  }

  static clearUserData(): void {
    // better-auth가 자동으로 세션 관리
  }
}
