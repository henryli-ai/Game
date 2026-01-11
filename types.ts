export interface Pokemon {
  id: number;
  name: string;
  nameZh: string;
  starLevel: 4 | 5 | 6;
  imageUrl: string;
  type: 'fire' | 'water' | 'grass' | 'electric' | 'normal';
}

export type QuestionType = 'math' | 'english';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: string;
}

export type GamePhase = 
  | 'INIT' 
  | 'SCENE_SELECT' 
  | 'BATTLE' 
  | 'CATCH' 
  | 'RESULT';

export type SceneType = 'mountain' | 'swamp' | 'forest';

export type BallType = 'poke' | 'great' | 'ultra' | 'master';