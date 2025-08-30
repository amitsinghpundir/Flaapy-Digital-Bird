import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
      <h2 className="text-4xl sm:text-6xl font-bold text-red-500 mb-4" style={{ textShadow: '0 0 20px #ef4444' }}>
        MISSION FAILED
      </h2>
      <div className="p-8 bg-gray-800 border-2 border-cyan-400 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)] text-center">
        <p className="text-xl text-gray-300 mb-2">FINAL SCORE</p>
        <p className="text-6xl sm:text-7xl font-bold text-lime-400 mb-6" style={{ textShadow: '0 0 15px #a3e635' }}>
          {score}
        </p>
        <button 
          onClick={onRestart} 
          className="px-8 py-4 text-2xl font-bold text-gray-900 bg-lime-400 border-2 border-lime-300 rounded-md shadow-[0_0_20px_rgba(163,230,53,0.8)] hover:bg-lime-300 hover:scale-105 transition-transform"
        >
          RESTART
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;