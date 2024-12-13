import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Building } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { CURRENCIES } from '../../../utils/constants';
import { ssiSchema, SSIFormData } from '../../../schemas/ssiSchemas';
import { validateSSI } from '../../../utils/ssiValidation';
import { toast } from 'react-hot-toast';

interface SSI {
  id: string;
  currency: string;
  correspondentBank: string;
  correspondentSwift: string;
  intermediaryBank?: string;
  intermediarySwift?: string;
  beneficiaryBank: string;
  beneficiarySwift: string;
  beneficiaryAccount: string;
  beneficiaryName: string;
  specialInstructions?: string;
  isPrimary: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

interface PartySSITabProps {
  ssiList: SSI[];
  partyId?: string;
  onSSIAdded?: () => void;
}

export function PartySSITab({ ssiList: initialSSIList, partyId, onSSIAdded }: PartySSITabProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSSI, setSelectedSSI] = useState<SSI | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    trigger
  } = useForm<SSIFormData>({
    resolver: zodResolver(ssiSchema),
    defaultValues: selectedSSI || {
      currency: '',
      isPrimary: false,
      status: 'ACTIVE'
    }
  });

  const handleAddClick = () => {
    setSelectedSSI(undefined);
    reset();
    setShowForm(true);
  };

  const handleSSIClick = (ssi: SSI) => {
    setSelectedSSI(ssi);
    reset(ssi);
    setShowForm(true);
  };

  const onSubmit = async (data: SSIFormData) => {
    try {
      const validationErrors = validateSSI(data);
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error));
        return;
      }

      if (data.isPrimary && !selectedSSI) {
        const existingPrimary = initialSSIList.find(
          ssi => ssi.currency === data.currency && ssi.isPrimary
        );
        if (existingPrimary) {
          toast.error(`A primary SSI already exists for ${data.currency}`);
          return;
        }
      }

      // TODO: Save SSI data
      console.log('SSI data to save:', data);
      onSSIAdded?.();
      setShowForm(false);
      toast.success(`SSI ${selectedSSI ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving SSI:', error);
      toast.error('Failed to save SSI');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Standard Settlement Instructions</h3>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add SSI
        </Button>
      </div>

      {/* SSI List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {initialSSIList.map((ssi) => (
          <div
            key={ssi.id}
            onClick={() => handleSSIClick(ssi)}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-500 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <h4 className="font-medium text-gray-900">{ssi.beneficiaryBank}</h4>
                  <p className="text-sm text-gray-500">{ssi.currency}</p>
                </div>
              </div>
              {ssi.isPrimary && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Primary
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Beneficiary:</span>{' '}
                <span className="font-medium">{ssi.beneficiaryName}</span>
              </div>
              <div>
                <span className="text-gray-500">Account:</span>{' '}
                <span className="font-medium">{ssi.beneficiaryAccount}</span>
              </div>
              <div>
                <span className="text-gray-500">SWIFT:</span>{' '}
                <span className="font-medium">{ssi.beneficiarySwift}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SSI Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {selectedSSI ? 'Edit SSI' : 'Add SSI'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  {...register('currency')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Currency</option>
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>

              <Input
                label="Correspondent Bank"
                {...register('correspondentBank')}
                error={errors.correspondentBank?.message}
              />

              <Input
                label="Correspondent SWIFT"
                {...register('correspondentSwift')}
                error={errors.correspondentSwift?.message}
                onBlur={() => trigger('correspondentSwift')}
              />

              <Input
                label="Intermediary Bank (Optional)"
                {...register('intermediaryBank')}
                error={errors.intermediaryBank?.message}
              />

              <Input
                label="Intermediary SWIFT (Optional)"
                {...register('intermediarySwift')}
                error={errors.intermediarySwift?.message}
                onBlur={() => trigger('intermediarySwift')}
              />

              <Input
                label="Beneficiary Bank"
                {...register('beneficiaryBank')}
                error={errors.beneficiaryBank?.message}
              />

              <Input
                label="Beneficiary SWIFT"
                {...register('beneficiarySwift')}
                error={errors.beneficiarySwift?.message}
                onBlur={() => trigger('beneficiarySwift')}
              />

              <Input
                label="Beneficiary Account"
                {...register('beneficiaryAccount')}
                error={errors.beneficiaryAccount?.message}
              />

              <Input
                label="Beneficiary Name"
                {...register('beneficiaryName')}
                error={errors.beneficiaryName?.message}
              />

              <div className="md:col-span-2">
                <Input
                  label="Special Instructions (Optional)"
                  {...register('specialInstructions')}
                  error={errors.specialInstructions?.message}
                  multiline
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  {...register('isPrimary')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Set as primary SSI for this currency</label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save SSI'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}