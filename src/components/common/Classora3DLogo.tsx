import React, { useState } from 'react';

interface Classora3DLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  interactive?: boolean;
}

export const Classora3DLogo: React.FC<Classora3DLogoProps> = ({
  size = 'md',
  showText = false,
  interactive = true
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({
      x: -(y / (rect.height / 2)) * 20,
      y: (x / (rect.width / 2)) * 20
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const sizeStyles = {
    sm: { box: 'w-8 h-8', icon: 'text-base', text: 'text-base' },
    md: { box: 'w-11 h-11', icon: 'text-xl', text: 'text-lg' },
    lg: { box: 'w-16 h-16', icon: 'text-3xl', text: 'text-2xl' },
    xl: { box: 'w-24 h-24', icon: 'text-5xl', text: 'text-4xl' },
  }[size];

  return (
    <div className="flex items-center space-x-3 select-none">
      {/* 3D Perspective Box */}
      <div
        className={`relative ${sizeStyles.box} perspective-600 cursor-pointer`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-full h-full rounded-2xl relative transition-transform duration-150 ease-out shadow-lg"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'scale(1.08)' : 'scale(1)'}`,
          }}
        >
          {/* Glowing Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* Front Face */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 border border-blue-400/40 p-1 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Holographic light sweep */}
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-[shimmer_3s_infinite]" />

            {/* 3D Isometric Emblem */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_4px_12px_rgba(59,130,246,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="cLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
                <linearGradient id="cRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="cCore" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* 3D Isometric Academic Cube / Portal */}
              {/* Top diamond */}
              <path d="M50 16 L80 34 L50 52 L20 34 Z" fill="url(#cTop)" />
              {/* Left face */}
              <path d="M20 34 L50 52 L50 86 L20 68 Z" fill="url(#cLeft)" />
              {/* Right face */}
              <path d="M50 52 L80 34 L80 68 L50 86 Z" fill="url(#cRight)" />

              {/* Central Floating Sparkle/Portal Node */}
              <circle cx="50" cy="52" r="7" fill="url(#cCore)" className="animate-ping" opacity="0.4" />
              <circle cx="50" cy="52" r="5" fill="#FFFFFF" />

              {/* Academic Mortarboard Cap Lines */}
              <path d="M50 24 L72 37 L50 48 L28 37 Z" fill="white" fillOpacity="0.3" />
            </svg>
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className={`font-black text-white tracking-tight leading-none ${sizeStyles.text}`}>
              Classora
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-widest">
              3D OS
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Next-Gen Academic Tracker
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Official Google Multi-Color SVG Icon
 */
export const GoogleIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = 'w-4 h-4',
  size 
}) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    width={size || 20}
    height={size || 20}
    style={{ maxWidth: '100%', flexShrink: 0 }}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);
