import { useMemo } from 'react';
import { Framework } from '../../types';
import { TreeNode } from './hierarchy/TreeNode';

interface FrameworkHierarchyProps {
  frameworks: Framework[];
  selectedFrameworkId?: string;
}

export function FrameworkHierarchy({ frameworks, selectedFrameworkId }: FrameworkHierarchyProps) {
  // Get the selected framework's lineage (ancestors and descendants)
  const relevantFrameworks = useMemo(() => {
    if (!selectedFrameworkId) return frameworks;

    const lineage = new Set<string>();
    
    // Function to get all ancestors
    const getAncestors = (id: string) => {
      const framework = frameworks.find(f => f.id === id);
      if (framework?.parentFrameworkId) {
        lineage.add(framework.parentFrameworkId);
        getAncestors(framework.parentFrameworkId);
      }
    };

    // Function to get all descendants
    const getDescendants = (id: string) => {
      const children = frameworks.filter(f => f.parentFrameworkId === id);
      children.forEach(child => {
        lineage.add(child.id);
        getDescendants(child.id);
      });
    };

    // Add selected framework
    lineage.add(selectedFrameworkId);
    
    // Get ancestors and descendants
    getAncestors(selectedFrameworkId);
    getDescendants(selectedFrameworkId);

    // Return only frameworks in the lineage
    return frameworks.filter(f => lineage.has(f.id));
  }, [frameworks, selectedFrameworkId]);

  // Get root frameworks from the relevant frameworks
  const rootFrameworks = useMemo(() => {
    return relevantFrameworks.filter(f => !f.parentFrameworkId);
  }, [relevantFrameworks]);

  if (!relevantFrameworks.length) {
    return (
      <div className="h-[600px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No framework hierarchy data available</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] bg-gray-50 rounded-lg border border-gray-200 p-6 overflow-auto">
      <div className="space-y-6">
        {rootFrameworks.map(framework => (
          <TreeNode
            key={framework.id}
            framework={framework}
            frameworks={relevantFrameworks}
            selectedFrameworkId={selectedFrameworkId}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}