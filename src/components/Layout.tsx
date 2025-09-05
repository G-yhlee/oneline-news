import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthService, AuthUser } from '../utils/auth';
import UserProfileModal from './UserProfileModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };


  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                한줄뉴스
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/news" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  뉴스
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  대시보드
                </Link>
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  관리자
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition"
                    >
                      <span className="text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </button>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="text-sm text-gray-700 hover:text-gray-900"
                    >
                      {user.name}
                    </button>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      {children}
      
      {user && (
        <UserProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onUserUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </>
  );
}