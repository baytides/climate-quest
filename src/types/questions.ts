export interface QuestionLike {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
