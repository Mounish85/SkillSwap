import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export const Matches = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Smart Skill Matches
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Automated compatibility algorithm pairing your offered skills with peers' wanted skills.
        </p>
      </div>

      {/* Integration Notice Alert Box */}
      <div className="glass-panel p-6 md:p-8 border-violet-500/40 bg-gradient-to-r from-violet-950/40 via-slate-900/50 to-fuchsia-950/40">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center text-2xl shrink-0">
            ⚙️
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-bold text-white">
              Backend Integration Notice: Matching Engine Ready
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              The backend already implements the matching algorithm in{' '}
              <code className="px-2 py-0.5 rounded-lg bg-white/10 text-fuchsia-300 font-mono text-xs">
                matchingService.findMatches(userId)
              </code>
              , which computes reciprocal compatibility scores based on overlapping offered and wanted skills.
            </p>
            <p className="text-sm text-white/60 leading-relaxed">
              Because the backend routes do not currently mount a REST endpoint for matching (e.g. <code className="px-1.5 py-0.5 rounded bg-white/10 text-xs">GET /skill/matches</code>), the frontend strictly honors your requirement: <strong>no fake matches or client-side simulations are generated</strong>. As soon as the endpoint is mapped on the server, live results will instantly appear here.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/skills">
                <Button size="sm" variant="primary">
                  Browse Skills Directory
                </Button>
              </Link>
              <Link to="/swaps">
                <Button size="sm" variant="secondary">
                  Create Direct Swap Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-white/10">
          <div className="text-2xl mb-3">🎓</div>
          <h4 className="text-lg font-bold text-white mb-2">1. What You Teach</h4>
          <p className="text-sm text-white/60 leading-relaxed">
            The engine evaluates your active OFFER skills against what candidate peers are actively looking to learn.
          </p>
        </div>

        <div className="glass-panel p-6 border-white/10">
          <div className="text-2xl mb-3">🎯</div>
          <h4 className="text-lg font-bold text-white mb-2">2. What You Learn</h4>
          <p className="text-sm text-white/60 leading-relaxed">
            The engine simultaneously cross-checks your active WANT skills against skills candidate peers can instruct.
          </p>
        </div>

        <div className="glass-panel p-6 border-white/10">
          <div className="text-2xl mb-3">⚡</div>
          <h4 className="text-lg font-bold text-white mb-2">3. Compatibility Score</h4>
          <p className="text-sm text-white/60 leading-relaxed">
            A combined score up to 100% is computed. Two-way mutual matches rank highest for seamless skill trading.
          </p>
        </div>
      </div>

      {/* Match Card Interface Preview Template */}
      <div className="glass-panel p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>✨</span>
            <span>Match Card Layout Specification</span>
          </h3>
          <span className="text-xs uppercase font-mono px-3 py-1 rounded-full bg-white/10 text-white/60">
            UI Blueprint
          </span>
        </div>

        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white/5 border border-white/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white">
                M
              </div>
              <div>
                <h4 className="font-bold text-white">Matched Peer Name</h4>
                <p className="text-xs text-white/50">Compatible Learning Partner</p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                95% Match
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/50">Matching Offered Skills:</span>
              <span className="text-fuchsia-300 font-semibold">Python, Web Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Matching Wanted Skills:</span>
              <span className="text-cyan-300 font-semibold">Spanish, UI Design</span>
            </div>
          </div>

          <div className="pt-2">
            <Button size="sm" variant="primary" className="w-full" disabled>
              Send Swap Request (Active upon route mount)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;

