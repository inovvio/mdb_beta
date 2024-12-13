import { supabase } from '../../config/supabase';
import { FrameworkAttribute } from '../../types';
import { camelToSnake } from '../../utils/caseConversion';

export async function createFrameworkAttributes(
  frameworkId: string,
  attributes: Partial<FrameworkAttribute>[]
) {
  const attributesData = attributes.map(attr => ({
    frameworkId,
    name: attr.name,
    type: attr.type,
    value: attr.value,
  }));

  const { error } = await supabase
    .from('framework_attributes')
    .insert(attributesData.map(camelToSnake));

  if (error) throw error;
}

export async function updateFrameworkAttributes(
  frameworkId: string,
  attributes: Partial<FrameworkAttribute>[]
) {
  // Delete existing attributes
  await supabase
    .from('framework_attributes')
    .delete()
    .eq('framework_id', frameworkId);

  // Create new attributes if any
  if (attributes.length > 0) {
    await createFrameworkAttributes(frameworkId, attributes);
  }
}