import { Framework } from '../../../types';
import { FrameworkNode } from './FrameworkNode';

interface FrameworkBranchProps {
  framework: Framework;
  frameworks: Framework[];
  selectedFrameworkId?: string;
  level?: number;
}

export function FrameworkBranch({ 
  framework, 
  frameworks,
  selectedFrameworkId,
  level = 0 
}: FrameworkBranchProps) {
  const childFrameworks = frameworks.filter(f => f.parentFrameworkId === framework.id);
  
  return (
    <div className="relative">
      {/* Framework node with connecting lines container */}
      <div className="flex">
        <div className="relative">
          {level > 0 && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-12 h-px bg-gray-300" />
          )}
          <FrameworkNode 
            framework={framework}
            isSelected={framework.id === selectedFrameworkId}
          />
        </div>

        {/* Vertical line connecting to children */}
        {childFrameworks.length > 0 && (
          <div className="relative ml-12">
            <div className="absolute left-0 top-[140px] w-px h-[calc(100%-140px)] bg-gray-300" />
          </div>
        )}
      </div>

      {/* Child frameworks */}
      {childFrameworks.length > 0 && (
        <div className="ml-24 mt-8 space-y-8">
          {childFrameworks.map((childFramework, index) => (
            <div key={childFramework.id} className="relative">
              {/* Horizontal line to child */}
              <div className="absolute left-[-48px] top-[140px] w-12 h-px bg-gray-300" />
              
              {/* Vertical connection line for multiple children */}
              {index < childFrameworks.length - 1 && (
                <div className="absolute left-[-48px] top-[140px] w-px h-[calc(100%+32px)] bg-gray-300" />
              )}
              
              <FrameworkBranch
                framework={childFramework}
                frameworks={frameworks}
                selectedFrameworkId={selectedFrameworkId}
                level={level + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}