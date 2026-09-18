import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import RatingStars from '../components/RatingStars';

export const Dashboard = () => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [sentSwaps, setSentSwaps] = useState([]);
  const [receivedSwaps, setReceivedSwaps] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [skillsMap, setSkillsMap] = useState({});

  useEffect(() => {
    if (!user?.userId) return;

    let isMounted = true;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel using the central Axios api instance
        const [
          skillsRes,
          offeredRes,
          wantedRes,
          sentSwapsRes,
          receivedSwapsRes,
          ratingsRes,
        ] = await Promise.allSettled([
          api.get('/skills'),
          api.get(`/user-skills/${user.userId}/offered`),
          api.get(`/user-skills/${user.userId}/wanted`),
          api.get('/swaps/sent'),
          api.get('/swaps/received'),
          api.get(`/ratings/user/${user.userId}`),
        ]);

        if (!isMounted) return;

        // Build skillId -> skillName dictionary
        const sMap = {};
        if (skillsRes.status === 'fulfilled' && skillsRes.value.data?.skills) {
          skillsRes.value.data.skills.forEach((s) => {
            sMap[s.skillId] = s.skillName;
          });
          setSkillsMap(sMap);
        }

        if (offeredRes.status === 'fulfilled' && offeredRes.value.data?.skills) {
          setOfferedSkills(offeredRes.value.data.skills);
        }

        if (wantedRes.status === 'fulfilled' && wantedRes.value.data?.skills) {
          setWantedSkills(wantedRes.value.data.skills);
        }

        if (sentSwapsRes.status === 'fulfilled' && sentSwapsRes.value.data?.requests) {
          setSentSwaps(sentSwapsRes.value.data.requests);
        }

        if (receivedSwapsRes.status === 'fulfilled' && receivedSwapsRes.value.data?.requests) {
          setReceivedSwaps(receivedSwapsRes.value.data.requests);
        }

        if (ratingsRes.status === 'fulfilled' && ratingsRes.value.data?.ratings) {
          setRatings(ratingsRes.value.data.ratings);
        }
      } catch (err) {
        console.error('Failed loading dashboard data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return <Loading fullScreen message="Loading your dashboard..." />;
  }

  // Calculate statistics from real data
  const pendingReceived = receivedSwaps.filter((s) => s.status === 'PENDING');
  const pendingSent = sentSwaps.filter((s) => s.status === 'PENDING');
  const acceptedSwaps = [
    ...receivedSwaps.filter((s) => s.status === 'ACCEPTED'),
    ...sentSwaps.filter((s) => s.status === 'ACCEPTED'),
  ];

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) /
          ratings.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      {/* Background glow orb */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* 1. WELCOME BANNER */}
      <div className="glass-panel p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/20 shadow-xl shadow-violet-950/40">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {user?.name || 'Swapper'}
              </span>
            </h1>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
              {user?.role || 'USER'}
            </span>
          </div>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            Here is your live SkillSwap exchange overview. Teach what you master, learn what you love.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/my-skills">
            <Button variant="primary" size="md">
              + Manage Skills
            </Button>
          </Link>
          <Link to="/swaps">
            <Button variant="secondary" size="md">
              View Swaps
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. REAL-TIME STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-6 border-violet-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-violet-400 tracking-wider">
              Teaching (Offer)
            </span>
            <span className="text-xl">🎓</span>
          </div>
          <p className="text-3xl md:text-4xl font-black text-white mt-3">
            {offeredSkills.length}
          </p>
          <p className="text-xs text-white/50 mt-1">Skills you can teach</p>
        </div>

        <div className="glass-panel p-6 border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
              Learning (Want)
            </span>
            <span className="text-xl">🎯</span>
          </div>
          <p className="text-3xl md:text-4xl font-black text-white mt-3">
            {wantedSkills.length}
          </p>
          <p className="text-xs text-white/50 mt-1">Skills you want to learn</p>
        </div>

        <div className="glass-panel p-6 border-fuchsia-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-fuchsia-400 tracking-wider">
              Pending Swaps
            </span>
            <span className="text-xl">⏳</span>
          </div>
          <p className="text-3xl md:text-4xl font-black text-white mt-3">
            {pendingReceived.length + pendingSent.length}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {pendingReceived.length} received, {pendingSent.length} sent
          </p>
        </div>

        <div className="glass-panel p-6 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Reputation
            </span>
            <span className="text-xl">⭐</span>
          </div>
          <p className="text-3xl md:text-4xl font-black text-white mt-3">
            {averageRating ? `${averageRating} / 5` : 'New'}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {ratings.length} total rating{ratings.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* 3. SKILLS PREVIEW: OFFERED VS WANTED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Offered Skills */}
        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎓</span>
                <span>What I Can Teach (Offer)</span>
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Skills you are offering to share with peers
              </p>
            </div>
            <Link to="/my-skills">
              <Button size="sm" variant="secondary">
                View All
              </Button>
            </Link>
          </div>

          {offeredSkills.length === 0 ? (
            <EmptyState
              title="You haven't offered any skills yet."
              description="Add skills you master to appear in matches and receive swap requests."
              actionText="Add Your First Skill"
              actionHref="/my-skills"
              className="my-2"
            />
          ) : (
            <div className="space-y-3">
              {offeredSkills.slice(0, 4).map((s) => (
                <div
                  key={s.userSkillId}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-white">
                      {skillsMap[s.skillId] || s.skillId}
                    </h4>
                    <p className="text-xs text-white/50">Level: {s.level}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    OFFER
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wanted Skills */}
        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎯</span>
                <span>What I Want to Learn (Want)</span>
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Skills you wish to learn from others
              </p>
            </div>
            <Link to="/my-skills">
              <Button size="sm" variant="secondary">
                View All
              </Button>
            </Link>
          </div>

          {wantedSkills.length === 0 ? (
            <EmptyState
              title="You haven't requested any skills yet."
              description="Specify what you're interested in learning to initiate swap requests."
              actionText="Find Skills to Learn"
              actionHref="/skills"
              className="my-2"
            />
          ) : (
            <div className="space-y-3">
              {wantedSkills.slice(0, 4).map((s) => (
                <div
                  key={s.userSkillId}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-white">
                      {skillsMap[s.skillId] || s.skillId}
                    </h4>
                    <p className="text-xs text-white/50">Desired Level: {s.level}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    WANT
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. RECENT SWAPS & SESSIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending / Active Swaps */}
        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>⇄</span>
              <span>Pending Swap Requests</span>
            </h3>
            <Link to="/swaps">
              <Button size="sm" variant="secondary">
                All Swaps
              </Button>
            </Link>
          </div>

          {pendingReceived.length === 0 && pendingSent.length === 0 ? (
            <EmptyState
              title="No pending swap requests"
              description="Browse skills or find peers to send your first swap request."
              actionText="Explore Skills"
              actionHref="/skills"
              className="my-2"
            />
          ) : (
            <div className="space-y-3">
              {pendingReceived.map((req) => (
                <div
                  key={req.requestId}
                  className="p-4 rounded-2xl bg-white/5 border border-amber-500/30 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-300">
                      ↙ Incoming Request
                    </span>
                    <p className="text-sm font-semibold text-white mt-1">
                      Exchange: {skillsMap[req.offeredSkillId] || 'Skill'} ⇄{' '}
                      {skillsMap[req.requestedSkillId] || 'Skill'}
                    </p>
                  </div>
                  <Link to="/swaps">
                    <Button size="sm" variant="primary">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}

              {pendingSent.map((req) => (
                <div
                  key={req.requestId}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs uppercase font-bold text-white/50">
                      ↗ Sent Request
                    </span>
                    <p className="text-sm font-semibold text-white mt-1">
                      Exchange: {skillsMap[req.offeredSkillId] || 'Skill'} ⇄{' '}
                      {skillsMap[req.requestedSkillId] || 'Skill'}
                    </p>
                  </div>
                  <span className="text-xs text-amber-400 font-medium">Awaiting response</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Ratings / Feedback */}
        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>⭐</span>
              <span>Recent Ratings & Reviews</span>
            </h3>
            <Link to="/ratings">
              <Button size="sm" variant="secondary">
                View All
              </Button>
            </Link>
          </div>

          {ratings.length === 0 ? (
            <EmptyState
              title="No ratings received yet."
              description="Complete learning sessions with peers to receive ratings and build your reputation."
              actionText="View Sessions"
              actionHref="/sessions"
              className="my-2"
            />
          ) : (
            <div className="space-y-3">
              {ratings.slice(0, 3).map((r) => (
                <div
                  key={r.ratingId}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <RatingStars value={Number(r.rating)} readOnly size="sm" />
                    <span className="text-xs text-white/40">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {r.review && (
                    <p className="text-sm text-white/80 italic">"{r.review}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

