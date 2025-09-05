import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthService, AuthUser } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // better-auth로 세션 확인
        const userData = await AuthService.getCurrentUser();
        
        if (userData) {
          setUser(userData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleContinue = () => {
    router.push('/news');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="로그인 정보를 확인하고 있습니다..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">로그인 성공!</h3>
            <p className="mt-1 text-sm text-gray-500">한줄뉴스에 오신 것을 환영합니다</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            한줄뉴스 시작하기
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              이제 한줄뉴스에서 뉴스를 공유하고 다른 사용자들과 소통해보세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}