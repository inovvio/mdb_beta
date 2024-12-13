import { supabase } from '../../config/supabase';
import { Party, PartyContact } from '../../types/party';
import { snakeToCamel } from '../../utils/caseConversion';
import { handleApiError } from './utils/errorHandling';

export const partiesApi = {
  create: async (data: Partial<Party>): Promise<Party> => {
    try {
      const partyData = {
        name: data.name,
        legal_name: data.legalName,
        short_name: data.shortName,
        roles: data.roles,
        country: data.country,
        status: data.status || 'ACTIVE'
      };

      const { data: party, error } = await supabase
        .from('parties')
        .insert([partyData])
        .select('*, party_contacts(*)')
        .single();

      if (error) throw error;
      return snakeToCamel(party);
    } catch (error) {
      handleApiError(error, 'Error creating party');
    }
  },

  list: async (): Promise<Party[]> => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .select('*, party_contacts(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(snakeToCamel);
    } catch (error) {
      handleApiError(error, 'Error loading parties');
    }
  },

  update: async (id: string, data: Partial<Party>): Promise<Party> => {
    try {
      const partyData = {
        name: data.name,
        legal_name: data.legalName,
        short_name: data.shortName,
        roles: data.roles,
        country: data.country,
        status: data.status
      };

      const { data: party, error } = await supabase
        .from('parties')
        .update(partyData)
        .eq('id', id)
        .select('*, party_contacts(*)')
        .single();

      if (error) throw error;
      return snakeToCamel(party);
    } catch (error) {
      handleApiError(error, 'Error updating party');
    }
  },

  addContact: async (partyId: string, contact: Partial<PartyContact>): Promise<PartyContact> => {
    try {
      const contactData = {
        party_id: partyId,
        name: contact.name,
        designation: contact.designation,
        email: contact.email,
        phone: contact.phone,
        mobile: contact.mobile,
        address: contact.address,
        is_primary: contact.isPrimary || false
      };

      const { data, error } = await supabase
        .from('party_contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) throw error;
      return snakeToCamel(data);
    } catch (error) {
      handleApiError(error, 'Error adding party contact');
    }
  }
};