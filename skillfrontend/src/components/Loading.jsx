import React from 'react';

export const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6">
      <div className="relative w-16 h-16">
        {/* Animated glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 backdrop-blur-md animate-pulse"></div>
      </div>
      <p className="text-white/70 text-sm font-medium tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;

