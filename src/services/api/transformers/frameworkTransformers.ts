export function createFrameworkData(data: any) {
  return {
    name: data.name,
    type: data.type,
    short_description: data.shortDescription,
    long_description: data.longDescription || null,
    initial_allocated_amount: Number(data.initialAllocatedAmount) || 0,
    max_amount_per_transaction: Number(data.maxAmountPerTransaction) || 0,
    currency: data.currency,
    status: 'DRAFT',
    framework_lead: data.frameworkLead || null,
    funding_type: data.fundingType || null,
    funding_source: data.fundingSource || null,
    allocation_type: data.allocationType || null,
    priority: data.priority || null,
    parent_framework_id: data.parentFrameworkId || null
  };
}

export function updateFrameworkData(data: any) {
  return {
    name: data.name,
    type: data.type,
    short_description: data.shortDescription,
    long_description: data.longDescription || null,
    initial_allocated_amount: Number(data.initialAllocatedAmount) || 0,
    max_amount_per_transaction: Number(data.maxAmountPerTransaction) || 0,
    currency: data.currency,
    framework_lead: data.frameworkLead || null,
    funding_type: data.fundingType || null,
    funding_source: data.fundingSource || null,
    allocation_type: data.allocationType || null,
    priority: data.priority || null,
    parent_framework_id: data.parentFrameworkId || null
  };
}