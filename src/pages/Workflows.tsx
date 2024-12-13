import { useState, useEffect } from 'react';
import { Plus, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { WorkflowTransition } from '../types/workflow';
import { WorkflowList } from '../components/workflows/WorkflowList';
import { WorkflowForm } from '../components/workflows/WorkflowForm';
import { toast } from 'react-hot-toast';
import { workflowsApi } from '../services/api/workflows';
import { useNavigate } from 'react-router-dom';

export function Workflows() {
  const [workflows, setWorkflows] = useState<WorkflowTransition[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTransition | undefined>();
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

  const handleCreateWorkflow = async (data: Partial<WorkflowTransition>) => {
    try {
      await workflowsApi.create(data);
      await loadWorkflows();
      setShowForm(false);
      toast.success('Workflow created successfully');
    } catch (error: any) {
      console.error('Error creating workflow:', error);
      toast.error(error.message || 'Failed to create workflow');
    }
  };

  const handleUpdateWorkflow = async (data: Partial<WorkflowTransition>) => {
    if (!selectedWorkflow) return;

    try {
      await workflowsApi.update(selectedWorkflow.id, data);
      await loadWorkflows();
      setShowForm(false);
      setSelectedWorkflow(undefined);
      toast.success('Workflow updated successfully');
    } catch (error: any) {
      console.error('Error updating workflow:', error);
      toast.error(error.message || 'Failed to update workflow');
    }
  };

  const handleWorkflowClick = (workflow: WorkflowTransition) => {
    setSelectedWorkflow(workflow);
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
        <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
        <div className="flex space-x-4">
          {!showForm && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate('/workflows/visualization')}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Visualize Workflow
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
          </h2>
          <WorkflowForm
            workflow={selectedWorkflow}
            onSubmit={selectedWorkflow ? handleUpdateWorkflow : handleCreateWorkflow}
            onCancel={() => {
              setShowForm(false);
              setSelectedWorkflow(undefined);
            }}
          />
        </div>
      ) : (
        <WorkflowList
          workflows={workflows}
          onWorkflowClick={handleWorkflowClick}
        />
      )}
    </div>
  );
}