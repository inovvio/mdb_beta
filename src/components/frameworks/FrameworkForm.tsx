import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, ListTree, CheckSquare, Plus, FileStack } from 'lucide-react';
import { Framework } from '../../types';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { frameworkSchema } from '../../schemas/frameworkSchemas';
import { FrameworkDetailsTab } from './tabs/FrameworkDetailsTab';
import { EligibilityCriteriaForm } from './EligibilityCriteriaForm';
import { AdditionalAttributesForm } from './AdditionalAttributesForm';
import { DocumentsTab } from './DocumentsTab';
import { FrameworkHierarchy } from './FrameworkHierarchy';
import { frameworksApi } from '../../services/api';
import { referenceDataApi } from '../../services/api/referenceData';
import { toast } from 'react-hot-toast';

interface FrameworkFormProps {
  framework?: Framework;
  onSubmit: (data: Partial<Framework>) => Promise<void>;
  onCancel: () => void;
}

export function FrameworkForm({ framework, onSubmit, onCancel }: FrameworkFormProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [frameworkTypes, setFrameworkTypes] = useState<any[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load frameworks for hierarchy
        const frameworksData = await frameworksApi.list();
        setFrameworks(frameworksData);

        // Load framework types
        const typesData = await referenceDataApi.getByName('Framework Type');
        setFrameworkTypes(typesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load required data');
      } finally {
        setIsLoadingTypes(false);
      }
    };

    loadData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(frameworkSchema),
    defaultValues: framework || {
      type: '',
      currency: 'USD',
      status: 'DRAFT',
      attributes: [],
      documents: []
    }
  });

  const tabs = [
    { id: 'details', label: 'Framework Details', icon: <FileText className="h-4 w-4" /> },
    { id: 'eligibility', label: 'Eligibility Criteria', icon: <CheckSquare className="h-4 w-4" /> },
    { id: 'additional', label: 'Additional Info', icon: <Plus className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileStack className="h-4 w-4" /> },
    { id: 'hierarchy', label: 'Hierarchy', icon: <ListTree className="h-4 w-4" /> },
  ];

  const onFormSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await onSubmit(data);
      toast.success(framework ? 'Framework updated successfully' : 'Framework created successfully');
    } catch (error: any) {
      console.error('Error saving framework:', error);
      toast.error(error.message || 'Failed to save framework');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="mt-6">
        {activeTab === 'details' && (
          <FrameworkDetailsTab
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            frameworkTypes={frameworkTypes}
            isLoadingTypes={isLoadingTypes}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityCriteriaForm
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        )}

        {activeTab === 'additional' && (
          <AdditionalAttributesForm
            control={control}
            errors={errors}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsTab
            control={control}
            errors={errors}
          />
        )}

        {activeTab === 'hierarchy' && (
          <FrameworkHierarchy
            frameworks={frameworks}
            selectedFrameworkId={framework?.id}
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
          {isSaving ? 'Saving...' : 'Save Framework'}
        </Button>
      </div>
    </form>
  );
}