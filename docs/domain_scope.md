STATUS: APPROVED — DO NOT MODIFY

# Domain Scope — GearGuard

## Purpose
GearGuard is an ERP-style maintenance management module
responsible for tracking and controlling maintenance
activities performed on equipment.

The domain defines **what exists** and **what rules are absolute**.

---

## Core Domain Entities

### 1. Equipment
A physical asset owned by the organization that may require maintenance.

Invariants:
- Each equipment has a unique identifier
- Each equipment belongs to exactly one maintenance team
- Equipment usability is affected by maintenance outcomes

Equipment does not manage workflows directly.

---

### 2. Maintenance Request
A transactional record representing a maintenance task
performed on one equipment.

Invariants:
- Each request belongs to exactly one equipment
- Each request has exactly one type
- Each request has exactly one state at any time

---

### 3. Maintenance Team
A group responsible for maintaining specific equipment.

Invariants:
- Equipment is pre-assigned to a team
- Only team members may be assigned to requests

---

## Maintenance Request Types

### Corrective
- Created in response to breakdowns
- Not scheduled
- Represents unplanned work

### Preventive
- Created in advance
- Requires a scheduled date
- Represents planned work

Request type is immutable after creation.

---

## Workflow (Canonical)

All maintenance requests follow the same workflow:

Yaml:-


State meanings:
- **New**: Request recorded, work not started
- **In Progress**: Technician actively working
- **Repaired**: Work completed successfully
- **Scrap**: Equipment declared unusable

---

## Domain Rules (Non-Negotiable)

1. A maintenance request cannot exist without equipment
2. A request cannot change type after creation
3. Preventive requests require a scheduled date
4. A request cannot move to Repaired without recorded duration
5. Scrap is terminal and irreversible
6. If a request enters Scrap, the equipment becomes unusable
7. Only technicians from the responsible team may be assigned

---

## Domain Exclusions

This domain does NOT define:
- User interface behavior
- Automations
- Notifications
- Analytics or KPIs
- Validation schemas
- API design
- Authentication or authorization
- Scheduling logic

These are handled in separate system documents.

---

## Domain Assumptions

- Single organization
- Single location
- Single time zone
- English language
- Auth is handled externally
