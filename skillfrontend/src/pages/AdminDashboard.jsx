import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [skillsCount, setSkillsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/skills');
        if (res.data?.skills) {
          setSkillsCount(res.data.skills.length);
        }
      } catch (err) {
        console.error('Failed loading admin statistics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return <Loading fullScreen message="Loading administrator hub..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 right-10 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Admin Welcome Header */}
      <div className="glass-panel p-8 md:p-10 border-fuchsia-500/40 bg-gradient-to-r from-fuchsia-950/40 via-slate-900/50 to-violet-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 mb-3">
            <span>⚡ Administrator Console</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Platform Administration
          </h1>
          <p className="text-white/60 text-sm mt-1 max-w-xl">
            Manage global catalog definitions, oversee platform data pipelines, and verify database integrity.
          </p>
        </div>

        <Link to="/admin/skills">
          <Button variant="primary" size="lg">
            ⚡ Manage Skill Catalog
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-fuchsia-500/30">
          <div className="flex items-center justify-between text-fuchsia-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">
              Total Global Skills
            </span>
            <span className="text-xl">📚</span>
          </div>
          <p className="text-3xl md:text-4xl font-black text-white">{skillsCount}</p>
          <p className="text-xs text-white/50 mt-1">Available for user exchange</p>
        </div>

        <div className="glass-panel p-6 border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">
              Database Provider
            </span>
            <span className="text-xl">📊</span>
          </div>
          <p className="text-2xl font-bold text-white">Google Sheets</p>
          <p className="text-xs text-white/50 mt-1">Syncing across 7 database sheets</p>
        </div>

        <div className="glass-panel p-6 border-cyan-500/30">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">
              Cloud Storage
            </span>
            <span className="text-xl">☁️</span>
          </div>
          <p className="text-2xl font-bold text-white">Google Drive</p>
          <p className="text-xs text-white/50 mt-1">Authenticated via Service OAuth</p>
        </div>
      </div>

      {/* Admin Action Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 space-y-4 hover:border-fuchsia-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 flex items-center justify-center text-2xl">
            ✏️
          </div>
          <h3 className="text-xl font-bold text-white">
            Skill Catalog & Taxonomy
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Create new skill taxonomy categories, edit existing titles, or prune outdated skills from the global directory.
          </p>
          <div className="pt-2">
            <Link to="/admin/skills">
              <Button size="sm" variant="primary">
                Open Skill Management →
              </Button>
            </Link>
          </div>
        </div>

        <div className="glass-panel p-8 space-y-4 hover:border-violet-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center text-2xl">
            🛡️
          </div>
          <h3 className="text-xl font-bold text-white">
            Role-Based Access Control
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Your current account holds role <code className="text-fuchsia-300 font-mono text-xs">{user?.role}</code>. All administrative mutations are checked and enforced strictly on the backend.
          </p>
          <div className="pt-2">
            <Link to="/profile">
              <Button size="sm" variant="secondary">
                View Account Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

