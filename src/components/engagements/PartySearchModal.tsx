import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Party } from '../../types/party';
import { partiesApi } from '../../services/api/parties';
import { toast } from 'react-hot-toast';

interface PartySearchModalProps {
  onClose: () => void;
  onSelect: (party: Party) => void;
}

export function PartySearchModal({ onClose, onSelect }: PartySearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      const data = await partiesApi.list();
      setParties(data);
    } catch (error) {
      console.error('Error loading parties:', error);
      toast.error('Failed to load parties');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredParties = parties.filter(party => {
    const searchTerms = searchTerm.toLowerCase().split(/\s+/);
    const searchableText = [
      party.name,
      party.legalName,
      party.shortName,
      ...party.roles,
      party.country
    ].join(' ').toLowerCase();

    return searchTerms.every(term => searchableText.includes(term));
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Search Party</h2>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, role, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {filteredParties.length > 0 ? (
              <div className="space-y-2">
                {filteredParties.map((party) => (
                  <div
                    key={party.id}
                    onClick={() => onSelect(party)}
                    className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{party.name}</h3>
                        <p className="text-sm text-gray-500">{party.legalName}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {party.roles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Country: {party.country}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No parties found matching your search criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}