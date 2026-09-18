import React, { useState } from 'react';

export const RatingStars = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const currentDisplay = hoverValue || Number(value) || 0;

  return (
    <div className="flex items-center gap-1.5" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentDisplay;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`transition-transform duration-150 ${
              readOnly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-125 focus:outline-none'
            }`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <svg
              className={`${starSizes[size] || starSizes.md} ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-white/20 fill-transparent stroke-current'
              }`}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;

