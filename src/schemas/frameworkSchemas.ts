import { z } from 'zod';

export const frameworkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  longDescription: z.string().optional(),
  initialAllocatedAmount: z.number().min(0, 'Amount must be positive'),
  maxAmountPerTransaction: z.number().min(0, 'Amount must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  status: z.string().optional(),
  frameworkLead: z.string().optional(),
  fundingType: z.string().optional(),
  fundingSource: z.string().optional(),
  allocationType: z.string().optional(),
  priority: z.string().optional(),
  parentFrameworkId: z.string().optional(),
  eligibilityCriteria: z.object({
    permittedSics: z.array(z.string()).optional(),
    environmentCategory: z.string().optional(),
    countriesOfOperation: z.array(z.string()).optional(),
    transitionImpactPrimaryQuality: z.string().optional(),
    clientTypes: z.array(z.string()).optional(),
    productTypes: z.array(z.string()).optional(),
    attributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional()
  }).optional(),
  attributes: z.array(z.object({
    name: z.string(),
    type: z.string(),
    value: z.string()
  })).optional(),
  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    url: z.string(),
    comments: z.string().optional()
  })).optional()
});

export type FrameworkFormData = z.infer<typeof frameworkSchema>;