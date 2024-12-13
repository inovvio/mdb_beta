export enum EntityType {
  FRAMEWORK = 'FRAMEWORK',
  ENGAGEMENT = 'ENGAGEMENT',
  PARTY = 'PARTY'
}

export enum WorkflowAction {
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
  USER_APPROVAL = 'USER_APPROVAL',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  DATA_VALIDATION = 'DATA_VALIDATION',
  EXTERNAL_VERIFICATION = 'EXTERNAL_VERIFICATION',
  NOTIFICATION = 'NOTIFICATION',
  TASK_CREATION = 'TASK_CREATION'
}

export enum WorkflowPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  validationFunction: string;
}

export interface WorkflowTransition {
  id: string;
  entityType: EntityType;
  startState: string;
  endState: string;
  action: WorkflowAction;
  priority: number;
  stpFlag: boolean;
  createTaskFlag: boolean;
  createNotificationFlag: boolean;
  activeFlag: boolean;
  rules: WorkflowRule[];
  createdAt: Date;
  updatedAt: Date;
}