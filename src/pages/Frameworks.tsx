import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Framework } from '../types';
import { FrameworkList } from '../components/frameworks/FrameworkList';
import { FrameworkForm } from '../components/frameworks/FrameworkForm';
import { toast } from 'react-hot-toast';
import { frameworksApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Frameworks() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<Framework | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFrameworks();
  }, []);

  const loadFrameworks = async () => {
    try {
      const data = await frameworksApi.list();
      setFrameworks(data);
    } catch (error) {
      console.error('Error loading frameworks:', error);
      toast.error('Failed to load frameworks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFramework = async (data: Partial<Framework>) => {
    try {
      await frameworksApi.create(data);
      await loadFrameworks();
      setShowForm(false);
      toast.success('Framework created successfully');
    } catch (error: any) {
      console.error('Error creating framework:', error);
      toast.error(error.message || 'Failed to create framework');
      throw error;
    }
  };

  const handleUpdateFramework = async (data: Partial<Framework>) => {
    if (!selectedFramework) return;

    try {
      await frameworksApi.update(selectedFramework.id, data);
      await loadFrameworks();
      setShowForm(false);
      setSelectedFramework(undefined);
      toast.success('Framework updated successfully');
    } catch (error: any) {
      console.error('Error updating framework:', error);
      toast.error(error.message || 'Failed to update framework');
      throw error;
    }
  };

  const handleFrameworkClick = (framework: Framework) => {
    setSelectedFramework(framework);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedFramework(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Frameworks</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Framework
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {selectedFramework ? 'Edit Framework' : 'Create New Framework'}
          </h2>
          <FrameworkForm
            framework={selectedFramework}
            onSubmit={selectedFramework ? handleUpdateFramework : handleCreateFramework}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <FrameworkList
          frameworks={frameworks}
          onFrameworkClick={handleFrameworkClick}
        />
      )}
    </div>
  );
}