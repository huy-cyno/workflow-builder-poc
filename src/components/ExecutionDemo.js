import React, { useState } from 'react';
import WorkflowExecutor from '../utils/workflowExecutor';
import './ExecutionDemo.css';

/**
 * ExecutionDemo Component
 *
 * Demonstrates how to consume and execute workflow JSON
 * Shows how frontend JS can use the workflow builder output
 */
function ExecutionDemo({ workflow, onClose }) {
  const [testData, setTestData] = useState('{\n  "age": 25,\n  "country": "Singapore"\n}');
  const [executionResult, setExecutionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);
    setExecutionResult(null);

    try {
      // Parse test data
      const context = JSON.parse(testData);

      console.log('Creating executor with workflow:', workflow);

      // Create executor
      const executor = new WorkflowExecutor(workflow);

      // Execute workflow
      const result = await executor.execute(context, {
        onStep: (stepInfo) => {
          console.log('Step:', stepInfo);
        }
      });

      setExecutionResult(result);
      console.log('Execution Result:', result);

    } catch (err) {
      setError(err.message);
      console.error('Execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const renderExecutionLog = () => {
    if (!executionResult) return null;

    return (
      <div className="execution-log">
        <h3>Execution Log</h3>

        <div className="log-summary">
          <div className="summary-item">
            <strong>Total Steps:</strong> {executionResult.steps}
          </div>
          <div className="summary-item">
            <strong>Status:</strong> {executionResult.success ? '✅ Success' : '❌ Failed'}
          </div>
        </div>

        <div className="execution-path">
          <strong>Path Taken:</strong>
          <div className="path-flow">
            {executionResult.summary.executionPath.map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="path-step">{step}</span>
                {idx < executionResult.summary.executionPath.length - 1 && (
                  <span className="path-arrow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="log-details">
          <strong>Step-by-Step Details:</strong>
          {executionResult.executionLog.map((entry, idx) => (
            <div key={idx} className={`log-entry ${entry.nodeType}`}>
              <div className="log-header">
                <span className="step-number">Step {entry.step}</span>
                <span className="node-type">{entry.nodeType}</span>
              </div>
              <div className="log-label">{entry.label}</div>
              {entry.result && (
                <div className="log-result">
                  <pre>{JSON.stringify(entry.result, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="execution-demo-overlay">
      <div className="execution-demo">
        <div className="demo-header">
          <h2>🚀 Workflow Execution Demo</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="demo-content">
          <div className="demo-section">
            <h3>📖 How It Works</h3>
            <div className="info-box">
              <p>This demo shows how to <strong>consume the workflow JSON</strong> from the builder:</p>
              <ol>
                <li>The workflow is passed as <code>{'{ nodes, edges }'}</code></li>
                <li><code>WorkflowExecutor</code> parses the structure</li>
                <li>It executes nodes in order, following edges</li>
                <li>For <strong>condition nodes</strong>, it evaluates branches and takes the matching path</li>
                <li>Returns execution log showing the path taken</li>
              </ol>
            </div>
          </div>

          <div className="demo-section">
            <h3>📝 Test Data (Input Context)</h3>
            <p className="hint">
              Edit the JSON below to test different scenarios.
              Condition nodes will evaluate against these values.
            </p>
            <textarea
              className="test-data-input"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder='{"age": 25, "country": "Singapore"}'
            />
          </div>

          <div className="demo-section">
            <h3>🔍 Workflow Structure</h3>
            <div className="workflow-info">
              <div className="info-item">
                <strong>Nodes:</strong> {workflow.nodes?.length || 0}
              </div>
              <div className="info-item">
                <strong>Connections:</strong> {workflow.edges?.length || 0}
              </div>
              <div className="info-item">
                <strong>Start Node:</strong>{' '}
                {workflow.nodes?.find(n => !workflow.edges?.some(e => e.target === n.id))?.data?.label || 'None'}
              </div>
            </div>
          </div>

          <button
            className="execute-btn"
            onClick={handleExecute}
            disabled={isExecuting}
          >
            {isExecuting ? '⏳ Executing...' : '▶️ Execute Workflow'}
          </button>

          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}

          {executionResult && renderExecutionLog()}
        </div>

        <div className="demo-footer">
          <div className="code-example">
            <h4>💻 How to Use in Your Code:</h4>
            <pre>{`// 1. Import the executor
import WorkflowExecutor from './utils/workflowExecutor';

// 2. Get workflow from the builder
const workflow = {
  nodes: [...],  // from builder
  edges: [...]   // from builder
};

// 3. Create executor
const executor = new WorkflowExecutor(workflow);

// 4. Execute with user data
const result = await executor.execute({
  age: 25,
  country: 'Singapore'
});

// 5. Use the results
console.log('Path taken:', result.summary.executionPath);
console.log('Steps:', result.executionLog);`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutionDemo;
