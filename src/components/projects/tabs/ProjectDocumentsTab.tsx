```tsx
import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

const DOCUMENT_TYPES = [
  'CONTRACT',
  'AGREEMENT',
  'TERM_SHEET',
  'APPROVAL',
  'OTHER',
] as const;

interface ProjectDocumentsTabProps {
  control: Control<any>;
  errors: any;
}

export function ProjectDocumentsTab({ control, errors }: ProjectDocumentsTabProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents'
  });

  const handleFileUpload = (index: number) => {
    // TODO: Implement file upload
    console.log('File upload triggered for document at index:', index);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Documents</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', type: 'OTHER', url: '', comments: '' })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <Input
            label="Document Name"
            {...control.register(`documents.${index}.name`)}
            error={errors.documents?.[index]?.name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...control.register(`documents.${index}.type`)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Document</label>
            <div className="mt-1 flex">
              <input
                type="text"
                {...control.register(`documents.${index}.url`)}
                className="block w-full rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleFileUpload(index)}
                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:text-gray-700"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Input
              label="Comments"
              {...control.register(`documents.${index}.comments`)}
              error={errors.documents?.[index]?.comments?.message}
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
          No documents added yet. Click the button above to add a document.
        </p>
      )}
    </div>
  );
}
```