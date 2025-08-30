import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);


const StartScreen: React.FC<StartScreenProps> = ({ onStart, onOpenSettings }) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <button 
        onClick={onOpenSettings} 
        className="absolute top-5 right-5 text-gray-400 hover:text-cyan-400 transition-colors"
        aria-label="Open settings"
      >
        <SettingsIcon />
      </button>

      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-cyan-400 animate-pulse" style={{ textShadow: '0 0 20px #22d3ee' }}>
          FLAPPY
        </h1>
        <h1 className="mb-8 text-6xl sm:text-8xl font-bold text-fuchsia-500 animate-pulse" style={{ textShadow: '0 0 20px #d946ef' }}>
          CYBER BIRD
        </h1>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 text-2xl font-bold text-gray-900 bg-lime-400 border-2 border-lime-300 rounded-md shadow-[0_0_20px_rgba(163,230,53,0.8)] hover:bg-lime-300 hover:scale-105 transition-transform"
      >
        START MISSION
      </button>

      <div className="absolute bottom-10 text-center text-gray-400 w-full">
         <p className="text-lg text-gray-300 mb-4">USE TAP, CLICK, OR SPACEBAR TO BOOST</p>
        <div className="hidden sm:flex items-end justify-center space-x-12">
            {/* Mouse Click Demo */}
            <div className="flex flex-col items-center">
                <div className="relative w-12 h-20 bg-gray-700 border-2 border-gray-500 rounded-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-500"></div>
                    <div className="absolute top-0 left-0 w-1/2 h-8 bg-gray-600 rounded-tl-full animate-mouse-click"></div>
                </div>
            </div>
            {/* Spacebar Demo */}
            <div className="flex flex-col items-center">
                <div className="w-48 h-12 bg-gray-700 border-2 border-gray-500 rounded-lg flex items-center justify-center relative animate-spacebar-press"
                     style={{ boxShadow: '0 4px 0 #4a5568' }}>
                    <span className="text-gray-300 text-lg font-bold tracking-widest">SPACE</span>
                </div>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes spacebar-press {
            0%, 100% { transform: translateY(0); box-shadow: 0 4px 0 #4a5568; }
            50% { transform: translateY(2px); box-shadow: 0 2px 0 #4a5568; }
        }
        .animate-spacebar-press {
            animation: spacebar-press 1.5s ease-in-out infinite;
        }
        @keyframes mouse-click {
            0%, 40%, 100% { background-color: #4b5563; } /* gray-600 */
            50%, 90% { background-color: #374151; } /* gray-700 */
        }
        .animate-mouse-click {
            animation: mouse-click 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;