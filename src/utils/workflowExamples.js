/**
 * Workflow Execution Examples
 *
 * Run these examples to understand how workflow execution works.
 *
 * Usage:
 *   import { runExample1, runExample2, runExample3 } from './workflowExamples';
 *   await runExample1();
 */

import WorkflowExecutor from './workflowExecutor';

// ============================================================================
// EXAMPLE 1: Simple Linear Flow
// ============================================================================

export async function runExample1() {
  console.log('\n\n📌 EXAMPLE 1: Simple Linear Flow\n');

  const workflow = {
    nodes: [
      {
        id: 'start',
        type: 'level',
        data: {
          label: 'Collect Personal Data',
          levelName: 'Basic Information',
          levelType: 'Individuals',
          steps: ['APPLICANT_DATA']
        }
      },
      {
        id: 'verify',
        type: 'level',
        data: {
          label: 'Verify Identity',
          levelName: 'ID Check',
          levelType: 'Individuals',
          steps: ['IDENTITY']
        }
      },
      {
        id: 'complete',
        type: 'action',
        data: {
          label: 'Complete',
          actions: [
            { type: 'approve', title: 'Approve Application' }
          ]
        }
      }
    ],
    edges: [
      { source: 'start', target: 'verify' },
      { source: 'verify', target: 'complete' }
    ]
  };

  const executor = new WorkflowExecutor(workflow);
  const result = await executor.execute({});

  console.log('\n📊 Result:', result.summary);
  console.log('Path taken:', result.summary.executionPath.join(' → '));

  return result;
}

// ============================================================================
// EXAMPLE 2: If/Else Flow (Age Check)
// ============================================================================

export async function runExample2() {
  console.log('\n\n📌 EXAMPLE 2: If/Else Flow (Age Check)\n');

  const workflow = {
    nodes: [
      {
        id: 'collect',
        type: 'level',
        data: {
          label: 'Collect Data',
          levelName: 'Personal Info',
          steps: ['APPLICANT_DATA']
        }
      },
      {
        id: 'age-check',
        type: 'condition',
        data: {
          label: 'Age Verification',
          branches: [
            { name: 'Is Adult', condition: 'age >= 18' }
          ]
        }
      },
      {
        id: 'approve',
        type: 'action',
        data: {
          label: 'Approve',
          actions: [{ type: 'approve', title: 'Application Approved' }]
        }
      },
      {
        id: 'reject',
        type: 'action',
        data: {
          label: 'Reject',
          actions: [{ type: 'reject', title: 'Rejected - Too Young' }]
        }
      }
    ],
    edges: [
      { source: 'collect', target: 'age-check' },
      { source: 'age-check', target: 'approve', sourceHandle: 'branch-0' },
      { source: 'age-check', target: 'reject', sourceHandle: 'else' }
    ]
  };

  const executor = new WorkflowExecutor(workflow);

  // Test Case 1: Adult (age = 25)
  console.log('\n--- Test Case 1: Adult User (age = 25) ---');
  const result1 = await executor.execute({ age: 25 });
  console.log('Path:', result1.summary.executionPath.join(' → '));

  // Test Case 2: Minor (age = 15)
  console.log('\n--- Test Case 2: Minor User (age = 15) ---');
  const result2 = await executor.execute({ age: 15 });
  console.log('Path:', result2.summary.executionPath.join(' → '));

  return { result1, result2 };
}

// ============================================================================
// EXAMPLE 3: Multiple Conditions (Country-based Flow)
// ============================================================================

export async function runExample3() {
  console.log('\n\n📌 EXAMPLE 3: Multiple Conditions (Country-based)\n');

  const workflow = {
    nodes: [
      {
        id: 'start',
        type: 'level',
        data: { label: 'Start KYC', levelName: 'Initial', steps: [] }
      },
      {
        id: 'country-check',
        type: 'condition',
        data: {
          label: 'Country Verification',
          branches: [
            { name: 'Singapore', condition: 'country equals Singapore' },
            { name: 'USA', condition: 'country equals USA' },
            { name: 'UK', condition: 'country equals UK' }
          ]
        }
      },
      {
        id: 'sg-kyc',
        type: 'level',
        data: { label: 'Singapore KYC', levelName: 'SG Process', steps: ['IDENTITY', 'SELFIE'] }
      },
      {
        id: 'usa-kyc',
        type: 'level',
        data: { label: 'USA KYC', levelName: 'US Process', steps: ['IDENTITY', 'SSN'] }
      },
      {
        id: 'uk-kyc',
        type: 'level',
        data: { label: 'UK KYC', levelName: 'UK Process', steps: ['IDENTITY', 'PROOF_OF_ADDRESS'] }
      },
      {
        id: 'other-kyc',
        type: 'level',
        data: { label: 'International KYC', levelName: 'Standard', steps: ['IDENTITY'] }
      },
      {
        id: 'final',
        type: 'action',
        data: { label: 'Complete', actions: [{ type: 'complete', title: 'Done' }] }
      }
    ],
    edges: [
      { source: 'start', target: 'country-check' },
      { source: 'country-check', target: 'sg-kyc', sourceHandle: 'branch-0' },
      { source: 'country-check', target: 'usa-kyc', sourceHandle: 'branch-1' },
      { source: 'country-check', target: 'uk-kyc', sourceHandle: 'branch-2' },
      { source: 'country-check', target: 'other-kyc', sourceHandle: 'else' },
      { source: 'sg-kyc', target: 'final' },
      { source: 'usa-kyc', target: 'final' },
      { source: 'uk-kyc', target: 'final' },
      { source: 'other-kyc', target: 'final' }
    ]
  };

  const executor = new WorkflowExecutor(workflow);

  // Test different countries
  const countries = ['Singapore', 'USA', 'UK', 'Japan'];

  for (const country of countries) {
    console.log(`\n--- Testing: ${country} ---`);
    const result = await executor.execute({ country });
    console.log('Path:', result.summary.executionPath.join(' → '));
  }
}

// ============================================================================
// EXAMPLE 4: Complex Flow (Risk-based KYC)
// ============================================================================

export async function runExample4() {
  console.log('\n\n📌 EXAMPLE 4: Complex Flow (Risk-based KYC)\n');

  const workflow = {
    nodes: [
      {
        id: 'collect',
        type: 'level',
        data: { label: 'Collect Data', steps: ['APPLICANT_DATA'] }
      },
      {
        id: 'risk-check',
        type: 'condition',
        data: {
          label: 'Risk Assessment',
          branches: [
            { name: 'High Risk', condition: 'riskScore >= 70' },
            { name: 'Medium Risk', condition: 'riskScore >= 30' }
          ]
        }
      },
      {
        id: 'enhanced-kyc',
        type: 'level',
        data: {
          label: 'Enhanced KYC',
          steps: ['IDENTITY', 'SELFIE', 'PROOF_OF_ADDRESS', 'SOURCE_OF_FUNDS']
        }
      },
      {
        id: 'standard-kyc',
        type: 'level',
        data: {
          label: 'Standard KYC',
          steps: ['IDENTITY', 'SELFIE']
        }
      },
      {
        id: 'basic-kyc',
        type: 'level',
        data: {
          label: 'Basic KYC',
          steps: ['IDENTITY']
        }
      },
      {
        id: 'manual-review',
        type: 'action',
        data: {
          label: 'Manual Review',
          actions: [{ type: 'createCase', title: 'Send to Compliance Team' }]
        }
      },
      {
        id: 'auto-approve',
        type: 'action',
        data: {
          label: 'Auto Approve',
          actions: [{ type: 'approve', title: 'Automatically Approved' }]
        }
      }
    ],
    edges: [
      { source: 'collect', target: 'risk-check' },
      { source: 'risk-check', target: 'enhanced-kyc', sourceHandle: 'branch-0' },
      { source: 'risk-check', target: 'standard-kyc', sourceHandle: 'branch-1' },
      { source: 'risk-check', target: 'basic-kyc', sourceHandle: 'else' },
      { source: 'enhanced-kyc', target: 'manual-review' },
      { source: 'standard-kyc', target: 'auto-approve' },
      { source: 'basic-kyc', target: 'auto-approve' }
    ]
  };

  const executor = new WorkflowExecutor(workflow);

  // Test different risk scores
  const riskScores = [85, 50, 10];

  for (const riskScore of riskScores) {
    console.log(`\n--- Risk Score: ${riskScore} ---`);
    const result = await executor.execute({ riskScore });
    console.log('Path:', result.summary.executionPath.join(' → '));
  }
}

// ============================================================================
// EXAMPLE 5: With Step Callback (Real-time Updates)
// ============================================================================

export async function runExample5() {
  console.log('\n\n📌 EXAMPLE 5: Real-time Step Callback\n');

  const workflow = {
    nodes: [
      { id: 'step1', type: 'level', data: { label: 'Step 1' } },
      { id: 'step2', type: 'level', data: { label: 'Step 2' } },
      { id: 'step3', type: 'level', data: { label: 'Step 3' } }
    ],
    edges: [
      { source: 'step1', target: 'step2' },
      { source: 'step2', target: 'step3' }
    ]
  };

  const executor = new WorkflowExecutor(workflow);

  // Execute with step callback
  const result = await executor.execute({}, {
    onStep: async (stepInfo) => {
      console.log(`\n🔔 Step Callback: ${stepInfo.label}`);
      console.log(`   Status: ${stepInfo.result.status}`);
      console.log(`   Time: ${stepInfo.timestamp}`);

      // In real app, you might:
      // - Update UI progress bar
      // - Send notification
      // - Log to analytics
      // - Update database

      // Simulate some async work
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  });

  console.log('\n✓ Workflow completed with callbacks');
  return result;
}

// ============================================================================
// Run All Examples
// ============================================================================

export async function runAllExamples() {
  await runExample1();
  await runExample2();
  await runExample3();
  await runExample4();
  await runExample5();

  console.log('\n\n✅ All examples completed!\n');
}

// Export individual examples
export default {
  runExample1,
  runExample2,
  runExample3,
  runExample4,
  runExample5,
  runAllExamples
};
