import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SwapRequestCard from '../components/SwapRequestCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export const Swaps = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [skillsMap, setSkillsMap] = useState({});
  const [myOfferedSkills, setMyOfferedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // New Swap Request Modal
  const [isNewSwapOpen, setIsNewSwapOpen] = useState(false);
  const [newReceiverId, setNewReceiverId] = useState('');
  const [newOfferedSkillId, setNewOfferedSkillId] = useState('');
  const [newRequestedSkillId, setNewRequestedSkillId] = useState('');
  const [modalError, setModalError] = useState(null);

  const [toast, setToast] = useState(null);

  const loadSwapData = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      const [
        receivedRes,
        sentRes,
        skillsRes,
        myOfferedRes,
      ] = await Promise.allSettled([
        api.get('/swaps/received'),
        api.get('/swaps/sent'),
        api.get('/skills'),
        api.get(`/user-skills/${user.userId}/offered`),
      ]);

      const sMap = {};
      if (skillsRes.status === 'fulfilled' && skillsRes.value?.data?.skills) {
        setAllSkills(skillsRes.value.data.skills);
        skillsRes.value.data.skills.forEach((s) => {
          sMap[s.skillId] = s.skillName;
        });
        setSkillsMap(sMap);
      }

      if (receivedRes.status === 'fulfilled' && receivedRes.value?.data?.requests) {
        setReceivedRequests(receivedRes.value.data.requests);
      }

      if (sentRes.status === 'fulfilled' && sentRes.value?.data?.requests) {
        setSentRequests(sentRes.value.data.requests);
      }

      if (myOfferedRes.status === 'fulfilled' && myOfferedRes.value?.data?.skills) {
        setMyOfferedSkills(myOfferedRes.value.data.skills);
        if (myOfferedRes.value.data.skills.length > 0) {
          setNewOfferedSkillId(myOfferedRes.value.data.skills[0].skillId);
        }
      }
    } catch (err) {
      console.error('Failed to load swaps:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSwapData();
  }, [loadSwapData]);

  // Handle Accept
  const handleAccept = async (requestId) => {
    setIsProcessing(true);
    try {
      await api.patch(`/swaps/${requestId}/accept`);
      setToast({ type: 'success', message: 'Swap request accepted! You can now schedule a session.' });
      await loadSwapData();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.userMessage || 'Failed to accept swap request.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Reject
  const handleReject = async (requestId) => {
    setIsProcessing(true);
    try {
      await api.patch(`/swaps/${requestId}/reject`);
      setToast({ type: 'success', message: 'Swap request rejected.' });
      await loadSwapData();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.userMessage || 'Failed to reject swap request.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Cancel
  const handleCancel = async (requestId) => {
    setIsProcessing(true);
    try {
      await api.patch(`/swaps/${requestId}/cancel`);
      setToast({ type: 'success', message: 'Swap request cancelled.' });
      await loadSwapData();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.userMessage || 'Failed to cancel swap request.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Create Swap Modal
  const handleOpenCreateModal = () => {
    setNewReceiverId('');
    if (myOfferedSkills.length > 0) {
      setNewOfferedSkillId(myOfferedSkills[0].skillId);
    }
    if (allSkills.length > 0) {
      setNewRequestedSkillId(allSkills[0].skillId);
    }
    setModalError(null);
    setIsNewSwapOpen(true);
  };

  // Submit New Swap
  const handleCreateSwap = async (e) => {
    e.preventDefault();
    if (!newReceiverId.trim()) {
      setModalError('Target User ID is required.');
      return;
    }
    if (!newOfferedSkillId) {
      setModalError('Please select a skill you offer to teach.');
      return;
    }
    if (!newRequestedSkillId) {
      setModalError('Please select a skill you want to learn.');
      return;
    }

    setIsProcessing(true);
    setModalError(null);

    try {
      await api.post('/swaps', {
        receiverId: newReceiverId.trim(),
        offeredSkillId: newOfferedSkillId,
        requestedSkillId: newRequestedSkillId,
      });

      setToast({
        type: 'success',
        message: 'Swap request created successfully!',
      });
      setIsNewSwapOpen(false);
      await loadSwapData();
      setActiveTab('sent');
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to create swap request.';
      setModalError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigate to Sessions to schedule
  const handleScheduleFromSwap = (swap) => {
    navigate('/sessions', {
      state: {
        presetRequestId: swap.requestId,
      },
    });
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading swap requests..." />;
  }

  const currentList = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Skill Swap Requests
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Manage incoming proposals and track requests you sent to other members.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreateModal}>
          + Propose New Swap
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'received'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>↙ Received</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
            {receivedRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sent')}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'sent'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>↗ Sent</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Requests Grid */}
      {currentList.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'received'
              ? 'No incoming swap requests yet'
              : 'No sent swap requests'
          }
          description={
            activeTab === 'received'
              ? 'When other members find your offered skills, their proposals will appear here.'
              : 'Propose a swap to another user to initiate a skill exchange session.'
          }
          actionText={activeTab === 'sent' ? '+ Propose New Swap' : 'Explore Skills'}
          onAction={activeTab === 'sent' ? handleOpenCreateModal : undefined}
          actionHref={activeTab === 'received' ? '/skills' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((req) => (
            <SwapRequestCard
              key={req.requestId}
              request={req}
              type={activeTab}
              skillsMap={skillsMap}
              isLoading={isProcessing}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              onSchedule={handleScheduleFromSwap}
            />
          ))}
        </div>
      )}

      {/* Propose New Swap Modal */}
      <Modal
        isOpen={isNewSwapOpen}
        onClose={() => setIsNewSwapOpen(false)}
        title="Propose a Skill Swap"
      >
        <form onSubmit={handleCreateSwap} className="space-y-6">
          {modalError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{modalError}</span>
            </div>
          )}

          <Input
            label="Partner User ID"
            placeholder="Enter the partner's User ID (UUID)"
            value={newReceiverId}
            onChange={(e) => setNewReceiverId(e.target.value)}
            required
            helperText="The unique ID of the member you want to swap skills with."
          />

          {myOfferedSkills.length === 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs">
              ⚠️ You haven't added any OFFER skills yet. You must offer a skill you teach before proposing a swap.
            </div>
          ) : (
            <Input
              as="select"
              label="Skill You Will Teach (Offered Skill)"
              value={newOfferedSkillId}
              onChange={(e) => setNewOfferedSkillId(e.target.value)}
              options={myOfferedSkills.map((s) => ({
                value: s.skillId,
                label: `${skillsMap[s.skillId] || s.skillId} (Level: ${s.level})`,
              }))}
              required
            />
          )}

          <Input
            as="select"
            label="Skill You Want to Learn (Requested Skill)"
            value={newRequestedSkillId}
            onChange={(e) => setNewRequestedSkillId(e.target.value)}
            options={allSkills.map((s) => ({
              value: s.skillId,
              label: `${s.skillName} (${s.category || 'General'})`,
            }))}
            required
            helperText="The skill you wish the partner to teach you."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsNewSwapOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={myOfferedSkills.length === 0}
              isLoading={isProcessing}
              loadingText="Sending Request..."
            >
              Send Proposal
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

export default Swaps;
