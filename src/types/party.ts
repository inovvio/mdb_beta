export enum PartyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_KYC = 'PENDING_KYC',
  BLACKLISTED = 'BLACKLISTED'
}

export enum PartyRole {
  CLIENT = 'CLIENT',
  DONOR = 'DONOR',
  PFI = 'PFI',
  GUARANTOR = 'GUARANTOR',
  VENDOR = 'VENDOR'
}

export interface PartyContact {
  id: string;
  partyId: string;
  name: string;
  designation?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Party {
  id: string;
  name: string;
  legalName: string;
  shortName?: string;
  roles: PartyRole[];
  country: string;
  status: PartyStatus;
  contacts?: PartyContact[];
  createdAt: Date;
  updatedAt: Date;
}