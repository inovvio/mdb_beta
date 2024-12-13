import { useState } from 'react';
import { WorkflowTransition, EntityType } from '../../types/workflow';
import { Search } from 'lucide-react';

interface WorkflowListProps {
  workflows: WorkflowTransition[];
  onWorkflowClick: (workflow: WorkflowTransition) => void;
}

export function WorkflowList({ workflows, onWorkflowClick }: WorkflowListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<EntityType | 'ALL'>('ALL');

  const filteredWorkflows = workflows.filter((workflow) => {
    const searchTerms = searchTerm.toLowerCase().split(/\s+/);
    const searchableText = [
      workflow.startState,
      workflow.endState,
      workflow.action,
      workflow.entityType
    ].join(' ').toLowerCase();

    const matchesSearch = searchTerms.every(term => searchableText.includes(term));
    const matchesEntity = entityFilter === 'ALL' || workflow.entityType === entityFilter;
    
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value as EntityType | 'ALL')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="ALL">All Entity Types</option>
            {Object.values(EntityType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entity Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State Transition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWorkflows.map((workflow) => (
              <tr
                key={workflow.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onWorkflowClick(workflow)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {workflow.entityType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {workflow.startState} → {workflow.endState}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {workflow.action?.replace(/_/g, ' ') || 'SYSTEM_UPDATE'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${workflow.priority === 1 ? 'bg-red-100 text-red-800' :
                      workflow.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}`}>
                    {workflow.priority === 1 ? 'HIGH' :
                      workflow.priority === 2 ? 'MEDIUM' : 'LOW'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${workflow.activeFlag ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {workflow.activeFlag ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredWorkflows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <p className="text-base">No workflows found matching your search criteria.</p>
                  <p className="text-sm mt-1">Try adjusting your search terms or filters to see more results.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}