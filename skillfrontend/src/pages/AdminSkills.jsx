import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Create Skill Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createCategory, setCreateCategory] = useState('');
  const [createError, setCreateError] = useState(null);

  // Edit Skill Modal
  const [skillToEdit, setSkillToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editError, setEditError] = useState(null);

  // Delete Confirmation Modal
  const [skillToDelete, setSkillToDelete] = useState(null);

  const [toast, setToast] = useState(null);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/skills');
      if (res.data?.skills) {
        setSkills(res.data.skills);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Filter skills
  const filteredSkills = skills.filter(
    (s) =>
      s.skillName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create Skill Handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createName.trim() || !createCategory.trim()) {
      setCreateError('Skill name and category are required.');
      return;
    }

    setIsProcessing(true);
    setCreateError(null);

    try {
      const res = await api.post('/skills', {
        skillName: createName.trim(),
        category: createCategory.trim(),
      });

      setToast({
        type: 'success',
        message: `Created skill "${createName}" successfully!`,
      });
      setIsCreateOpen(false);
      setCreateName('');
      setCreateCategory('');
      if (res.data?.skill) {
        setSkills((prev) => [...prev, res.data.skill]);
      } else {
        await loadSkills();
      }
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to create skill.';
      setCreateError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (skill) => {
    setSkillToEdit(skill);
    setEditName(skill.skillName || '');
    setEditCategory(skill.category || '');
    setEditError(null);
  };

  // Edit Skill Handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!skillToEdit) return;
    if (!editName.trim() || !editCategory.trim()) {
      setEditError('Skill name and category are required.');
      return;
    }

    setIsProcessing(true);
    setEditError(null);

    try {
      const res = await api.put(`/skills/${skillToEdit.skillId}`, {
        skillName: editName.trim(),
        category: editCategory.trim(),
      });

      setToast({
        type: 'success',
        message: `Updated skill "${editName}" successfully!`,
      });
      const updated = res.data?.skill;
      setSkills((prev) =>
        prev.map((s) =>
          s.skillId === skillToEdit.skillId
            ? updated || { ...s, skillName: editName, category: editCategory }
            : s
        )
      );
      setSkillToEdit(null);
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to update skill.';
      setEditError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Skill Handler
  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;

    setIsProcessing(true);
    try {
      await api.delete(`/skills/${skillToDelete.skillId}`);
      setToast({
        type: 'success',
        message: `Skill "${skillToDelete.skillName}" permanently deleted.`,
      });
      setSkills((prev) =>
        prev.filter((s) => s.skillId !== skillToDelete.skillId)
      );
      setSkillToDelete(null);
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to delete skill.';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading skill repository..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      <div className="absolute top-20 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin"
              className="text-xs uppercase font-semibold text-fuchsia-400 hover:text-fuchsia-300"
            >
              ← Admin Dashboard
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Skill Catalog Management
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Create, update, and manage global skill definitions for all users.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setCreateError(null);
            setIsCreateOpen(true);
          }}
        >
          + Create New Skill
        </Button>
      </div>

      {/* Search Input */}
      <div className="glass-panel p-4">
        <Input
          type="search"
          placeholder="Filter skills by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Skills Table / Card view */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          title="No skills found"
          description={
            searchQuery
              ? `No skills match "${searchQuery}".`
              : 'The skill catalog is currently empty.'
          }
          actionText="+ Create First Skill"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="glass-panel overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 bg-white/5 text-xs uppercase font-bold tracking-wider text-white/60">
                  <th className="py-4 px-6">Skill Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Skill ID</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {filteredSkills.map((s) => (
                  <tr
                    key={s.skillId}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6 font-semibold text-white">
                      {s.skillName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {s.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-white/40">
                      {s.skillId}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenEdit(s)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setSkillToDelete(s)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Skill Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Define New Global Skill"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          {createError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{createError}</span>
            </div>
          )}

          <Input
            label="Skill Name"
            placeholder="e.g. Modern React, Graphic Design, Japanese"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            required
          />

          <Input
            label="Category"
            placeholder="e.g. Technology, Creative Arts, Languages, Music"
            value={createCategory}
            onChange={(e) => setCreateCategory(e.target.value)}
            required
            helperText="Grouping category for easier browsing."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isProcessing}
              loadingText="Creating..."
            >
              Create Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal
        isOpen={Boolean(skillToEdit)}
        onClose={() => setSkillToEdit(null)}
        title={`Edit "${skillToEdit?.skillName}"`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          {editError && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{editError}</span>
            </div>
          )}

          <Input
            label="Skill Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <Input
            label="Category"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setSkillToEdit(null)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(skillToDelete)}
        onClose={() => setSkillToDelete(null)}
        title="Confirm Destructive Deletion"
      >
        <div className="space-y-6">
          <p className="text-white/80">
            Are you sure you want to delete skill{' '}
            <strong className="text-white font-semibold">
              "{skillToDelete?.skillName}"
            </strong>{' '}
            ({skillToDelete?.category})?
          </p>
          <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
            ⚠️ Caution: Deleting this skill will remove it from the global catalog in Google Sheets. Users who currently have this skill in their profile will retain their records, but no new swaps can be proposed using this skill.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={() => setSkillToDelete(null)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={isProcessing}
              loadingText="Deleting..."
            >
              Yes, Delete Permanently
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

export default AdminSkills;

