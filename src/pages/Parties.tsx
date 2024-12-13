import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Party } from '../types/party';
import { PartyList } from '../components/parties/PartyList';
import { PartyForm } from '../components/parties/PartyForm';
import { PartyDashboard } from '../components/parties/PartyDashboard';
import { toast } from 'react-hot-toast';
import { partiesApi } from '../services/api/parties';

export function Parties() {
  const [parties, setParties] = useState<Party[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | undefined>();
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

  const handleCreateParty = async (data: Partial<Party>) => {
    try {
      await partiesApi.create(data);
      await loadParties();
      setShowForm(false);
      toast.success('Party created successfully');
    } catch (error: any) {
      console.error('Error creating party:', error);
      toast.error(error.message || 'Failed to create party');
    }
  };

  const handleUpdateParty = async (data: Partial<Party>) => {
    if (!selectedParty) return;

    try {
      await partiesApi.update(selectedParty.id, data);
      await loadParties();
      setShowForm(false);
      setSelectedParty(undefined);
      toast.success('Party updated successfully');
    } catch (error: any) {
      console.error('Error updating party:', error);
      toast.error(error.message || 'Failed to update party');
    }
  };

  const handlePartyClick = (party: Party) => {
    setSelectedParty(party);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Party Hub</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Party
          </Button>
        )}
      </div>

      {!showForm && <PartyDashboard parties={parties} />}

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {selectedParty ? 'Edit Party' : 'Create New Party'}
          </h2>
          <PartyForm
            party={selectedParty}
            onSubmit={selectedParty ? handleUpdateParty : handleCreateParty}
            onCancel={() => {
              setShowForm(false);
              setSelectedParty(undefined);
            }}
          />
        </div>
      ) : (
        <PartyList
          parties={parties}
          onPartyClick={handlePartyClick}
        />
      )}
    </div>
  );
}
