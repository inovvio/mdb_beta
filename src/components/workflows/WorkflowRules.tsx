import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface WorkflowRulesProps {
  control: Control<any>;
  errors: any;
}

export function WorkflowRules({ control, errors }: WorkflowRulesProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules'
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow Rules</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', description: '', validationFunction: '' })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <Input
            label="Rule Name"
            {...control.register(`rules.${index}.name`)}
            error={errors.rules?.[index]?.name?.message}
          />

          <Input
            label="Description"
            {...control.register(`rules.${index}.description`)}
            error={errors.rules?.[index]?.description?.message}
          />

          <div className="relative">
            <Input
              label="Validation Function"
              {...control.register(`rules.${index}.validationFunction`)}
              error={errors.rules?.[index]?.validationFunction?.message}
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
          No rules added yet. Click the button above to add a rule.
        </p>
      )}
    </div>
  );
}
