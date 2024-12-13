import { Framework } from '../types';

// In-memory storage
const frameworks: Framework[] = [];

export const frameworksDb = {
  create: (framework: Partial<Framework>) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newFramework: Framework = {
      id,
      name: framework.name || '',
      type: framework.type || 'INVESTMENT',
      initialAllocatedAmount: framework.initialAllocatedAmount || 0,
      currency: framework.currency || 'USD',
      status: framework.status || 'DRAFT',
      frameworkLead: framework.frameworkLead || '',
      shortDescription: framework.shortDescription || '',
      longDescription: framework.longDescription || '',
      fundingType: framework.fundingType || 'DONOR',
      fundingSource: framework.fundingSource || '',
      allocationType: framework.allocationType || 'FIXED',
      maxAmountPerTransaction: framework.maxAmountPerTransaction || 0,
      priority: framework.priority || 'MEDIUM',
      effectiveFrom: new Date(framework.effectiveFrom || now),
      effectiveTo: new Date(framework.effectiveTo || now),
      createdAt: new Date(now),
      updatedAt: new Date(now),
      attributes: framework.attributes || [],
      eligibilityCriteria: framework.eligibilityCriteria,
    };

    frameworks.push(newFramework);
    return newFramework;
  },

  list: () => {
    return frameworks;
  },

  update: (id: string, framework: Partial<Framework>) => {
    const index = frameworks.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Framework not found');
    }

    const updatedFramework = {
      ...frameworks[index],
      ...framework,
      updatedAt: new Date(),
    };

    frameworks[index] = updatedFramework;
    return updatedFramework;
  }
};