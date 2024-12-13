import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { PartyRole, PartyStatus } from '../../../types/party';
import { Input } from '../../ui/Input';
import { MultiSelect } from '../../ui/MultiSelect';
import { COUNTRIES } from '../../../utils/constants';

interface PartyDetailsTabProps {
  register: UseFormRegister<any>;
  errors: any;
  setValue: (name: string, value: any) => void;
  watch: UseFormWatch<any>;
}

export function PartyDetailsTab({
  register,
  errors,
  setValue,
  watch
}: PartyDetailsTabProps) {
  const watchedValues = {
    roles: watch('roles') || [],
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Input
        label="Party Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Legal Name"
        {...register('legalName')}
        error={errors.legalName?.message}
      />

      <Input
        label="Short Name (Optional)"
        {...register('shortName')}
        error={errors.shortName?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Country</label>
        <select
          {...register('country')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select Country</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {Object.values(PartyStatus).map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <MultiSelect
          label="Roles"
          options={Object.values(PartyRole)}
          value={watchedValues.roles}
          onChange={(value) => setValue('roles', value)}
          error={errors.roles?.message}
          placeholder="Select roles..."
        />
      </div>
    </div>
  );
}