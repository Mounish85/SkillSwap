import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionHref,
  actionVariant = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`glass-panel p-8 md:p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 border border-white/10 flex items-center justify-center mb-6 text-violet-400">
        {icon ? (
          icon
        ) : (
          <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      <h4 className="text-xl md:text-2xl font-bold text-white mb-2">
        {title}
      </h4>

      {description && (
        <p className="text-white/60 text-sm md:text-base max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {actionText && (
        <div>
          {actionHref ? (
            <Link to={actionHref}>
              <Button variant={actionVariant}>{actionText}</Button>
            </Link>
          ) : onAction ? (
            <Button variant={actionVariant} onClick={onAction}>
              {actionText}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

