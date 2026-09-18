import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon = null,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-2xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-500/20 hover:shadow-fuchsia-500/30 hover:from-violet-500 hover:to-fuchsia-500',
    secondary:
      'backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 hover:scale-[1.02] active:scale-95',
    cyan:
      'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500',
    accent:
      'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-pink-500/20',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20',
    ghost:
      'text-white/80 hover:text-white hover:bg-white/5 active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs md:text-sm',
    md: 'px-6 py-3 text-sm md:text-base',
    lg: 'px-8 py-3.5 text-base md:text-lg',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{loadingText || 'Processing...'}</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span className="inline-block">{icon}</span>}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
};

export default Button;

