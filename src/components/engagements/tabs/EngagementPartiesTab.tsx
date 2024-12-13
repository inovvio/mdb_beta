import { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { PartyRole } from '../../../types/party';
import { PartySearchModal } from '../PartySearchModal';

interface EngagementPartiesTabProps {
  control: Control<any>;
  errors: any;
}

export function EngagementPartiesTab({ control, errors }: EngagementPartiesTabProps) {
  const [showPartySearch, setShowPartySearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'parties'
  });

  const handlePartySearch = (index: number) => {
    setActiveIndex(index);
    setShowPartySearch(true);
  };

  const handlePartySelect = (party: any) => {
    if (activeIndex !== null) {
      update(activeIndex, {
        ...fields[activeIndex],
        partyId: party.id,
        partyName: party.name,
      });
    }
    setShowPartySearch(false);
    setActiveIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Engagement Parties</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ partyId: '', partyName: '', role: '', isPrimary: false })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Party
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Party</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={field.partyName || ''}
                className="flex-1 rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                readOnly
              />
              <button
                type="button"
                onClick={() => handlePartySearch(index)}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            {errors.parties?.[index]?.partyName && (
              <p className="mt-1 text-sm text-red-600">{errors.parties[index].partyName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={field.role || ''}
              onChange={(e) => update(index, { ...field, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select Role</option>
              {Object.values(PartyRole).map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.parties?.[index]?.role && (
              <p className="mt-1 text-sm text-red-600">{errors.parties[index].role.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <input
              type="checkbox"
              checked={field.isPrimary || false}
              onChange={(e) => update(index, { ...field, isPrimary: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Primary Party</label>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No parties added yet. Click the button above to add a party.
        </p>
      )}

      {showPartySearch && (
        <PartySearchModal
          onClose={() => {
            setShowPartySearch(false);
            setActiveIndex(null);
          }}
          onSelect={handlePartySelect}
        />
      )}
    </div>
  );
}