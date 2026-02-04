import questions from './questions.json';
import events from './events.json';
import summaries from './summaries.json';

export type GradeBand = '4-5' | '6-8';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type EventType = 'hazard' | 'decision' | 'restoration';

export interface ContentTags {
  ngss: string[];
  epc: string[];
  topic: string[];
}

export interface QuestionContent {
  id: string;
  locationId: string;
  gradeBand: GradeBand;
  difficulty: Difficulty;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  misconception?: string;
  tags: ContentTags;
}

export interface EventChoice {
  id: string;
  label: string;
  outcome: string;
  effects: {
    health: number;
    supplies: number;
    biodiversity: number;
    time: number;
  };
  tags: ContentTags;
}

export interface EventContent {
  id: string;
  locationId: string;
  gradeBand: GradeBand;
  type: EventType;
  title: string;
  prompt: string;
  choices: EventChoice[];
  followUpQuestionIds: string[];
}

export interface LocationSummary {
  locationId: string;
  title: string;
  summary: string;
  keyTakeaway: string;
  tags: ContentTags;
}

export const content = {
  questions: questions as QuestionContent[],
  events: events as EventContent[],
  summaries: summaries as LocationSummary[],
};

export function getQuestionsForLocation(locationId: string, gradeBand?: GradeBand) {
  return content.questions.filter((q) => q.locationId === locationId && (!gradeBand || q.gradeBand === gradeBand));
}

export function getRandomQuestionsForLocation(locationId: string, count: number, gradeBand?: GradeBand) {
  const locationQuestions = getQuestionsForLocation(locationId, gradeBand);
  const shuffled = [...locationQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getEventsForLocation(locationId: string, gradeBand?: GradeBand) {
  return content.events.filter((e) => e.locationId === locationId && (!gradeBand || e.gradeBand === gradeBand));
}

export function getSummaryForLocation(locationId: string) {
  return content.summaries.find((s) => s.locationId === locationId) ?? null;
}
