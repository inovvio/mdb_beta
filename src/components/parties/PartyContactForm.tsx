import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PartyContact } from '../../types/party';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface PartyContactFormProps {
  contact?: PartyContact;
  onSubmit: (data: Partial<PartyContact>) => Promise<void>;
  onClose: () => void;
}

export function PartyContactForm({ contact, onSubmit, onClose }: PartyContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact || {
      isPrimary: false,
    }
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {contact ? 'Edit Contact' : 'Add New Contact'}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Designation"
            {...register('designation')}
            error={errors.designation?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              label="Mobile"
              {...register('mobile')}
              error={errors.mobile?.message}
            />
          </div>

          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isPrimary')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Set as primary contact
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Contact'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}