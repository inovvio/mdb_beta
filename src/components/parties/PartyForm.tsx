import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Users, Building2, Building, Plus, FileStack } from 'lucide-react';
import { Party } from '../../types/party';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { partySchema, PartyFormData } from '../../schemas/partySchemas';
import { PartyDetailsTab } from './tabs/PartyDetailsTab';
import { PartyContactsTab } from './tabs/PartyContactsTab';
import { PartyBankDetailsTab } from './tabs/PartyBankDetailsTab';
import { PartySSITab } from './tabs/PartySSITab';
import { PartyAttributesTab } from './tabs/PartyAttributesTab';
import { PartyDocumentsTab } from './tabs/PartyDocumentsTab';

interface PartyFormProps {
  party?: Party;
  onSubmit: (data: Partial<Party>) => Promise<void>;
  onCancel: () => void;
}

export function PartyForm({ party, onSubmit, onCancel }: PartyFormProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
    defaultValues: party || {
      status: 'ACTIVE',
      roles: [],
      attributes: [],
      documents: []
    }
  });

  const tabs = [
    { id: 'details', label: 'Party Details', icon: <FileText className="h-4 w-4" /> },
    { id: 'contacts', label: 'Contacts', icon: <Users className="h-4 w-4" /> },
    { id: 'bank-details', label: 'Bank Details', icon: <Building2 className="h-4 w-4" /> },
    { id: 'ssi', label: 'SSI', icon: <Building className="h-4 w-4" /> },
    { id: 'attributes', label: 'Additional Info', icon: <Plus className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileStack className="h-4 w-4" /> },
  ];

  const onFormSubmit = async (data: PartyFormData) => {
    setIsSaving(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error saving party:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    // Prevent default form submission behavior
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-6">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mt-6">
          {activeTab === 'details' && (
            <PartyDetailsTab
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}

          {activeTab === 'contacts' && (
            <PartyContactsTab
              contacts={party?.contacts || []}
              partyId={party?.id}
            />
          )}

          {activeTab === 'bank-details' && (
            <PartyBankDetailsTab
              bankDetails={party?.bankDetails || []}
              partyId={party?.id}
            />
          )}

          {activeTab === 'ssi' && (
            <PartySSITab
              ssiList={party?.ssiList || []}
              partyId={party?.id}
            />
          )}

          {activeTab === 'attributes' && (
            <PartyAttributesTab
              control={control}
              errors={errors}
            />
          )}

          {activeTab === 'documents' && (
            <PartyDocumentsTab
              control={control}
              errors={errors}
            />
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Party'}
          </Button>
        </div>
      </form>
    </div>
  );
}