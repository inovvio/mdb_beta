import { supabase } from '../../config/supabase';
import { Project, ProjectParty, ProjectDocument, ProjectAttribute } from '../../types/project';
import { snakeToCamel } from '../../utils/caseConversion';
import { handleApiError } from './utils/errorHandling';
import { generateProjectId } from './utils/idGenerator';

export const projectsApi = {
  create: async (data: Partial<Project>): Promise<Project> => {
    try {
      const projectData = {
        project_id: generateProjectId(),
        name: data.name,
        description: data.description,
        type: data.type,
        framework_id: data.frameworkId,
        status: 'DRAFT'
      };

      // Create project
      const { data: project, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select(`
          *,
          framework:frameworks (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      // Add parties
      if (data.parties?.length) {
        const { error: partiesError } = await supabase
          .from('project_parties')
          .insert(data.parties.map(party => ({
            project_id: project.id,
            party_id: party.partyId,
            party_name: party.partyName,
            role: party.role,
            is_primary: party.isPrimary
          })));

        if (partiesError) throw partiesError;
      }

      // Add attributes
      if (data.attributes?.length) {
        const { error: attributesError } = await supabase
          .from('project_attributes')
          .insert(data.attributes.map(attr => ({
            project_id: project.id,
            name: attr.name,
            type: attr.type,
            value: attr.value
          })));

        if (attributesError) throw attributesError;
      }

      // Add documents
      if (data.documents?.length) {
        const { error: documentsError } = await supabase
          .from('project_documents')
          .insert(data.documents.map(doc => ({
            project_id: project.id,
            name: doc.name,
            type: doc.type,
            url: doc.url,
            comments: doc.comments
          })));

        if (documentsError) throw documentsError;
      }

      // Add initial history entry
      const { error: historyError } = await supabase
        .from('project_history')
        .insert([{
          project_id: project.id,
          action: 'CREATE',
          description: 'Project created',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          user_name: 'System'
        }]);

      if (historyError) throw historyError;

      return snakeToCamel(project);
    } catch (error) {
      handleApiError(error, 'Error creating project');
    }
  },

  list: async (): Promise<Project[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          framework:frameworks (
            id,
            name
          ),
          project_parties (*),
          project_documents (*),
          project_attributes (*),
          project_history (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(snakeToCamel);
    } catch (error) {
      handleApiError(error, 'Error loading projects');
    }
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    try {
      const projectData = {
        name: data.name,
        description: data.description,
        type: data.type,
        framework_id: data.frameworkId,
        status: data.status
      };

      const { data: project, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select(`
          *,
          framework:frameworks (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      // Update related data
      await updateProjectRelations(id, data);

      // Add history entry
      const { error: historyError } = await supabase
        .from('project_history')
        .insert([{
          project_id: id,
          action: 'UPDATE',
          description: 'Project updated',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          user_name: 'System'
        }]);

      if (historyError) throw historyError;

      return snakeToCamel(project);
    } catch (error) {
      handleApiError(error, 'Error updating project');
    }
  }
};

async function updateProjectRelations(projectId: string, data: Partial<Project>) {
  // Update parties
  if (data.parties) {
    await supabase
      .from('project_parties')
      .delete()
      .eq('project_id', projectId);

    if (data.parties.length > 0) {
      await supabase
        .from('project_parties')
        .insert(data.parties.map(party => ({
          project_id: projectId,
          party_id: party.partyId,
          party_name: party.partyName,
          role: party.role,
          is_primary: party.isPrimary
        })));
    }
  }

  // Update attributes
  if (data.attributes) {
    await supabase
      .from('project_attributes')
      .delete()
      .eq('project_id', projectId);

    if (data.attributes.length > 0) {
      await supabase
        .from('project_attributes')
        .insert(data.attributes.map(attr => ({
          project_id: projectId,
          name: attr.name,
          type: attr.type,
          value: attr.value
        })));
    }
  }

  // Update documents
  if (data.documents) {
    await supabase
      .from('project_documents')
      .delete()
      .eq('project_id', projectId);

    if (data.documents.length > 0) {
      await supabase
        .from('project_documents')
        .insert(data.documents.map(doc => ({
          project_id: projectId,
          name: doc.name,
          type: doc.type,
          url: doc.url,
          comments: doc.comments
        })));
    }
  }
}