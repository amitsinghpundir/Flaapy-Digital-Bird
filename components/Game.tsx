import React, { useState, useEffect, useCallback, useRef } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import Hud from './Hud';
import Background from './Background';
import { Pipe as PipeType } from '../types';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  BIRD_START_X,
  BIRD_START_Y,
  GRAVITY,
  TAP_JUMP_STRENGTH,
  DESKTOP_JUMP_STRENGTH,
  PIPE_SPACING,
  PIPE_WIDTH,
  INITIAL_GAME_SPEED,
  SPEED_INCREASE_INTERVAL,
  SPEED_INCREASE_AMOUNT,
  INITIAL_LIVES,
  BIRD_HEIGHT,
  BIRD_WIDTH,
  MAX_FALL_SPEED,
  PIPE_GAP,
  EASY_PIPE_GAP,
  EASY_MODE_SCORE_THRESHOLD
} from '../constants';

// --- Sound Effects ---
let audioContext: AudioContext | null = null;
let isSoundEnabled = true; // Module-level flag

const initializeAudioContext = () => {
  if (!audioContext && (window.AudioContext || (window as any).webkitAudioContext)) {
    try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch(e) {
        console.error("Web Audio API is not supported in this browser");
    }
  }
};

const playJumpSound = () => {
  if (!isSoundEnabled) return;
  initializeAudioContext();
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
};

const playHitSound = () => {
  if (!isSoundEnabled || !audioContext) return;

  // Static noise for glitch effect
  const bufferSize = audioContext.sampleRate * 0.2;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
  }
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;
  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(0.15, audioContext.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
  noiseSource.connect(noiseGain);
  noiseGain.connect(audioContext.destination);
  noiseSource.start();

  // Low-frequency buzz for impact
  const buzzOscillator = audioContext.createOscillator();
  const buzzGain = audioContext.createGain();
  buzzOscillator.type = 'sawtooth';
  buzzOscillator.frequency.setValueAtTime(120, audioContext.currentTime);
  buzzOscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);
  buzzGain.gain.setValueAtTime(0.3, audioContext.currentTime);
  buzzGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
  buzzOscillator.connect(buzzGain);
  buzzGain.connect(audioContext.destination);
  buzzOscillator.start();
  buzzOscillator.stop(audioContext.currentTime + 0.2);
};

const playScoreSound = () => {
    if (!isSoundEnabled || !audioContext) return;
    const now = audioContext.currentTime;

    // First note
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // Second, higher note shortly after
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now + 0.08);
    gain2.gain.setValueAtTime(0.3, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.18);
};
// --- End Sound Effects ---

// --- Background Music ---
let musicInterval: number | null = null;
let musicGainNode: GainNode | null = null;
let snareBuffer: AudioBuffer | null = null;

const createSnareBuffer = (context: AudioContext) => {
    if (snareBuffer) return snareBuffer;
    const bufferSize = context.sampleRate;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    snareBuffer = buffer;
    return snareBuffer;
}

const startMusic = (volume: number) => {
  if (musicInterval || !audioContext) return;
  
  // 1. Setup global gain
  musicGainNode = audioContext.createGain();
  musicGainNode.gain.setValueAtTime(0, audioContext.currentTime);
  musicGainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 3); // Fade in
  musicGainNode.connect(audioContext.destination);

  // 2. Sound Generators
  const playKick = (time: number) => {
      if (!audioContext || !musicGainNode) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(musicGainNode);
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
      gain.gain.setValueAtTime(1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.start(time);
      osc.stop(time + 0.15);
  };
  
  const playSnare = (time: number) => {
      if (!audioContext || !musicGainNode) return;
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = createSnareBuffer(audioContext);
      const filter = audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      const gain = audioContext.createGain();
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(musicGainNode);
      gain.gain.setValueAtTime(0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      noiseSource.start(time);
      noiseSource.stop(time + 0.15);
  };
  
  const playNote = (time: number, freq: number, duration: number, wave: OscillatorType, noteGain: number) => {
      if (!audioContext || !musicGainNode) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(musicGainNode);
      osc.type = wave;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(noteGain, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.9);
      osc.start(time);
      osc.stop(time + duration);
  };

  // 3. Sequencer Logic
  const tempo = 130;
  const secondsPerBeat = 60.0 / tempo;
  const sixteenthNoteTime = secondsPerBeat / 4;
  let current16thNote = 0;
  let nextNoteTime = audioContext.currentTime + 0.1;

  // Note Frequencies
  const C3=130.81, E3=164.81, F3=174.61, G3=196.00, A3=220.00, B3=246.94;
  const C4=261.63, D4=293.66, E4=329.63, G4=392.00;

  const bassSeq = [A3/4, A3/4, G3/4, G3/4, C3/2, C3/2, F3/4, F3/4]; // 2-bar loop of quarter notes
  const arpSeq = [ // 4-bar loop of 16th notes
      // Am7
      A3, C4, E4, G4, A3, C4, E4, G4, A3, C4, E4, G4, A3, C4, E4, G4,
      // G
      G3, B3, D4, B3, G3, B3, D4, B3, G3, B3, D4, B3, G3, B3, D4, B3,
      // C
      C3, E4, G4, E4, C3, E4, G4, E4, C3, E4, G4, E4, C3, E4, G4, E4,
      // F
      F3, A3, C4, A3, F3, A3, C4, A3, F3, A3, C4, A3, F3, A3, C4, A3,
  ];

  const scheduler = () => {
      if (!audioContext) return;
      while (nextNoteTime < audioContext.currentTime + 0.1) {
          const barPos16th = current16thNote % 16;

          // Kick on 1 & 3
          if (barPos16th === 0 || barPos16th === 8) playKick(nextNoteTime);
          // Snare on 2 & 4
          if (barPos16th === 4 || barPos16th === 12) playSnare(nextNoteTime);
          
          // Bass on quarter notes
          if (barPos16th % 4 === 0) {
              const bassNoteIndex = Math.floor((current16thNote % 32) / 4);
              playNote(nextNoteTime, bassSeq[bassNoteIndex], sixteenthNoteTime * 3, 'sawtooth', 0.6);
          }
          
          // Arpeggio on 16th notes
          const arpNote = arpSeq[current16thNote];
          playNote(nextNoteTime, arpNote, sixteenthNoteTime, 'triangle', 0.4);

          nextNoteTime += sixteenthNoteTime;
          current16thNote = (current16thNote + 1) % 64; // Loop over 4 bars
      }
  };
  musicInterval = window.setInterval(scheduler, 25);
};

const stopMusic = () => {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
    if (!audioContext || !musicGainNode) return;

    const currentGain = musicGainNode.gain.value;
    musicGainNode.gain.cancelScheduledValues(audioContext.currentTime);
    musicGainNode.gain.setValueAtTime(currentGain, audioContext.currentTime);
    musicGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
    
    setTimeout(() => {
        musicGainNode?.disconnect();
        musicGainNode = null;
    }, 1600);
};

const setMusicVolume = (volume: number) => {
    if (musicGainNode && audioContext) {
        musicGainNode.gain.setTargetAtTime(volume * 0.3, audioContext.currentTime, 0.1);
    }
};
// --- End Background Music ---

interface GameProps {
  onGameOver: (score: number) => void;
  soundEnabled: boolean;
  musicVolume: number;
}

// Separate state for rendering to avoid re-rendering the whole Game component on every frame
interface RenderState {
  birdY: number;
  pipes: PipeType[];
  score: number;
  lives: number;
  isHit: boolean;
  isInvincible: boolean;
  isKnockedBack: boolean;
  gameSpeed: number;
}

const Game: React.FC<GameProps> = ({ onGameOver, soundEnabled, musicVolume }) => {
  isSoundEnabled = soundEnabled; // Update module-level flag
  
  // Use a single ref for all mutable game state to prevent re-renders and stale closures
  const gameState = useRef({
    birdY: BIRD_START_Y,
    birdVelocity: 0,
    pipes: [] as PipeType[],
    score: 0,
    lives: INITIAL_LIVES,
    gameSpeed: INITIAL_GAME_SPEED,
    isInvincible: false,
    isKnockedBack: false,
    lastSpeedIncreaseScore: 0,
    hitEffectActive: false,
  });

  // State that holds only the data needed for rendering
  const [renderState, setRenderState] = useState<RenderState>({
    birdY: gameState.current.birdY,
    pipes: gameState.current.pipes,
    score: gameState.current.score,
    lives: gameState.current.lives,
    isHit: gameState.current.hitEffectActive,
    isInvincible: gameState.current.isInvincible,
    isKnockedBack: gameState.current.isKnockedBack,
    gameSpeed: gameState.current.gameSpeed,
  });

  const gameLoopRef = useRef<number | undefined>(undefined);
  const invincibleTimeoutRef = useRef<number | undefined>(undefined);
  const hitEffectTimeoutRef = useRef<number | undefined>(undefined);
  const knockbackTimeoutRef = useRef<number | undefined>(undefined);
  
  const gameLoop = useCallback(() => {
    const state = gameState.current;
    let gameOver = false;

    // Bird physics
    state.birdVelocity = Math.min(state.birdVelocity + GRAVITY, MAX_FALL_SPEED);
    state.birdY += state.birdVelocity;

    // Pipe logic: move, remove, and spawn (only if not in knockback)
    if (!state.isKnockedBack) {
      state.pipes = state.pipes
        .map(pipe => ({ ...pipe, x: pipe.x - state.gameSpeed }))
        .filter(pipe => pipe.x > -PIPE_WIDTH);

      const lastPipe = state.pipes[state.pipes.length - 1];
      if (!lastPipe || lastPipe.x < SCREEN_WIDTH - PIPE_SPACING) {
        const isEasyMode = state.score < EASY_MODE_SCORE_THRESHOLD;
        const currentGap = isEasyMode ? EASY_PIPE_GAP : PIPE_GAP;
        
        let gapY;
        if (isEasyMode) {
          const minGapY = SCREEN_HEIGHT * 0.25;
          const maxGapY = SCREEN_HEIGHT * 0.75 - currentGap;
          gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        } else {
          gapY = Math.random() * (SCREEN_HEIGHT - currentGap - 200) + 100;
        }
        
        state.pipes.push({ x: SCREEN_WIDTH, gapY: gapY, gap: currentGap, passed: false });
      }
    }

    // Scoring
    const passedPipe = state.pipes.find(p => !p.passed && p.x + PIPE_WIDTH < BIRD_START_X);
    if (passedPipe) {
      passedPipe.passed = true;
      state.score += 1;
      playScoreSound();

      if (state.score > 0 && state.score % SPEED_INCREASE_INTERVAL === 0 && state.score > state.lastSpeedIncreaseScore) {
          state.gameSpeed += SPEED_INCREASE_AMOUNT;
          state.lastSpeedIncreaseScore = state.score;
      }
    }

    // Collision checks and state updates
    if (!state.isInvincible && !state.isKnockedBack) {
        const hitBounds = state.birdY > SCREEN_HEIGHT - BIRD_HEIGHT || state.birdY < 0;
        let hitPipe = false;
        for (const pipe of state.pipes) {
            const birdBox = { left: BIRD_START_X, right: BIRD_START_X + BIRD_WIDTH, top: state.birdY, bottom: state.birdY + BIRD_HEIGHT };
            const pipeBox = { left: pipe.x, right: pipe.x + PIPE_WIDTH, topPipeBottom: pipe.gapY, bottomPipeTop: pipe.gapY + pipe.gap };

            if (birdBox.right > pipeBox.left && birdBox.left < pipeBox.right && (birdBox.top < pipeBox.topPipeBottom || birdBox.bottom > pipeBox.bottomPipeTop)) {
                hitPipe = true;
                break;
            }
        }
        
        if (hitBounds || hitPipe) {
            playHitSound();
            if (invincibleTimeoutRef.current) clearTimeout(invincibleTimeoutRef.current);
            if (hitEffectTimeoutRef.current) clearTimeout(hitEffectTimeoutRef.current);
            if (knockbackTimeoutRef.current) clearTimeout(knockbackTimeoutRef.current);

            state.lives -= 1;
            
            if (state.lives > 0) {
              // Immediately reset position and physics for better playability
              state.birdY = BIRD_START_Y;
              state.birdVelocity = 0;
              state.isInvincible = true;
              
              // Trigger visual-only effects
              state.isKnockedBack = true; // For red flash/translate on bird
              state.hitEffectActive = true; // For white screen flash

              // Set timeouts to remove the effects
              hitEffectTimeoutRef.current = window.setTimeout(() => {
                state.hitEffectActive = false;
              }, 300);

              knockbackTimeoutRef.current = window.setTimeout(() => {
                state.isKnockedBack = false;
              }, 200);
              
              invincibleTimeoutRef.current = window.setTimeout(() => {
                state.isInvincible = false;
              }, 3000);

            } else {
              gameOver = true;
            }
        }
    }

    // Update render state or end game
    if (gameOver) {
      onGameOver(state.score);
      return;
    }

    setRenderState({
      birdY: state.birdY,
      pipes: [...state.pipes],
      score: state.score,
      lives: state.lives,
      isHit: state.hitEffectActive,
      isInvincible: state.isInvincible,
      isKnockedBack: state.isKnockedBack,
      gameSpeed: state.gameSpeed,
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [onGameOver]);

  const jump = useCallback((strength: number) => {
    playJumpSound();
    gameState.current.birdVelocity = strength;
  }, []);
  
  useEffect(() => {
    setMusicVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    initializeAudioContext();
    startMusic(musicVolume);

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleDesktopJump = (e: Event) => {
        e.preventDefault();
        // For mouse events, only trigger on primary button
        if (e instanceof MouseEvent && e.button !== 0) {
            return;
        }
        jump(DESKTOP_JUMP_STRENGTH);
    };

    const handleMobileJump = (e: Event) => {
        e.preventDefault();
        jump(TAP_JUMP_STRENGTH);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            handleDesktopJump(e);
        }
    };

    // Add listeners based on device type
    window.addEventListener('keydown', handleKeyDown);
    if (isTouchDevice) {
        window.addEventListener('touchstart', handleMobileJump);
    } else {
        window.addEventListener('mousedown', handleDesktopJump);
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      stopMusic();
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (invincibleTimeoutRef.current) clearTimeout(invincibleTimeoutRef.current);
      if (hitEffectTimeoutRef.current) clearTimeout(hitEffectTimeoutRef.current);
      if (knockbackTimeoutRef.current) clearTimeout(knockbackTimeoutRef.current);
      
      // Cleanup listeners
      window.removeEventListener('keydown', handleKeyDown);
      if (isTouchDevice) {
          window.removeEventListener('touchstart', handleMobileJump);
      } else {
          window.removeEventListener('mousedown', handleDesktopJump);
      }
    };
  }, [jump, gameLoop, musicVolume]);

  return (
    <>
      <Background gameSpeed={renderState.gameSpeed} />
      {renderState.isHit && <div className="absolute inset-0 z-50 bg-white opacity-70 animate-flash pointer-events-none" />}
      <Hud score={renderState.score} lives={renderState.lives} gameSpeed={renderState.gameSpeed} />
      <Bird 
        y={renderState.birdY} 
        velocity={gameState.current.birdVelocity} 
        isInvincible={renderState.isInvincible}
        isKnockedBack={renderState.isKnockedBack}
        score={renderState.score}
      />
      {renderState.pipes.map((pipe, index) => (
        <Pipe key={index} x={pipe.x} gapY={pipe.gapY} gap={pipe.gap} />
      ))}
      <style>{`
        @keyframes flash {
          0% { opacity: 0.7; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Game;