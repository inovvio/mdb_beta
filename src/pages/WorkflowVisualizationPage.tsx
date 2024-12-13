import { useState, useEffect } from 'react';
import { EntityType, WorkflowTransition } from '../types/workflow';
import { WorkflowVisualization } from '../components/workflows/WorkflowVisualization';
import { workflowsApi } from '../services/api/workflows';
import { toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WorkflowVisualizationPage() {
  const [workflows, setWorkflows] = useState<WorkflowTransition[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>(EntityType.FRAMEWORK);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await workflowsApi.list();
      setWorkflows(data);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
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
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/workflows')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Workflow Visualization</h1>
        </div>
        <select
          value={selectedEntityType}
          onChange={(e) => setSelectedEntityType(e.target.value as EntityType)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {Object.values(EntityType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Legend</h2>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-1 w-8 bg-primary-600"></div>
              <span className="text-sm text-gray-600">Active Transition</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-1 w-8 bg-gray-400"></div>
              <span className="text-sm text-gray-600">Inactive Transition</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-1 w-8 bg-primary-600" style={{ height: '3px' }}></div>
              <span className="text-sm text-gray-600">High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-1 w-8 bg-primary-600" style={{ height: '2px' }}></div>
              <span className="text-sm text-gray-600">Medium Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-1 w-8 bg-primary-600" style={{ height: '1px' }}></div>
              <span className="text-sm text-gray-600">Low Priority</span>
            </div>
          </div>
        </div>

        <WorkflowVisualization
          workflows={workflows}
          selectedEntityType={selectedEntityType}
        />
      </div>
    </div>
  );
}