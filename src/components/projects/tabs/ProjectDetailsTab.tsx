```tsx
import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form';
import { ProjectType, ProjectStatus } from '../../../types/project';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Search } from 'lucide-react';

interface ProjectDetailsTabProps {
  register: UseFormRegister<any>;
  errors: any;
  control: Control<any>;
  watch: UseFormWatch<any>;
  frameworks: any[];
  onPartySearch: () => void;
}

export function ProjectDetailsTab({
  register,
  errors,
  control,
  watch,
  frameworks,
  onPartySearch
}: ProjectDetailsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Input
        label="Project ID"
        {...register('projectId')}
        error={errors.projectId?.message}
        disabled
      />

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

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          {Object.values(ProjectType).map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          {Object.values(ProjectStatus).map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Framework</label>
        <select
          {...register('frameworkId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Primary Party</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            {...register('primaryParty')}
            className="flex-1 rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            readOnly
          />
          <button
            type="button"
            onClick={onPartySearch}
            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
        {errors.primaryParty && (
          <p className="mt-1 text-sm text-red-600">{errors.primaryParty.message}</p>
        )}
      </div>
    </div>
  );
}
```