import { z } from 'zod';
import { EntityType } from '../types/workflow';

export const workflowSchema = z.object({
  entityType: z.enum(Object.values(EntityType) as [string, ...string[]]),
  startState: z.string().min(1, 'Start state is required'),
  endState: z.string().min(1, 'End state is required'),
  action: z.string().min(1, 'Action is required'),
  priority: z.number().int().min(1).max(3),
  stpFlag: z.boolean(),
  createTaskFlag: z.boolean(),
  createNotificationFlag: z.boolean(),
  activeFlag: z.boolean(),
  rules: z.array(z.object({
    name: z.string().min(1, 'Rule name is required'),
    description: z.string().min(1, 'Rule description is required'),
    validationFunction: z.string().min(1, 'Validation function is required')
  }))
});

export type WorkflowFormData = z.infer<typeof workflowSchema>;