import { supabase } from '../../config/supabase';
import { EligibilityCriteria } from '../../types';
import { snakeToCamel, camelToSnake } from '../../utils/caseConversion';

export async function createEligibilityCriteria(
  frameworkId: string,
  data: Partial<EligibilityCriteria>
) {
  const criteriaData = {
    frameworkId,
    permittedSics: data.permittedSics || [],
    environmentCategory: data.environmentCategory || null,
    countriesOfOperation: data.countriesOfOperation || [],
    transitionImpactPrimaryQuality: data.transitionImpactPrimaryQuality || null,
    clientTypes: data.clientTypes || [],
    productTypes: data.productTypes || [],
  };

  const { error } = await supabase
    .from('eligibility_criteria')
    .insert([camelToSnake(criteriaData)]);

  if (error) throw error;
}

export async function updateEligibilityCriteria(
  frameworkId: string,
  data: Partial<EligibilityCriteria>
) {
  // Delete existing criteria
  await supabase
    .from('eligibility_criteria')
    .delete()
    .eq('framework_id', frameworkId);

  // Create new criteria
  await createEligibilityCriteria(frameworkId, data);
}