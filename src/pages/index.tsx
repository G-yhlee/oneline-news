import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '../utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        router.push('/news');
      } else {
        router.push('/login');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">리디렉션 중...</p>
      </div>
    </div>
  );
}