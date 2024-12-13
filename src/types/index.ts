export enum FrameworkType {
  INVESTMENT = 'INVESTMENT',
  GUARANTEE = 'GUARANTEE',
  TRADE_FINANCE = 'TRADE_FINANCE'
}

export enum ProjectType {
  INVESTMENT = 'INVESTMENT',
  GUARANTEE = 'GUARANTEE',
  TRADE_FINANCE = 'TRADE_FINANCE'
}

export enum PartyRole {
  GUARANTOR = 'GUARANTOR',
  BORROWER = 'BORROWER',
  BENEFICIARY = 'BENEFICIARY',
  AGENT = 'AGENT',
  SPONSOR = 'SPONSOR'
}

export enum ClientType {
  CORPORATE = 'CORPORATE',
  FINANCIAL_INSTITUTION = 'FINANCIAL_INSTITUTION',
  GOVERNMENT = 'GOVERNMENT',
  SME = 'SME'
}

export enum ProductType {
  LOAN = 'LOAN',
  GUARANTEE = 'GUARANTEE',
  EQUITY = 'EQUITY',
  TECHNICAL_ASSISTANCE = 'TECHNICAL_ASSISTANCE'
}

export enum EnvironmentCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  FI = 'FI'
}

export interface FrameworkDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Framework {
  id: string;
  name: string;
  type: FrameworkType;
  shortDescription: string;
  longDescription?: string;
  initialAllocatedAmount: number;
  currency: string;
  status: string;
  frameworkLead: string;
  fundingType: string;
  fundingSource?: string;
  allocationType: string;
  maxAmountPerTransaction: number;
  priority: string;
  parentFrameworkId?: string;
  createdAt: Date;
  updatedAt: Date;
  eligibilityCriteria?: EligibilityCriteria;
  attributes: FrameworkAttribute[];
  documents: FrameworkDocument[];
}

export interface Project {
  id: string;
  projectId: string;
  name: string;
  type: ProjectType;
  frameworkId: string;
  partyId: string;
  partyName: string;
  role: PartyRole;
  maxLimitAmount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityCriteria {
  id: string;
  permittedSICs?: string[];
  environmentCategory?: string;
  countriesOfOperation?: string[];
  transitionImpactPrimaryQuality?: string;
  clientTypes?: string[];
  productTypes?: string[];
  attributes: EligibilityCriteriaAttribute[];
}

export interface EligibilityCriteriaAttribute {
  id: string;
  key: string;
  value: string;
}

export interface FrameworkAttribute {
  id: string;
  name: string;
  type: string;
  value: string;
}

export interface Task {
  id: string;
  title: string;
  type: string;
  status: string;
  dueDate: Date;
  assignedTo: string;
}