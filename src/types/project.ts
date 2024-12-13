```typescript
export enum ProjectType {
  INVESTMENT = 'INVESTMENT',
  GUARANTEE = 'GUARANTEE',
  TRADE_FINANCE = 'TRADE_FINANCE'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ProjectParty {
  id: string;
  projectId: string;
  partyId: string;
  partyName: string;
  role: string;
  isPrimary: boolean;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  comments?: string;
}

export interface ProjectAttribute {
  id: string;
  name: string;
  type: string;
  value: string;
}

export interface ProjectHistory {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  frameworkId?: string;
  framework?: {
    id: string;
    name: string;
  };
  parties: ProjectParty[];
  documents: ProjectDocument[];
  attributes: ProjectAttribute[];
  history: ProjectHistory[];
  createdAt: Date;
  updatedAt: Date;
}
```