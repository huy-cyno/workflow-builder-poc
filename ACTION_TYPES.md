# 🎯 Available Action Types

> Complete reference for all action types in the workflow builder

---

## 📋 Action Types Reference

### 1. **Create Case** (`createCase`)
- **Icon:** 📋
- **Color:** #FF6B9D (Pink)
- **Use Case:** Create a manual review case or ticket
- **Example:**
  ```javascript
  {
    type: 'createCase',
    title: 'Create manual review case',
    value: 'Compliance Team'
  }
  ```

### 2. **Send Webhook** (`sendWebhook`)
- **Icon:** 🔗
- **Color:** #9B59B6 (Purple)
- **Use Case:** Send HTTP webhook to external systems
- **Example:**
  ```javascript
  {
    type: 'sendWebhook',
    title: 'Notify partner system',
    value: 'https://api.partner.com/webhook'
  }
  ```

### 3. **Send Email** (`sendEmail`)
- **Icon:** 📧
- **Color:** #3498DB (Blue)
- **Use Case:** Send email notifications
- **Example:**
  ```javascript
  {
    type: 'sendEmail',
    title: 'Welcome email',
    value: 'user@example.com'
  }
  ```

### 4. **Send SMS** (`sendSMS`)
- **Icon:** 💬
- **Color:** #1ABC9C (Teal)
- **Use Case:** Send SMS text messages
- **Example:**
  ```javascript
  {
    type: 'sendSMS',
    title: 'Verification code',
    value: '+1234567890'
  }
  ```

### 5. **Update Database** (`updateDatabase`)
- **Icon:** 💾
- **Color:** #34495E (Dark Gray)
- **Use Case:** Update records in database
- **Example:**
  ```javascript
  {
    type: 'updateDatabase',
    title: 'Update user status',
    value: 'status: verified'
  }
  ```

### 6. **Call API** (`callAPI`)
- **Icon:** 🌐
- **Color:** #E67E22 (Orange)
- **Use Case:** Make API calls to external services
- **Example:**
  ```javascript
  {
    type: 'callAPI',
    title: 'Check credit score',
    value: 'POST /api/credit-check'
  }
  ```

### 7. **Approve** (`approve`)
- **Icon:** ✅
- **Color:** #27AE60 (Green)
- **Use Case:** Approve applications or requests
- **Example:**
  ```javascript
  {
    type: 'approve',
    title: 'Auto-approve user',
    value: ''
  }
  ```

### 8. **Reject** (`reject`)
- **Icon:** ❌
- **Color:** #E74C3C (Red)
- **Use Case:** Reject applications or requests
- **Example:**
  ```javascript
  {
    type: 'reject',
    title: 'Reject application',
    value: 'Reason: Insufficient documents'
  }
  ```

### 9. **Send Notification** (`notify`)
- **Icon:** 🔔
- **Color:** #F39C12 (Yellow)
- **Use Case:** Send push notifications to mobile/web
- **Example:**
  ```javascript
  {
    type: 'notify',
    title: 'Push notification',
    value: 'Your account has been verified!'
  }
  ```

### 10. **Log Event** (`log`)
- **Icon:** 📝
- **Color:** #95A5A6 (Gray)
- **Use Case:** Log events for auditing/tracking
- **Example:**
  ```javascript
  {
    type: 'log',
    title: 'Log completion',
    value: 'User verification completed'
  }
  ```

---

## 🎨 Visual Reference

Each action type has:
- Unique **icon** for quick identification
- Distinct **color** for visual grouping
- **Badge** showing the action type
- **Border color** matching the action type

---

## 💡 Usage Examples

### Example 1: High Risk User Flow

```javascript
{
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
}
```

### Example 2: Auto-Approval Flow

```javascript
{
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
}
```

### Example 3: Verification Flow

```javascript
{
  label: 'Verification Actions',
  actions: [
    {
      type: 'sendSMS',
      title: 'Send verification code',
      value: '+1234567890'
    },
    {
      type: 'callAPI',
      title: 'Verify identity',
      value: 'POST /api/verify'
    },
    {
      type: 'updateDatabase',
      title: 'Update verification status',
      value: 'verified: true'
    },
    {
      type: 'log',
      title: 'Log verification',
      value: 'Identity verified successfully'
    }
  ]
}
```

### Example 4: Rejection Flow

```javascript
{
  label: 'Rejection Actions',
  actions: [
    {
      type: 'reject',
      title: 'Reject application',
      value: 'Reason: Incomplete documents'
    },
    {
      type: 'sendEmail',
      title: 'Rejection notice',
      value: 'user@example.com'
    },
    {
      type: 'notify',
      title: 'App notification',
      value: 'Application rejected. Please resubmit.'
    },
    {
      type: 'log',
      title: 'Log rejection',
      value: 'Application rejected - incomplete docs'
    }
  ]
}
```

---

## 🔧 Adding Custom Action Types

To add your own action type:

1. **Update ActionNode.js:**
   ```javascript
   const ACTION_TYPES = {
     // ... existing types
     myCustomAction: {
       icon: '🚀',
       label: 'My Custom Action',
       color: '#FF5733'
     }
   };
   ```

2. **Use it in your workflow:**
   ```javascript
   {
     type: 'myCustomAction',
     title: 'Do something custom',
     value: 'custom value'
   }
   ```

3. **Handle it in the executor:**
   ```javascript
   // In workflowExecutor.js
   async executeAction(node, context) {
     for (const action of node.data.actions) {
       if (action.type === 'myCustomAction') {
         // Your custom logic here
         await handleMyCustomAction(action, context);
       }
     }
   }
   ```

---

## 🎯 Real-World Workflow Example

Here's a complete KYC verification workflow using multiple action types:

```javascript
const kycWorkflow = {
  nodes: [
    {
      id: 'collect',
      type: 'level',
      data: {
        label: 'Collect Documents',
        steps: ['IDENTITY', 'SELFIE', 'PROOF_OF_ADDRESS']
      }
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
      id: 'high-risk',
      type: 'action',
      data: {
        label: 'High Risk Flow',
        actions: [
          { type: 'createCase', title: 'Manual review', value: 'Compliance' },
          { type: 'sendEmail', title: 'Alert team', value: 'team@co.com' },
          { type: 'reject', title: 'Temporary reject', value: 'Pending review' },
          { type: 'log', title: 'Log event', value: 'High risk detected' }
        ]
      }
    },
    {
      id: 'medium-risk',
      type: 'action',
      data: {
        label: 'Medium Risk Flow',
        actions: [
          { type: 'callAPI', title: 'Enhanced check', value: '/api/enhanced-kyc' },
          { type: 'sendSMS', title: 'Additional verification', value: '+123...' },
          { type: 'log', title: 'Log check', value: 'Medium risk - enhanced KYC' }
        ]
      }
    },
    {
      id: 'low-risk',
      type: 'action',
      data: {
        label: 'Low Risk - Auto Approve',
        actions: [
          { type: 'approve', title: 'Auto approve', value: '' },
          { type: 'updateDatabase', title: 'Update status', value: 'verified' },
          { type: 'sendWebhook', title: 'Notify partners', value: 'https://...' },
          { type: 'sendEmail', title: 'Welcome email', value: 'user@co.com' },
          { type: 'notify', title: 'Push notification', value: 'Approved!' },
          { type: 'log', title: 'Log success', value: 'Auto-approved' }
        ]
      }
    }
  ],
  edges: [
    { source: 'collect', target: 'risk-check' },
    { source: 'risk-check', target: 'high-risk', sourceHandle: 'branch-0' },
    { source: 'risk-check', target: 'medium-risk', sourceHandle: 'branch-1' },
    { source: 'risk-check', target: 'low-risk', sourceHandle: 'else' }
  ]
};
```

---

## 📊 Action Types by Category

### **Data Management**
- 💾 Update Database
- 📝 Log Event

### **Communication**
- 📧 Send Email
- 💬 Send SMS
- 🔔 Send Notification
- 🔗 Send Webhook

### **Integration**
- 🌐 Call API
- 🔗 Send Webhook

### **Decision Actions**
- ✅ Approve
- ❌ Reject
- 📋 Create Case

### **Tracking**
- 📝 Log Event

---

## 🚀 Next Steps

1. **Try the demo** - The initial workflow now shows multiple action types
2. **Create action nodes** - Add new action nodes with different types
3. **Test execution** - Click "Test Execute" to see actions in the log
4. **Customize** - Add your own action types as needed

---

**All 10 action types are now available in the workflow builder!**
