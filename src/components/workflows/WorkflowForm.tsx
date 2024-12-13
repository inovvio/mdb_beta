import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkflowTransition, EntityType } from '../../types/workflow';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { WorkflowRules } from './WorkflowRules';
import { workflowSchema } from '../../schemas/workflowSchemas';

interface WorkflowFormProps {
  workflow?: WorkflowTransition;
  onSubmit: (data: Partial<WorkflowTransition>) => Promise<void>;
  onCancel: () => void;
}

export function WorkflowForm({ workflow, onSubmit, onCancel }: WorkflowFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(workflowSchema),
    defaultValues: workflow || {
      entityType: 'FRAMEWORK',
      action: '',
      priority: 2, // Default to medium priority
      stpFlag: false,
      createTaskFlag: false,
      createNotificationFlag: false,
      activeFlag: true,
      rules: []
    }
  });

  const onFormSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error saving workflow:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Entity Type</label>
          <select
            {...register('entityType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {Object.values(EntityType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.entityType && (
            <p className="mt-1 text-sm text-red-600">{errors.entityType.message}</p>
          )}
        </div>

        <Input
          label="Action"
          {...register('action')}
          error={errors.action?.message}
          placeholder="Enter the action to be performed"
        />

        <Input
          label="Start State"
          {...register('startState')}
          error={errors.startState?.message}
        />

        <Input
          label="End State"
          {...register('endState')}
          error={errors.endState?.message}
        />

        <Input
          type="number"
          label="Priority (1-3, lower is higher priority)"
          min={1}
          max={3}
          {...register('priority', { valueAsNumber: true })}
          error={errors.priority?.message}
        />

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('stpFlag')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Straight Through Processing</label>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('createTaskFlag')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Create Task</label>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('createNotificationFlag')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Create Notification</label>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('activeFlag')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <WorkflowRules
          control={control}
          errors={errors}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Workflow'}
        </Button>
      </div>
    </form>
  );
}