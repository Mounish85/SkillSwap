import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 relative text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="glass-panel p-10 md:p-16 max-w-lg mx-auto shadow-2xl border-white/20 space-y-6">
        <div className="text-7xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Destination Uncharted
        </h1>

        <p className="text-white/60 text-sm md:text-base leading-relaxed">
          The skill swap route you navigated to does not exist or has been relocated to another dimension.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={user ? '/dashboard' : '/'}>
            <Button variant="primary" size="md">
              {user ? 'Return to Dashboard' : 'Back to Home'}
            </Button>
          </Link>
          <Link to="/skills">
            <Button variant="secondary" size="md">
              Browse Skills
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

