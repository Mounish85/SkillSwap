import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillCard from '../components/SkillCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export const Skills = () => {
  const { user } = useAuth();

  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Add skill modal state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [skillType, setSkillType] = useState('OFFER');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [skillsRes, userSkillsRes] = await Promise.allSettled([
          api.get('/skills'),
          user?.userId ? api.get(`/user-skills/${user.userId}`) : Promise.resolve(null),
        ]);

        if (!isMounted) return;

        if (skillsRes.status === 'fulfilled' && skillsRes.value?.data?.skills) {
          setSkills(skillsRes.value.data.skills);
        }

        if (userSkillsRes.status === 'fulfilled' && userSkillsRes.value?.data?.skills) {
          setUserSkills(userSkillsRes.value.data.skills);
        }
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Extract unique categories
  const categories = ['ALL', ...new Set(skills.map((s) => s.category).filter(Boolean))];

  // Filter skills based on search and category
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || skill.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = (skill) => {
    setSelectedSkill(skill);
    setSkillType('OFFER');
    setSkillLevel('Intermediate');
    setModalError(null);
    setModalOpen(true);
  };

  const handleAddSkillToProfile = async (e) => {
    e.preventDefault();
    if (!user?.userId || !selectedSkill) return;

    setIsSubmitting(true);
    setModalError(null);

    try {
      const res = await api.post(`/user-skills/${user.userId}`, {
        skillId: selectedSkill.skillId,
        type: skillType,
        level: skillLevel,
      });

      if (res.data?.userSkill) {
        setUserSkills((prev) => [...prev, res.data.userSkill]);
      }

      setToast({
        type: 'success',
        message: `Added "${selectedSkill.skillName}" to your ${skillType === 'OFFER' ? 'teaching' : 'learning'} skills!`,
      });
      setModalOpen(false);
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to add skill to your profile.';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to check if user already added this skill
  const isAlreadyAdded = (skillId, type) => {
    return userSkills.some((us) => us.skillId === skillId && us.type === type);
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading skill directory..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 left-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Skill Directory
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Browse skills and add them to your profile as things you teach or want to learn.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <Input
              type="search"
              placeholder="Search by skill name (e.g. Python, Guitar, UI Design)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Cards Grid */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          title="No skills found"
          description={
            searchQuery
              ? `No skills match "${searchQuery}". Try a different search term or category.`
              : 'No skills are currently available in this category.'
          }
          actionText={searchQuery ? 'Clear Search' : undefined}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const hasOffered = isAlreadyAdded(skill.skillId, 'OFFER');
            const hasWanted = isAlreadyAdded(skill.skillId, 'WANT');

            return (
              <SkillCard
                key={skill.skillId}
                skill={skill}
                actionText={
                  hasOffered && hasWanted
                    ? '✓ Already in Profile'
                    : '+ Add to Profile'
                }
                actionVariant={hasOffered && hasWanted ? 'secondary' : 'primary'}
                onAction={() => handleOpenAddModal(skill)}
              />
            );
          })}
        </div>
      )}

      {/* Add Skill to Profile Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Add "${selectedSkill?.skillName}" to Profile`}
      >
        <form onSubmit={handleAddSkillToProfile} className="space-y-6">
          {modalError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{modalError}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/50 uppercase font-semibold">Category</p>
            <p className="text-lg font-bold text-white">{selectedSkill?.category}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-3">
              How do you want to add this skill?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSkillType('OFFER')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  skillType === 'OFFER'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/40'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="block text-xl mb-1">🎓</span>
                <span className="block font-bold">OFFER</span>
                <span className="block text-xs opacity-75">I can teach this</span>
              </button>

              <button
                type="button"
                onClick={() => setSkillType('WANT')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  skillType === 'WANT'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-950/40'
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
            label="Proficiency / Desired Level"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
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
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              loadingText="Adding Skill..."
            >
              Add to Profile
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

export default Skills;
