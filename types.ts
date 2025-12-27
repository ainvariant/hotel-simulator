export type Gender = '남성' | '여성' | '논바이너리';
export type MBTI = 
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export type Job = 
  | '유아' | '초등학생' | '중학생' | '고등학생' | '대학생' // 학생
  | '백수' | '회사원' | '기술자' | '건축가' // 일반/전문
  | '의사' | '간호사' // 의료
  | '가수' | '배우' | '모델' | '디자이너' | '마술사' | '기자' // 예술/방송
  | '군인' | '형사' | '탐정'; // 특수

export type JobCategory = '학생' | '일반/전문' | '의료' | '예술/방송' | '특수';

export type GuestStatus = 'ALIVE' | 'DEAD' | 'MISSING';

export interface Guest {
  id: string;
  name: string;
  job: Job;
  gender: Gender;
  roomNumber: string;
  mbti: MBTI;
  health: number; // 0-100
  sanity: number; // 0-100
  status: GuestStatus;
}

export interface MBTIDefinition {
  behaviors: string[]; // 10 items (Normal Individual)
  interactions: string[]; // 10 items (Normal Social)
  anomalyBehaviors: string[]; // 5 items (Horror Individual)
  anomalyInteractions: string[]; // 5 items (Horror Social)
}

export interface JobDefinition {
  behaviors: string[]; // 10 items (Normal Individual)
  interactions: string[]; // 10 items (Normal Social)
  anomalyBehaviors: string[]; // 5 items (Horror Individual)
  anomalyInteractions: string[]; // 5 items (Horror Social)
}

export interface GameEventOutcome {
  description: string;
  healthChange: number;
  sanityChange: number;
  isVictory?: boolean;
}

export interface GameEventOption {
  label: string;
  outcomes: GameEventOutcome[]; // Randomly select one from here
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'NORMAL' | 'ANOMALY';
  targetType: 'RANDOM_SINGLE' | 'ALL' | 'RANDOM_SUBSET'; 
  options: GameEventOption[];
}

export interface CharacterActionLog {
  guestName: string;
  mbti: MBTI;
  job: Job;
  action: string;
}

export interface InteractionLog {
  participants: string[];
  scenario: string;
}

export interface DailyLog {
  day: number;
  summary: string;
  characterActions: CharacterActionLog[];
  interactions: InteractionLog[];
  hotelEvents: string[];
}

export interface SummaryResponseSchema {
  day_summary: string;
}