import { useState, useEffect } from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { EngagementStatus } from '../../../types/engagement';
import { Input } from '../../ui/Input';
import { MultiSelect } from '../../ui/MultiSelect';
import { frameworksApi } from '../../../services/api';
import { referenceDataApi } from '../../../services/api/referenceData';
import { toast } from 'react-hot-toast';

interface Framework {
  id: string;
  name: string;
}

interface EngagementType {
  code: string;
  description: string;
}

interface EngagementDetailsTabProps {
  register: UseFormRegister<any>;
  errors: any;
  setValue: (name: string, value: any) => void;
  watch: UseFormWatch<any>;
}

export function EngagementDetailsTab({
  register,
  errors,
  setValue,
  watch
}: EngagementDetailsTabProps) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [engagementTypes, setEngagementTypes] = useState<EngagementType[]>([]);
  const [isLoadingFrameworks, setIsLoadingFrameworks] = useState(true);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  const watchedValues = {
    types: watch('types') || [],
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load frameworks
        const frameworksData = await frameworksApi.list();
        setFrameworks(frameworksData);
        setIsLoadingFrameworks(false);

        // Load engagement types
        const typesData = await referenceDataApi.getByName('Engagement Type');
        setEngagementTypes(typesData);
        setIsLoadingTypes(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load required data');
      }
    };
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <div className="md:col-span-2">
        <Input
          label="Description"
          {...register('description')}
          error={errors.description?.message}
          multiline
          rows={3}
        />
      </div>

      <div className="md:col-span-2">
        <MultiSelect
          label="Types"
          options={engagementTypes.map(type => type.code)}
          value={watchedValues.types}
          onChange={(value) => setValue('types', value)}
          error={errors.types?.message}
          placeholder="Select engagement types..."
          isLoading={isLoadingTypes}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Framework</label>
        <select
          {...register('frameworkId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          disabled={isLoadingFrameworks}
        >
          <option value="">Select Framework</option>
          {frameworks.map((framework) => (
            <option key={framework.id} value={framework.id}>
              {framework.name}
            </option>
          ))}
        </select>
        {errors.frameworkId && (
          <p className="mt-1 text-sm text-red-600">{errors.frameworkId.message}</p>
        )}
        {isLoadingFrameworks && (
          <p className="mt-1 text-sm text-gray-500">Loading frameworks...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          {Object.values(EngagementStatus).map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <Input
        type="date"
        label="Effective From"
        {...register('effectiveFrom')}
        error={errors.effectiveFrom?.message}
      />

      <Input
        type="date"
        label="Effective To"
        {...register('effectiveTo')}
        error={errors.effectiveTo?.message}
      />
    </div>
  );
}