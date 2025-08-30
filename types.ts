export enum GameState {
  Start,
  Playing,
  GameOver,
}

export interface Pipe {
  x: number;
  gapY: number;
  gap: number;
  passed?: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
}
