import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_LIVES, INITIAL_GAME_SPEED } from '../constants';

interface HudProps {
  score: number;
  lives: number;
  gameSpeed: number;
}

const LifeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <div className={`w-8 h-8 transition-opacity ${active ? 'opacity-100' : 'opacity-20'}`}>
    <div className="relative w-full h-full">
      <div className="absolute top-[7px] left-0 w-[25px] h-[8px] bg-cyan-400 rounded-sm shadow-[0_0_4px_rgba(0,255,255,0.8)] -skew-x-12"></div>
      <div className="absolute top-[4px] left-[5px] w-[13px] h-[5px] bg-fuchsia-500 rounded-t-full border-t border-fuchsia-300 shadow-[0_0_4px_rgba(212,59,212,0.8)]"></div>
    </div>
  </div>
);

const Hud: React.FC<HudProps> = ({ score, lives, gameSpeed }) => {
  const [showSpeedUp, setShowSpeedUp] = useState(false);
  const [scoreChanged, setScoreChanged] = useState(false);
  
  const prevGameSpeedRef = useRef(INITIAL_GAME_SPEED);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    // Don't show on initial render, only on subsequent increases
    if (gameSpeed > prevGameSpeedRef.current) {
      setShowSpeedUp(true);
      const timer = setTimeout(() => setShowSpeedUp(false), 1200);
      prevGameSpeedRef.current = gameSpeed;
      return () => clearTimeout(timer);
    }
  }, [gameSpeed]);

  useEffect(() => {
    // Animate score on increase, but not for the initial 0
    if (score > prevScoreRef.current) {
        setScoreChanged(true);
        const timer = setTimeout(() => setScoreChanged(false), 200); // Animation duration
        prevScoreRef.current = score;
        return () => clearTimeout(timer);
    }
    // Update ref even if score doesn't increase (e.g., for resets)
    prevScoreRef.current = score;
  }, [score]);


  return (
    <>
      <div className="absolute top-4 left-0 right-0 z-10 pointer-events-none">
        {/* Lives Display (Top Left) */}
        <div className="absolute top-0 left-4 flex items-center space-x-2">
          {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
            <LifeIcon key={i} active={i < lives} />
          ))}
        </div>
        
        {/* Score Display (Centered) */}
        <div className="flex justify-center">
            <div 
                className={`text-5xl sm:text-6xl font-bold text-cyan-300 transition-transform duration-200 ${scoreChanged ? 'animate-score-pop' : ''}`}
                style={{ textShadow: '0 0 15px #22d3ee' }}
            >
                {score}
            </div>
        </div>
      </div>

      {showSpeedUp && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <h2 className="text-4xl sm:text-5xl font-bold text-lime-400 animate-fade-out-up" style={{ textShadow: '0 0 15px #a3e635' }}>
                SPEED UP!
            </h2>
        </div>
      )}

      <style>{`
        @keyframes fade-out-up {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) scale(1.2); }
        }
        .animate-fade-out-up {
            animation: fade-out-up 1.2s ease-out forwards;
        }
        @keyframes score-pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.25); }
            100% { transform: scale(1); }
        }
        .animate-score-pop {
            animation: score-pop 0.2s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default Hud;