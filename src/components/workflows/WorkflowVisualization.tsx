import { useMemo } from 'react';
import { FlowAnalysisGraph } from '@ant-design/graphs';
import { EntityType, WorkflowTransition } from '../../types/workflow';

interface WorkflowVisualizationProps {
  workflows: WorkflowTransition[];
  selectedEntityType: EntityType;
}

export function WorkflowVisualization({ workflows, selectedEntityType }: WorkflowVisualizationProps) {
  const data = useMemo(() => {
    const filteredWorkflows = workflows.filter(w => w.entityType === selectedEntityType);
    
    // Get unique states
    const states = new Set<string>();
    filteredWorkflows.forEach(w => {
      states.add(w.startState);
      states.add(w.endState);
    });

    // Create nodes
    const nodes = Array.from(states).map(state => ({
      id: state,
      value: {
        title: state,
        items: []
      },
      style: {
        fill: '#fff',
        stroke: '#e2e8f0',
        radius: 8,
        shadowColor: '#e2e8f0',
        shadowBlur: 5,
        cursor: 'pointer'
      }
    }));

    // Create edges with labels showing action and priority
    const edges = filteredWorkflows.map(workflow => ({
      source: workflow.startState,
      target: workflow.endState,
      value: {
        text: `${workflow.action.replace(/_/g, ' ')}\nPriority: ${workflow.priority}`,
        style: {
          stroke: workflow.activeFlag ? '#0090ff' : '#94a3b8',
          lineWidth: workflow.priority === 1 ? 3 : workflow.priority === 2 ? 2 : 1,
          opacity: workflow.activeFlag ? 1 : 0.6,
          endArrow: {
            path: 'M 0,0 L 8,4 L 0,8 Z',
            fill: workflow.activeFlag ? '#0090ff' : '#94a3b8'
          }
        }
      }
    }));

    return {
      nodes,
      edges,
    };
  }, [workflows, selectedEntityType]);

  const config = {
    data,
    nodeCfg: {
      size: [200, 40],
      badge: {
        style: {
          fill: '#1890ff',
          radius: 2,
        },
      },
      title: {
        style: {
          fill: '#1e293b',
          fontSize: 12,
          fontWeight: 500
        },
      },
      items: {
        style: {
          fill: '#64748b',
          fontSize: 10,
        },
      },
      style: {
        fill: '#fff',
        stroke: '#e2e8f0',
        radius: 8,
        shadowColor: '#e2e8f0',
        shadowBlur: 5,
      },
      nodeStateStyles: {
        hover: {
          stroke: '#0090ff',
          lineWidth: 2,
        },
      },
    },
    edgeCfg: {
      label: {
        style: {
          fill: '#64748b',
          fontSize: 10,
          background: {
            fill: '#fff',
            padding: [4, 8],
            radius: 4,
          },
        },
      },
      style: {
        stroke: '#64748b',
        lineWidth: 1,
        radius: 8,
      },
      edgeStateStyles: {
        hover: {
          stroke: '#0090ff',
          lineWidth: 2,
        },
      },
    },
    markerCfg: {
      show: true,
      collapsed: false,
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      nodesep: 80,
      ranksep: 100,
      controlPoints: true,
    },
    autoFit: true,
    fitCenter: true,
    animate: true,
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-[600px]">
        {data.nodes.length > 0 ? (
          <FlowAnalysisGraph {...config} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No workflow transitions found for {selectedEntityType}
          </div>
        )}
      </div>
    </div>
  );
}