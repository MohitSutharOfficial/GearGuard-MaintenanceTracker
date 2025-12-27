# API Contracts Document

## Overview

This document defines all REST API endpoints, request/response schemas, authentication, and error handling for the GearGuard backend API.

## API Base URL

```
Development:  http://localhost:3000/api/v1
Staging:      https://staging-api.gearguard.com/api/v1
Production:   https://api.gearguard.com/api/v1
```

## Authentication

### JWT-Based Authentication

**Authentication Flow**:
1. Client sends credentials to `/auth/login`
2. Server validates credentials
3. Server generates JWT token (expires in 8 hours)
4. Client stores token (localStorage)
5. Client includes token in all subsequent requests

**Authorization Header**:
```
Authorization: Bearer <jwt_token>
```

### Auth Endpoints

#### POST /auth/login

**Description**: Authenticate user and receive JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Smith",
    "role": "manager"
  },
  "expiresIn": 28800
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email format
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

#### POST /auth/register

**Description**: Register new user (admin only)

**Request**:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "fullName": "Jane Doe",
  "role": "technician"
}
```

**Response** (201 Created):
```json
{
  "id": "user-456",
  "email": "newuser@example.com",
  "fullName": "Jane Doe",
  "role": "technician",
  "createdAt": "2024-12-27T10:00:00Z"
}
```

#### POST /auth/logout

**Description**: Invalidate current token

**Response** (204 No Content)

#### POST /auth/refresh

**Description**: Refresh expired token

**Request**:
```json
{
  "refreshToken": "..."
}
```

**Response** (200 OK):
```json
{
  "token": "...",
  "expiresIn": 28800
}
```

## Equipment Endpoints

### GET /equipment

**Description**: List all equipment with optional filters

**Query Parameters**:
```
?page=1                 // Page number (default: 1)
&limit=20               // Items per page (default: 20, max: 100)
&department=Production  // Filter by department
&category=Manufacturing // Filter by category
&status=active          // Filter by status
&search=CNC             // Search in name and serial number
&sortBy=name            // Sort field (default: createdAt)
&sortOrder=asc          // Sort order (asc/desc, default: desc)
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "eq-001",
      "serialNumber": "CNC-001",
      "name": "CNC Milling Machine",
      "category": "Manufacturing",
      "department": "Production",
      "employee": "John Smith",
      "location": "Factory Floor A",
      "purchaseDate": "2023-01-15",
      "warrantyExpiry": "2026-01-15",
      "status": "active",
      "maintenanceTeam": {
        "id": "team-001",
        "name": "Mechanical Team"
      },
      "openRequestsCount": 2,
      "createdAt": "2023-01-15T10:00:00Z",
      "updatedAt": "2024-12-27T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "totalPages": 7
  }
}
```

### GET /equipment/:id

**Description**: Get single equipment by ID

**Response** (200 OK):
```json
{
  "id": "eq-001",
  "serialNumber": "CNC-001",
  "name": "CNC Milling Machine",
  "category": "Manufacturing",
  "department": "Production",
  "employee": "John Smith",
  "location": "Factory Floor A",
  "purchaseDate": "2023-01-15",
  "warrantyExpiry": "2026-01-15",
  "status": "active",
  "maintenanceTeam": {
    "id": "team-001",
    "name": "Mechanical Team",
    "specialization": "Mechanical & Heavy Machinery"
  },
  "openRequestsCount": 2,
  "maintenanceHistory": [
    {
      "id": "req-001",
      "subject": "Oil Leak Repair",
      "type": "corrective",
      "stage": "repaired",
      "createdAt": "2024-12-26T08:00:00Z",
      "completedAt": "2024-12-27T10:30:00Z",
      "duration": 2.5
    }
  ],
  "createdAt": "2023-01-15T10:00:00Z",
  "updatedAt": "2024-12-27T14:30:00Z"
}
```

**Error Responses**:
- `404 Not Found`: Equipment not found

### POST /equipment

**Description**: Create new equipment

**Request**:
```json
{
  "serialNumber": "CNC-002",
  "name": "CNC Lathe",
  "category": "Manufacturing",
  "department": "Production",
  "employee": "Sarah Williams",
  "location": "Factory Floor B",
  "purchaseDate": "2024-01-10",
  "warrantyExpiry": "2027-01-10",
  "maintenanceTeamId": "team-001"
}
```

**Response** (201 Created):
```json
{
  "id": "eq-125",
  "serialNumber": "CNC-002",
  "name": "CNC Lathe",
  // ... all fields ...
  "status": "active",
  "openRequestsCount": 0,
  "createdAt": "2024-12-27T15:00:00Z"
}
```

**Validation Errors** (400 Bad Request):
```json
{
  "error": "Validation Error",
  "details": {
    "serialNumber": "Serial number already exists",
    "warrantyExpiry": "Must be after purchase date"
  }
}
```

### PUT /equipment/:id

**Description**: Update equipment

**Request**:
```json
{
  "name": "CNC Milling Machine Pro",
  "location": "Factory Floor C",
  "employee": "Mike Johnson"
}
```

**Response** (200 OK):
```json
{
  "id": "eq-001",
  // ... all updated fields ...
  "updatedAt": "2024-12-27T15:30:00Z"
}
```

### DELETE /equipment/:id

**Description**: Delete equipment (soft delete, sets status to scrapped)

**Response** (204 No Content)

**Error Responses**:
- `404 Not Found`: Equipment not found
- `409 Conflict`: Cannot delete equipment with open requests

## Maintenance Request Endpoints

### GET /requests

**Description**: List all maintenance requests with filters

**Query Parameters**:
```
?page=1
&limit=20
&type=corrective       // Filter by type
&stage=new             // Filter by stage
&priority=high         // Filter by priority
&equipmentId=eq-001    // Filter by equipment
&teamId=team-001       // Filter by team
&isOverdue=true        // Filter overdue requests
&sortBy=createdAt
&sortOrder=desc
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "req-001",
      "subject": "CNC Machine Motor Failure",
      "type": "corrective",
      "description": "Motor not starting",
      "stage": "in_progress",
      "priority": "high",
      "equipment": {
        "id": "eq-001",
        "name": "CNC Milling Machine",
        "serialNumber": "CNC-001",
        "category": "Manufacturing"
      },
      "maintenanceTeam": {
        "id": "team-001",
        "name": "Mechanical Team"
      },
      "technician": {
        "id": "user-123",
        "fullName": "Mike Johnson"
      },
      "hoursSpent": 2.5,
      "createdAt": "2024-12-26T08:00:00Z",
      "updatedAt": "2024-12-27T10:00:00Z",
      "isOverdue": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 48,
    "totalPages": 3
  }
}
```

### GET /requests/:id

**Description**: Get single request by ID

**Response** (200 OK):
```json
{
  "id": "req-001",
  "subject": "CNC Machine Motor Failure",
  "type": "corrective",
  "description": "Motor not starting, unusual noise before failure",
  "stage": "in_progress",
  "priority": "high",
  "equipment": {
    "id": "eq-001",
    "name": "CNC Milling Machine",
    "serialNumber": "CNC-001",
    "category": "Manufacturing",
    "location": "Factory Floor A"
  },
  "maintenanceTeam": {
    "id": "team-001",
    "name": "Mechanical Team",
    "specialization": "Mechanical & Heavy Machinery"
  },
  "technician": {
    "id": "user-123",
    "fullName": "Mike Johnson",
    "email": "mike.j@example.com"
  },
  "duration": null,
  "hoursSpent": 2.5,
  "notes": null,
  "createdAt": "2024-12-26T08:00:00Z",
  "updatedAt": "2024-12-27T10:00:00Z",
  "completedAt": null,
  "isOverdue": false
}
```

### POST /requests

**Description**: Create new maintenance request

**Request** (Corrective):
```json
{
  "subject": "Forklift Hydraulic Leak",
  "type": "corrective",
  "description": "Hydraulic fluid leaking from lift cylinder",
  "priority": "urgent",
  "equipmentId": "eq-002"
}
```

**Request** (Preventive):
```json
{
  "subject": "Quarterly HVAC Inspection",
  "type": "preventive",
  "description": "Check filters, clean coils, test controls",
  "equipmentId": "eq-003",
  "scheduledDate": "2025-01-15T09:00:00Z"
}
```

**Response** (201 Created):
```json
{
  "id": "req-125",
  "subject": "Forklift Hydraulic Leak",
  "type": "corrective",
  "stage": "new",
  // ... auto-filled fields ...
  "maintenanceTeam": {
    "id": "team-001",
    "name": "Mechanical Team"
  },
  "createdAt": "2024-12-27T15:00:00Z"
}
```

### PATCH /requests/:id

**Description**: Update request (partial update)

**Request** (Assign technician):
```json
{
  "technicianId": "user-123"
}
```

**Request** (Change stage):
```json
{
  "stage": "in_progress"
}
```

**Request** (Complete with duration):
```json
{
  "stage": "repaired",
  "duration": 3.5,
  "notes": "Replaced motor and tested. All systems operational."
}
```

**Response** (200 OK):
```json
{
  "id": "req-001",
  // ... all updated fields ...
  "updatedAt": "2024-12-27T16:00:00Z"
}
```

**Validation Errors** (400 Bad Request):
```json
{
  "error": "Validation Error",
  "details": {
    "stage": "Cannot transition from 'repaired' to 'scrap'",
    "duration": "Duration required for stage 'repaired'"
  }
}
```

### DELETE /requests/:id

**Description**: Delete maintenance request

**Response** (204 No Content)

## Maintenance Team Endpoints

### GET /teams

**Description**: List all maintenance teams

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "team-001",
      "name": "Mechanical Team",
      "specialization": "Mechanical & Heavy Machinery",
      "description": "Handles all mechanical equipment maintenance",
      "members": [
        {
          "id": "user-123",
          "fullName": "Mike Johnson",
          "role": "lead"
        },
        {
          "id": "user-124",
          "fullName": "Sarah Williams",
          "role": "member"
        }
      ],
      "color": "#3b82f6",
      "equipmentCount": 45,
      "openRequestsCount": 12,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /teams/:id

**Description**: Get single team by ID

**Response** (200 OK):
```json
{
  "id": "team-001",
  "name": "Mechanical Team",
  "specialization": "Mechanical & Heavy Machinery",
  "description": "Handles all mechanical equipment maintenance and repairs",
  "members": [
    {
      "id": "user-123",
      "fullName": "Mike Johnson",
      "email": "mike.j@example.com",
      "role": "lead",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "color": "#3b82f6",
  "equipment": [
    {
      "id": "eq-001",
      "name": "CNC Milling Machine",
      "serialNumber": "CNC-001",
      "status": "active"
    }
  ],
  "openRequests": [
    {
      "id": "req-001",
      "subject": "Oil Leak",
      "priority": "high",
      "stage": "new"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-12-27T10:00:00Z"
}
```

### POST /teams

**Description**: Create new maintenance team

**Request**:
```json
{
  "name": "Electronics Team",
  "specialization": "Electronic Systems",
  "description": "Handles all electronic equipment and controls",
  "memberIds": ["user-125", "user-126"],
  "color": "#8b5cf6"
}
```

**Response** (201 Created):
```json
{
  "id": "team-004",
  "name": "Electronics Team",
  // ... all fields ...
  "createdAt": "2024-12-27T15:00:00Z"
}
```

### PUT /teams/:id

**Description**: Update team

**Request**:
```json
{
  "description": "Updated description",
  "memberIds": ["user-123", "user-124", "user-127"]
}
```

**Response** (200 OK)

### DELETE /teams/:id

**Description**: Delete team

**Response** (204 No Content)

**Error** (409 Conflict):
```json
{
  "error": "Cannot delete team with assigned equipment or open requests"
}
```

## Analytics Endpoints

### GET /analytics/dashboard

**Description**: Get dashboard KPIs and metrics

**Query Parameters**:
```
?startDate=2024-12-01
&endDate=2024-12-31
```

**Response** (200 OK):
```json
{
  "kpis": {
    "totalEquipment": 125,
    "openRequests": 18,
    "totalTeams": 12,
    "avgResolutionTime": 4.2
  },
  "requestsByStatus": [
    { "status": "new", "count": 5 },
    { "status": "in_progress", "count": 8 },
    { "status": "repaired", "count": 42 },
    { "status": "scrap", "count": 2 }
  ],
  "requestsByCategory": [
    { "category": "Manufacturing", "count": 25 },
    { "category": "HVAC", "count": 12 },
    { "category": "Vehicle", "count": 8 }
  ],
  "monthlyTrends": [
    { "month": "2024-10", "count": 15 },
    { "month": "2024-11", "count": 18 },
    { "month": "2024-12", "count": 22 }
  ]
}
```

### GET /analytics/reports/equipment-performance

**Description**: Equipment performance report

**Response** (200 OK):
```json
{
  "data": [
    {
      "equipmentId": "eq-001",
      "name": "CNC Milling Machine",
      "totalRequests": 15,
      "correctiveRequests": 12,
      "preventiveRequests": 3,
      "totalDowntime": 48.5,
      "avgResolutionTime": 3.2,
      "failureRate": 0.8
    }
  ]
}
```

## Error Responses

### Standard Error Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {
    // Additional error details
  },
  "timestamp": "2024-12-27T15:00:00Z",
  "path": "/api/v1/equipment",
  "requestId": "req-uuid-123"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Business rule violation |
| 422 | Unprocessable Entity | Semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary outage |

### Error Examples

**400 Bad Request**:
```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "details": {
    "serialNumber": "Serial number already exists",
    "warrantyExpiry": "Must be after purchase date"
  }
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**403 Forbidden**:
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to perform this action"
}
```

**404 Not Found**:
```json
{
  "error": "Not Found",
  "message": "Equipment with ID 'eq-999' not found"
}
```

**409 Conflict**:
```json
{
  "error": "Conflict",
  "message": "Cannot delete team with assigned equipment"
}
```

**429 Too Many Requests**:
```json
{
  "error": "Rate Limit Exceeded",
  "message": "Too many requests. Please try again in 60 seconds.",
  "retryAfter": 60
}
```

## Rate Limiting

**Limits**:
- 100 requests per minute per IP
- 1000 requests per hour per user
- Burst: 20 requests in 10 seconds

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703692800
```

## Pagination

**Request**:
```
GET /equipment?page=2&limit=20
```

**Response Headers**:
```
X-Total-Count: 125
X-Page: 2
X-Per-Page: 20
X-Total-Pages: 7
Link: </equipment?page=1>; rel="first", </equipment?page=3>; rel="next"
```

## Versioning

API version is specified in the URL: `/api/v1/`

**Version History**:
- v1 (current): Initial release

## CORS Policy

**Allowed Origins**:
- Development: `http://localhost:5173`
- Staging: `https://staging.gearguard.com`
- Production: `https://gearguard.com`

**Allowed Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS

**Allowed Headers**: Authorization, Content-Type, X-Requested-With

---

**Document Maintained By**: Backend Engineering Team  
**Last Updated**: December 2024  
**Version**: 1.0
