import { create } from 'zustand';
import { GamePhase, Pokemon, Question, SceneType, BallType } from './types';

interface GameState {
  phase: GamePhase;
  playerHp: number;
  maxHp: number;
  proficiency: 'novice' | 'expert'; // Result of Phase 1
  selectedScene: SceneType | null;
  currentEnemy: Pokemon | null;
  currentQuestion: Question | null;
  caughtPokemon: Pokemon | null;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setProficiency: (level: 'novice' | 'expert') => void;
  selectScene: (scene: SceneType) => void;
  setEnemy: (pokemon: Pokemon) => void;
  setQuestion: (q: Question) => void;
  takeDamage: (amount: number) => void;
  resetHp: () => void;
  setCaughtPokemon: (p: Pokemon | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'INIT',
  playerHp: 3,
  maxHp: 3,
  proficiency: 'novice',
  selectedScene: null,
  currentEnemy: null,
  currentQuestion: null,
  caughtPokemon: null,

  setPhase: (phase) => set({ phase }),
  setProficiency: (proficiency) => set({ proficiency }),
  selectScene: (selectedScene) => set({ selectedScene }),
  setEnemy: (currentEnemy) => set({ currentEnemy }),
  setQuestion: (currentQuestion) => set({ currentQuestion }),
  takeDamage: (amount) => set((state) => ({ playerHp: Math.max(0, state.playerHp - amount) })),
  resetHp: () => set({ playerHp: 3 }),
  setCaughtPokemon: (caughtPokemon) => set({ caughtPokemon }),
}));