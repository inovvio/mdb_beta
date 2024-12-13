import { useState } from 'react';
import { Framework } from '../../types';
import { Search } from 'lucide-react';

interface FrameworkListProps {
  frameworks: Framework[];
  onFrameworkClick: (framework: Framework) => void;
}

export function FrameworkList({ frameworks, onFrameworkClick }: FrameworkListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFrameworks = frameworks.filter((framework) => {
    // If no search term, show all frameworks
    if (!searchTerm.trim()) return true;

    // Convert search term to lowercase and split into words
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);

    // Create a single string of all searchable fields
    const searchableText = [
      framework.name,
      framework.shortDescription,
      framework.longDescription,
      framework.frameworkLead,
      framework.type,
      framework.status,
      framework.priority,
      framework.currency,
      framework.fundingType,
      framework.fundingSource,
      framework.allocationType,
      // Include nested data if available
      framework.eligibilityCriteria?.clientTypes?.join(' '),
      framework.eligibilityCriteria?.productTypes?.join(' '),
      framework.eligibilityCriteria?.countriesOfOperation?.join(' '),
      // Include attributes if available
      framework.attributes?.map(attr => `${attr.name} ${attr.value}`).join(' ')
    ]
      .filter(Boolean) // Remove null/undefined values
      .join(' ')
      .toLowerCase();

    // Check if all search words are found in the searchable text
    return searchWords.every(word => searchableText.includes(word));
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search frameworks by name, description, type, status, currency, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Tip: You can search using multiple words to find more specific results
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Framework Lead
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFrameworks.map((framework) => (
              <tr
                key={framework.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onFrameworkClick(framework)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {framework.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {framework.shortDescription}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{framework.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: framework.currency,
                    }).format(framework.initialAllocatedAmount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${framework.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      framework.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}`}>
                    {framework.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${framework.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      framework.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      framework.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {framework.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {framework.frameworkLead}
                </td>
              </tr>
            ))}
            {filteredFrameworks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <p className="text-base">No frameworks found matching your search criteria.</p>
                  <p className="text-sm mt-1">Try adjusting your search terms or clear the search to see all frameworks.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}