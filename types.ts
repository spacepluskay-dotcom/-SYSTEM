
export enum ModuleType {
  BOOT = 'BOOT',
  SYSTEM = 'SYSTEM',
  ENGINEERING = 'ENGINEERING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  AI = 'AI',
  PROJECTS = 'PROJECTS',
  FOUNDER = 'FOUNDER',
  WORK = 'WORK',
}

export interface NavItem {
  id: ModuleType;
  label: string;
  code: string;
}

export interface SystemState {
  currentModule: ModuleType;
  isBooted: boolean;
}

export type Language = 'en' | 'cn';
