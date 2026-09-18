import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950/80 backdrop-blur-xl mt-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-lg font-black text-white">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                Skill<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Swap</span>
              </span>
            </div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              A peer-to-peer skill exchange platform empowering people to learn and teach freely without money. Exchange skills, expand your horizon, and grow together.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="text-xs uppercase font-bold tracking-wider text-white/50 mb-4">
              Platform
            </h5>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/skills" className="hover:text-white transition-colors">
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link to="/my-skills" className="hover:text-white transition-colors">
                  Teach & Learn
                </Link>
              </li>
              <li>
                <Link to="/swaps" className="hover:text-white transition-colors">
                  Swap Requests
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="hover:text-white transition-colors">
                  Live Sessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Exchange Philosophy */}
          <div>
            <h5 className="text-xs uppercase font-bold tracking-wider text-white/50 mb-4">
              Workflow
            </h5>
            <div className="space-y-2 text-xs text-white/60">
              <p>1. Offer a skill you master</p>
              <p>2. Request a skill you desire</p>
              <p>3. Agree on a swap exchange</p>
              <p>4. Complete & review session</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} SkillSwap Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 text-white/50">
            Powered by Google Sheets & Google Drive
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

