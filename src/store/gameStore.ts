import { create } from 'zustand';

export type Companion = 'crab' | 'otter' | 'seal' | 'pelican';
export type AgeGroup = 'young' | 'middle' | 'older';
export type GamePhase = 'onboarding-age' | 'onboarding-companion' | 'playing' | 'game-over' | 'victory';

interface GameState {
  // Player profile
  ageGroup: AgeGroup | null;
  companion: Companion | null;

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
  setAgeGroup: (age: AgeGroup) => void;
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

// Health settings by age group
const HEALTH_SETTINGS: Record<AgeGroup, { start: number; damage: number; heal: number; minHealth: number }> = {
  young: { start: 100, damage: 5, heal: 10, minHealth: 30 }, // Gentler for young kids
  middle: { start: 100, damage: 10, heal: 15, minHealth: 0 }, // Standard
  older: { start: 80, damage: 15, heal: 15, minHealth: 0 }, // Harder for older kids
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  ageGroup: null,
  companion: null,
  phase: 'onboarding-age',
  health: 100,
  maxHealth: 100,
  currentLocationIndex: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  reducedMotion: false,
  highContrast: false,
  soundEnabled: true,

  setAgeGroup: (age) => {
    const settings = HEALTH_SETTINGS[age];
    set({
      ageGroup: age,
      health: settings.start,
      maxHealth: settings.start,
      phase: 'onboarding-companion',
    });
  },

  setCompanion: (companion) => {
    set({ companion });
  },

  startGame: () => {
    set({ phase: 'playing' });
  },

  answerQuestion: (correct) => {
    const state = get();
    const settings = HEALTH_SETTINGS[state.ageGroup || 'middle'];

    if (correct) {
      set({
        questionsAnswered: state.questionsAnswered + 1,
        correctAnswers: state.correctAnswers + 1,
      });
    } else {
      const newHealth = Math.max(settings.minHealth, state.health - settings.damage);
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

    // 5 locations total (0-4), victory after completing last
    if (newIndex >= 5) {
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
      ageGroup: null,
      companion: null,
      phase: 'onboarding-age',
      health: 100,
      maxHealth: 100,
      currentLocationIndex: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
    });
  },

  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setHighContrast: (enabled) => set({ highContrast: enabled }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
}));
