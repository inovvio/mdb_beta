import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Engagement } from '../types/engagement';
import { EngagementList } from '../components/engagements/EngagementList';
import { EngagementForm } from '../components/engagements/EngagementForm';
import { toast } from 'react-hot-toast';
import { engagementsApi } from '../services/api/engagements';

export function Engagements() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEngagements();
  }, []);

  const loadEngagements = async () => {
    try {
      const data = await engagementsApi.list();
      setEngagements(data);
    } catch (error) {
      console.error('Error loading engagements:', error);
      toast.error('Failed to load engagements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEngagement = async (data: Partial<Engagement>) => {
    try {
      await engagementsApi.create(data);
      await loadEngagements();
      setShowForm(false);
      toast.success('Engagement created successfully');
    } catch (error: any) {
      console.error('Error creating engagement:', error);
      toast.error(error.message || 'Failed to create engagement');
      throw error; // Re-throw to prevent form from closing
    }
  };

  const handleUpdateEngagement = async (data: Partial<Engagement>) => {
    if (!selectedEngagement) return;

    try {
      await engagementsApi.update(selectedEngagement.id, data);
      await loadEngagements();
      setShowForm(false);
      setSelectedEngagement(undefined);
      toast.success('Engagement updated successfully');
    } catch (error: any) {
      console.error('Error updating engagement:', error);
      toast.error(error.message || 'Failed to update engagement');
      throw error; // Re-throw to prevent form from closing
    }
  };

  const handleEngagementClick = (engagement: Engagement) => {
    setSelectedEngagement(engagement);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedEngagement(undefined);
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
        <h1 className="text-2xl font-semibold text-gray-900">Engagements</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Engagement
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {selectedEngagement ? 'Edit Engagement' : 'Create New Engagement'}
          </h2>
          <EngagementForm
            engagement={selectedEngagement}
            onSubmit={selectedEngagement ? handleUpdateEngagement : handleCreateEngagement}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <EngagementList
          engagements={engagements}
          onEngagementClick={handleEngagementClick}
        />
      )}
    </div>
  );
}