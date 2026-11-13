/**
 * Types for the Good Sports Questionnaire Game
 */

export type ClubStream = 'CSJ' | 'CSNJ' | 'CNSJ' | 'CNSNJ' | 'NCNSJ' | 'NCNSNJ';

export type QuestionGroup =
  | 'Alcohol'
  | 'Community Leadership'
  | 'Governance'
  | 'Illicit Drugs'
  | 'Juniors'
  | 'Legal Compliance'
  | 'Mental Health'
  | 'Smoking and Vaping';

export type AnswerStatus = 'unanswered' | 'yes' | 'not_yet' | 'skipped' | 'help_requested';

export interface QuestionnaireItem {
  id: string;
  group: QuestionGroup;
  prompt: string;
  criteria: string;
  isMinimumCriteria: boolean;
  streams: ClubStream[];
  why: string;
  how: string;
  actionItems: string[];
  policyStatement: string;
  resources: string[];
  npcId: string; // which NPC teammate asks or oversees this
}

export interface ClubProfile {
  name: string;
  sport: string;
  state: string;
  stream: ClubStream;
  sellsAlcohol: boolean;
  consumesAlcohol: boolean;
  hasJuniors: boolean;
  silverSignedAt?: string;
  goldSignedAt?: string;
  signeeName?: string;
  signeeRole?: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  locationName: string;
  zone: 'clubhouse' | 'oval' | 'juniors' | 'boardroom' | 'wellbeing' | 'spectator';
  x: number; // tile coordinates
  y: number;
  direction: 'down' | 'up' | 'left' | 'right';
  spriteColor: string;
  avatarIcon: string;
  greeting: string;
  group: QuestionGroup;
  unlockedModuleId?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  group: QuestionGroup;
  description: string;
  badgeName: string;
  badgeIcon: string;
  badgeColor: string;
  badgeEarned: boolean;
  requiredQuestionIds: string[];
}

export interface PlayerPosition {
  x: number; // pixel coords or tile coords
  y: number;
  dir: 'down' | 'up' | 'left' | 'right';
  isMoving: boolean;
}
