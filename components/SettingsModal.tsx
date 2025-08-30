
import React from 'react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onSettingsChange: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSettingsChange, onClose }) => {
  return (
    <>
      <div 
        className="absolute inset-0 z-30 bg-black bg-opacity-70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-md animate-slide-in-up">
        <div className="p-8 bg-gray-800 border-2 border-cyan-400 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)] text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px #22d3ee' }}>
              SETTINGS
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-6">
            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="sound-toggle" className="text-lg text-gray-300">Sound Effects</label>
              <label htmlFor="sound-toggle" className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="sound-toggle" 
                  className="sr-only peer" 
                  checked={settings.soundEnabled}
                  onChange={(e) => onSettingsChange({ soundEnabled: e.target.checked })}
                />
                <div className="w-14 h-7 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Music Volume Slider */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="music-volume" className="text-lg text-gray-300">Music Volume</label>
              <input
                id="music-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.musicVolume}
                onChange={(e) => onSettingsChange({ musicVolume: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
                onClick={onClose}
                className="px-6 py-2 font-bold text-gray-900 bg-lime-400 border-2 border-lime-300 rounded-md shadow-[0_0_15px_rgba(163,230,53,0.7)] hover:bg-lime-300 hover:scale-105 transition-transform"
            >
                CLOSE
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-in-up {
            from { transform: translate(-50%, calc(-50% + 20px)); opacity: 0; }
            to { transform: translate(-50%, -50%); opacity: 1; }
        }
        .animate-slide-in-up {
            animation: slide-in-up 0.3s ease-out forwards;
        }
        
        /* Custom Slider Styles */
        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #a3e635; /* lime-400 */
            border: 2px solid #bef264; /* lime-300 */
            border-radius: 50%;
            cursor: pointer;
            margin-top: -7px; /* Center thumb */
            box-shadow: 0 0 10px rgba(163, 230, 53, 0.8);
        }
        .range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #a3e635;
            border: 2px solid #bef264;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(163, 230, 53, 0.8);
        }
      `}</style>
    </>
  );
};

export default SettingsModal;
