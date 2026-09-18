import React from 'react';
import Button from './Button';

export const SwapRequestCard = ({
  request,
  type = 'received', // 'sent' or 'received'
  onAccept,
  onReject,
  onCancel,
  onSchedule,
  skillsMap = {}, // skillId -> skillName lookup
  usersMap = {},  // userId -> userName lookup
  isLoading = false,
}) => {
  const {
    requestId,
    senderId,
    receiverId,
    offeredSkillId,
    requestedSkillId,
    status,
    createdAt,
  } = request;

  const offeredName = skillsMap[offeredSkillId] || offeredSkillId;
  const requestedName = skillsMap[requestedSkillId] || requestedSkillId;
  const otherUserName =
    type === 'sent'
      ? usersMap[receiverId] || `User (${receiverId?.slice(0, 8)}...)`
      : usersMap[senderId] || `User (${senderId?.slice(0, 8)}...)`;

  const getStatusDetails = (st) => {
    switch (st) {
      case 'PENDING':
        return {
          label: 'PENDING',
          icon: '⏳',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'ACCEPTED':
        return {
          label: 'ACCEPTED',
          icon: '✓',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        };
      case 'REJECTED':
        return {
          label: 'REJECTED',
          icon: '✕',
          classes: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
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

  return (
    <div className="glass-panel p-6 md:p-8 flex flex-col justify-between hover:border-white/30 transition-all duration-300">
      <div>
        {/* Top bar: Direction and Status */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/15">
            {type === 'sent' ? '↗ Sent Request' : '↙ Received Request'}
          </span>

          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${statusInfo.classes}`}
          >
            <span>{statusInfo.icon}</span>
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Counterparty info */}
        <p className="text-sm text-white/60 mb-4">
          {type === 'sent' ? 'Sent to:' : 'Received from:'}{' '}
          <strong className="text-white text-base font-semibold ml-1">
            {otherUserName}
          </strong>
        </p>

        {/* Skill Exchange flow diagram inside card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">They teach:</span>
            <span className="font-semibold text-fuchsia-300">{offeredName}</span>
          </div>

          <div className="flex items-center justify-center text-white/30 text-xs">
            <span>⇄ Skill Exchange</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">They learn:</span>
            <span className="font-semibold text-cyan-300">{requestedName}</span>
          </div>
        </div>

        {createdAt && (
          <p className="text-xs text-white/40 mb-4">
            Created on {new Date(createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
        {type === 'received' && status === 'PENDING' && (
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onAccept && onAccept(requestId)}
              disabled={isLoading}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onReject && onReject(requestId)}
              disabled={isLoading}
            >
              Reject
            </Button>
          </>
        )}

        {type === 'sent' && status === 'PENDING' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onCancel && onCancel(requestId)}
            disabled={isLoading}
            className="w-full"
          >
            Cancel Request
          </Button>
        )}

        {status === 'ACCEPTED' && (
          <Button
            size="sm"
            variant="cyan"
            onClick={() => onSchedule && onSchedule(request)}
            className="w-full"
          >
            📅 Schedule Session
          </Button>
        )}
      </div>
    </div>
  );
};

export default SwapRequestCard;

