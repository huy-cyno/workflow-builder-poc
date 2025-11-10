import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import LevelNode from './nodes/LevelNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import './App.css';

const nodeTypes = {
  level: LevelNode,
  condition: ConditionNode,
  action: ActionNode,
};

const initialNodes = [
  {
    id: 'level-1',
    type: 'level',
    position: { x: 50, y: 150 },
    data: {
      label: 'Level step 1',
      levelName: 'Collect particulars',
      levelType: 'Individuals',
      steps: ['APPLICANT_DATA'],
      isStart: true
    },
  },
];

const initialEdges = [];

function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  // Handle connection between nodes
  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#6D9DFF', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // Add new node from sidebar
  const onAddNode = useCallback((type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: getDefaultNodeData(type),
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Delete selected node
  const onDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) =>
        e.source !== selectedNode.id && e.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // Node click handler
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Save workflow
  const onSave = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      metadata: {
        version: 1,
        createdAt: new Date().toISOString(),
      }
    };

    console.log('💾 Saving workflow:', workflow);

    // Download as JSON
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    link.click();
    URL.revokeObjectURL(url);

    alert('Workflow saved! Check console for JSON output.');
  }, [nodes, edges]);

  // Load workflow
  const onLoad = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target.result);
        setNodes(workflow.nodes || []);
        setEdges(workflow.edges || []);
        alert('Workflow loaded successfully!');
      } catch (error) {
        console.error('Error loading workflow:', error);
        alert('Failed to load workflow');
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges]);

  // Analyze workflow
  const onAnalyze = useCallback(() => {
    console.log('🔍 Workflow Analysis:');
    console.log('Total nodes:', nodes.length);
    console.log('Total connections:', edges.length);

    // Find start node
    const startNode = nodes.find(n =>
      !edges.some(e => e.target === n.id)
    );
    console.log('Start node:', startNode?.data.label);

    // Analyze connections
    nodes.forEach(node => {
      const incoming = edges.filter(e => e.target === node.id);
      const outgoing = edges.filter(e => e.source === node.id);

      console.log(`\nNode: ${node.data.label}`);
      console.log('  Type:', node.type);
      console.log('  Incoming:', incoming.length);
      console.log('  Outgoing:', outgoing.length);
      console.log('  Connected from:', incoming.map(e => {
        const src = nodes.find(n => n.id === e.source);
        return src?.data.label;
      }));
      console.log('  Connected to:', outgoing.map(e => {
        const tgt = nodes.find(n => n.id === e.target);
        return tgt?.data.label;
      }));
    });

    alert('Check console for workflow analysis!');
  }, [nodes, edges]);

  return (
    <div className="workflow-container">
      <Toolbar
        onSave={onSave}
        onLoad={onLoad}
        onAnalyze={onAnalyze}
        onDelete={onDeleteNode}
        selectedNode={selectedNode}
      />

      <div className="workflow-content">
        <Sidebar onAddNode={onAddNode} />

        <div className="flow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'level': return '#6D9DFF';
                  case 'condition': return '#FFB648';
                  case 'action': return '#68CD86';
                  default: return '#eee';
                }
              }}
            />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
}

export default App;

// Helper function to get default data for node types
function getDefaultNodeData(type) {
  switch (type) {
    case 'level':
      return {
        label: 'Level Step',
        levelName: 'New Level',
        levelType: 'Individuals',
        steps: ['IDENTITY'],
        isStart: false
      };
    case 'condition':
      return {
        label: 'Condition',
        branches: [
          {
            name: 'Branch 1',
            condition: 'field equals value'
          }
        ]
      };
    case 'action':
      return {
        label: 'Action',
        actions: [
          {
            type: 'createCase',
            title: 'Create case',
            value: ''
          }
        ]
      };
    default:
      return { label: 'Node' };
  }
}
