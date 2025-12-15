export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github';
}

export interface GeneratedCode {
  id: string;
  timestamp: number;
  prompt: string;
  language: 'nodejs' | 'python' | 'java';
  code: string;
  explanation: string;
  filename: string;
  dependencies: string[];
}

export interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  language: 'nodejs' | 'python' | 'java';
}

export type CodeLanguage = 'nodejs' | 'python' | 'java';

export interface Snippet {
  id: string;
  title: string;
  description: string;
  language: CodeLanguage | 'all';
  code: string;
}

export interface SecurityIssue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestion: string;
}

export interface SecurityReport {
  issues: SecurityIssue[];
  score: number;
  summary: string;
}
