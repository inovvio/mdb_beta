import { supabase } from '../../config/supabase';
import { Framework } from '../../types';
import { snakeToCamel } from '../../utils/caseConversion';
import { handleApiError } from './utils/errorHandling';
import { createFrameworkData, updateFrameworkData } from './transformers/frameworkTransformers';

export const frameworksApi = {
  create: async (data: Partial<Framework>): Promise<Framework> => {
    try {
      // Create framework
      const { data: framework, error } = await supabase
        .from('frameworks')
        .insert([createFrameworkData(data)])
        .select()
        .single();

      if (error) throw error;

      // Create related data
      await createRelatedData(framework.id, data);

      // Return complete framework
      return await fetchFrameworkWithRelations(framework.id);
    } catch (error) {
      handleApiError(error, 'Error creating framework');
    }
  },

  update: async (id: string, data: Partial<Framework>): Promise<Framework> => {
    try {
      // Update framework
      const { error } = await supabase
        .from('frameworks')
        .update({
          ...updateFrameworkData(data),
          parent_framework_id: data.parentFrameworkId || null
        })
        .eq('id', id);

      if (error) throw error;

      // Update related data
      await updateRelatedData(id, data);

      // Return updated framework
      return await fetchFrameworkWithRelations(id);
    } catch (error) {
      handleApiError(error, 'Error updating framework');
    }
  },

  list: async (): Promise<Framework[]> => {
    try {
      const { data, error } = await supabase
        .from('frameworks')
        .select(`
          *,
          parent_framework:frameworks!frameworks_parent_framework_id_fkey (
            id,
            name
          ),
          eligibility_criteria (*),
          framework_attributes (*),
          framework_documents (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(snakeToCamel);
    } catch (error) {
      handleApiError(error, 'Error loading frameworks');
    }
  },

  getById: async (id: string): Promise<Framework> => {
    try {
      const { data, error } = await supabase
        .from('frameworks')
        .select(`
          *,
          parent_framework:frameworks!frameworks_parent_framework_id_fkey (
            id,
            name
          ),
          eligibility_criteria (*),
          framework_attributes (*),
          framework_documents (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return snakeToCamel(data);
    } catch (error) {
      handleApiError(error, 'Error fetching framework');
    }
  }
};

async function createRelatedData(frameworkId: string, data: Partial<Framework>) {
  if (data.eligibilityCriteria) {
    await createEligibilityCriteria(frameworkId, data.eligibilityCriteria);
  }

  if (data.attributes?.length) {
    await createFrameworkAttributes(frameworkId, data.attributes);
  }
}

async function updateRelatedData(frameworkId: string, data: Partial<Framework>) {
  if (data.eligibilityCriteria) {
    await updateEligibilityCriteria(frameworkId, data.eligibilityCriteria);
  }

  if (data.attributes) {
    await updateFrameworkAttributes(frameworkId, data.attributes);
  }
}

async function fetchFrameworkWithRelations(id: string): Promise<Framework> {
  const { data, error } = await supabase
    .from('frameworks')
    .select(`
      *,
      parent_framework:frameworks!frameworks_parent_framework_id_fkey (
        id,
        name
      ),
      eligibility_criteria (*),
      framework_attributes (*),
      framework_documents (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return snakeToCamel(data);
}

async function createEligibilityCriteria(frameworkId: string, criteria: any) {
  const { error } = await supabase
    .from('eligibility_criteria')
    .insert([{
      framework_id: frameworkId,
      permitted_sics: criteria.permittedSics || [],
      environment_category: criteria.environmentCategory || null,
      countries_of_operation: criteria.countriesOfOperation || [],
      transition_impact_primary_quality: criteria.transitionImpactPrimaryQuality || null,
      client_types: criteria.clientTypes || [],
      product_types: criteria.productTypes || []
    }]);

  if (error) throw error;
}

async function updateEligibilityCriteria(frameworkId: string, criteria: any) {
  await supabase
    .from('eligibility_criteria')
    .delete()
    .eq('framework_id', frameworkId);

  await createEligibilityCriteria(frameworkId, criteria);
}

async function createFrameworkAttributes(frameworkId: string, attributes: any[]) {
  const { error } = await supabase
    .from('framework_attributes')
    .insert(attributes.map(attr => ({
      framework_id: frameworkId,
      name: attr.name,
      type: attr.type,
      value: attr.value
    })));

  if (error) throw error;
}

async function updateFrameworkAttributes(frameworkId: string, attributes: any[]) {
  await supabase
    .from('framework_attributes')
    .delete()
    .eq('framework_id', frameworkId);

  if (attributes.length > 0) {
    await createFrameworkAttributes(frameworkId, attributes);
  }
}