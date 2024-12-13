import { supabase } from '../../config/supabase';
import { WorkflowTransition } from '../../types/workflow';
import { snakeToCamel } from '../../utils/caseConversion';
import { handleApiError } from './utils/errorHandling';

export const workflowsApi = {
  create: async (data: Partial<WorkflowTransition>): Promise<WorkflowTransition> => {
    try {
      const { data: workflow, error } = await supabase
        .from('workflow_transitions')
        .insert([{
          entity_type: data.entityType,
          start_state: data.startState,
          end_state: data.endState,
          priority: data.priority,
          stp_flag: data.stpFlag,
          create_task_flag: data.createTaskFlag,
          create_notification_flag: data.createNotificationFlag,
          active_flag: data.activeFlag,
          rules: data.rules
        }])
        .select()
        .single();

      if (error) throw error;
      return snakeToCamel(workflow);
    } catch (error) {
      handleApiError(error, 'Error creating workflow transition');
    }
  },

  list: async (): Promise<WorkflowTransition[]> => {
    try {
      const { data, error } = await supabase
        .from('workflow_transitions')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(snakeToCamel);
    } catch (error) {
      handleApiError(error, 'Error loading workflow transitions');
    }
  },

  update: async (id: string, data: Partial<WorkflowTransition>): Promise<WorkflowTransition> => {
    try {
      const { data: workflow, error } = await supabase
        .from('workflow_transitions')
        .update({
          entity_type: data.entityType,
          start_state: data.startState,
          end_state: data.endState,
          priority: data.priority,
          stp_flag: data.stpFlag,
          create_task_flag: data.createTaskFlag,
          create_notification_flag: data.createNotificationFlag,
          active_flag: data.activeFlag,
          rules: data.rules
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return snakeToCamel(workflow);
    } catch (error) {
      handleApiError(error, 'Error updating workflow transition');
    }
  }
};