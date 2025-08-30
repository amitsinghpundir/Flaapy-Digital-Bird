export const SCREEN_WIDTH = window.innerWidth;
export const SCREEN_HEIGHT = window.innerHeight;

export const BIRD_WIDTH = 60;
export const BIRD_HEIGHT = 45;
export const BIRD_START_X = SCREEN_WIDTH / 4;
export const BIRD_START_Y = SCREEN_HEIGHT / 2;

// --- Differentiated Physics for Optimal Feel ---
export const GRAVITY = 0.3; // A constant gravity for a consistent feel
export const TAP_JUMP_STRENGTH = -6.2; // A gentle jump, perfect for mobile taps
export const DESKTOP_JUMP_STRENGTH = -8.0; // A stronger jump for responsive desktop mouse clicks and key presses
export const MAX_FALL_SPEED = 10; // Capped fall speed for better recovery

export const PIPE_WIDTH = 80;
export const PIPE_GAP = Math.max(180, SCREEN_HEIGHT * 0.22); // Responsive gap
export const PIPE_SPACING = 400;

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export const INITIAL_GAME_SPEED = isTouchDevice ? 3.2 : 2.0;
export const SPEED_INCREASE_INTERVAL = 7; // Increase speed every 7 points
export const SPEED_INCREASE_AMOUNT = isTouchDevice ? 1.0 : 0.5; // Speed increases at different rates for mobile and desktop

export const INITIAL_LIVES = 3;

// Easy Mode Constants
export const EASY_MODE_SCORE_THRESHOLD = 10;
export const EASY_PIPE_GAP = Math.max(220, SCREEN_HEIGHT * 0.28); // Responsive easy gap