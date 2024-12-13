import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

const ATTRIBUTE_TYPES = [
  'DATE',
  'AMOUNT',
  'CURRENCY',
  'NUMERIC',
  'TEXT',
  'LIST',
] as const;

interface AdditionalAttributesFormProps {
  control: Control<any>;
  errors: any;
}

export function AdditionalAttributesForm({
  control,
  errors,
}: AdditionalAttributesFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Additional Attributes</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', type: 'TEXT', value: '' })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Attribute
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...control.register(`attributes.${index}.name`)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.attributes?.[index]?.name && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes[index].name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...control.register(`attributes.${index}.type`)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {ATTRIBUTE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <div className="flex gap-2">
              <input
                {...control.register(`attributes.${index}.value`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {errors.attributes?.[index]?.value && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes[index].value.message}</p>
            )}
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No additional attributes added yet. Click the button above to add one.
        </p>
      )}
    </div>
  );
}