import React from 'react';
import Button from './Button';

export const SkillCard = ({
  skill,
  onAction,
  actionText,
  actionVariant = 'primary',
  secondaryActionText,
  onSecondaryAction,
  secondaryVariant = 'danger',
  badgeText,
  levelText,
  className = '',
}) => {
  const { skillName, category, type, level } = skill;

  // Derive badge styling for OFFER vs WANT
  const isOffer = (type || badgeText) === 'OFFER';
  const isWant = (type || badgeText) === 'WANT';

  return (
    <div
      className={`glass-panel p-6 md:p-8 flex flex-col justify-between hover:border-white/35 transition-all duration-300 group ${className}`}
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {category || 'General'}
          </span>

          {(badgeText || type) && (
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                isOffer
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : isWant
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-white/10 text-white/80 border-white/20'
              }`}
            >
              {isOffer ? 'Teaching (Offer)' : isWant ? 'Learning (Want)' : badgeText || type}
            </span>
          )}
        </div>

        {/* Skill Title */}
        <h4 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-fuchsia-300 transition-all">
          {skillName}
        </h4>

        {/* Level indicator if present */}
        {(level || levelText) && (
          <div className="flex items-center gap-2 mt-2 text-sm text-white/60">
            <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400"></span>
            <span>Level: <strong className="text-white/90">{level || levelText}</strong></span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {(actionText || secondaryActionText) && (
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
          {actionText && (
            <Button
              size="sm"
              variant={actionVariant}
              onClick={() => onAction && onAction(skill)}
              className="flex-1"
            >
              {actionText}
            </Button>
          )}

          {secondaryActionText && (
            <Button
              size="sm"
              variant={secondaryVariant}
              onClick={() => onSecondaryAction && onSecondaryAction(skill)}
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillCard;

