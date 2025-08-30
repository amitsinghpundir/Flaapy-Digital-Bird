
import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import SettingsModal from './components/SettingsModal';
import { GameState, GameSettings } from './types';
import Background from './components/Background';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [score, setScore] = useState(0);
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicVolume: 0.5,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStart = useCallback(() => {
    setScore(0);
    setGameState(GameState.Playing);
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.GameOver);
  }, []);

  const handleSettingsChange = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {gameState !== GameState.Playing && <Background />}
      
      {gameState === GameState.Start && (
        <StartScreen onStart={handleStart} onOpenSettings={() => setIsSettingsOpen(true)} />
      )}

      {gameState === GameState.Playing && (
        <Game 
          onGameOver={handleGameOver} 
          soundEnabled={settings.soundEnabled} 
          musicVolume={settings.musicVolume}
        />
      )}

      {gameState === GameState.GameOver && (
        <GameOverScreen score={score} onRestart={handleStart} />
      )}
      
      {isSettingsOpen && (
        <SettingsModal 
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
