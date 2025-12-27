interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
}

export default function Toast({ type, title, message, onClose }: ToastProps) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-500',
      titleColor: 'text-green-800',
      messageColor: 'text-green-600',
      iconPath: 'M5 13l4 4L19 7'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-500',
      titleColor: 'text-red-800',
      messageColor: 'text-red-600',
      iconPath: 'M6 18L18 6M6 6l12 12'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'bg-yellow-500',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-600',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-500',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-600',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  };

  const style = styles[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} border ${style.border} rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px] max-w-md`}>
        <div className={`w-8 h-8 ${style.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.iconPath} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${style.titleColor}`}>{title}</p>
          <p className={`text-sm ${style.messageColor} mt-1 break-words`}>{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
