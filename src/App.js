import React, { useState, useCallback, useEffect } from 'react';
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
import ExecutionDemo from './components/ExecutionDemo';
import NodeEditor from './components/NodeEditor';
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
    position: { x: 50, y: 100 },
    data: {
      label: 'Collect User Data',
      levelName: 'Identity Collection',
      levelType: 'Individuals',
      steps: ['APPLICANT_DATA', 'IDENTITY'],
      isStart: true
    },
  },
  {
    id: 'condition-1',
    type: 'condition',
    position: { x: 350, y: 100 },
    data: {
      label: 'Risk Assessment',
      branches: [
        {
          name: 'High Risk',
          condition: 'riskScore >= 70'
        }
      ]
    },
  },
  {
    id: 'action-high',
    type: 'action',
    position: { x: 650, y: 50 },
    data: {
      label: 'High Risk Actions',
      actions: [
        {
          type: 'createCase',
          title: 'Create manual review case',
          value: 'Compliance Team'
        },
        {
          type: 'sendEmail',
          title: 'Alert compliance team',
          value: 'compliance@company.com'
        },
        {
          type: 'log',
          title: 'Log risk event',
          value: 'High risk user detected'
        }
      ]
    },
  },
  {
    id: 'action-low',
    type: 'action',
    position: { x: 650, y: 250 },
    data: {
      label: 'Auto-Approve Actions',
      actions: [
        {
          type: 'approve',
          title: 'Auto-approve user',
          value: ''
        },
        {
          type: 'sendWebhook',
          title: 'Notify partner system',
          value: 'https://api.partner.com/webhook'
        },
        {
          type: 'sendEmail',
          title: 'Welcome email',
          value: 'user@example.com'
        },
        {
          type: 'notify',
          title: 'Push notification',
          value: 'Account approved!'
        }
      ]
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: 'level-1',
    target: 'condition-1',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6D9DFF', strokeWidth: 2 }
  },
  {
    id: 'e2-3',
    source: 'condition-1',
    target: 'action-high',
    sourceHandle: 'branch-0',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#FF6B9D', strokeWidth: 2 }
  },
  {
    id: 'e2-4',
    source: 'condition-1',
    target: 'action-low',
    sourceHandle: 'else',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#27AE60', strokeWidth: 2 }
  }
];

function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showExecutionDemo, setShowExecutionDemo] = useState(false);
  const [showNodeEditor, setShowNodeEditor] = useState(false);

  // PostMessage integration for Angular wrapper
  useEffect(() => {
    // Notify Angular that React app is ready
    const notifyReady = () => {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'REACT_APP_READY' }, '*');
        console.log('📤 Sent REACT_APP_READY to Angular');
      }
    };

    // Send ready message after a short delay to ensure parent is listening
    const timer = setTimeout(notifyReady, 100);

    // Listen for messages from Angular
    const handleMessage = (event) => {
      console.log('📨 Message received in React:', event.data);

      switch (event.data.type) {
        case 'LOAD_WORKFLOW':
          if (event.data.workflow) {
            setNodes(event.data.workflow.nodes || []);
            setEdges(event.data.workflow.edges || []);
            window.parent.postMessage({
              type: 'WORKFLOW_LOADED',
              workflow: event.data.workflow
            }, '*');
            console.log('✅ Workflow loaded from Angular');
          }
          break;

        case 'SAVE_WORKFLOW':
          const workflow = {
            nodes,
            edges,
            metadata: {
              version: 1,
              createdAt: new Date().toISOString(),
            }
          };
          window.parent.postMessage({
            type: 'WORKFLOW_SAVED',
            workflow: workflow
          }, '*');
          console.log('💾 Workflow saved and sent to Angular');
          break;

        case 'CLEAR_WORKFLOW':
          setNodes([]);
          setEdges([]);
          setSelectedNode(null);
          console.log('🗑️ Workflow cleared');
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, [nodes, edges, setNodes, setEdges]);

  // Notify Angular when a node is selected
  useEffect(() => {
    if (selectedNode && window.parent !== window) {
      window.parent.postMessage({
        type: 'NODE_SELECTED',
        node: selectedNode
      }, '*');
    }
  }, [selectedNode]);

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
  const onAddNode = useCallback((type, customData) => {
    const xPos = Math.random() * 400 + 100;
    const yPos = Math.random() * 300 + 100;

    const newNode = {
      id: `${type}-${Date.now()}`,
      type: type,
      position: {
        x: Number.isFinite(xPos) ? xPos : 250,
        y: Number.isFinite(yPos) ? yPos : 250,
      },
      data: customData || getDefaultNodeData(type),
    };
    console.log('Adding node:', newNode);
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

  // Node double-click handler - open editor
  const onNodeDoubleClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowNodeEditor(true);
  }, []);

  // Update node data
  const onUpdateNode = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: newData }
          : node
      )
    );
  }, [setNodes]);

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
        // Ensure all nodes have valid positions
        const validatedNodes = (workflow.nodes || []).map((node) => ({
          ...node,
          position: {
            x: Number.isFinite(node.position?.x) ? node.position.x : 250,
            y: Number.isFinite(node.position?.y) ? node.position.y : 250,
          },
        }));
        setNodes(validatedNodes);
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

  // Test execute workflow
  const onTestExecute = useCallback(() => {
    setShowExecutionDemo(true);
  }, []);

  return (
    <div className="workflow-container">
      <Toolbar
        onSave={onSave}
        onLoad={onLoad}
        onAnalyze={onAnalyze}
        onDelete={onDeleteNode}
        onTestExecute={onTestExecute}
        onEdit={() => setShowNodeEditor(true)}
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
            onNodeDoubleClick={onNodeDoubleClick}
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

      {showExecutionDemo && (
        <ExecutionDemo
          workflow={{ nodes, edges }}
          onClose={() => setShowExecutionDemo(false)}
        />
      )}

      {showNodeEditor && selectedNode && (
        <NodeEditor
          selectedNode={selectedNode}
          onUpdateNode={onUpdateNode}
          onClose={() => setShowNodeEditor(false)}
        />
      )}
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
        label: 'Actions',
        actions: [
          {
            type: 'sendEmail',
            title: 'Send notification email',
            value: 'user@example.com'
          },
          {
            type: 'log',
            title: 'Log completion',
            value: 'User verification completed'
          }
        ]
      };
    default:
      return { label: 'Node' };
  }
}
