export enum EngagementType {
  INVESTMENT = 'INVESTMENT',
  RISK_MITIGATION = 'RISK_MITIGATION',
  TRADE_FINANCE = 'TRADE_FINANCE',
  GREEN = 'GREEN'
}

export enum EngagementStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface EngagementParty {
  id: string;
  engagementId: string;
  partyId: string;
  partyName: string;
  role: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementAttribute {
  id: string;
  name: string;
  type: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementHistory {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Engagement {
  id: string;
  name: string;
  description?: string;
  types: EngagementType[];
  frameworkId?: string;
  framework?: {
    id: string;
    name: string;
  };
  effectiveFrom: Date;
  effectiveTo: Date;
  status: EngagementStatus;
  parties: EngagementParty[];
  documents: EngagementDocument[];
  attributes: EngagementAttribute[];
  history: EngagementHistory[];
  createdAt: Date;
  updatedAt: Date;
}