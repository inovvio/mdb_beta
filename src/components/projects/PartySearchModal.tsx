import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface PartySearchModalProps {
  onClose: () => void;
  onSelect: (partyId: string, partyName: string) => void;
}

export function PartySearchModal({ onClose, onSelect }: PartySearchModalProps) {
  // Mock party selection for now
  const handlePartySelect = () => {
    onSelect('PARTY001', 'Sample Bank Ltd');
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h3 className="text-lg font-medium mb-4">Search Party</h3>
        <div className="mb-4">
          <Input
            placeholder="Search by name..."
            onChange={() => {}}
          />
        </div>
        <div className="space-y-2">
          <div
            className="p-3 hover:bg-gray-50 rounded-md cursor-pointer"
            onClick={handlePartySelect}
          >
            <div className="font-medium">Sample Bank Ltd</div>
            <div className="text-sm text-gray-500">Banking Institution</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}