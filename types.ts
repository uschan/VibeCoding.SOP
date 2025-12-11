import React from 'react';

export enum PhaseId {
  MANIFESTO = 'manifesto',
  DECOMPOSITION = 'decomposition',
  CONTEXT = 'context',
  ITERATION = 'iteration',
  REVIEW = 'review',
  CLOSING = 'closing',
  TOOLKIT = 'toolkit'
}

export interface SOPPhase {
  id: PhaseId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string;
  standardOps?: string[];
  dos: string[];
  donts: string[];
  positiveExample?: {
    type: 'code' | 'text';
    content: string;
    annotation: string;
  };
  negativeExample?: {
    type: 'code' | 'text';
    content: string;
    annotation: string;
  };
}

export interface PlannerResponse {
  steps: {
    title: string;
    promptStrategy: string;
    risk: string;
  }[];
}