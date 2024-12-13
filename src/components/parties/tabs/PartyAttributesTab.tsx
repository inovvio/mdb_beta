import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface PartyAttributesTabProps {
  control: Control<any>;
  errors: any;
}

export function PartyAttributesTab({ control, errors }: PartyAttributesTabProps) {
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
          onClick={() => append({ name: '', value: '' })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Attribute
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <Input
            label="Name"
            {...control.register(`attributes.${index}.name`)}
            error={errors.attributes?.[index]?.name?.message}
          />
          
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