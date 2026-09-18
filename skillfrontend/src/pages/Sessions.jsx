import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SessionCard from '../components/SessionCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';

export const Sessions = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [acceptedSwaps, setAcceptedSwaps] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Schedule Session Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(
    location.state?.presetRequestId || ''
  );
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduleError, setScheduleError] = useState(null);

  // Edit Session Modal
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [editScheduledAt, setEditScheduledAt] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editError, setEditError] = useState(null);

  // Rate Session Modal
  const [sessionToRate, setSessionToRate] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingReview, setRatingReview] = useState('');
  const [ratingToUserId, setRatingToUserId] = useState('');
  const [rateError, setRateError] = useState(null);

  const [toast, setToast] = useState(null);

  // Load accepted swaps and user ratings
  const loadData = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      const [sentRes, receivedRes, ratingsRes] = await Promise.allSettled([
        api.get('/swaps/sent'),
        api.get('/swaps/received'),
        api.get(`/ratings/user/${user.userId}`),
      ]);

      const accepted = [];
      if (sentRes.status === 'fulfilled' && sentRes.value?.data?.requests) {
        accepted.push(
          ...sentRes.value.data.requests.filter((r) => r.status === 'ACCEPTED')
        );
      }
      if (receivedRes.status === 'fulfilled' && receivedRes.value?.data?.requests) {
        accepted.push(
          ...receivedRes.value.data.requests.filter((r) => r.status === 'ACCEPTED')
        );
      }
      setAcceptedSwaps(accepted);

      if (ratingsRes.status === 'fulfilled' && ratingsRes.value?.data?.ratings) {
        setUserRatings(ratingsRes.value.data.ratings);
      }

      // If presetRequestId came through location state, open schedule modal immediately
      if (location.state?.presetRequestId) {
        setSelectedRequestId(location.state.presetRequestId);
        setIsScheduleModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to load sessions data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, location.state]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create Session
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequestId) {
      setScheduleError('Please choose an accepted swap request.');
      return;
    }
    if (!scheduledAt) {
      setScheduleError('Please specify the date and time for the session.');
      return;
    }

    setIsProcessing(true);
    setScheduleError(null);

    try {
      const res = await api.post('/sessions', {
        requestId: selectedRequestId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes,
      });

      if (res.data?.session) {
        setSessions((prev) => [res.data.session, ...prev]);
      }

      setToast({
        type: 'success',
        message: 'Learning session scheduled successfully!',
      });
      setIsScheduleModalOpen(false);
      setScheduledAt('');
      setNotes('');
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to schedule session.';
      setScheduleError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete Session
  const handleCompleteSession = async (sessionId) => {
    setIsProcessing(true);
    try {
      const res = await api.patch(`/sessions/${sessionId}/complete`);
      const updated = res.data?.session;

      setSessions((prev) =>
        prev.map((s) => (s.sessionId === sessionId ? updated || { ...s, status: 'COMPLETED' } : s))
      );

      setToast({
        type: 'success',
        message: 'Session completed! You can now rate your partner.',
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.userMessage || 'Failed to complete session.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel Session
  const handleCancelSession = async (sessionId) => {
    setIsProcessing(true);
    try {
      const res = await api.patch(`/sessions/${sessionId}/cancel`);
      const updated = res.data?.session;

      setSessions((prev) =>
        prev.map((s) => (s.sessionId === sessionId ? updated || { ...s, status: 'CANCELLED' } : s))
      );

      setToast({ type: 'success', message: 'Session cancelled.' });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.userMessage || 'Failed to cancel session.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Edit Session Modal
  const handleOpenEdit = (session) => {
    setSessionToEdit(session);
    setEditScheduledAt(
      session.scheduledAt ? new Date(session.scheduledAt).toISOString().slice(0, 16) : ''
    );
    setEditNotes(session.notes || '');
    setEditError(null);
  };

  // Submit Edit Session
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!sessionToEdit) return;

    setIsProcessing(true);
    setEditError(null);

    try {
      const res = await api.put(`/sessions/${sessionToEdit.sessionId}`, {
        scheduledAt: new Date(editScheduledAt).toISOString(),
        notes: editNotes,
      });

      const updated = res.data?.session;
      setSessions((prev) =>
        prev.map((s) => (s.sessionId === sessionToEdit.sessionId ? updated || { ...s, scheduledAt: editScheduledAt, notes: editNotes } : s))
      );

      setToast({ type: 'success', message: 'Session updated successfully!' });
      setSessionToEdit(null);
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to update session.';
      setEditError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Rate Modal
  const handleOpenRate = (session) => {
    // Find the linked swap request to determine the partner's userId
    const linkedSwap = acceptedSwaps.find((s) => s.requestId === session.requestId);
    const partnerId =
      linkedSwap?.senderId === user?.userId
        ? linkedSwap?.receiverId
        : linkedSwap?.senderId || '';

    setSessionToRate(session);
    setRatingToUserId(partnerId);
    setRatingScore(5);
    setRatingReview('');
    setRateError(null);
  };

  // Submit Rating
  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (!sessionToRate) return;
    if (!ratingToUserId) {
      setRateError('Recipient User ID is required.');
      return;
    }

    setIsProcessing(true);
    setRateError(null);

    try {
      await api.post('/ratings', {
        sessionId: sessionToRate.sessionId,
        toUserId: ratingToUserId,
        rating: Number(ratingScore),
        review: ratingReview,
      });

      setToast({
        type: 'success',
        message: 'Rating and review submitted successfully!',
      });
      setSessionToRate(null);
      await loadData();
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to submit rating.';
      setRateError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading sessions..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Live Learning Sessions
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Schedule meetings, complete reciprocal learning, and exchange verified peer reviews.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setScheduleError(null);
            setIsScheduleModalOpen(true);
          }}
        >
          📅 Schedule New Session
        </Button>
      </div>

      {/* Accepted Swaps Helper Banner */}
      {acceptedSwaps.length > 0 && sessions.length === 0 && (
        <div className="glass-panel p-6 border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-emerald-300">
              You have {acceptedSwaps.length} accepted swap request{acceptedSwaps.length === 1 ? '' : 's'} ready for scheduling!
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Pick a convenient time with your exchange partner to meet and share knowledge.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            Schedule Now
          </Button>
        </div>
      )}

      {/* Sessions Grid or Empty State */}
      {sessions.length === 0 ? (
        <EmptyState
          title="No sessions scheduled yet"
          description="Sessions are scheduled once both partners accept a swap request."
          actionText={
            acceptedSwaps.length > 0
              ? '📅 Schedule Session from Accepted Swap'
              : '⇄ View Swap Requests'
          }
          onAction={
            acceptedSwaps.length > 0
              ? () => setIsScheduleModalOpen(true)
              : () => navigate('/swaps')
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((sess) => {
            const hasRated = userRatings.some((r) => r.sessionId === sess.sessionId);
            return (
              <SessionCard
                key={sess.sessionId}
                session={sess}
                isLoading={isProcessing}
                hasRated={hasRated}
                onComplete={handleCompleteSession}
                onCancel={handleCancelSession}
                onEdit={handleOpenEdit}
                onRate={handleOpenRate}
              />
            );
          })}
        </div>
      )}

      {/* Schedule Session Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Learning Session"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-6">
          {scheduleError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{scheduleError}</span>
            </div>
          )}

          {acceptedSwaps.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                You can specify a Swap Request ID manually, or accept a pending swap first.
              </p>
              <Input
                label="Accepted Swap Request ID"
                placeholder="UUID of accepted swap request"
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                required
              />
            </div>
          ) : (
            <Input
              as="select"
              label="Select Accepted Swap Request"
              value={selectedRequestId}
              onChange={(e) => setSelectedRequestId(e.target.value)}
              options={acceptedSwaps.map((s) => ({
                value: s.requestId,
                label: `Request ID: ${s.requestId.slice(0, 8)}... (${s.status})`,
              }))}
              required
            />
          )}

          <Input
            type="datetime-local"
            label="Date & Time"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            helperText="Set the agreed meeting time for your session."
          />

          <Input
            as="textarea"
            label="Meeting Notes & Link"
            rows={3}
            placeholder="e.g. Google Meet link, topics to cover, preparation materials..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setIsScheduleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isProcessing}
              loadingText="Scheduling..."
            >
              Confirm Session
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        isOpen={Boolean(sessionToEdit)}
        onClose={() => setSessionToEdit(null)}
        title="Update Session Details"
      >
        <form onSubmit={handleSaveEdit} className="space-y-6">
          {editError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{editError}</span>
            </div>
          )}

          <Input
            type="datetime-local"
            label="Scheduled Date & Time"
            value={editScheduledAt}
            onChange={(e) => setEditScheduledAt(e.target.value)}
            required
          />

          <Input
            as="textarea"
            label="Session Notes"
            rows={4}
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setSessionToEdit(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isProcessing}
              loadingText="Updating..."
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rate Session Modal */}
      <Modal
        isOpen={Boolean(sessionToRate)}
        onClose={() => setSessionToRate(null)}
        title="Rate Your Swap Partner"
      >
        <form onSubmit={handleRateSubmit} className="space-y-6">
          {rateError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{rateError}</span>
            </div>
          )}

          <Input
            label="Partner User ID"
            placeholder="UUID of participant"
            value={ratingToUserId}
            onChange={(e) => setRatingToUserId(e.target.value)}
            required
            helperText="The user ID of the participant you learned with."
          />

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Score (1 to 5 Stars)
            </label>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <RatingStars
                value={ratingScore}
                onChange={(score) => setRatingScore(score)}
                size="lg"
              />
              <span className="font-bold text-amber-300 text-lg">
                {ratingScore} / 5
              </span>
            </div>
          </div>

          <Input
            as="textarea"
            label="Written Review"
            rows={3}
            placeholder="Share feedback on how the session went, communication quality, and subject mastery..."
            value={ratingReview}
            onChange={(e) => setRatingReview(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setSessionToRate(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              isLoading={isProcessing}
              loadingText="Submitting..."
            >
              Submit Verified Rating
            </Button>
          </div>
        </form>
      </Modal>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Sessions;

