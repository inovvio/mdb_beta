import { z } from 'zod';
import { PartyRole, PartyStatus } from '../types/party';

export const partySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  legalName: z.string().min(1, 'Legal name is required'),
  shortName: z.string().optional(),
  roles: z.array(z.enum(Object.values(PartyRole) as [string, ...string[]])).min(1, 'At least one role is required'),
  country: z.string().min(1, 'Country is required'),
  status: z.enum(Object.values(PartyStatus) as [string, ...string[]]),
  attributes: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.string().min(1, 'Value is required')
  })).optional(),
  documents: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    url: z.string().min(1, 'URL is required'),
    comments: z.string().optional()
  })).optional()
});

export type PartyFormData = z.infer<typeof partySchema>;