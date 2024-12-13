import { supabase } from '../../../config/supabase';

export const frameworkQueries = {
  getFrameworkWithRelations: `
    *,
    eligibility_criteria (*),
    framework_attributes (*),
    framework_documents (*)
  `,

  getBasicFramework: '*',
};

export async function executeFrameworkQuery(query: string, options: any = {}) {
  const builder = supabase.from('frameworks').select(query);
  
  if (options.id) {
    builder.eq('id', options.id);
  }
  
  if (options.orderBy) {
    builder.order(options.orderBy.field, options.orderBy);
  }
  
  if (options.single) {
    return builder.single();
  }
  
  return builder;
}