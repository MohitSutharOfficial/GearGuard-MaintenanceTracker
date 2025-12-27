# Reports & Analytics

## Overview

This document defines all reporting capabilities, KPIs, analytics queries, and export features in GearGuard.

## Dashboard KPIs

### Primary Metrics

#### 1. Total Equipment Count
**Definition**: Count of all active equipment  
**Calculation**: `equipment.filter(e => e.status !== 'scrapped').length`  
**Display**: Large number with icon  
**Color**: Odoo purple (#714B67)

#### 2. Active Requests
**Definition**: Count of non-completed maintenance requests  
**Calculation**:
```typescript
requests.filter(r => 
  !['repaired', 'completed', 'scrap'].includes(r.stage)
).length
```
**Display**: Large number with up/down indicator  
**Trend**: Compare to last week/month

#### 3. Overdue Requests
**Definition**: Requests past scheduled date and not completed  
**Calculation**:
```typescript
requests.filter(r => r.isOverdue).length
```
**Display**: Large number with warning color  
**Alert**: Red if > 0

#### 4. Average Resolution Time
**Definition**: Average hours from request creation to completion  
**Calculation**:
```typescript
const completedRequests = requests.filter(r => r.completedAt);
const totalTime = completedRequests.reduce((sum, r) => {
  const created = new Date(r.createdAt);
  const completed = new Date(r.completedAt);
  const hours = (completed - created) / (1000 * 60 * 60);
  return sum + hours;
}, 0);
return completedRequests.length > 0 
  ? totalTime / completedRequests.length 
  : 0;
```
**Display**: Hours with 1 decimal place  
**Format**: "24.5 hrs"

## Chart Specifications

### 1. Requests by Status (Bar Chart)

**Type**: Vertical bar chart  
**Library**: Recharts

**Data Structure**:
```typescript
interface StatusBarData {
  status: string; // 'New', 'In Progress', 'Repaired', 'Scrap'
  count: number;
  fill: string; // Bar color
}
```

**Query**:
```typescript
function getRequestsByStatus(): StatusBarData[] {
  const stages = [
    { key: 'new', label: 'New', color: '#94a3b8' },
    { key: 'in_progress', label: 'In Progress', color: '#3b82f6' },
    { key: 'repaired', label: 'Repaired', color: '#22c55e' },
    { key: 'scrap', label: 'Scrap', color: '#ef4444' }
  ];
  
  return stages.map(stage => ({
    status: stage.label,
    count: requests.filter(r => r.stage === stage.key).length,
    fill: stage.color
  }));
}
```

**Recharts Configuration**:
```tsx
<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="status" />
  <YAxis allowDecimals={false} />
  <Tooltip />
  <Bar dataKey="count" />
</BarChart>
```

### 2. Equipment by Category (Pie Chart)

**Type**: Donut chart  
**Library**: Recharts

**Data Structure**:
```typescript
interface CategoryPieData {
  category: string;
  count: number;
  percentage: number;
}
```

**Query**:
```typescript
function getEquipmentByCategory(): CategoryPieData[] {
  const grouped = equipment.reduce((acc, eq) => {
    const category = eq.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const total = equipment.length;
  
  return Object.entries(grouped).map(([category, count]) => ({
    category,
    count,
    percentage: (count / total) * 100
  }));
}
```

**Recharts Configuration**:
```tsx
<PieChart>
  <Pie
    data={data}
    dataKey="count"
    nameKey="category"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
    label={({ category, percentage }) => 
      `${category} (${percentage.toFixed(1)}%)`
    }
  >
    {data.map((entry, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

### 3. Maintenance Trend (Line Chart)

**Type**: Multi-line time series  
**Library**: Recharts  
**Time Range**: Last 12 months

**Data Structure**:
```typescript
interface TrendLineData {
  month: string; // 'Jan', 'Feb', etc.
  corrective: number;
  preventive: number;
}
```

**Query**:
```typescript
function getMaintenanceTrend(months: number = 12): TrendLineData[] {
  const today = new Date();
  const result: TrendLineData[] = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    
    const monthRequests = requests.filter(r => {
      const created = new Date(r.createdAt);
      return created >= monthStart && created <= monthEnd;
    });
    
    result.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      corrective: monthRequests.filter(r => r.type === 'corrective').length,
      preventive: monthRequests.filter(r => r.type === 'preventive').length
    });
  }
  
  return result;
}
```

**Recharts Configuration**:
```tsx
<LineChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis allowDecimals={false} />
  <Tooltip />
  <Legend />
  <Line 
    type="monotone" 
    dataKey="corrective" 
    stroke="#ef4444" 
    strokeWidth={2}
    name="Corrective"
  />
  <Line 
    type="monotone" 
    dataKey="preventive" 
    stroke="#22c55e" 
    strokeWidth={2}
    name="Preventive"
  />
</LineChart>
```

## Detailed Reports

### 1. Equipment Utilization Report

**Purpose**: Show equipment usage, downtime, and repair frequency

**Filters**:
- Date Range
- Equipment Category
- Maintenance Team

**Columns**:
| Column | Description | Calculation |
|--------|-------------|-------------|
| Equipment Name | Equipment identifier | `equipment.name` |
| Category | Equipment type | `equipment.category` |
| Total Requests | Count of all requests | `COUNT(requests WHERE equipmentId = eq.id)` |
| Completed Repairs | Count of completed | `COUNT(requests WHERE stage = 'repaired')` |
| Open Requests | Current open | `COUNT(requests WHERE stage NOT IN completed)` |
| Total Downtime (hrs) | Sum of all repair durations | `SUM(request.duration)` |
| Avg Repair Time (hrs) | Mean duration | `AVG(request.duration)` |
| Last Maintenance | Most recent request | `MAX(request.createdAt)` |
| Status | Current status | `equipment.status` |

**Query**:
```typescript
interface EquipmentUtilization {
  equipmentId: string;
  equipmentName: string;
  category: string;
  totalRequests: number;
  completedRepairs: number;
  openRequests: number;
  totalDowntime: number;
  avgRepairTime: number;
  lastMaintenance: string | null;
  status: EquipmentStatus;
}

function generateEquipmentUtilizationReport(
  startDate: Date,
  endDate: Date,
  filters: {
    category?: string;
    teamId?: string;
  }
): EquipmentUtilization[] {
  let filteredEquipment = equipment;
  
  if (filters.category) {
    filteredEquipment = filteredEquipment.filter(e => e.category === filters.category);
  }
  
  if (filters.teamId) {
    filteredEquipment = filteredEquipment.filter(e => e.maintenanceTeamId === filters.teamId);
  }
  
  return filteredEquipment.map(eq => {
    const equipmentRequests = requests.filter(r => {
      const created = new Date(r.createdAt);
      return r.equipmentId === eq.id 
        && created >= startDate 
        && created <= endDate;
    });
    
    const completedRequests = equipmentRequests.filter(r => 
      ['repaired', 'completed'].includes(r.stage)
    );
    
    const totalDowntime = completedRequests.reduce(
      (sum, r) => sum + (r.duration || 0), 
      0
    );
    
    const lastRequest = equipmentRequests
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    
    return {
      equipmentId: eq.id,
      equipmentName: eq.name,
      category: eq.category,
      totalRequests: equipmentRequests.length,
      completedRepairs: completedRequests.length,
      openRequests: equipmentRequests.filter(r => 
        !['repaired', 'completed', 'scrap'].includes(r.stage)
      ).length,
      totalDowntime,
      avgRepairTime: completedRequests.length > 0 
        ? totalDowntime / completedRequests.length 
        : 0,
      lastMaintenance: lastRequest?.createdAt || null,
      status: eq.status
    };
  });
}
```

**Export Formats**: CSV, Excel, PDF

### 2. Technician Performance Report

**Purpose**: Analyze technician workload and efficiency

**Filters**:
- Date Range
- Maintenance Team
- Technician

**Columns**:
| Column | Description |
|--------|-------------|
| Technician Name | Full name |
| Team | Maintenance team |
| Assigned Requests | Total assigned |
| Completed Requests | Successfully completed |
| Completion Rate | % completed |
| Avg Resolution Time | Mean duration |
| Overdue Requests | Currently overdue |
| Workload Score | Normalized score |

**Query**:
```typescript
interface TechnicianPerformance {
  technicianId: string;
  technicianName: string;
  teamName: string;
  assignedRequests: number;
  completedRequests: number;
  completionRate: number;
  avgResolutionTime: number;
  overdueRequests: number;
  workloadScore: number;
}

function generateTechnicianPerformanceReport(
  startDate: Date,
  endDate: Date
): TechnicianPerformance[] {
  const technicians = getAllTechnicians();
  
  return technicians.map(tech => {
    const assignedRequests = requests.filter(r => {
      const created = new Date(r.createdAt);
      return r.technicianId === tech.id
        && created >= startDate
        && created <= endDate;
    });
    
    const completed = assignedRequests.filter(r => 
      ['repaired', 'completed'].includes(r.stage)
    );
    
    const totalTime = completed.reduce((sum, r) => {
      if (!r.completedAt) return sum;
      const created = new Date(r.createdAt);
      const done = new Date(r.completedAt);
      return sum + (done - created) / (1000 * 60 * 60);
    }, 0);
    
    const overdue = assignedRequests.filter(r => r.isOverdue);
    
    return {
      technicianId: tech.id,
      technicianName: tech.fullName,
      teamName: tech.teamName,
      assignedRequests: assignedRequests.length,
      completedRequests: completed.length,
      completionRate: assignedRequests.length > 0
        ? (completed.length / assignedRequests.length) * 100
        : 0,
      avgResolutionTime: completed.length > 0
        ? totalTime / completed.length
        : 0,
      overdueRequests: overdue.length,
      workloadScore: calculateWorkloadScore(tech.id)
    };
  });
}

function calculateWorkloadScore(technicianId: string): number {
  const openRequests = requests.filter(r => 
    r.technicianId === technicianId &&
    !['repaired', 'completed', 'scrap'].includes(r.stage)
  );
  
  // Weight by priority
  const score = openRequests.reduce((sum, r) => {
    const priorityWeight = {
      low: 1,
      medium: 2,
      high: 3
    };
    return sum + (priorityWeight[r.priority] || 1);
  }, 0);
  
  return score;
}
```

### 3. Maintenance Cost Analysis

**Purpose**: Track maintenance expenses and budget

**Filters**:
- Date Range
- Cost Center
- Equipment Category

**Metrics**:
- Total Maintenance Cost
- Cost per Equipment
- Cost per Request
- Labor Cost vs Parts Cost
- Budget vs Actual

**Data Structure**:
```typescript
interface MaintenanceCost {
  requestId: string;
  subject: string;
  equipmentName: string;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  duration: number;
  costPerHour: number;
}
```

**Query**:
```typescript
function generateCostAnalysis(
  startDate: Date,
  endDate: Date
): {
  summary: {
    totalCost: number;
    laborCost: number;
    partsCost: number;
    avgCostPerRequest: number;
    avgCostPerEquipment: number;
  };
  details: MaintenanceCost[];
} {
  const periodRequests = requests.filter(r => {
    const created = new Date(r.createdAt);
    return created >= startDate && created <= endDate;
  });
  
  const details: MaintenanceCost[] = periodRequests.map(r => {
    const laborCost = (r.duration || 0) * LABOR_RATE_PER_HOUR;
    const partsCost = r.partsCost || 0;
    
    return {
      requestId: r.id,
      subject: r.subject,
      equipmentName: getEquipmentById(r.equipmentId)?.name || 'Unknown',
      laborCost,
      partsCost,
      totalCost: laborCost + partsCost,
      duration: r.duration || 0,
      costPerHour: r.duration > 0 ? (laborCost + partsCost) / r.duration : 0
    };
  });
  
  const totalCost = details.reduce((sum, d) => sum + d.totalCost, 0);
  const totalLabor = details.reduce((sum, d) => sum + d.laborCost, 0);
  const totalParts = details.reduce((sum, d) => sum + d.partsCost, 0);
  
  const uniqueEquipment = new Set(periodRequests.map(r => r.equipmentId));
  
  return {
    summary: {
      totalCost,
      laborCost: totalLabor,
      partsCost: totalParts,
      avgCostPerRequest: details.length > 0 ? totalCost / details.length : 0,
      avgCostPerEquipment: uniqueEquipment.size > 0 
        ? totalCost / uniqueEquipment.size 
        : 0
    },
    details
  };
}
```

### 4. Preventive Maintenance Compliance

**Purpose**: Track completion of scheduled preventive maintenance

**Metrics**:
- Scheduled vs Completed
- Compliance Rate (%)
- Average Delay Days
- Overdue Preventive Tasks

**Query**:
```typescript
interface PreventiveCompliance {
  month: string;
  scheduled: number;
  completed: number;
  completedOnTime: number;
  completedLate: number;
  pending: number;
  complianceRate: number;
  avgDelayDays: number;
}

function generatePreventiveComplianceReport(
  months: number = 6
): PreventiveCompliance[] {
  const result: PreventiveCompliance[] = [];
  const today = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    
    const preventiveRequests = requests.filter(r => {
      const scheduled = r.scheduledDate ? new Date(r.scheduledDate) : null;
      return r.type === 'preventive' 
        && scheduled 
        && scheduled >= monthStart 
        && scheduled <= monthEnd;
    });
    
    const completed = preventiveRequests.filter(r => 
      ['repaired', 'completed'].includes(r.stage)
    );
    
    const completedOnTime = completed.filter(r => {
      if (!r.completedAt || !r.scheduledDate) return false;
      const scheduledDate = new Date(r.scheduledDate);
      const completedDate = new Date(r.completedAt);
      return completedDate <= scheduledDate;
    });
    
    const completedLate = completed.filter(r => {
      if (!r.completedAt || !r.scheduledDate) return false;
      const scheduledDate = new Date(r.scheduledDate);
      const completedDate = new Date(r.completedAt);
      return completedDate > scheduledDate;
    });
    
    const totalDelay = completedLate.reduce((sum, r) => {
      const scheduledDate = new Date(r.scheduledDate!);
      const completedDate = new Date(r.completedAt!);
      const delayDays = (completedDate - scheduledDate) / (1000 * 60 * 60 * 24);
      return sum + delayDays;
    }, 0);
    
    result.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      scheduled: preventiveRequests.length,
      completed: completed.length,
      completedOnTime: completedOnTime.length,
      completedLate: completedLate.length,
      pending: preventiveRequests.length - completed.length,
      complianceRate: preventiveRequests.length > 0
        ? (completedOnTime.length / preventiveRequests.length) * 100
        : 0,
      avgDelayDays: completedLate.length > 0
        ? totalDelay / completedLate.length
        : 0
    });
  }
  
  return result;
}
```

## Export Functionality

### CSV Export

```typescript
function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Build CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

### Excel Export (using xlsx library)

```typescript
import * as XLSX from 'xlsx';

function exportToExcel<T extends Record<string, any>>(
  data: T[],
  sheetName: string,
  filename: string
): void {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString()}.xlsx`);
}
```

### PDF Export (using jsPDF)

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function exportToPDF<T extends Record<string, any>>(
  data: T[],
  title: string,
  filename: string
): void {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add metadata
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  // Get headers and rows
  const headers = Object.keys(data[0] || {});
  const rows = data.map(item => headers.map(h => String(item[h] ?? '')));
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    theme: 'grid',
    headStyles: {
      fillColor: [113, 75, 103], // Odoo purple
      textColor: 255
    }
  });
  
  // Save PDF
  doc.save(`${filename}_${new Date().toISOString()}.pdf`);
}
```

## Report Scheduling (Future)

### Email Delivery

```typescript
interface ScheduledReport {
  id: string;
  reportType: 'utilization' | 'performance' | 'cost' | 'compliance';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[]; // Email addresses
  filters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
  enabled: boolean;
}

async function sendScheduledReport(report: ScheduledReport): Promise<void> {
  // Generate report data
  const data = await generateReportData(report.reportType, report.filters);
  
  // Create file based on format
  let attachment: Buffer;
  let mimeType: string;
  
  if (report.format === 'pdf') {
    attachment = await generatePDFBuffer(data);
    mimeType = 'application/pdf';
  } else if (report.format === 'excel') {
    attachment = await generateExcelBuffer(data);
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else {
    attachment = await generateCSVBuffer(data);
    mimeType = 'text/csv';
  }
  
  // Send email to all recipients
  await sendEmail({
    to: report.recipients,
    subject: `GearGuard ${report.reportType} Report - ${new Date().toLocaleDateString()}`,
    html: `
      <h2>${report.reportType} Report</h2>
      <p>Please find attached your scheduled ${report.frequency} report.</p>
      <p>Report generated: ${new Date().toLocaleString()}</p>
    `,
    attachments: [{
      filename: `${report.reportType}_report.${report.format}`,
      content: attachment,
      contentType: mimeType
    }]
  });
}
```

---

**Document Maintained By**: Analytics & BI Team  
**Last Updated**: December 2024  
**Version**: 1.0
