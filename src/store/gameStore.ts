import { create } from 'zustand';

export type Companion = 'crab' | 'otter' | 'seal' | 'pelican';
export type GamePhase = 'onboarding-length' | 'onboarding-companion' | 'playing' | 'game-over' | 'victory';
export type GameLength = 15 | 25 | 50;

interface GameState {
  // Player profile
  companion: Companion | null;
  gameLength: GameLength;

  // Game state
  phase: GamePhase;
  health: number;
  maxHealth: number;
  currentLocationIndex: number;
  questionsAnswered: number;
  correctAnswers: number;

  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  soundEnabled: boolean;

  // Actions
  setGameLength: (length: GameLength) => void;
  setCompanion: (companion: Companion) => void;
  startGame: () => void;
  answerQuestion: (correct: boolean) => void;
  advanceLocation: () => void;
  healHealth: (amount: number) => void;
  resetGame: () => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

// Standard difficulty settings
const HEALTH_SETTINGS = {
  start: 100,
  damage: 10,
  heal: 15,
  minHealth: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  companion: null,
  gameLength: 25,
  phase: 'onboarding-length',
  health: HEALTH_SETTINGS.start,
  maxHealth: HEALTH_SETTINGS.start,
  currentLocationIndex: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  reducedMotion: false,
  highContrast: false,
  soundEnabled: true,

  setGameLength: (length) => {
    set({ gameLength: length, phase: 'onboarding-companion' });
  },

  setCompanion: (companion) => {
    set({ companion });
  },

  startGame: () => {
    set({ phase: 'playing' });
  },

  answerQuestion: (correct) => {
    const state = get();

    if (correct) {
      set({
        questionsAnswered: state.questionsAnswered + 1,
        correctAnswers: state.correctAnswers + 1,
      });
    } else {
      const newHealth = Math.max(HEALTH_SETTINGS.minHealth, state.health - HEALTH_SETTINGS.damage);
      set({
        questionsAnswered: state.questionsAnswered + 1,
        health: newHealth,
        phase: newHealth <= 0 ? 'game-over' : state.phase,
      });
    }
  },

  advanceLocation: () => {
    const state = get();
    const newIndex = state.currentLocationIndex + 1;

    if (newIndex >= state.gameLength) {
      set({ phase: 'victory' });
    } else {
      set({ currentLocationIndex: newIndex });
    }
  },

  healHealth: (amount) => {
    const state = get();
    const newHealth = Math.min(state.maxHealth, state.health + amount);
    set({ health: newHealth });
  },

  resetGame: () => {
    set({
      companion: null,
      gameLength: 25,
      phase: 'onboarding-length',
      health: HEALTH_SETTINGS.start,
      maxHealth: HEALTH_SETTINGS.start,
      currentLocationIndex: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
    });
  },

  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setHighContrast: (enabled) => set({ highContrast: enabled }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
}));
