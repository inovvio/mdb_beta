import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form';
import { Input } from '../../ui/Input';
import { CurrencyInput } from '../../ui/CurrencyInput';

interface FrameworkType {
  id: string;
  reference_data_name: string;
  code: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

interface FrameworkDetailsTabProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: any;
  setValue: (name: string, value: any) => void;
  watch: UseFormWatch<any>;
  frameworkTypes: FrameworkType[];
  isLoadingTypes: boolean;
}

export function FrameworkDetailsTab({
  register,
  control,
  errors,
  setValue,
  watch,
  frameworkTypes,
  isLoadingTypes
}: FrameworkDetailsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Input
        label="Framework Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          disabled={isLoadingTypes}
        >
          <option value="">Select Type</option>
          {frameworkTypes.map((type) => (
            <option key={type.id} value={type.code}>
              {type.description}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
        {isLoadingTypes && (
          <p className="mt-1 text-sm text-gray-500">Loading framework types...</p>
        )}
      </div>

      <Input
        label="Short Description"
        {...register('shortDescription')}
        error={errors.shortDescription?.message}
      />

      <div className="md:col-span-2">
        <Input
          label="Long Description"
          {...register('longDescription')}
          error={errors.longDescription?.message}
          multiline
          rows={3}
        />
      </div>

      <CurrencyInput
        label="Initial Allocated Amount"
        value={watch('initialAllocatedAmount')?.toString()}
        onChange={(e) => setValue('initialAllocatedAmount', Number(e.target.value))}
        currency={watch('currency')}
        onCurrencyChange={(value) => setValue('currency', value)}
        error={errors.initialAllocatedAmount?.message}
      />

      <CurrencyInput
        label="Maximum Amount Per Transaction"
        value={watch('maxAmountPerTransaction')?.toString()}
        onChange={(e) => setValue('maxAmountPerTransaction', Number(e.target.value))}
        currency={watch('currency')}
        onCurrencyChange={(value) => setValue('currency', value)}
        error={errors.maxAmountPerTransaction?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          {...register('priority')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <Input
        label="Framework Lead"
        {...register('frameworkLead')}
        error={errors.frameworkLead?.message}
      />
    </div>
  );
}