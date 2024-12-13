import { useState } from 'react';
import { Engagement, EngagementStatus } from '../../types/engagement';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface EngagementListProps {
  engagements: Engagement[];
  onEngagementClick: (engagement: Engagement) => void;
}

export function EngagementList({ engagements, onEngagementClick }: EngagementListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EngagementStatus | 'ALL'>('ALL');

  const filteredEngagements = engagements.filter((engagement) => {
    const matchesSearch = 
      engagement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engagement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engagement.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      engagement.parties?.some(party => party.partyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || engagement.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPrimaryParty = (engagement: Engagement) => {
    return engagement.parties?.find(party => party.isPrimary);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search engagements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EngagementStatus | 'ALL')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(EngagementStatus).map((status) => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Types
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Primary Party
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Framework
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEngagements.map((engagement) => {
              const primaryParty = getPrimaryParty(engagement);
              return (
                <tr
                  key={engagement.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onEngagementClick(engagement)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {engagement.name}
                    </div>
                    {engagement.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {engagement.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {engagement.types.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800"
                        >
                          {type.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {primaryParty ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {primaryParty.partyName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {primaryParty.role}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No primary party</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {engagement.framework?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${engagement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        engagement.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        engagement.status === 'EXPIRED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {engagement.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(engagement.effectiveFrom).toLocaleDateString()} - {new Date(engagement.effectiveTo).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
            {filteredEngagements.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <p className="text-base">No engagements found matching your search criteria.</p>
                  <p className="text-sm mt-1">Try adjusting your search terms or clear the search to see all engagements.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}