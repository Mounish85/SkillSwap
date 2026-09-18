import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillCard from '../components/SkillCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export const MySkills = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'OFFER', 'WANT'
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [allSkillsCatalog, setAllSkillsCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Skill Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillId, setNewSkillId] = useState('');
  const [newSkillType, setNewSkillType] = useState('OFFER');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Delete Confirmation Modal
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const loadSkills = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      const [offeredRes, wantedRes, catalogRes] = await Promise.allSettled([
        api.get(`/user-skills/${user.userId}/offered`),
        api.get(`/user-skills/${user.userId}/wanted`),
        api.get('/skills'),
      ]);

      if (catalogRes.status === 'fulfilled' && catalogRes.value?.data?.skills) {
        setAllSkillsCatalog(catalogRes.value.data.skills);
      }

      if (offeredRes.status === 'fulfilled' && offeredRes.value?.data?.skills) {
        setOfferedSkills(offeredRes.value.data.skills);
      }

      if (wantedRes.status === 'fulfilled' && wantedRes.value?.data?.skills) {
        setWantedSkills(wantedRes.value.data.skills);
      }
    } catch (err) {
      console.error('Failed to load user skills:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Build dictionary for fast skillName lookup
  const skillNameMap = {};
  const skillCategoryMap = {};
  allSkillsCatalog.forEach((s) => {
    skillNameMap[s.skillId] = s.skillName;
    skillCategoryMap[s.skillId] = s.category;
  });

  const handleOpenAddModal = (presetType = 'OFFER') => {
    setNewSkillType(presetType);
    setNewSkillId(allSkillsCatalog[0]?.skillId || '');
    setNewSkillLevel('Intermediate');
    setModalError(null);
    setIsAddModalOpen(true);
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillId) {
      setModalError('Please select a skill from the directory.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      await api.post(`/user-skills/${user.userId}`, {
        skillId: newSkillId,
        type: newSkillType,
        level: newSkillLevel,
      });

      setToast({
        type: 'success',
        message: `Successfully added ${newSkillType === 'OFFER' ? 'teaching' : 'learning'} skill!`,
      });
      setIsAddModalOpen(false);
      await loadSkills();
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to add skill.';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/user-skills/${skillToDelete.userSkillId}`);
      setToast({
        type: 'success',
        message: 'Skill removed from your profile.',
      });
      setSkillToDelete(null);
      await loadSkills();
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to remove skill.';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading your skills..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            My Skills Management
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Clearly distinguish what you can teach and what you want to learn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => handleOpenAddModal('OFFER')}
          >
            + Add Teaching Skill
          </Button>
          <Button
            variant="cyan"
            onClick={() => handleOpenAddModal('WANT')}
          >
            + Add Learning Skill
          </Button>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === 'ALL'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
              : 'text-white/60 hover:text-white'
          }`}
        >
          All Skills ({offeredSkills.length + wantedSkills.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('OFFER')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'OFFER'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>🎓</span>
          <span>What I Teach ({offeredSkills.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('WANT')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'WANT'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>🎯</span>
          <span>What I Want to Learn ({wantedSkills.length})</span>
        </button>
      </div>

      {/* Skills Sections */}
      {(activeTab === 'ALL' || activeTab === 'OFFER') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-base">
                🎓
              </span>
              <span>What I Can Teach (Offer)</span>
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {offeredSkills.length} Available
            </span>
          </div>

          {offeredSkills.length === 0 ? (
            <EmptyState
              title="You are not offering any skills yet"
              description="List skills you master so other users can swap knowledge with you."
              actionText="+ Offer a Skill"
              onAction={() => handleOpenAddModal('OFFER')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offeredSkills.map((item) => (
                <SkillCard
                  key={item.userSkillId}
                  skill={{
                    skillName: skillNameMap[item.skillId] || 'Skill',
                    category: skillCategoryMap[item.skillId] || 'Skill',
                    type: 'OFFER',
                    level: item.level,
                  }}
                  secondaryActionText="Remove"
                  onSecondaryAction={() => setSkillToDelete(item)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {(activeTab === 'ALL' || activeTab === 'WANT') && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-base">
                🎯
              </span>
              <span>What I Want to Learn (Want)</span>
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {wantedSkills.length} Desired
            </span>
          </div>

          {wantedSkills.length === 0 ? (
            <EmptyState
              title="You haven't added any learning targets"
              description="Tell the community what you want to master to start matching."
              actionText="+ Add Learning Goal"
              actionVariant="cyan"
              onAction={() => handleOpenAddModal('WANT')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wantedSkills.map((item) => (
                <SkillCard
                  key={item.userSkillId}
                  skill={{
                    skillName: skillNameMap[item.skillId] || 'Skill',
                    category: skillCategoryMap[item.skillId] || 'Skill',
                    type: 'WANT',
                    level: item.level,
                  }}
                  secondaryActionText="Remove"
                  onSecondaryAction={() => setSkillToDelete(item)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          newSkillType === 'OFFER'
            ? 'Add a Skill You Can Teach'
            : 'Add a Skill You Want to Learn'
        }
      >
        <form onSubmit={handleAddSkill} className="space-y-6">
          {modalError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{modalError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-3">
              Type of Skill
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setNewSkillType('OFFER')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  newSkillType === 'OFFER'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="block text-xl mb-1">🎓</span>
                <span className="block font-bold">OFFER</span>
                <span className="block text-xs opacity-75">I can teach this</span>
              </button>

              <button
                type="button"
                onClick={() => setNewSkillType('WANT')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  newSkillType === 'WANT'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="block text-xl mb-1">🎯</span>
                <span className="block font-bold">WANT</span>
                <span className="block text-xs opacity-75">I want to learn this</span>
              </button>
            </div>
          </div>

          <Input
            as="select"
            label="Select Skill from Directory"
            value={newSkillId}
            onChange={(e) => setNewSkillId(e.target.value)}
            options={allSkillsCatalog.map((s) => ({
              value: s.skillId,
              label: `${s.skillName} (${s.category || 'General'})`,
            }))}
            required
            helperText="Can't find your skill? Contact an admin to add new skill definitions."
          />

          <Input
            as="select"
            label="Proficiency / Desired Level"
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value)}
            options={[
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
              { value: 'Expert', label: 'Expert / Master' },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={newSkillType === 'OFFER' ? 'primary' : 'cyan'}
              size="md"
              isLoading={isSubmitting}
              loadingText="Adding Skill..."
            >
              Confirm & Add
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(skillToDelete)}
        onClose={() => setSkillToDelete(null)}
        title="Remove Skill from Profile?"
      >
        <div className="space-y-6">
          <p className="text-white/80">
            Are you sure you want to remove this skill from your{' '}
            <span className="font-semibold text-white">
              {skillToDelete?.type === 'OFFER' ? 'teaching' : 'learning'}
            </span>{' '}
            list? Active swap requests referencing this skill will not be automatically deleted.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setSkillToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSkill}
              isLoading={isDeleting}
              loadingText="Removing..."
            >
              Yes, Remove Skill
            </Button>
          </div>
        </div>
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

export default MySkills;
