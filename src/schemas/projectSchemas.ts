```typescript
import { z } from 'zod';
import { ProjectType, ProjectStatus } from '../types/project';

export const projectSchema = z.object({
  projectId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  status: z.nativeEnum(ProjectStatus).default('DRAFT'),
  frameworkId: z.string().optional(),
  parties: z.array(z.object({
    partyId: z.string().min(1, 'Party ID is required'),
    partyName: z.string().min(1, 'Party name is required'),
    role: z.string().min(1, 'Role is required'),
    isPrimary: z.boolean().default(false)
  })).min(1, 'At least one party is required'),
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

export type ProjectFormData = z.infer<typeof projectSchema>;
```