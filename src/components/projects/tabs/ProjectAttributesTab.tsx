```tsx
import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface ProjectAttributesTabProps {
  control: Control<any>;
  errors: any;
}

export function ProjectAttributesTab({ control, errors }: ProjectAttributesTabProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes'
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Additional Information</h3>
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
          <Input
            label="Name"
            {...control.register(`attributes.${index}.name`)}
            error={errors.attributes?.[index]?.name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...control.register(`attributes.${index}.type`)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="DATE">Date</option>
              <option value="BOOLEAN">Yes/No</option>
            </select>
          </div>

          <div className="relative">
            <Input
              label="Value"
              {...control.register(`attributes.${index}.value`)}
              error={errors.attributes?.[index]?.value?.message}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute right-0 top-7"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No additional attributes added yet. Click the button above to add one.
        </p>
      )}
    </div>
  );
}
```