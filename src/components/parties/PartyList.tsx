import { useState } from 'react';
import { Party, PartyStatus } from '../../types/party';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface PartyListProps {
  parties: Party[];
  onPartyClick: (party: Party) => void;
}

export function PartyList({ parties, onPartyClick }: PartyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PartyStatus | 'ALL'>('ALL');

  const filteredParties = parties.filter((party) => {
    const matchesSearch = 
      party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.shortName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || party.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PartyStatus | 'ALL')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(PartyStatus).map((status) => (
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
                Party Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParties.map((party) => (
              <tr
                key={party.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onPartyClick(party)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {party.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {party.legalName}
                  </div>
                  {party.shortName && (
                    <div className="text-sm text-gray-500">
                      {party.shortName}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {party.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {party.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${party.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      party.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                      party.status === 'PENDING_KYC' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {party.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {party.contacts?.length || 0} contacts
                </td>
              </tr>
            ))}
            {filteredParties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No parties found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}