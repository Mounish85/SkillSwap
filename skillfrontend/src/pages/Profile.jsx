import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', status: 'ACTIVE' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;

    let isMounted = true;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/users/${user.userId}/profile`);
        const p = res.data?.profile || res.data?.user || {};
        if (isMounted) {
          setProfile(p);
          setFormData({
            name: p.name || '',
            status: p.status || 'ACTIVE',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (isMounted) {
          setError(err.userMessage || 'Could not load profile details.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Normal users can only edit allowed fields: name and status
      const res = await api.put(`/users/${user.userId}`, {
        name: formData.name.trim(),
        status: formData.status,
      });

      const updated = res.data?.user || res.data?.profile;
      if (updated) {
        setProfile(updated);
      }
      await refreshUser();
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to update profile.';
      setError(msg);
      setToast({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Account Profile
        </h1>
        <p className="text-white/60 text-sm mt-1">
          View your membership details and update your public persona.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Meta */}
        <div className="glass-panel p-6 md:p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 p-[2px] mb-4 shadow-xl shadow-violet-950/50">
            <div className="w-full h-full rounded-3xl bg-slate-900 flex items-center justify-center text-3xl font-black text-white">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">
            {profile?.name || user?.name}
          </h2>
          <p className="text-xs text-white/50 mb-4">{profile?.email || user?.email}</p>

          <div className="w-full pt-4 border-t border-white/10 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">User Role</span>
              <span className="font-mono font-semibold text-fuchsia-300">
                {profile?.role || 'USER'}
              </span>
            </div>

            <div className="flex items-center justify-center pt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  profile?.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {profile?.status || 'ACTIVE'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-white/50">Member Since</span>
              <span className="text-white/80">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2 glass-panel p-6 md:p-8">
          <h3 className="text-xl font-bold text-white mb-6">
            Edit Information
          </h3>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Permitted editable field: Name */}
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              helperText="This name will be visible to skill exchange partners."
            />

            {/* Read-only field: Email */}
            <Input
              label="Email Address"
              name="email"
              value={profile?.email || ''}
              disabled
              helperText="Email is bound to your authentication and cannot be changed here."
            />

            {/* Permitted editable field: Status */}
            <Input
              as="select"
              label="Account Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'ACTIVE', label: 'Active (Available for swaps)' },
                { value: 'INACTIVE', label: 'Inactive (Paused)' },
              ]}
              helperText="Set to Inactive if you are taking a break from new swaps."
            />

            {/* Read-only user id */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white/50">
              <span className="text-white/30 block mb-1">User Identification:</span>
              <span>{profile?.userId || user?.userId}</span>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                loadingText="Saving Changes..."
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

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

export default Profile;

