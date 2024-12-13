import { supabase } from '../config/supabase';
import { Framework, Project } from '../types';
import { snakeToCamel, camelToSnake } from '../utils/caseConversion';

export const frameworksApi = {
  create: async (data: Partial<Framework>): Promise<Framework> => {
    try {
      // Prepare framework data
      const frameworkData = {
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

      // Create framework
      const { data: framework, error: frameworkError } = await supabase
        .from('frameworks')
        .insert([frameworkData])
        .select()
        .single();

      if (frameworkError) throw frameworkError;

      // If eligibility criteria exists, create it
      if (data.eligibilityCriteria) {
        const criteriaData = {
          framework_id: framework.id,
          permitted_sics: data.eligibilityCriteria.permittedSics || [],
          environment_category: data.eligibilityCriteria.environmentCategory || null,
          countries_of_operation: data.eligibilityCriteria.countriesOfOperation || [],
          transition_impact_primary_quality: data.eligibilityCriteria.transitionImpactPrimaryQuality || null,
          client_types: data.eligibilityCriteria.clientTypes || [],
          product_types: data.eligibilityCriteria.productTypes || []
        };

        const { error: criteriaError } = await supabase
          .from('eligibility_criteria')
          .insert([criteriaData]);

        if (criteriaError) throw criteriaError;
      }

      // If attributes exist, create them
      if (data.attributes?.length) {
        const attributesData = data.attributes.map(attr => ({
          framework_id: framework.id,
          name: attr.name,
          type: attr.type,
          value: attr.value
        }));

        const { error: attributesError } = await supabase
          .from('framework_attributes')
          .insert(attributesData);

        if (attributesError) throw attributesError;
      }

      // Fetch complete framework with relations
      const { data: completeFramework, error: fetchError } = await supabase
        .from('frameworks')
        .select('*, eligibility_criteria (*), framework_attributes (*), framework_documents (*)')
        .eq('id', framework.id)
        .single();

      if (fetchError) throw fetchError;

      return snakeToCamel(completeFramework);
    } catch (error) {
      console.error('Error creating framework:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Framework>): Promise<Framework> => {
    try {
      // Prepare framework data
      const frameworkData = {
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

      // Update framework
      const { error: frameworkError } = await supabase
        .from('frameworks')
        .update(frameworkData)
        .eq('id', id);

      if (frameworkError) throw frameworkError;

      // Update eligibility criteria
      if (data.eligibilityCriteria) {
        // Delete existing criteria
        await supabase
          .from('eligibility_criteria')
          .delete()
          .eq('framework_id', id);

        // Create new criteria
        const criteriaData = {
          framework_id: id,
          permitted_sics: data.eligibilityCriteria.permittedSics || [],
          environment_category: data.eligibilityCriteria.environmentCategory || null,
          countries_of_operation: data.eligibilityCriteria.countriesOfOperation || [],
          transition_impact_primary_quality: data.eligibilityCriteria.transitionImpactPrimaryQuality || null,
          client_types: data.eligibilityCriteria.clientTypes || [],
          product_types: data.eligibilityCriteria.productTypes || []
        };

        const { error: criteriaError } = await supabase
          .from('eligibility_criteria')
          .insert([criteriaData]);

        if (criteriaError) throw criteriaError;
      }

      // Update attributes
      if (data.attributes) {
        // Delete existing attributes
        await supabase
          .from('framework_attributes')
          .delete()
          .eq('framework_id', id);

        // Create new attributes if any
        if (data.attributes.length > 0) {
          const attributesData = data.attributes.map(attr => ({
            framework_id: id,
            name: attr.name,
            type: attr.type,
            value: attr.value
          }));

          const { error: attributesError } = await supabase
            .from('framework_attributes')
            .insert(attributesData);

          if (attributesError) throw attributesError;
        }
      }

      // Fetch updated framework with relations
      const { data: updatedFramework, error: fetchError } = await supabase
        .from('frameworks')
        .select('*, eligibility_criteria (*), framework_attributes (*), framework_documents (*)')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return snakeToCamel(updatedFramework);
    } catch (error) {
      console.error('Error updating framework:', error);
      throw error;
    }
  },

  list: async (): Promise<Framework[]> => {
    try {
      const { data, error } = await supabase
        .from('frameworks')
        .select('*, eligibility_criteria (*), framework_attributes (*), framework_documents (*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(snakeToCamel);
    } catch (error) {
      console.error('Error loading frameworks:', error);
      throw error;
    }
  },
};

export const projectsApi = {
  create: async (data: Partial<Project>): Promise<Project> => {
    try {
      const projectData = {
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

      const { data: project, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;
      return snakeToCamel(project);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  list: async (): Promise<Project[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(snakeToCamel);
    } catch (error) {
      console.error('Error loading projects:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    try {
      const projectData = {
        name: data.name,
        type: data.type,
        framework_id: data.frameworkId,
        party_id: data.partyId,
        party_name: data.partyName,
        role: data.role,
        max_limit_amount: Number(data.maxLimitAmount) || 0,
        currency: data.currency
      };

      const { data: project, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return snakeToCamel(project);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }
};