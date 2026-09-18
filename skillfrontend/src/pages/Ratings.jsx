import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export const Ratings = () => {
  const { user } = useAuth();

  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for creating rating
  const [formSessionId, setFormSessionId] = useState('');
  const [formToUserId, setFormToUserId] = useState('');
  const [formScore, setFormScore] = useState(5);
  const [formReview, setFormReview] = useState('');
  const [modalError, setModalError] = useState(null);

  const [toast, setToast] = useState(null);

  const loadRatings = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/ratings/user/${user.userId}`);
      if (res.data?.ratings) {
        setRatings(res.data.ratings);
      }
    } catch (err) {
      console.error('Failed to load ratings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!formSessionId.trim() || !formToUserId.trim()) {
      setModalError('Session ID and Target User ID are required.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      await api.post('/ratings', {
        sessionId: formSessionId.trim(),
        toUserId: formToUserId.trim(),
        rating: Number(formScore),
        review: formReview.trim(),
      });

      setToast({
        type: 'success',
        message: 'Rating submitted successfully!',
      });
      setIsModalOpen(false);
      setFormSessionId('');
      setFormToUserId('');
      setFormScore(5);
      setFormReview('');
      await loadRatings();
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to submit rating.';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading reputation and ratings..." />;
  }

  // Calculate statistics
  const totalRatings = ratings.length;
  const averageScore =
    totalRatings > 0
      ? (
          ratings.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
          totalRatings
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Reputation & Ratings
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Verified peer reviews from completed learning sessions.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setModalError(null);
            setIsModalOpen(true);
          }}
        >
          ⭐ Submit a Review
        </Button>
      </div>

      {/* Score Summary Card */}
      <div className="glass-panel p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-amber-500/30">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 p-[2px] shadow-xl shadow-amber-950/50">
            <div className="w-full h-full rounded-3xl bg-slate-900 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">
                {averageScore || '–'}
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-300">
                out of 5
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <RatingStars
                value={averageScore ? Math.round(Number(averageScore)) : 0}
                readOnly
                size="md"
              />
              <span className="text-white font-bold">
                {averageScore ? `${averageScore} Score` : 'No reviews yet'}
              </span>
            </div>
            <p className="text-sm text-white/60">
              Based on {totalRatings} verified feedback submission{totalRatings === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center w-full sm:w-auto">
            <span className="block text-2xl font-bold text-white">
              {ratings.filter((r) => Number(r.rating) === 5).length}
            </span>
            <span className="text-xs text-white/50 uppercase font-semibold">
              5-Star Ratings
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center w-full sm:w-auto">
            <span className="block text-2xl font-bold text-white">
              {ratings.filter((r) => Number(r.rating) >= 4).length}
            </span>
            <span className="text-xs text-white/50 uppercase font-semibold">
              Positive Feedback
            </span>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      {ratings.length === 0 ? (
        <EmptyState
          title="No ratings received yet"
          description="Complete skill exchange sessions to build your community reputation and receive reviews."
          actionText="View Sessions"
          actionHref="/sessions"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ratings.map((r) => (
            <div
              key={r.ratingId}
              className="glass-panel p-6 md:p-8 flex flex-col justify-between hover:border-white/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <RatingStars value={Number(r.rating)} readOnly size="md" />
                  <span className="text-xs text-white/40">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString(undefined, {
                          dateStyle: 'medium',
                        })
                      : ''}
                  </span>
                </div>

                <p className="text-sm md:text-base text-white/90 italic leading-relaxed mb-6">
                  {r.review ? `"${r.review}"` : 'No written commentary provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
                <span>From Peer: {r.fromUserId?.slice(0, 8)}...</span>
                <span>Session: {r.sessionId?.slice(0, 8)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Rating Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Leave a Rating & Review"
      >
        <form onSubmit={handleSubmitRating} className="space-y-6">
          {modalError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{modalError}</span>
            </div>
          )}

          <Input
            label="Completed Session ID"
            placeholder="UUID of completed session"
            value={formSessionId}
            onChange={(e) => setFormSessionId(e.target.value)}
            required
            helperText="Rating is only allowed after a session has been marked as COMPLETED."
          />

          <Input
            label="Target User ID (Participant)"
            placeholder="UUID of member you are rating"
            value={formToUserId}
            onChange={(e) => setFormToUserId(e.target.value)}
            required
            helperText="You cannot rate yourself."
          />

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Select Score (1 to 5)
            </label>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <RatingStars
                value={formScore}
                onChange={(s) => setFormScore(s)}
                size="lg"
              />
              <span className="font-bold text-amber-300 text-lg">
                {formScore} / 5 Stars
              </span>
            </div>
          </div>

          <Input
            as="textarea"
            label="Written Review"
            rows={4}
            placeholder="Explain how well the session was conducted, punctuality, communication, and teaching clarity..."
            value={formReview}
            onChange={(e) => setFormReview(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit Rating
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

export default Ratings;

