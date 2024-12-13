import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Users, Plus, FileStack, DollarSign } from 'lucide-react';
import { Engagement } from '../../types/engagement';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { engagementSchema } from '../../schemas/engagementSchemas';
import { EngagementDetailsTab } from './tabs/EngagementDetailsTab';
import { EngagementPartiesTab } from './tabs/EngagementPartiesTab';
import { EngagementDocumentsTab } from './tabs/EngagementDocumentsTab';
import { EngagementAttributesTab } from './tabs/EngagementAttributesTab';
import { EngagementFinancialsTab } from './tabs/EngagementFinancialsTab';
import { toast } from 'react-hot-toast';

interface EngagementFormProps {
  engagement?: Engagement;
  onSubmit: (data: Partial<Engagement>) => Promise<void>;
  onCancel: () => void;
}

export function EngagementForm({ engagement, onSubmit, onCancel }: EngagementFormProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(engagementSchema),
    defaultValues: engagement || {
      types: [],
      status: 'DRAFT',
      parties: [],
      attributes: [],
      documents: [],
      financials: []
    }
  });

  const onFormSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      await onSubmit(data);
    } catch (error: any) {
      console.error('Error saving engagement:', error);
      toast.error(error.message || 'Failed to save engagement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    // Prevent form submission when changing tabs
    setActiveTab(tabId);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <Tabs
          tabs={[
            { id: 'details', label: 'Engagement Details', icon: <FileText className="h-4 w-4" /> },
            { id: 'parties', label: 'Parties', icon: <Users className="h-4 w-4" /> },
            { id: 'financials', label: 'Financials', icon: <DollarSign className="h-4 w-4" /> },
            { id: 'documents', label: 'Documents', icon: <FileStack className="h-4 w-4" /> },
            { id: 'attributes', label: 'Additional Info', icon: <Plus className="h-4 w-4" /> },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <form onSubmit={methods.handleSubmit(onFormSubmit)}>
          <div className="mt-6">
            {activeTab === 'details' && (
              <EngagementDetailsTab
                register={methods.register}
                control={methods.control}
                errors={methods.formState.errors}
                setValue={methods.setValue}
                watch={methods.watch}
              />
            )}

            {activeTab === 'parties' && (
              <EngagementPartiesTab
                control={methods.control}
                errors={methods.formState.errors}
              />
            )}

            {activeTab === 'financials' && (
              <EngagementFinancialsTab
                control={methods.control}
                errors={methods.formState.errors}
                watch={methods.watch}
                setValue={methods.setValue}
              />
            )}

            {activeTab === 'documents' && (
              <EngagementDocumentsTab
                control={methods.control}
                errors={methods.formState.errors}
              />
            )}

            {activeTab === 'attributes' && (
              <EngagementAttributesTab
                control={methods.control}
                errors={methods.formState.errors}
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
              {isSaving ? 'Saving...' : 'Save Engagement'}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}