import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthService, AuthUser } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

interface News {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [newNews, setNewNews] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 인증 상태 확인
      const isAuth = await AuthService.isAuthenticated();
      if (!isAuth) {
        router.push('/login');
        return;
      }

      // 사용자 데이터 로드
      const userData = await AuthService.getCurrentUser();
      if (userData) {
        setUser(userData);
      }

      // 뉴스 데이터 로드
      const storedNews = localStorage.getItem('newsData');
      if (storedNews) {
        setNews(JSON.parse(storedNews));
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.trim()) return;

    const newsItem: News = {
      id: Date.now().toString(),
      content: newNews,
      author: user?.name || '익명',
      createdAt: new Date().toISOString()
    };

    const updatedNews = [newsItem, ...news];
    setNews(updatedNews);
    localStorage.setItem('newsData', JSON.stringify(updatedNews));
    setNewNews('');
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="뉴스 페이지 로딩 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📰 한줄뉴스</h1>
          <p className="text-gray-600">오늘의 뉴스를 한 줄로 공유해보세요</p>
        </div>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newNews}
                onChange={(e) => setNewNews(e.target.value)}
                placeholder="오늘의 뉴스를 한 줄로 작성해주세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                maxLength={100}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                등록
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {user?.name}님으로 작성
            </div>
          </div>
        </form>

        <div className="space-y-3">
          {news.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 등록된 뉴스가 없습니다. 첫 번째 뉴스를 작성해보세요!
            </div>
          ) : (
            news.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 flex-1">{item.content}</p>
                  <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  by {item.author}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}