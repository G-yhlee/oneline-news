import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthService } from "../utils/auth";
import { authClient } from "../lib/auth-client";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL에서 에러 파라미터 확인
    const { error } = router.query;
    if (error === "oauth_failed") {
      setError("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  }, [router.query]);

  const handleAnonymousLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 현재 로그인된 사용자 확인
      const currentUser = await AuthService.getCurrentUser();
      
      // 이미 익명으로 로그인되어 있다면 바로 뉴스 페이지로 이동
      if (currentUser && (
        (currentUser.email && currentUser.email.includes('temp-')) || 
        currentUser.name === 'Anonymous'
      )) {
        await router.push("/news");
        return;
      }

      // 익명이 아닌 다른 계정으로 로그인되어 있다면 먼저 로그아웃
      if (currentUser) {
        await AuthService.signOut();
      }

      const result = await authClient.signIn.anonymous();
      
      if (result.error) {
        setError(result.error.message || "익명 로그인에 실패했습니다.");
        return;
      }

      if (result.data) {
        await router.push("/news");
      }
    } catch (error) {
      console.error("Anonymous login error:", error);
      setError("네트워크 연결을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError(null);
    
    // better-auth 클라이언트를 사용하여 OAuth 로그인
    void authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/news`
    }).catch((error) => {
      console.error("Google login error:", error);
      setError("네트워크 연결을 확인해주세요.");
      setIsLoading(false);
    });
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    setError(null);
    
    // better-auth 클라이언트를 사용하여 OAuth 로그인
    void authClient.signIn.social({
      provider: "github",
      callbackURL: `${window.location.origin}/news`
    }).catch((error) => {
      console.error("GitHub login error:", error);
      setError("네트워크 연결을 확인해주세요.");
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            📰 한줄뉴스
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            로그인하여 뉴스를 공유해보세요
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          {error && (
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          )}
          <button
            onClick={handleAnonymousLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isLoading ? "로그인 중..." : "🎭 익명으로 시작하기"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </button>

          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub으로 계속하기
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              로그인하면 한줄뉴스의 <br />
              <span className="text-blue-600 hover:underline cursor-pointer">
                이용약관
              </span>
              과{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                개인정보처리방침
              </span>
              에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
