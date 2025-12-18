# UML Class Diagram — EduTrack System

**Laboratory Management System — Object-Oriented Design**

---

## Class Diagram Overview

This document describes the key classes, interfaces, and relationships in the EduTrack system using UML notation.

---

## Core Classes

### 1. User Class

```
┌─────────────────────────────────┐
│           User                  │
├─────────────────────────────────┤
│ Properties:                     │
│  - userId: String               │
│  - email: String                │
│  - name: String                 │
│  - role: UserRole               │
│  - department: String           │
│  - phone: String                │
│  - createdAt: Date              │
│  - updatedAt: Date              │
│  - isActive: Boolean            │
├─────────────────────────────────┤
│ Methods:                        │
│  + login(email, password)       │
│  + logout()                     │
│  + updateProfile(data)          │
│  + getRole(): UserRole          │
│  + hasPermission(action): Bool  │
│  + changePassword(oldPwd, new)  │
└─────────────────────────────────┘
```

**UserRole Enum:**
- ADMIN
- TEACHER
- LAB_ASSISTANT
- STUDENT

---

### 2. Equipment Class

```
┌──────────────────────────────────┐
│         Equipment                │
├──────────────────────────────────┤
│ Properties:                      │
│  - equipmentId: String           │
│  - name: String                  │
│  - category: String              │
│  - description: String           │
│  - quantity: Integer             │
│  - location: String              │
│  - status: EquipmentStatus       │
│  - qrCode: String                │
│  - purchaseDate: Date            │
│  - lastMaintenanceDate: Date     │
│  - nextMaintenanceDate: Date     │
│  - cost: Double                  │
├──────────────────────────────────┤
│ Methods:                         │
│  + checkout(user): CheckInOut    │
│  + checkin(user): CheckInOut     │
│  + scheduleMaintenace(date)      │
│  + updateStatus(newStatus)       │
│  + generateQRCode(): String      │
│  + getHistory(): CheckInOut[]    │
│  + isAvailable(): Boolean        │
│  + retire()                      │
└──────────────────────────────────┘
```

**EquipmentStatus Enum:**
- AVAILABLE
- CHECKED_OUT
- IN_MAINTENANCE
- RETIRED
- DAMAGED

---

### 3. Chemical Class

```
┌──────────────────────────────────┐
│         Chemical                 │
├──────────────────────────────────┤
│ Properties:                      │
│  - chemicalId: String            │
│  - name: String                  │
│  - chemicalFormula: String       │
│  - quantity: Double              │
│  - unit: String (mL, g, mol)     │
│  - hazardLevel: HazardLevel      │
│  - manufacturer: String          │
│  - storageLocation: String       │
│  - expiryDate: Date              │
│  - purchaseDate: Date            │
│  - batchNumber: String           │
│  - sds: String (URL/path)        │
├──────────────────────────────────┤
│ Methods:                         │
│  + updateQuantity(amount)        │
│  + checkExpiry(): Boolean        │
│  + isExpired(): Boolean          │
│  + logUsage(amount, user)        │
│  + getHazardInfo(): String       │
│  + needsReorder(): Boolean       │
│  + getSDS(): String              │
└──────────────────────────────────┘
```

**HazardLevel Enum:**
- LOW
- MODERATE
- HIGH
- CRITICAL

---

### 4. CheckInOut Class

```
┌──────────────────────────────────┐
│       CheckInOut                 │
├──────────────────────────────────┤
│ Properties:                      │
│  - checkId: String               │
│  - equipmentId: String           │
│  - userId: String                │
│  - action: Action                │
│  - checkoutTime: Date            │
│  - expectedReturnTime: Date      │
│  - actualReturnTime: Date        │
│  - notes: String                 │
│  - status: CheckStatus           │
│  - location: String              │
├──────────────────────────────────┤
│ Methods:                         │
│  + isOverdue(): Boolean          │
│  + getDuration(): Integer (mins) │
│  + complete()                    │
│  + cancel()                      │
│  + addNote(note: String)         │
│  + updateLocation(location)      │
└──────────────────────────────────┘
```

**Action Enum:**
- CHECKOUT
- CHECKIN

**CheckStatus Enum:**
- ACTIVE
- COMPLETED
- OVERDUE
- CANCELLED

---

### 5. Maintenance Class

```
┌──────────────────────────────────┐
│      Maintenance                 │
├──────────────────────────────────┤
│ Properties:                      │
│  - maintenanceId: String         │
│  - equipmentId: String           │
│  - type: MaintenanceType         │
│  - status: MaintStatus           │
│  - scheduledDate: Date           │
│  - completedDate: Date           │
│  - assignedTo: String (userId)   │
│  - description: String           │
│  - notes: String                 │
│  - cost: Double                  │
│  - priority: Priority            │
├──────────────────────────────────┤
│ Methods:                         │
│  + start()                       │
│  + complete(notes, cost)         │
│  + reschedule(newDate)           │
│  + assign(userId)                │
│  + addNote(note)                 │
│  + getStatus(): MaintStatus      │
│  + isOverdue(): Boolean          │
└──────────────────────────────────┘
```

**MaintenanceType Enum:**
- ROUTINE
- PREVENTIVE
- CORRECTIVE
- CALIBRATION

**MaintStatus Enum:**
- SCHEDULED
- IN_PROGRESS
- COMPLETED
- CANCELLED

**Priority Enum:**
- LOW
- MEDIUM
- HIGH
- URGENT

---

### 6. Report Class

```
┌──────────────────────────────────┐
│         Report                   │
├──────────────────────────────────┤
│ Properties:                      │
│  - reportId: String              │
│  - type: ReportType              │
│  - title: String                 │
│  - generatedBy: String (userId)  │
│  - generatedAt: Date             │
│  - startDate: Date               │
│  - endDate: Date                 │
│  - data: Object                  │
│  - format: Format                │
├──────────────────────────────────┤
│ Methods:                         │
│  + generate()                    │
│  + export(format): File          │
│  + sendEmail(recipient)          │
│  + schedule(frequency)           │
│  + getData(): Object             │
│  + filter(criteria): Report      │
└──────────────────────────────────┘
```

**ReportType Enum:**
- EQUIPMENT_USAGE
- CHEMICAL_INVENTORY
- MAINTENANCE_HISTORY
- USER_ACTIVITY
- COMPLIANCE

**Format Enum:**
- PDF
- CSV
- EXCEL
- JSON

---

### 7. Permission Class

```
┌──────────────────────────────────┐
│       Permission                 │
├──────────────────────────────────┤
│ Properties:                      │
│  - permissionId: String          │
│  - role: UserRole                │
│  - action: String                │
│  - resource: String              │
│  - allowed: Boolean              │
├──────────────────────────────────┤
│ Methods:                         │
│  + canAccess(resource): Boolean  │
│  + canPerform(action): Boolean   │
│  + grant()                       │
│  + revoke()                      │
└──────────────────────────────────┘
```

---

### 8. Notification Class

```
┌──────────────────────────────────┐
│      Notification                │
├──────────────────────────────────┤
│ Properties:                      │
│  - notificationId: String        │
│  - userId: String                │
│  - type: NotificationType        │
│  - title: String                 │
│  - message: String               │
│  - createdAt: Date               │
│  - readAt: Date                  │
│  - actionUrl: String             │
├──────────────────────────────────┤
│ Methods:                         │
│  + markAsRead()                  │
│  + delete()                      │
│  + send()                        │
│  + getDetails(): Object          │
└──────────────────────────────────┘
```

**NotificationType Enum:**
- CHECKOUT_OVERDUE
- CHEMICAL_EXPIRY
- MAINTENANCE_REMINDER
- SYSTEM_ALERT
- USER_REQUEST

---

## Class Relationships

### 1. User ↔ Equipment (One-to-Many)
```
User ──────────────────→ Equipment
  |                         |
  | checkout/checkin       |
  └─────────→ CheckInOut ←─┘
```
- A User can checkout multiple Equipment items
- Each Equipment can have multiple CheckInOut records

### 2. Equipment ↔ Maintenance (One-to-Many)
```
Equipment ──────→ Maintenance
    |                 |
    └─────────────────┘
```
- One Equipment can have multiple Maintenance records

### 3. Equipment ↔ Chemical (Many-to-Many)
```
Equipment ←──────────────→ Chemical
    |                         |
    └─── EquipmentChemical ──┘
```
- Equipment can require multiple Chemicals
- Chemicals can be used in multiple Equipment

### 4. User ↔ Permission (Many-to-Many)
```
User ←──────────────→ Permission
    |                    |
    └─── RolePermission ─┘
```
- Users have Roles
- Roles have Permissions

### 5. Equipment ↔ Report (One-to-Many)
```
Equipment ──────→ Report
```
- Equipment usage data feeds into Reports

### 6. User ↔ Notification (One-to-Many)
```
User ──────→ Notification
```
- Users receive multiple Notifications

---

## Complete Class Relationship Diagram

```
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                      /    |    \
                    /      |      \
                  /        |        \
        ┌─────────┴────┐   |   ┌────────────┐
        │  CheckInOut  │   |   │Permission  │
        └──────┬───────┘   |   └────────────┘
               │           |
        ┌──────┴────────┐  |
        │   Equipment   │◄─┘
        └──────┬────────┘
               │
        ┌──────┴────────┐
        │  Maintenance  │
        └───────────────┘
        
        ┌───────────────┐
        │   Chemical    │
        └───────────────┘
        
        ┌───────────────┐
        │    Report     │
        └───────────────┘
        
        ┌───────────────┐
        │ Notification  │
        └───────────────┘
```

---

## Inheritance Hierarchy

### ReportType Inheritance

```
        ┌─────────────────┐
        │  AbstractReport │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
┌───▼──────┐ ┌──▼────────┐ ┌─▼──────────┐ ┌─▼──────────┐
│Equipment │ │ Chemical  │ │Maintenance │ │ UserActivity
│UseReport │ │Inventory  │ │ Report     │ │ Report
└──────────┘ │Report     │ └────────────┘ └────────────┘
             └───────────┘
```

---

## Interface Definitions

### IDataAccess Interface
```
Interface IDataAccess {
  + create(data: Object): Promise<Object>
  + read(id: String): Promise<Object>
  + update(id: String, data: Object): Promise<Object>
  + delete(id: String): Promise<Boolean>
  + list(query: Query): Promise<Object[]>
}
```

### INotifiable Interface
```
Interface INotifiable {
  + notify(user: User, message: String): void
  + notifyMultiple(users: User[], message: String): void
  + schedule(time: Date): void
}
```

### IReportable Interface
```
Interface IReportable {
  + generateReport(): Report
  + exportReport(format: Format): File
  + scheduleReport(frequency: String): void
}
```

---

## Key Design Patterns Used

### 1. **Observer Pattern**
- Real-time updates for Equipment status
- Notification system for Users
- Activity log subscriptions

### 2. **Strategy Pattern**
- Different Report generation strategies
- Role-based permission checking
- Various export formats

### 3. **Factory Pattern**
- Creating Equipment, Chemical, and Maintenance objects
- Report generation based on type

### 4. **Repository Pattern**
- Data access abstraction layer
- Firebase service encapsulation

### 5. **Singleton Pattern**
- Firebase database connection
- User session manager

---

## Multiplicity Notation

```
One-to-One:        1 ——— 1
One-to-Many:       1 ——— * or 0..* or 1..*
Many-to-Many:      * ——— *
Optional:          0..1
Required:          1
Many:              * or 0..*
```

---

## Class Diagram in Text Format

```
┌─────────────────────────────────────────────────────────────────┐
│                         EduTrack System                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │    User      │───→│ Permission   │    │Equipment     │     │
│  │  (1,1)       │    │  (role-based)│    │  (tracked)   │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│         │                                       │               │
│         │ 1..*                                  │               │
│         │                                   1..*│               │
│  ┌──────▼───────────┐                    ┌─────▼──────┐       │
│  │  CheckInOut      │                    │Maintenance │       │
│  │  (track usage)   │                    │ (schedule) │       │
│  └──────────────────┘                    └────────────┘       │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  Chemical    │    │Report        │    │Notification │     │
│  │ (inventory)  │    │(analytics)   │    │  (alerts)   │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Class Attributes & Methods Summary

| Class | Key Attributes | Key Methods |
|-------|----------------|-------------|
| **User** | userId, email, role, name | login(), logout(), hasPermission() |
| **Equipment** | equipmentId, name, status, qrCode | checkout(), checkin(), scheduleMaintenence() |
| **Chemical** | chemicalId, quantity, expiryDate, hazardLevel | updateQuantity(), checkExpiry(), logUsage() |
| **CheckInOut** | checkId, equipmentId, userId, action | isOverdue(), getDuration(), complete() |
| **Maintenance** | maintenanceId, type, status, priority | start(), complete(), reschedule() |
| **Report** | reportId, type, generatedAt, data | generate(), export(), schedule() |
| **Permission** | permissionId, role, action, resource | canAccess(), grant(), revoke() |
| **Notification** | notificationId, userId, type, message | markAsRead(), send(), delete() |

---

## Data Types & Enumerations

### Enumeration Summary

| Enum | Values |
|------|--------|
| **UserRole** | ADMIN, TEACHER, LAB_ASSISTANT, STUDENT |
| **EquipmentStatus** | AVAILABLE, CHECKED_OUT, IN_MAINTENANCE, RETIRED, DAMAGED |
| **HazardLevel** | LOW, MODERATE, HIGH, CRITICAL |
| **CheckStatus** | ACTIVE, COMPLETED, OVERDUE, CANCELLED |
| **MaintenanceType** | ROUTINE, PREVENTIVE, CORRECTIVE, CALIBRATION |
| **MaintStatus** | SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED |
| **Priority** | LOW, MEDIUM, HIGH, URGENT |
| **ReportType** | EQUIPMENT_USAGE, CHEMICAL_INVENTORY, MAINTENANCE_HISTORY, USER_ACTIVITY, COMPLIANCE |
| **Format** | PDF, CSV, EXCEL, JSON |
| **NotificationType** | CHECKOUT_OVERDUE, CHEMICAL_EXPIRY, MAINTENANCE_REMINDER, SYSTEM_ALERT, USER_REQUEST |

---

## Class Dependencies

### Direct Dependencies
- **User** depends on: Permission, Role
- **Equipment** depends on: Status, Category, QRCode
- **Chemical** depends on: HazardLevel, Unit
- **CheckInOut** depends on: User, Equipment, Action, Status
- **Maintenance** depends on: Equipment, Type, Status, Priority
- **Report** depends on: Equipment, Chemical, Maintenance, User data
- **Notification** depends on: User, NotificationType

### Transitive Dependencies
- **CheckInOut** → User → Permission
- **Report** → Equipment → Maintenance
- **Notification** → User → Role

---

## Visibility & Access Modifiers

```
+ Public      (accessible from anywhere)
- Private     (accessible only within class)
# Protected   (accessible within class & subclasses)
~ Package     (accessible within same package)
```

### Example: Equipment Class
```
+ equipmentId: String      (public read-only)
- internalStatus: String   (private)
# baseQRCode: String       (protected)
+ checkout()               (public method)
- validateQRCode()         (private method)
```

---

## Cardinality & Constraints

### CheckInOut to Equipment
```
Equipment 1 ──── 0..* CheckInOut
```
- One Equipment can have zero or many CheckInOut records
- Each CheckInOut references exactly one Equipment

### User to Permission
```
User 1 ──── 1..* Permission
```
- One User must have at least one Permission (from their role)
- One Permission can apply to multiple Users

### Equipment to Maintenance
```
Equipment 1 ──── 0..* Maintenance
```
- One Equipment can have zero or many Maintenance records
- Each Maintenance targets exactly one Equipment

---

## Implementation Notes

### Type System
- All IDs are Strings (UUID format in Firebase)
- Dates use ISO 8601 format
- Numerical values (quantity, cost) use Double/Decimal
- Status fields use Enum types

### Null Safety
- User-defined fields can be nullable (marked as optional in TypeScript)
- System-critical fields are non-nullable (id, createdAt, status)
- Default values provided for status enums

### Timestamps
- All entities include `createdAt` and `updatedAt` timestamps
- Firebase Timestamps automatically managed
- Timezone handled in frontend (UTC storage)

---

## Related Documentation

- **ARCHITECTURE_DOCUMENTATION.md** — System architecture overview
- **OOP_DESIGN_NOTE.md** — OOP principles and patterns
- **ER_DIAGRAM.md** — Database entity relationships
- **DATABASE_SCHEMA.sql** — SQL schema definitions
- **FINAL_REPORT.md** — Complete project report

---

**Version:** 1.0  
**Last Updated:** December 8, 2025  
**Status:** ✅ Production Ready
