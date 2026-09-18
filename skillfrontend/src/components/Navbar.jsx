import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/15 border border-white/20 shadow-lg shadow-white/5'
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/15 border border-white/20'
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-3 group"
            onClick={closeMobile}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                <span className="text-xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  S
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-fuchsia-300 transition-colors">
                Skill<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Swap</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-white/40 -mt-1 font-medium">
                Exchange Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/skills" className={navLinkClass}>
                Browse Skills
              </NavLink>
              <NavLink to="/my-skills" className={navLinkClass}>
                My Skills
              </NavLink>
              <NavLink to="/matches" className={navLinkClass}>
                Matches
              </NavLink>
              <NavLink to="/swaps" className={navLinkClass}>
                Swaps
              </NavLink>
              <NavLink to="/sessions" className={navLinkClass}>
                Sessions
              </NavLink>
              <NavLink to="/ratings" className={navLinkClass}>
                Ratings
              </NavLink>
              <NavLink to="/files" className={navLinkClass}>
                Files
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'bg-fuchsia-600/30 text-fuchsia-300 border-fuchsia-500/50'
                        : 'text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/10'
                    }`
                  }
                >
                  ⚡ Admin
                </NavLink>
              )}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/#how-it-works" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link to="/#categories" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                Categories
              </Link>
              <Link to="/#why-us" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                Why SkillSwap
              </Link>
            </nav>
          )}

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/30">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white leading-tight truncate max-w-[100px]">
                      {user.name || 'User'}
                    </p>
                    <p className="text-[10px] text-white/50 uppercase font-mono">
                      {user.role || 'USER'}
                    </p>
                  </div>
                </Link>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white/70 hover:text-rose-400"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Start Swapping
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 z-50 p-6 overflow-y-auto animate-fade-in flex flex-col justify-between">
          <div className="space-y-2">
            {user ? (
              <>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </div>
                </div>

                <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={closeMobile}>
                  📊 Dashboard
                </NavLink>
                <NavLink to="/skills" className={mobileNavLinkClass} onClick={closeMobile}>
                  🔍 Browse Skills
                </NavLink>
                <NavLink to="/my-skills" className={mobileNavLinkClass} onClick={closeMobile}>
                  🎯 My Skills
                </NavLink>
                <NavLink to="/matches" className={mobileNavLinkClass} onClick={closeMobile}>
                  ✨ Matches
                </NavLink>
                <NavLink to="/swaps" className={mobileNavLinkClass} onClick={closeMobile}>
                  ⇄ Swaps
                </NavLink>
                <NavLink to="/sessions" className={mobileNavLinkClass} onClick={closeMobile}>
                  📅 Sessions
                </NavLink>
                <NavLink to="/ratings" className={mobileNavLinkClass} onClick={closeMobile}>
                  ⭐ Ratings
                </NavLink>
                <NavLink to="/files" className={mobileNavLinkClass} onClick={closeMobile}>
                  📁 Files
                </NavLink>
                <NavLink to="/profile" className={mobileNavLinkClass} onClick={closeMobile}>
                  👤 Profile
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20"
                    onClick={closeMobile}
                  >
                    ⚡ Admin Panel
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/#how-it-works"
                  className="block px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5"
                  onClick={closeMobile}
                >
                  How It Works
                </Link>
                <Link
                  to="/#categories"
                  className="block px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5"
                  onClick={closeMobile}
                >
                  Categories
                </Link>
                <Link
                  to="/#why-us"
                  className="block px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5"
                  onClick={closeMobile}
                >
                  Why SkillSwap
                </Link>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            {user ? (
              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            ) : (
              <>
                <Link to="/login" className="block" onClick={closeMobile}>
                  <Button variant="secondary" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="block" onClick={closeMobile}>
                  <Button variant="primary" size="md" className="w-full">
                    Start Swapping
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
