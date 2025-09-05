import { useState } from 'react';
import { AuthUser, AuthService } from '../utils/auth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onUserUpdate?: (updatedUser: AuthUser) => void;
}

export default function UserProfileModal({ isOpen, onClose, user, onUserUpdate }: UserProfileModalProps) {
  const [step, setStep] = useState<'profile' | 'tfa' | 'verification' | 'success'>('profile');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTfaEnabled, setIsTfaEnabled] = useState(false);

  const handleSend2FA = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/send-2fa-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) {
        throw new Error('이메일 전송에 실패했습니다.');
      }

      setStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('인증코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-2fa-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email, 
          code: verificationCode.trim() 
        }),
      });

      if (!response.ok) {
        throw new Error('인증코드가 올바르지 않습니다.');
      }

      setIsTfaEnabled(true);
      setStep('success');
      
      // 사용자 정보 새로고침
      if (onUserUpdate) {
        try {
          const updatedUser = await AuthService.getCurrentUser();
          if (updatedUser) {
            onUserUpdate(updatedUser);
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('profile');
    setVerificationCode('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'profile' && '내 정보'}
            {step === 'tfa' && '2단계 인증'}
            {step === 'verification' && '인증코드 입력'}
            {step === 'success' && '인증 완료'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'profile' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {user.name}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {user.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일 인증 상태</label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.emailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.emailVerified ? '인증완료' : '미인증'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">2단계 인증</label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  (isTfaEnabled || user.isValid)
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {(isTfaEnabled || user.isValid) ? '활성화됨' : '비활성화됨'}
                </span>
              </div>
            </div>

            {!(isTfaEnabled || user.isValid) && (
              <button
                onClick={handleSend2FA}
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '처리중...' : '2단계 인증하기'}
              </button>
            )}
          </div>
        )}

        {step === 'tfa' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              {user.email}로 인증코드가 전송됩니다.
            </p>
            
            <button
              onClick={handleSend2FA}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '전송중...' : '인증코드 전송'}
            </button>
            
            <button
              onClick={() => setStep('profile')}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              뒤로가기
            </button>
          </div>
        )}

        {step === 'verification' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              {user.email}로 전송된 인증코드를 입력해주세요.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">인증코드</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6자리 숫자를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={6}
              />
            </div>
            
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '인증중...' : '인증하기'}
            </button>
            
            <button
              onClick={() => setStep('profile')}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900">인증되었습니다!</h3>
            <p className="text-gray-600">2단계 인증이 성공적으로 활성화되었습니다.</p>
            
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}