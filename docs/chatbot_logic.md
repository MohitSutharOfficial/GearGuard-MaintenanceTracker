# Chatbot Logic Document

## Overview

This document defines the AI chatbot integration for GearGuard, including intent recognition, entity extraction, conversation flows, and function calling patterns.

## Chatbot Purpose

The GearGuard chatbot assists users with:
- **Quick Data Lookup**: Find equipment, check request status
- **Task Execution**: Create maintenance requests, update statuses
- **Analytics**: Get insights and summaries
- **Guidance**: Help users navigate the system

## AI Provider Integration

### OpenAI GPT-4

**Configuration**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

const chatConfig = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  max_tokens: 500,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
};
```

### Azure OpenAI (Alternative)

```typescript
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
);

const deploymentId = 'gpt-4-deployment';
```

## System Prompt

```typescript
const SYSTEM_PROMPT = `You are GearGuard Assistant, an AI helper for a maintenance management system.

CAPABILITIES:
- Look up equipment information
- Check maintenance request status
- Create new maintenance requests
- Get team information
- Provide analytics and summaries

RULES:
1. Be concise and professional
2. Always confirm before creating or updating data
3. Use function calls to access real data
4. If unsure, ask clarifying questions
5. Format responses in markdown for readability

CONTEXT:
- Equipment has categories: Manufacturing, Computer, Vehicle, HVAC, Electrical
- Maintenance requests have two types: corrective (breakdowns) and preventive (scheduled)
- Requests go through stages: New → In Progress → Repaired/Completed
- Priority levels: Low, Medium, High, Urgent

Remember: You can only access data through function calls. Don't make up information.`;
```

## Function Definitions

### Equipment Functions

#### search_equipment

**Description**: Search for equipment by name, serial number, or category

```typescript
const searchEquipmentFunction = {
  name: 'search_equipment',
  description: 'Search for equipment by name, serial number, category, or department',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query (name or serial number)'
      },
      category: {
        type: 'string',
        enum: ['Manufacturing', 'Computer', 'Vehicle', 'HVAC', 'Electrical', 'Other'],
        description: 'Filter by equipment category'
      },
      department: {
        type: 'string',
        description: 'Filter by department'
      },
      status: {
        type: 'string',
        enum: ['active', 'under_repair', 'scrapped'],
        description: 'Filter by status'
      }
    },
    required: []
  }
};
```

**Implementation**:
```typescript
async function searchEquipment(params: {
  query?: string;
  category?: string;
  department?: string;
  status?: string;
}): Promise<Equipment[]> {
  const { query, category, department, status } = params;
  
  let results = equipment;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(eq => 
      eq.name.toLowerCase().includes(lowerQuery) ||
      eq.serialNumber.toLowerCase().includes(lowerQuery)
    );
  }
  
  if (category) {
    results = results.filter(eq => eq.category === category);
  }
  
  if (department) {
    results = results.filter(eq => eq.department === department);
  }
  
  if (status) {
    results = results.filter(eq => eq.status === status);
  }
  
  return results.slice(0, 5); // Limit to 5 results
}
```

#### get_equipment_by_id

**Description**: Get detailed information about specific equipment

```typescript
const getEquipmentByIdFunction = {
  name: 'get_equipment_by_id',
  description: 'Get detailed information about specific equipment by ID',
  parameters: {
    type: 'object',
    properties: {
      equipmentId: {
        type: 'string',
        description: 'The equipment ID'
      }
    },
    required: ['equipmentId']
  }
};
```

### Maintenance Request Functions

#### search_requests

**Description**: Search maintenance requests with filters

```typescript
const searchRequestsFunction = {
  name: 'search_requests',
  description: 'Search maintenance requests with various filters',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['corrective', 'preventive'],
        description: 'Filter by request type'
      },
      stage: {
        type: 'string',
        enum: ['new', 'in_progress', 'repaired', 'scrap', 'scheduled', 'completed'],
        description: 'Filter by stage'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'urgent'],
        description: 'Filter by priority'
      },
      equipmentId: {
        type: 'string',
        description: 'Filter by equipment ID'
      },
      isOverdue: {
        type: 'boolean',
        description: 'Filter for overdue requests only'
      }
    },
    required: []
  }
};
```

#### create_maintenance_request

**Description**: Create a new maintenance request

```typescript
const createRequestFunction = {
  name: 'create_maintenance_request',
  description: 'Create a new maintenance request for equipment',
  parameters: {
    type: 'object',
    properties: {
      subject: {
        type: 'string',
        description: 'Brief description of the issue or maintenance needed'
      },
      type: {
        type: 'string',
        enum: ['corrective', 'preventive'],
        description: 'Request type'
      },
      equipmentId: {
        type: 'string',
        description: 'ID of the equipment'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'urgent'],
        description: 'Priority level (required for corrective)'
      },
      description: {
        type: 'string',
        description: 'Detailed description of the issue'
      },
      scheduledDate: {
        type: 'string',
        description: 'Scheduled date for preventive maintenance (ISO format)'
      }
    },
    required: ['subject', 'type', 'equipmentId']
  }
};
```

#### update_request_stage

**Description**: Update the stage of a maintenance request

```typescript
const updateRequestStageFunction = {
  name: 'update_request_stage',
  description: 'Update the stage of a maintenance request',
  parameters: {
    type: 'object',
    properties: {
      requestId: {
        type: 'string',
        description: 'The request ID'
      },
      newStage: {
        type: 'string',
        enum: ['new', 'in_progress', 'repaired', 'completed', 'scrap'],
        description: 'New stage'
      },
      duration: {
        type: 'number',
        description: 'Hours spent (required when completing)'
      },
      notes: {
        type: 'string',
        description: 'Completion notes'
      }
    },
    required: ['requestId', 'newStage']
  }
};
```

### Analytics Functions

#### get_dashboard_stats

**Description**: Get dashboard KPIs and statistics

```typescript
const getDashboardStatsFunction = {
  name: 'get_dashboard_stats',
  description: 'Get current dashboard statistics and KPIs',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};
```

**Implementation**:
```typescript
async function getDashboardStats() {
  const totalEquipment = equipment.length;
  const activeEquipment = equipment.filter(eq => eq.status === 'active').length;
  const openRequests = requests.filter(r => 
    !['repaired', 'completed', 'scrap'].includes(r.stage)
  ).length;
  const totalTeams = teams.length;
  
  // Calculate average resolution time
  const completedRequests = requests.filter(r => 
    ['repaired', 'completed'].includes(r.stage) && r.duration
  );
  const avgResolutionTime = completedRequests.length > 0
    ? completedRequests.reduce((sum, r) => sum + (r.duration || 0), 0) / completedRequests.length
    : 0;
  
  return {
    totalEquipment,
    activeEquipment,
    openRequests,
    totalTeams,
    avgResolutionTime: Math.round(avgResolutionTime * 10) / 10
  };
}
```

#### get_overdue_requests

**Description**: Get all overdue maintenance requests

```typescript
const getOverdueRequestsFunction = {
  name: 'get_overdue_requests',
  description: 'Get all overdue maintenance requests',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};
```

### Team Functions

#### get_team_workload

**Description**: Get workload information for maintenance teams

```typescript
const getTeamWorkloadFunction = {
  name: 'get_team_workload',
  description: 'Get workload information for maintenance teams',
  parameters: {
    type: 'object',
    properties: {
      teamId: {
        type: 'string',
        description: 'Specific team ID (optional)'
      }
    },
    required: []
  }
};
```

## Intent Recognition

### Intent Categories

1. **Information Lookup**
   - Equipment search
   - Request status check
   - Team information
   - Analytics queries

2. **Task Execution**
   - Create maintenance request
   - Update request status
   - Assign technician

3. **Help & Guidance**
   - How-to questions
   - Feature explanations
   - Navigation help

### Intent Examples

```typescript
const intentExamples = {
  equipment_search: [
    "Find CNC machines",
    "Show me equipment in Production",
    "What equipment is under repair?",
    "List all manufacturing equipment"
  ],
  
  request_status: [
    "What's the status of request 123?",
    "Show me open maintenance requests",
    "Are there any overdue requests?",
    "List all high priority requests"
  ],
  
  create_request: [
    "Create a maintenance request for the forklift",
    "Report breakdown on CNC-001",
    "Schedule preventive maintenance for HVAC",
    "Log an oil leak on equipment FL-003"
  ],
  
  analytics: [
    "How many open requests do we have?",
    "What's our average repair time?",
    "Show dashboard stats",
    "Which team is busiest?"
  ],
  
  help: [
    "How do I create a maintenance request?",
    "What's the difference between corrective and preventive?",
    "How does the workflow work?",
    "Explain equipment statuses"
  ]
};
```

## Conversation Flows

### Flow 1: Create Maintenance Request

```
User: "Create a maintenance request for the CNC machine"
Bot: "I can help you create a maintenance request. Let me search for CNC machines..."
     [Calls: search_equipment({ query: "CNC" })]
     
Bot: "I found these CNC machines:
     1. CNC Milling Machine (CNC-001) - Active
     2. CNC Lathe (CNC-002) - Active
     
     Which one needs maintenance?"

User: "The milling machine"
Bot: "Got it. Is this for a breakdown (corrective) or scheduled maintenance (preventive)?"

User: "It's broken, won't start"
Bot: "I'll create a corrective maintenance request. What priority should this have?
     - Low
     - Medium
     - High
     - Urgent"

User: "High priority"
Bot: "Creating request..."
     [Calls: create_maintenance_request({
       subject: "CNC Milling Machine Won't Start",
       type: "corrective",
       equipmentId: "eq-001",
       priority: "high",
       description: "Machine won't start"
     })]
     
Bot: "✅ Maintenance request created successfully!
     
     **Request ID**: REQ-125
     **Equipment**: CNC Milling Machine (CNC-001)
     **Type**: Corrective
     **Priority**: High
     **Stage**: New
     
     The request has been assigned to the Mechanical Team. They'll be notified shortly."
```

### Flow 2: Check Equipment Status

```
User: "What's the status of the forklift?"
Bot: [Calls: search_equipment({ query: "forklift" })]
     
Bot: "I found Forklift #3 (FL-003):
     
     **Status**: Under Repair
     **Location**: Dock 2
     **Department**: Warehouse
     **Open Requests**: 1
     
     There's currently 1 active maintenance request:
     - Subject: Hydraulic Leak
     - Priority: Urgent
     - Stage: In Progress
     - Technician: Mike Johnson
     
     Would you like more details about this request?"
```

### Flow 3: Analytics Query

```
User: "How many maintenance requests are open?"
Bot: [Calls: get_dashboard_stats()]
     
Bot: "Current maintenance statistics:
     
     📊 **Open Requests**: 18
     📦 **Total Equipment**: 125
     👥 **Teams**: 12
     ⏱️ **Avg Resolution Time**: 4.2 hours
     
     Breaking down the open requests:
     - New: 5
     - In Progress: 8
     - Scheduled (Preventive): 5
     
     Would you like to see overdue requests or filter by priority?"
```

## Entity Extraction

### Equipment Entity

```typescript
interface EquipmentEntity {
  id?: string;
  name?: string;
  serialNumber?: string;
  category?: string;
  department?: string;
}

// Extract from user message
function extractEquipmentEntity(message: string): EquipmentEntity {
  const entity: EquipmentEntity = {};
  
  // Serial number pattern
  const serialMatch = message.match(/([A-Z]+-\d+)/);
  if (serialMatch) {
    entity.serialNumber = serialMatch[1];
  }
  
  // Category keywords
  const categories = ['CNC', 'forklift', 'HVAC', 'computer', 'vehicle'];
  for (const cat of categories) {
    if (message.toLowerCase().includes(cat.toLowerCase())) {
      entity.category = cat;
    }
  }
  
  return entity;
}
```

### Request Priority Entity

```typescript
function extractPriority(message: string): RequestPriority | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
    return 'urgent';
  }
  if (lowerMessage.includes('high')) {
    return 'high';
  }
  if (lowerMessage.includes('medium')) {
    return 'medium';
  }
  if (lowerMessage.includes('low')) {
    return 'low';
  }
  
  return null;
}
```

## Response Formatting

### Markdown Templates

```typescript
const responseTemplates = {
  equipmentCard: (eq: Equipment) => `
**${eq.name}** (${eq.serialNumber})
- Category: ${eq.category}
- Status: ${eq.status}
- Location: ${eq.location}
- Open Requests: ${eq.openRequestsCount}
  `,
  
  requestCard: (req: MaintenanceRequest) => `
**${req.subject}** [${req.stage}]
- Equipment: ${req.equipmentName}
- Priority: ${req.priority || 'N/A'}
- Created: ${formatDate(req.createdAt)}
${req.isOverdue ? '⚠️ **OVERDUE**' : ''}
  `,
  
  confirmation: (action: string, result: any) => `
✅ ${action} completed successfully!

${JSON.stringify(result, null, 2)}
  `
};
```

## Error Handling

```typescript
async function handleChatMessage(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      functions: allFunctions,
      function_call: 'auto'
    });
    
    // Handle function calls
    if (response.choices[0].message.function_call) {
      const result = await executeFunctionCall(
        response.choices[0].message.function_call
      );
      
      // Send function result back to GPT
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory,
          { role: 'user', content: message },
          response.choices[0].message,
          { role: 'function', name: functionName, content: JSON.stringify(result) }
        ]
      });
      
      return finalResponse.choices[0].message.content;
    }
    
    return response.choices[0].message.content;
    
  } catch (error) {
    console.error('Chatbot error:', error);
    
    if (error.code === 'rate_limit_exceeded') {
      return "I'm receiving too many requests right now. Please try again in a moment.";
    }
    
    if (error.code === 'context_length_exceeded') {
      return "This conversation has become too long. Let's start fresh. How can I help you?";
    }
    
    return "I encountered an error processing your request. Please try rephrasing or contact support if the issue persists.";
  }
}
```

## Suggested Prompts

```typescript
const suggestedPrompts = [
  "Find equipment that needs maintenance",
  "Show me all open requests",
  "What's the status of CNC-001?",
  "Create a maintenance request",
  "How many overdue requests are there?",
  "Show dashboard statistics",
  "Which team is handling the most requests?",
  "Explain the maintenance workflow"
];
```

## Context Management

```typescript
interface ChatContext {
  conversationHistory: ChatMessage[];
  currentIntent?: string;
  extractedEntities: Record<string, any>;
  pendingConfirmation?: {
    action: string;
    data: any;
  };
}

function manageContext(context: ChatContext, newMessage: string): ChatContext {
  // Add to history
  context.conversationHistory.push({
    role: 'user',
    content: newMessage,
    timestamp: new Date()
  });
  
  // Keep only last 10 messages to avoid token limits
  if (context.conversationHistory.length > 10) {
    context.conversationHistory = context.conversationHistory.slice(-10);
  }
  
  return context;
}
```

---

**Document Maintained By**: AI/ML Engineering Team  
**Last Updated**: December 2024  
**Version**: 1.0
