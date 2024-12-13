import { Framework } from '../../../types';
import { formatAmount } from '../../../utils/constants';

interface FrameworkNodeProps {
  framework: Framework;
  isSelected?: boolean;
}

export function FrameworkNode({ framework, isSelected }: FrameworkNodeProps) {
  const utilized = framework.initialAllocatedAmount * 0.4; // Mock utilization
  const available = framework.initialAllocatedAmount - utilized;

  return (
    <div 
      className={`w-[280px] p-4 rounded-lg border ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      } shadow-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 truncate">{framework.name}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          framework.type === 'INVESTMENT' ? 'bg-green-100 text-green-800' :
          framework.type === 'GUARANTEE' ? 'bg-purple-100 text-purple-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {framework.type}
        </span>
      </div>
      
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {framework.shortDescription}
      </p>

      <div className="grid grid-cols-3 gap-2 text-sm">
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
  );
}