import { z } from 'zod';
import { EngagementType, EngagementStatus } from '../types/engagement';

export const engagementSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  types: z.array(z.enum(Object.values(EngagementType) as [string, ...string[]])).min(1, 'At least one type is required'),
  frameworkId: z.string().optional(),
  effectiveFrom: z.string().min(1, 'Effective from date is required'),
  effectiveTo: z.string().min(1, 'Effective to date is required'),
  status: z.enum(Object.values(EngagementStatus) as [string, ...string[]]),
  parties: z.array(z.object({
    partyId: z.string().min(1, 'Party ID is required'),
    partyName: z.string().min(1, 'Party name is required'),
    role: z.string().min(1, 'Role is required'),
    isPrimary: z.boolean().default(false)
  })).min(1, 'At least one party is required'),
  financials: z.array(z.object({
    reference: z.string().min(1, 'Reference is required'),
    currency: z.string().min(1, 'Currency is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    date: z.string().optional(),
    comments: z.string().optional()
  })).optional(),
  documents: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    url: z.string().min(1, 'URL is required'),
    comments: z.string().optional()
  })).optional(),
  attributes: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    value: z.string().min(1, 'Value is required')
  })).optional()
});

export type EngagementFormData = z.infer<typeof engagementSchema>;