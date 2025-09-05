interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ message, onRetry, type = 'error' }: ErrorMessageProps) {
  const typeStyles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div className={`border px-4 py-3 rounded-md text-sm ${typeStyles[type]}`}>
      <div className="flex items-start justify-between">
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 underline hover:no-underline font-medium"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}