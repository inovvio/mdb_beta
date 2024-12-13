export function createProjectData(data: any) {
  return {
    name: data.name,
    type: data.type,
    framework_id: data.frameworkId,
    party_id: data.partyId,
    party_name: data.partyName,
    role: data.role,
    max_limit_amount: Number(data.maxLimitAmount) || 0,
    currency: data.currency,
    status: 'DRAFT'
  };
}

export function updateProjectData(data: any) {
  return {
    name: data.name,
    type: data.type,
    framework_id: data.frameworkId,
    party_id: data.partyId,
    party_name: data.partyName,
    role: data.role,
    max_limit_amount: Number(data.maxLimitAmount) || 0,
    currency: data.currency
  };
}