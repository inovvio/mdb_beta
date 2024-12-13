import { useState } from 'react';
import { Framework } from '../../../types';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { formatAmount } from '../../../utils/constants';

interface TreeNodeProps {
  framework: Framework;
  frameworks: Framework[];
  selectedFrameworkId?: string;
  level: number;
}

export function TreeNode({ 
  framework, 
  frameworks,
  selectedFrameworkId,
  level
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const childFrameworks = frameworks.filter(f => f.parentFrameworkId === framework.id);
  const hasChildren = childFrameworks.length > 0;
  const utilized = framework.initialAllocatedAmount * 0.4;
  const available = framework.initialAllocatedAmount - utilized;
  
  return (
    <div className="relative">
      {/* Vertical line from parent */}
      {level > 0 && (
        <div 
          className="absolute left-[-24px] top-0 w-px bg-gray-300 h-full"
          style={{ left: `${level * 24 - 24}px` }}
        />
      )}
      
      <div className="relative flex items-start">
        {/* Horizontal line to node */}
        {level > 0 && (
          <div 
            className="absolute left-[-24px] top-6 h-px bg-gray-300 w-6"
            style={{ left: `${level * 24 - 24}px` }}
          />
        )}
        
        <div 
          className={`flex-1 p-4 rounded-lg transition-colors ml-${level * 6}
            ${framework.id === selectedFrameworkId ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}
            border shadow-sm hover:border-blue-500`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {hasChildren && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-gray-100 rounded-full mr-2"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{framework.name}</h3>
                <p className="text-sm text-gray-500">{framework.shortDescription}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full
              ${framework.type === 'INVESTMENT' ? 'bg-green-100 text-green-800' :
                framework.type === 'GUARANTEE' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'}`}>
              {framework.type}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Limit</div>
              <div className="font-medium">
                {formatAmount(framework.initialAllocatedAmount, framework.currency)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Used</div>
              <div className="font-medium text-amber-600">
                {formatAmount(utilized, framework.currency)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Available</div>
              <div className="font-medium text-green-600">
                {formatAmount(available, framework.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Child nodes */}
      {hasChildren && isExpanded && (
        <div className="mt-4 space-y-4">
          {childFrameworks.map(childFramework => (
            <TreeNode
              key={childFramework.id}
              framework={childFramework}
              frameworks={frameworks}
              selectedFrameworkId={selectedFrameworkId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}