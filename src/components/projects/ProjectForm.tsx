```tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, FileStack, Plus, History } from 'lucide-react';
import { Project } from '../../types/project';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { projectSchema } from '../../schemas/projectSchemas';
import { ProjectDetailsTab } from './tabs/ProjectDetailsTab';
import { ProjectDocumentsTab } from './tabs/ProjectDocumentsTab';
import { ProjectAttributesTab } from './tabs/ProjectAttributesTab';
import { ProjectHistoryTab } from './tabs/ProjectHistoryTab';
import { toast } from 'react-hot-toast';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      type: 'INVESTMENT',
      status: 'DRAFT',
      attributes: [],
      documents: []
    }
  });

  const tabs = [
    { id: 'details', label: 'Project Details', icon: <FileText className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileStack className="h-4 w-4" /> },
    { id: 'attributes', label: 'Additional Info', icon: <Plus className="h-4 w-4" /> },
    { id: 'history', label: 'History', icon: <History className="h-4 w-4" /> },
  ];

  const onFormSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await onSubmit(data);
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePartySearch = () => {
    // TODO: Implement party search modal
    console.log('Party search clicked');
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'details' && (
          <ProjectDetailsTab
            register={register}
            control={control}
            watch={watch}
            errors={errors}
            onPartySearch={handlePartySearch}
          />
        )}

        {activeTab === 'documents' && (
          <ProjectDocumentsTab
            control={control}
            errors={errors}
          />
        )}

        {activeTab === 'attributes' && (
          <ProjectAttributesTab
            control={control}
            errors={errors}
          />
        )}

        {activeTab === 'history' && (
          <ProjectHistoryTab
            history={project?.history || []}
          />
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  );
}
```