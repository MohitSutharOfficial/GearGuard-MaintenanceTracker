# Automations Document

## Overview

This document defines all automated behaviors, business rule automations, and system triggers in GearGuard.

## Automation Categories

1. **Field Auto-fill**: Automatic population of form fields
2. **Status Updates**: Automatic status changes based on events
3. **Notifications**: Automated alerts and reminders (future)
4. **Scheduled Tasks**: Cron jobs and background processes
5. **Data Validations**: Real-time validation and constraints
6. **Cascade Operations**: Related record updates

## Field Auto-fill Automations

### 1. Equipment Selection in Request Form

**Trigger**: User selects equipment in maintenance request form

**Action**: Auto-fill category and maintenance team

**Implementation**:
```typescript
function onEquipmentSelected(equipmentId: string) {
  const equipment = getEquipmentById(equipmentId);
  
  if (equipment) {
    // Auto-fill category (read-only)
    setFormField('equipmentCategory', equipment.category);
    
    // Auto-fill maintenance team (read-only)
    setFormField('maintenanceTeamId', equipment.maintenanceTeamId);
    setFormField('maintenanceTeamName', equipment.maintenanceTeamName);
    
    // Lock these fields
    lockField('equipmentCategory');
    lockField('maintenanceTeamId');
  }
}
```

**User Experience**:
- User sees category and team populate immediately
- Fields are grayed out to indicate they're read-only
- Tooltip explains: "Auto-filled from equipment settings"

### 2. Default Request Type Stage

**Trigger**: User selects request type (corrective/preventive)

**Action**: Set appropriate default stage

**Implementation**:
```typescript
function onRequestTypeSelected(type: RequestType) {
  if (type === 'corrective') {
    setFormField('stage', RequestStage.NEW);
    showField('priority'); // Required for corrective
    hideField('scheduledDate');
  } else if (type === 'preventive') {
    setFormField('stage', RequestStage.SCHEDULED);
    hideField('priority');
    showField('scheduledDate'); // Required for preventive
  }
}
```

### 3. Technician Auto-assignment (Future)

**Trigger**: Request moves to "In Progress" without assigned technician

**Action**: Suggest technicians from maintenance team

**Logic**:
```typescript
function suggestTechnician(request: MaintenanceRequest) {
  const team = getTeamById(request.maintenanceTeamId);
  const teamMembers = team.members;
  
  // Get workload for each member
  const workloads = teamMembers.map(member => ({
    member,
    openRequests: countOpenRequestsForTechnician(member.id)
  }));
  
  // Sort by workload (least busy first)
  workloads.sort((a, b) => a.openRequests - b.openRequests);
  
  // Return least busy technician
  return workloads[0]?.member;
}
```

## Status Update Automations

### 1. Equipment Status on Request Stage Change

**Trigger**: Maintenance request stage changes

**Action**: Update equipment status accordingly

**Rules**:
```typescript
function updateEquipmentStatusOnRequestChange(
  request: MaintenanceRequest,
  oldStage: RequestStage,
  newStage: RequestStage
) {
  const equipment = getEquipmentById(request.equipmentId);
  
  // Request starts → Equipment under repair
  if (newStage === RequestStage.IN_PROGRESS) {
    equipment.status = EquipmentStatus.UNDER_REPAIR;
    logStatusChange(equipment, 'Request started');
  }
  
  // Request completed → Check if equipment can return to active
  if (['repaired', 'completed'].includes(newStage)) {
    const otherActiveRequests = getOpenRequestsForEquipment(
      equipment.id,
      request.id // Exclude current request
    );
    
    if (otherActiveRequests.length === 0) {
      equipment.status = EquipmentStatus.ACTIVE;
      logStatusChange(equipment, 'All repairs completed');
    }
  }
  
  // Request moved to scrap → Equipment scrapped
  if (newStage === RequestStage.SCRAP) {
    equipment.status = EquipmentStatus.SCRAPPED;
    logStatusChange(equipment, 'Equipment scrapped via request');
    
    // Cascade: Close all other open requests
    closeOtherRequestsForEquipment(equipment.id, request.id);
  }
}
```

### 2. Open Requests Count Update

**Trigger**: Request created, stage changed, or deleted

**Action**: Update equipment.openRequestsCount

**Implementation**:
```typescript
function updateOpenRequestsCount(equipmentId: string) {
  const openCount = requests.filter(r => 
    r.equipmentId === equipmentId &&
    !['repaired', 'completed', 'scrap'].includes(r.stage)
  ).length;
  
  const equipment = getEquipmentById(equipmentId);
  equipment.openRequestsCount = openCount;
  
  // Update last modified timestamp
  equipment.updatedAt = new Date().toISOString();
}

// Trigger points
function onRequestCreated(request: MaintenanceRequest) {
  updateOpenRequestsCount(request.equipmentId);
}

function onRequestStageChanged(request: MaintenanceRequest) {
  updateOpenRequestsCount(request.equipmentId);
}

function onRequestDeleted(request: MaintenanceRequest) {
  updateOpenRequestsCount(request.equipmentId);
}
```

### 3. Completion Timestamp

**Trigger**: Request stage changes to terminal state (repaired, completed, scrap)

**Action**: Set completedAt timestamp

**Implementation**:
```typescript
function onRequestStageChanged(
  request: MaintenanceRequest,
  newStage: RequestStage
) {
  const terminalStages = ['repaired', 'completed', 'scrap'];
  
  if (terminalStages.includes(newStage) && !request.completedAt) {
    request.completedAt = new Date().toISOString();
    
    // Calculate total time
    const created = new Date(request.createdAt);
    const completed = new Date(request.completedAt);
    const totalHours = (completed.getTime() - created.getTime()) / (1000 * 60 * 60);
    
    logMetric('request_completion_time', totalHours, {
      requestId: request.id,
      type: request.type,
      priority: request.priority
    });
  }
}
```

## Overdue Detection

### Real-time Overdue Calculation

**Trigger**: Page load, data refresh, every minute

**Action**: Calculate and mark overdue requests

**Implementation**:
```typescript
function calculateOverdueStatus(request: MaintenanceRequest): boolean {
  // Not overdue if already completed
  if (['repaired', 'completed', 'scrap'].includes(request.stage)) {
    return false;
  }
  
  // Only requests with scheduled dates can be overdue
  if (!request.scheduledDate) {
    return false;
  }
  
  // Compare dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const scheduled = new Date(request.scheduledDate);
  scheduled.setHours(0, 0, 0, 0);
  
  return scheduled < today;
}

// Run periodically
setInterval(() => {
  requests.forEach(request => {
    request.isOverdue = calculateOverdueStatus(request);
  });
}, 60000); // Every minute
```

## Cascade Operations

### 1. Equipment Scrapped → Close All Requests

**Trigger**: Equipment status changes to "scrapped"

**Action**: Automatically close all open maintenance requests

**Implementation**:
```typescript
function onEquipmentScrapped(equipmentId: string) {
  const openRequests = requests.filter(r => 
    r.equipmentId === equipmentId &&
    !['repaired', 'completed', 'scrap'].includes(r.stage)
  );
  
  openRequests.forEach(request => {
    request.stage = RequestStage.SCRAP;
    request.completedAt = new Date().toISOString();
    request.notes = 'Auto-closed: Equipment scrapped';
    
    logAudit('request_auto_closed', {
      requestId: request.id,
      reason: 'equipment_scrapped',
      equipmentId
    });
  });
  
  // Show notification
  showNotification({
    type: 'warning',
    title: 'Equipment Scrapped',
    message: `${openRequests.length} open request(s) automatically closed.`,
    duration: 5000
  });
}
```

### 2. Team Deleted → Reassign Equipment and Requests

**Trigger**: Maintenance team deletion

**Action**: Prevent deletion or require reassignment

**Implementation**:
```typescript
async function onTeamDelete(teamId: string): Promise<boolean> {
  const assignedEquipment = equipment.filter(eq => 
    eq.maintenanceTeamId === teamId
  );
  
  const openRequests = requests.filter(r => 
    r.maintenanceTeamId === teamId &&
    !['repaired', 'completed', 'scrap'].includes(r.stage)
  );
  
  if (assignedEquipment.length > 0 || openRequests.length > 0) {
    showError({
      title: 'Cannot Delete Team',
      message: `This team has ${assignedEquipment.length} assigned equipment and ${openRequests.length} open requests. Please reassign them first.`,
      actions: [
        { label: 'View Equipment', onClick: () => navigateToEquipmentList(teamId) },
        { label: 'View Requests', onClick: () => navigateToRequestList(teamId) }
      ]
    });
    
    return false; // Prevent deletion
  }
  
  return true; // Allow deletion
}
```

## Validation Automations

### 1. Stage Transition Validation

**Trigger**: User attempts to change request stage

**Action**: Validate transition rules before allowing change

**Implementation**:
```typescript
function validateStageTransition(
  request: MaintenanceRequest,
  newStage: RequestStage
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const currentStage = request.stage;
  
  // Check if transition is allowed
  const allowedTransitions: Record<RequestStage, RequestStage[]> = {
    [RequestStage.NEW]: [RequestStage.IN_PROGRESS],
    [RequestStage.IN_PROGRESS]: [RequestStage.REPAIRED, RequestStage.SCRAP],
    [RequestStage.REPAIRED]: [],
    [RequestStage.SCRAP]: [],
    [RequestStage.SCHEDULED]: [RequestStage.IN_PROGRESS],
    [RequestStage.COMPLETED]: []
  };
  
  if (!allowedTransitions[currentStage].includes(newStage)) {
    errors.push(`Cannot transition from ${currentStage} to ${newStage}`);
  }
  
  // Check required fields for target stage
  if (newStage === RequestStage.IN_PROGRESS && !request.technician) {
    errors.push('Technician must be assigned before starting work');
  }
  
  if ([RequestStage.REPAIRED, RequestStage.COMPLETED].includes(newStage)) {
    if (!request.duration || request.duration <= 0) {
      errors.push('Duration must be logged before completion');
    }
  }
  
  if (newStage === RequestStage.SCRAP && !request.scrapReason) {
    errors.push('Scrap reason is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Use in drag-and-drop handler
function onDragEnd(result: DropResult) {
  const { draggableId, destination } = result;
  
  if (!destination) return;
  
  const request = getRequestById(draggableId);
  const newStage = mapColumnToStage(destination.droppableId);
  
  const validation = validateStageTransition(request, newStage);
  
  if (!validation.valid) {
    // Revert drag
    showError({
      title: 'Invalid Transition',
      message: validation.errors.join('\n')
    });
    return;
  }
  
  // Proceed with update
  updateRequestStage(request.id, newStage);
}
```

### 2. Warranty Expiration Warning

**Trigger**: Equipment warranty within 30 days of expiration

**Action**: Show warning badge on equipment card

**Implementation**:
```typescript
function checkWarrantyStatus(equipment: Equipment): {
  isExpiring: boolean;
  daysRemaining: number;
} {
  const today = new Date();
  const warranty = new Date(equipment.warrantyExpiry);
  
  const diffTime = warranty.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isExpiring: diffDays <= 30 && diffDays > 0,
    daysRemaining: diffDays
  };
}

// Display in UI
function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const warrantyStatus = checkWarrantyStatus(equipment);
  
  return (
    <Card>
      <h3>{equipment.name}</h3>
      {warrantyStatus.isExpiring && (
        <Badge variant="warning">
          ⚠️ Warranty expires in {warrantyStatus.daysRemaining} days
        </Badge>
      )}
      {/* ... rest of card ... */}
    </Card>
  );
}
```

## Scheduled Tasks (Future)

### 1. Daily Overdue Email Notifications

**Schedule**: Every day at 8:00 AM

**Action**: Send email to managers with overdue requests

```typescript
// Cron job: 0 8 * * *
async function sendOverdueNotifications() {
  const overdueRequests = requests.filter(r => r.isOverdue);
  
  if (overdueRequests.length === 0) return;
  
  const managers = users.filter(u => u.role === 'manager');
  
  for (const manager of managers) {
    await sendEmail({
      to: manager.email,
      subject: `${overdueRequests.length} Overdue Maintenance Requests`,
      template: 'overdue-requests',
      data: {
        managerName: manager.fullName,
        requests: overdueRequests,
        dashboardLink: 'https://gearguard.com/dashboard'
      }
    });
  }
  
  logAudit('overdue_notifications_sent', {
    recipientCount: managers.length,
    overdueCount: overdueRequests.length
  });
}
```

### 2. Automatic Preventive Maintenance Generation

**Schedule**: First day of each month

**Action**: Create preventive maintenance requests based on schedule

```typescript
// Cron job: 0 0 1 * *
async function generatePreventiveMaintenance() {
  // Get all equipment with maintenance schedules
  const scheduledEquipment = equipment.filter(eq => 
    eq.maintenanceSchedule && eq.status === 'active'
  );
  
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  for (const eq of scheduledEquipment) {
    const { frequency, lastMaintenanceDate } = eq.maintenanceSchedule;
    
    // Check if maintenance is due next month
    const isDue = checkIfMaintenanceDue(lastMaintenanceDate, frequency, nextMonth);
    
    if (isDue) {
      const scheduledDate = calculateScheduledDate(frequency, nextMonth);
      
      await createMaintenanceRequest({
        subject: `${frequency} Maintenance - ${eq.name}`,
        type: 'preventive',
        equipmentId: eq.id,
        scheduledDate: scheduledDate.toISOString(),
        description: 'Auto-generated preventive maintenance',
        priority: 'medium'
      });
      
      logAudit('preventive_request_auto_created', {
        equipmentId: eq.id,
        scheduledDate
      });
    }
  }
}
```

### 3. Database Cleanup

**Schedule**: Weekly on Sunday at 2:00 AM

**Action**: Archive completed requests older than 1 year

```typescript
// Cron job: 0 2 * * 0
async function archiveOldRequests() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const oldRequests = await db.maintenance_requests
    .where('completed_at', '<', oneYearAgo)
    .where('stage', 'in', ['repaired', 'completed', 'scrap']);
  
  // Move to archive table
  await db.archived_requests.insert(oldRequests);
  
  // Delete from main table
  await db.maintenance_requests
    .where('id', 'in', oldRequests.map(r => r.id))
    .delete();
  
  logAudit('requests_archived', {
    count: oldRequests.length,
    cutoffDate: oneYearAgo
  });
}
```

## Audit Logging

### Automatic Audit Trail

**Trigger**: Any CRUD operation

**Action**: Log action details

```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string; // 'create', 'update', 'delete'
  entityType: string; // 'equipment', 'request', 'team'
  entityId: string;
  changes: Record<string, { old: any; new: any }>;
  ipAddress: string;
}

function logAudit(
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, any>
) {
  const log: AuditLog = {
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    userId: getCurrentUser().id,
    action,
    entityType,
    entityId,
    changes: changes || {},
    ipAddress: getClientIP()
  };
  
  // Store in database
  db.audit_logs.insert(log);
  
  // Also log to analytics
  analytics.track('audit_event', {
    action,
    entityType,
    userId: log.userId
  });
}

// Usage
function updateEquipment(id: string, updates: Partial<Equipment>) {
  const oldEquipment = getEquipmentById(id);
  const newEquipment = { ...oldEquipment, ...updates };
  
  // Calculate changes
  const changes: Record<string, any> = {};
  for (const key in updates) {
    if (oldEquipment[key] !== updates[key]) {
      changes[key] = {
        old: oldEquipment[key],
        new: updates[key]
      };
    }
  }
  
  // Log audit
  logAudit('update', 'equipment', id, changes);
  
  // Perform update
  saveEquipment(newEquipment);
}
```

## Performance Optimizations

### Debounced Calculations

```typescript
// Debounce expensive calculations
const debouncedRecalculateStats = debounce(() => {
  recalculateDashboardStats();
}, 1000);

function onRequestChanged() {
  // Update immediately in UI (optimistic)
  updateUIOptimistically();
  
  // Recalculate stats after 1 second of inactivity
  debouncedRecalculateStats();
}
```

### Batch Updates

```typescript
// Batch multiple updates into single transaction
async function batchUpdateRequests(updates: Array<{ id: string; data: any }>) {
  await db.transaction(async (trx) => {
    for (const update of updates) {
      await trx.maintenance_requests
        .where('id', update.id)
        .update(update.data);
      
      logAudit('update', 'request', update.id, update.data);
    }
  });
  
  // Single notification for all updates
  showNotification({
    type: 'success',
    title: 'Batch Update Complete',
    message: `${updates.length} requests updated successfully`
  });
}
```

---

**Document Maintained By**: Automation Engineering Team  
**Last Updated**: December 2024  
**Version**: 1.0
