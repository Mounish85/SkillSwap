import React from 'react';
import Button from './Button';

export const SessionCard = ({
  session,
  onComplete,
  onCancel,
  onEdit,
  onRate,
  hasRated = false,
  isLoading = false,
}) => {
  const { sessionId, scheduledAt, status, notes, requestId } = session;

  const getStatusDetails = (st) => {
    switch (st) {
      case 'SCHEDULED':
        return {
          label: 'SCHEDULED',
          icon: '📅',
          classes: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };
      case 'COMPLETED':
        return {
          label: 'COMPLETED',
          icon: '✓',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        };
      case 'CANCELLED':
        return {
          label: 'CANCELLED',
          icon: '⊘',
          classes: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        };
      default:
        return {
          label: st || 'UNKNOWN',
          icon: '•',
          classes: 'bg-white/10 text-white border-white/20',
        };
    }
  };

  const statusInfo = getStatusDetails(status);

  const formattedDate = scheduledAt
    ? new Date(scheduledAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Date not specified';

  return (
    <div className="glass-panel p-6 md:p-8 flex flex-col justify-between hover:border-white/30 transition-all duration-300">
      <div>
        {/* Header with status badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-mono text-white/50">
            ID: {sessionId?.slice(0, 8)}...
          </span>

          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${statusInfo.classes}`}
          >
            <span>{statusInfo.icon}</span>
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Scheduled time */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Scheduled For</p>
          <p className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">🕒</span>
            <span>{formattedDate}</span>
          </p>
        </div>

        {/* Notes */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Session Notes</p>
          <p className="text-sm text-white/80 whitespace-pre-wrap">
            {notes || 'No notes provided for this session.'}
          </p>
        </div>

        {requestId && (
          <p className="text-xs text-white/40 mb-4 font-mono">
            Linked Swap Request: {requestId?.slice(0, 8)}...
          </p>
        )}
      </div>

      {/* Action buttons based on state */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
        {status === 'SCHEDULED' && (
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onComplete && onComplete(sessionId)}
              disabled={isLoading}
              className="flex-1"
            >
              Complete Session
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit && onEdit(session)}
              disabled={isLoading}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onCancel && onCancel(sessionId)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </>
        )}

        {status === 'COMPLETED' && (
          <Button
            size="sm"
            variant={hasRated ? 'secondary' : 'accent'}
            onClick={() => onRate && onRate(session)}
            disabled={hasRated || isLoading}
            className="w-full"
          >
            {hasRated ? '✓ Already Rated' : '⭐ Rate Participant'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;

