import { useState, useEffect } from 'react';

interface News {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [newNews, setNewNews] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load news from localStorage
    const storedNews = localStorage.getItem('newsData');
    if (storedNews) {
      setNews(JSON.parse(storedNews));
    }

    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (username) {
      setIsLoggedIn(true);
      setAuthorName(username);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.trim()) return;

    const newsItem: News = {
      id: Date.now().toString(),
      content: newNews,
      author: isLoggedIn ? authorName : `익명${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };

    const updatedNews = [newsItem, ...news];
    setNews(updatedNews);
    localStorage.setItem('newsData', JSON.stringify(updatedNews));
    setNewNews('');
  };

  const handleLogin = () => {
    const name = prompt('사용자 이름을 입력하세요:');
    if (name) {
      localStorage.setItem('username', name);
      setAuthorName(name);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setAuthorName('');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">📰 한줄뉴스</h1>
          <button
            onClick={isLoggedIn ? handleLogout : handleLogin}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {isLoggedIn ? `${authorName} (로그아웃)` : '로그인'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
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
              {isLoggedIn ? `${authorName}님으로 작성` : '익명으로 작성'}
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