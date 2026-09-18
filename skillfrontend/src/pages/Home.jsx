import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export const Home = () => {
  const { user } = useAuth();

  const categories = [
    { name: 'Technology & Code', icon: '💻', desc: 'React, Python, Cloud, AI & Web Dev' },
    { name: 'Creative Arts & Design', icon: '🎨', desc: 'UI/UX, Figma, 3D Modeling & Illustration' },
    { name: 'Languages & Culture', icon: '🌍', desc: 'Spanish, Japanese, French & Conversation' },
    { name: 'Music & Audio', icon: '🎵', desc: 'Guitar, Piano, Mixing & Vocal Production' },
    { name: 'Business & Growth', icon: '📈', desc: 'Marketing, Product Strategy & Entrepreneurship' },
    { name: 'Health & Wellness', icon: '🧘', desc: 'Yoga, Calisthenics & Mindful Living' },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Offer a Skill',
      desc: 'List what you know and love doing—from coding to cooking to calligraphy.',
      color: 'from-violet-500 to-indigo-500',
    },
    {
      num: '02',
      title: 'Find a Match',
      desc: 'Discover peers eager to learn your expertise who hold the skills you need.',
      color: 'from-fuchsia-500 to-pink-500',
    },
    {
      num: '03',
      title: 'Send a Swap Request',
      desc: 'Propose a direct exchange: specify your offering and your requested learning.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      num: '04',
      title: 'Complete a Session',
      desc: 'Schedule and meet online to teach, share knowledge, and learn collaboratively.',
      color: 'from-pink-500 to-orange-500',
    },
    {
      num: '05',
      title: 'Rate the Experience',
      desc: 'Leave honest ratings and reviews to build community reputation and trust.',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const whyChooseUs = [
    {
      title: 'Zero Currency Required',
      desc: 'Skill is the only currency. Everyone has something valuable to teach and something exciting to learn.',
      icon: '💎',
    },
    {
      title: 'Mutual Motivation',
      desc: 'Because both parties are teaching and learning simultaneously, engagement and commitment remain sky-high.',
      icon: '🤝',
    },
    {
      title: 'Deep Community Connections',
      desc: 'Form lasting friendships and professional networks across diverse domains around the world.',
      icon: '🌐',
    },
    {
      title: 'Real-Time Verification',
      desc: 'Integrated session tracking and peer ratings ensure high accountability and trustworthy knowledge sharing.',
      icon: '🛡️',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-80 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 left-1/3 w-[30rem] h-[30rem] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-xs md:text-sm text-fuchsia-300 mb-8 shadow-lg shadow-violet-950/40 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping"></span>
          <span>The Next-Gen Peer-to-Peer Knowledge Economy</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] mb-8">
          Exchange Skills.{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Grow Together.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-white/70 font-normal leading-relaxed mb-10">
          Share what you know, learn what you love, and connect with people who can help you grow.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link to={user ? '/dashboard' : '/register'} className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto">
              {user ? 'Go to Dashboard' : 'Start Swapping'}
            </Button>
          </Link>
          <Link to="/skills" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Explore Skills
            </Button>
          </Link>
        </div>

        {/* Hero Stats / Trust metrics */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              100%
            </p>
            <p className="text-xs text-white/60 mt-1 uppercase font-semibold">Free Peer Learning</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              1:1
            </p>
            <p className="text-xs text-white/60 mt-1 uppercase font-semibold">Direct Skill Swaps</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Live
            </p>
            <p className="text-xs text-white/60 mt-1 uppercase font-semibold">Session Scheduling</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              Verified
            </p>
            <p className="text-xs text-white/60 mt-1 uppercase font-semibold">Participant Ratings</p>
          </div>
        </div>
      </section>

      {/* 2 & 5. SIMPLE EXCHANGE WORKFLOW */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-violet-400 mb-3">
            Simple Exchange Workflow
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">
            How SkillSwap Works
          </h3>
          <p className="mt-4 text-base md:text-lg text-white/60 leading-relaxed">
            No money changing hands. Just genuine exchange of talent, passion, and reciprocal mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.num}
              className="glass-panel p-6 flex flex-col justify-between hover:border-white/40 transition-all duration-300 relative group"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white font-black text-lg mb-6 shadow-lg shadow-violet-950/50 group-hover:scale-110 transition-transform`}
                >
                  {step.num}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-xs md:text-sm text-white/65 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < 4 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-white/30 text-xl font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED SKILL CATEGORIES */}
      <section id="categories" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-fuchsia-400 mb-3">
            Diversity of Talents
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">
            Explore Skill Domains
          </h3>
          <p className="mt-4 text-base md:text-lg text-white/60 leading-relaxed">
            From technical engineering to melodic arts, find someone ready to swap skills with you today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="glass-panel p-8 hover:border-white/30 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-fuchsia-300 transition-colors">
                {cat.name}
              </h4>
              <p className="text-sm text-white/60 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/skills">
            <Button variant="secondary" size="md">
              View All Available Skills →
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. WHY SKILLSWAP */}
      <section id="why-us" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-cyan-400 mb-3">
            Empowered Learning
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">
            Why Choose SkillSwap?
          </h3>
          <p className="mt-4 text-base md:text-lg text-white/60 leading-relaxed">
            Traditional learning costs money and lacks personal accountability. SkillSwap changes that.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="glass-panel p-8 flex items-start gap-5 hover:border-white/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm md:text-base text-white/65 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative glass-panel p-10 md:p-16 text-center overflow-hidden border border-white/30 shadow-2xl shadow-violet-950/50">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-30 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-30 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Ready to Expand Your Horizon?
            </h3>
            <p className="text-white/75 text-base md:text-lg leading-relaxed">
              Join students, developers, designers, musicians, and creators who swap knowledge every single day.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={user ? '/dashboard' : '/register'}>
                <Button size="lg" variant="primary">
                  {user ? 'Open Dashboard' : 'Join SkillSwap Free'}
                </Button>
              </Link>
              <Link to="/skills">
                <Button size="lg" variant="secondary">
                  Browse Skills Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

