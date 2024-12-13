import { useFieldArray, UseFormRegister, Control } from 'react-hook-form';
import { z } from 'zod';
import { EnvironmentCategory, ClientType, ProductType } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MultiSelect } from '../ui/MultiSelect';
import { Plus, Trash2 } from 'lucide-react';
import { COUNTRIES } from '../../utils/constants';

const eligibilityCriteriaSchema = z.object({
  permittedSICs: z.array(z.string()).optional(),
  environmentCategory: z.array(z.enum(['A', 'B', 'C', 'FI'])).optional(),
  countriesOfOperation: z.array(z.string()).optional(),
  transitionImpactPrimaryQuality: z.string().optional(),
  clientTypes: z.array(z.enum(['CORPORATE', 'FINANCIAL_INSTITUTION', 'GOVERNMENT', 'SME'])).optional(),
  productTypes: z.array(z.enum(['LOAN', 'GUARANTEE', 'EQUITY', 'TECHNICAL_ASSISTANCE'])).optional(),
  attributes: z.array(z.object({
    key: z.string().min(1, 'Key is required'),
    value: z.string().min(1, 'Value is required'),
  })).optional(),
});

export type EligibilityCriteriaFormData = z.infer<typeof eligibilityCriteriaSchema>;

interface EligibilityCriteriaFormProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: any;
  setValue: (name: string, value: any) => void;
  watch: (name: string) => any;
}

export function EligibilityCriteriaForm({
  register,
  control,
  errors,
  setValue,
  watch,
}: EligibilityCriteriaFormProps) {
  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control,
    name: 'eligibilityCriteria.attributes',
  });

  const watchedValues = {
    environmentCategory: watch('eligibilityCriteria.environmentCategory') || [],
    clientTypes: watch('eligibilityCriteria.clientTypes') || [],
    productTypes: watch('eligibilityCriteria.productTypes') || [],
    countriesOfOperation: watch('eligibilityCriteria.countriesOfOperation') || [],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Permitted SICs (comma-separated)"
          {...register('eligibilityCriteria.permittedSICs')}
          placeholder="e.g., 7371, 7372, 7373"
        />

        <MultiSelect
          label="Environment Categories"
          options={Object.values(EnvironmentCategory)}
          value={watchedValues.environmentCategory}
          onChange={(value) => setValue('eligibilityCriteria.environmentCategory', value)}
          placeholder="Select categories..."
        />

        <MultiSelect
          label="Countries of Operation"
          options={COUNTRIES}
          value={watchedValues.countriesOfOperation}
          onChange={(value) => setValue('eligibilityCriteria.countriesOfOperation', value)}
          placeholder="Select countries..."
        />

        <Input
          label="Transition Impact Primary Quality"
          {...register('eligibilityCriteria.transitionImpactPrimaryQuality')}
          placeholder="e.g., Green Economy Transition"
        />

        <MultiSelect
          label="Client Types"
          options={Object.values(ClientType).map(type => type.replace('_', ' '))}
          value={watchedValues.clientTypes}
          onChange={(value) => setValue('eligibilityCriteria.clientTypes', value)}
          placeholder="Select client types..."
        />

        <MultiSelect
          label="Product Types"
          options={Object.values(ProductType).map(type => type.replace('_', ' '))}
          value={watchedValues.productTypes}
          onChange={(value) => setValue('eligibilityCriteria.productTypes', value)}
          placeholder="Select product types..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Additional Criteria</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAttribute({ key: '', value: '' })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Criteria
          </Button>
        </div>

        {attributeFields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start">
            <Input
              label="Key"
              {...register(`eligibilityCriteria.attributes.${index}.key`)}
              error={errors.eligibilityCriteria?.attributes?.[index]?.key?.message}
            />
            <Input
              label="Value"
              {...register(`eligibilityCriteria.attributes.${index}.value`)}
              error={errors.eligibilityCriteria?.attributes?.[index]?.value?.message}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => removeAttribute(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}