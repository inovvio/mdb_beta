import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { CurrencyInput } from '../../ui/CurrencyInput';

interface EngagementFinancialsTabProps {
  control: Control<any>;
  errors: any;
  watch: any;
  setValue: any;
}

export function EngagementFinancialsTab({ control, errors, watch, setValue }: EngagementFinancialsTabProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'financials'
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial Details</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ 
            reference: '', 
            currency: 'USD', 
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            comments: '' 
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Financial Entry
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
          <Input
            label="Reference"
            {...control.register(`financials.${index}.reference`)}
            error={errors.financials?.[index]?.reference?.message}
          />

          <CurrencyInput
            label="Amount"
            value={watch(`financials.${index}.amount`)?.toString()}
            onChange={(e) => setValue(`financials.${index}.amount`, Number(e.target.value))}
            currency={watch(`financials.${index}.currency`)}
            onCurrencyChange={(value) => setValue(`financials.${index}.currency`, value)}
            error={errors.financials?.[index]?.amount?.message}
          />

          <Input
            type="date"
            label="Date (Optional)"
            {...control.register(`financials.${index}.date`)}
            error={errors.financials?.[index]?.date?.message}
          />

          <div className="relative md:col-span-2">
            <Input
              label="Comments"
              {...control.register(`financials.${index}.comments`)}
              error={errors.financials?.[index]?.comments?.message}
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
          No financial entries added yet. Click the button above to add one.
        </p>
      )}

      {fields.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(
              fields.reduce((acc: any, field: any, idx: number) => {
                const currency = watch(`financials.${idx}.currency`);
                const amount = Number(watch(`financials.${idx}.amount`)) || 0;
                acc[currency] = (acc[currency] || 0) + amount;
                return acc;
              }, {})
            ).map(([currency, total]) => (
              <div key={currency} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total ({currency}):</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(total as number)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}