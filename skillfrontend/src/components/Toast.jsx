import React, { useEffect } from 'react';

export const Toast = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all duration-300 animate-fade-in max-w-md ${
        isSuccess
          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100 shadow-emerald-950/50'
          : isError
          ? 'bg-rose-950/80 border-rose-500/30 text-rose-100 shadow-rose-950/50'
          : 'bg-slate-900/80 border-white/20 text-white shadow-violet-950/50'
      }`}
      role="alert"
    >
      <div className="shrink-0">
        {isSuccess ? (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : isError ? (
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 text-sm font-medium leading-snug">{message}</div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-white/50 hover:text-white transition-colors"
          aria-label="Dismiss message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Toast;

