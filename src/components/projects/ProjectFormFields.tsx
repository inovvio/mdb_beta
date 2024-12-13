import { UseFormRegister, Control, UseFormWatch } from 'react-hook-form';
import { ProjectType, PartyRole } from '../../types';
import { Input } from '../ui/Input';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Search } from 'lucide-react';
import { ProjectFormData } from '../../schemas/projectSchemas';

interface ProjectFormFieldsProps {
  register: UseFormRegister<ProjectFormData>;
  control: Control<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  errors: any;
  frameworks: any[];
  onPartySearch: () => void;
  setValue: (name: keyof ProjectFormData, value: any) => void;
}

export function ProjectFormFields({
  register,
  control,
  watch,
  errors,
  frameworks,
  onPartySearch,
  setValue,
}: ProjectFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Input
        label="Project Name"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {Object.entries(ProjectType).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Framework</label>
        <select
          {...register('frameworkId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
        <label className="block text-sm font-medium text-gray-700">Party</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            {...register('partyName')}
            className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            readOnly
          />
          <button
            type="button"
            onClick={onPartySearch}
            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          {...register('role')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {Object.entries(PartyRole).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace('_', ' ')}
            </option>
          ))}
        </select>
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

      <CurrencyInput
        label="Maximum Limit Amount"
        value={watch('maxLimitAmount')?.toString()}
        onChange={(e) => setValue('maxLimitAmount', Number(e.target.value))}
        currency={watch('currency')}
        onCurrencyChange={(value) => setValue('currency', value)}
        error={errors.maxLimitAmount?.message}
      />
    </div>
  );
}