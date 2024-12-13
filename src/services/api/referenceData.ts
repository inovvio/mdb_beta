import { supabase } from '../../config/supabase';
import { handleApiError } from './utils/errorHandling';

export const referenceDataApi = {
  getByName: async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('application_ref_data')
        .select('*')
        .eq('reference_data_name', name)
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error loading reference data:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(`Error loading reference data for ${name}:`, error);
      throw error;
    }
  }
};