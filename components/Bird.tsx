
import React, { useState, useEffect, useRef } from 'react';
import { BIRD_WIDTH, BIRD_HEIGHT, BIRD_START_X } from '../constants';

interface BirdProps {
  y: number;
  velocity: number;
  isInvincible: boolean;
  isKnockedBack: boolean;
  score: number;
}

const Bird: React.FC<BirdProps> = ({ y, velocity, isInvincible, isKnockedBack, score }) => {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    // Trigger celebration on score increase, but not for the initial score 0
    if (score > 0 && score > prevScoreRef.current) {
      setIsCelebrating(true);
      const timer = setTimeout(() => setIsCelebrating(false), 300); // Duration of the bounce animation
      return () => clearTimeout(timer);
    }
    prevScoreRef.current = score;
  }, [score]);

  const rotation = Math.min(Math.max(-25, velocity * 3), 90);
  const invincibleClass = isInvincible ? 'animate-pulse-opacity' : '';
  
  const knockbackGlowClass = isKnockedBack ? 'knockback-glow' : '';

  const bodyColor = isKnockedBack ? 'bg-red-500' : 'bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)]';
  const cockpitColor = isKnockedBack ? 'bg-red-400 border-red-300' : 'bg-fuchsia-500 border-fuchsia-300 shadow-[0_0_8px_rgba(212,59,212,0.8)]';
  const engineGlowColor = isKnockedBack ? 'bg-red-600' : 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]';

  // Calculate translations for effects to ensure they compose correctly
  const knockbackX = isKnockedBack ? -20 : 0; // in pixels
  const celebrationY = isCelebrating ? -12 : 0; // in pixels, for the bounce

  return (
    <>
      <div
        className={`absolute transition-transform duration-300 ease-in-out ${invincibleClass} ${knockbackGlowClass}`}
        style={{
          width: `${BIRD_WIDTH}px`,
          height: `${BIRD_HEIGHT}px`,
          left: `${BIRD_START_X}px`,
          top: `${y}px`,
          transform: `translateX(${knockbackX}px) translateY(${celebrationY}px) rotate(${rotation}deg)`,
        }}
      >
        <div className="relative w-full h-full">
          {/* Main Body */}
          <div className={`absolute top-[15px] left-0 w-[50px] h-[15px] rounded-sm -skew-x-12 ${bodyColor}`}></div>
          {/* Cockpit */}
          <div className={`absolute top-[10px] left-[10px] w-[25px] h-[10px] rounded-t-full border-t-2 ${cockpitColor}`}></div>
           {/* Engine Glow */}
          <div className={`absolute top-[15px] left-[-15px] w-[20px] h-[15px] rounded-r-full blur-sm ${engineGlowColor}`}></div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-opacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-opacity {
          animation: pulse-opacity 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .knockback-glow {
          filter: drop-shadow(0 0 6px rgb(239 68 68 / 0.8)); /* Tailwind red-500 */
        }
      `}</style>
    </>
  );
};

export default Bird;
