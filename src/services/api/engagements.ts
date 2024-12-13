import { supabase } from '../../config/supabase';
import { Engagement } from '../../types/engagement';
import { snakeToCamel } from '../../utils/caseConversion';
import { handleApiError } from './utils/errorHandling';

export const engagementsApi = {
  create: async (data: Partial<Engagement>): Promise<Engagement> => {
    try {
      // Create engagement
      const { data: engagement, error } = await supabase
        .from('engagements')
        .insert([{
          name: data.name,
          description: data.description,
          types: data.types,
          framework_id: data.frameworkId,
          effective_from: data.effectiveFrom,
          effective_to: data.effectiveTo,
          status: data.status || 'DRAFT'
        }])
        .select()
        .single();

      if (error) throw error;

      // Add parties if any
      if (data.parties?.length) {
        const { error: partiesError } = await supabase
          .from('engagement_parties')
          .insert(data.parties.map(party => ({
            engagement_id: engagement.id,
            party_id: party.partyId,
            party_name: party.partyName,
            role: party.role,
            is_primary: party.isPrimary
          })));

        if (partiesError) throw partiesError;
      }

      // Add financials if any
      if (data.financials?.length) {
        const { error: financialsError } = await supabase
          .from('engagement_financials')
          .insert(data.financials.map(financial => ({
            engagement_id: engagement.id,
            reference: financial.reference,
            currency: financial.currency,
            amount: financial.amount,
            date: financial.date,
            comments: financial.comments
          })));

        if (financialsError) throw financialsError;
      }

      return await fetchEngagementWithRelations(engagement.id);
    } catch (error) {
      handleApiError(error, 'Error creating engagement');
    }
  },

  list: async (): Promise<Engagement[]> => {
    try {
      const { data, error } = await supabase
        .from('engagements')
        .select(`
          *,
          framework:frameworks (
            id,
            name
          ),
          engagement_parties (
            id,
            party_id,
            party_name,
            role,
            is_primary
          ),
          engagement_financials (
            id,
            reference,
            currency,
            amount,
            date,
            comments
          ),
          engagement_documents (
            id,
            name,
            type,
            url,
            comments
          ),
          engagement_attributes (
            id,
            name,
            type,
            value
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(snakeToCamel);
    } catch (error) {
      handleApiError(error, 'Error loading engagements');
    }
  },

  update: async (id: string, data: Partial<Engagement>): Promise<Engagement> => {
    try {
      // Update engagement
      const { error } = await supabase
        .from('engagements')
        .update({
          name: data.name,
          description: data.description,
          types: data.types,
          framework_id: data.frameworkId,
          effective_from: data.effectiveFrom,
          effective_to: data.effectiveTo,
          status: data.status
        })
        .eq('id', id);

      if (error) throw error;

      // Update related data
      await updateEngagementRelations(id, data);

      return await fetchEngagementWithRelations(id);
    } catch (error) {
      handleApiError(error, 'Error updating engagement');
    }
  }
};

async function fetchEngagementWithRelations(id: string): Promise<Engagement> {
  const { data, error } = await supabase
    .from('engagements')
    .select(`
      *,
      framework:frameworks (
        id,
        name
      ),
      engagement_parties (
        id,
        party_id,
        party_name,
        role,
        is_primary
      ),
      engagement_financials (
        id,
        reference,
        currency,
        amount,
        date,
        comments
      ),
      engagement_documents (
        id,
        name,
        type,
        url,
        comments
      ),
      engagement_attributes (
        id,
        name,
        type,
        value
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return snakeToCamel(data);
}

async function updateEngagementRelations(id: string, data: Partial<Engagement>) {
  // Update parties
  if (data.parties) {
    await supabase
      .from('engagement_parties')
      .delete()
      .eq('engagement_id', id);

    if (data.parties.length > 0) {
      await supabase
        .from('engagement_parties')
        .insert(data.parties.map(party => ({
          engagement_id: id,
          party_id: party.partyId,
          party_name: party.partyName,
          role: party.role,
          is_primary: party.isPrimary
        })));
    }
  }

  // Update financials
  if (data.financials) {
    await supabase
      .from('engagement_financials')
      .delete()
      .eq('engagement_id', id);

    if (data.financials.length > 0) {
      await supabase
        .from('engagement_financials')
        .insert(data.financials.map(financial => ({
          engagement_id: id,
          reference: financial.reference,
          currency: financial.currency,
          amount: financial.amount,
          date: financial.date,
          comments: financial.comments
        })));
    }
  }
}