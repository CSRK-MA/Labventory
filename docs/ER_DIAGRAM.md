# Entity-Relationship (ER) Diagram

## Overview

This document describes the database schema and entity relationships for the EduTrack Inventory Platform. The ER diagram (available in SVG format) shows how different data entities are structured and related to each other.

## Entities

### 1. USERS
**Purpose**: Stores user account and authentication information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | VARCHAR(36) | PRIMARY KEY | Unique user identifier (UUID) |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL | User role: ADMIN, LAB_MANAGER, SAFETY_OFFICER, TECHNICIAN, LAB_USER |
| department | VARCHAR(100) | | Department/Lab affiliation |
| createdAt | TIMESTAMP | DEFAULT CURRENT | Account creation timestamp |

**Indexes**:
- UNIQUE INDEX on email
- INDEX on role for permission queries

---

### 2. EQUIPMENT
**Purpose**: Stores equipment/asset inventory information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| equipmentId | VARCHAR(36) | PRIMARY KEY | Unique equipment identifier (UUID) |
| name | VARCHAR(255) | NOT NULL | Equipment name/model |
| category | VARCHAR(100) | | Category (e.g., Microscope, Spectrophotometer) |
| status | ENUM | NOT NULL | Status: AVAILABLE, IN_USE, MAINTENANCE, RETIRED |
| location | VARCHAR(255) | | Current physical location |
| assignedTo | VARCHAR(36) | FOREIGN KEY | Currently assigned user (nullable) |
| lastMaintenance | DATE | | Date of last maintenance |
| createdAt | TIMESTAMP | DEFAULT CURRENT | Record creation date |

**Foreign Keys**:
- assignedTo → USERS.userId

**Indexes**:
- INDEX on status for filtering
- INDEX on location for queries
- INDEX on category for reporting

---

### 3. CHEMICALS
**Purpose**: Stores chemical inventory and safety information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| chemicalId | VARCHAR(36) | PRIMARY KEY | Unique chemical identifier (UUID) |
| name | VARCHAR(255) | NOT NULL | Chemical name |
| formula | VARCHAR(100) | | Chemical formula (e.g., H2O) |
| quantity | FLOAT | NOT NULL | Current quantity in stock |
| unit | VARCHAR(50) | NOT NULL | Unit of measurement (ml, g, L, etc.) |
| safetyLevel | ENUM | NOT NULL | Safety level: LOW, MEDIUM, HIGH, CRITICAL |
| location | VARCHAR(255) | | Storage location |
| reorderThreshold | FLOAT | | Minimum quantity before reorder alert |
| expirationDate | DATE | | Expiration/shelf-life date |
| sdsDocument | VARCHAR(500) | | URL/path to Safety Data Sheet |
| createdAt | TIMESTAMP | DEFAULT CURRENT | Record creation date |

**Indexes**:
- INDEX on safetyLevel for compliance
- INDEX on expirationDate for alerts
- INDEX on quantity for low-stock queries

---

### 4. CHECK_IN_OUT
**Purpose**: Records equipment check-in and check-out transactions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| recordId | VARCHAR(36) | PRIMARY KEY | Unique record identifier (UUID) |
| userId | VARCHAR(36) | FOREIGN KEY, NOT NULL | User performing check-in/out |
| equipmentId | VARCHAR(36) | FOREIGN KEY, NOT NULL | Equipment being checked |
| type | ENUM | NOT NULL | Type: CHECK_IN, CHECK_OUT |
| timestamp | TIMESTAMP | NOT NULL | Date and time of transaction |
| location | VARCHAR(255) | | Location where transaction occurred |
| notes | TEXT | | Additional notes/comments |

**Foreign Keys**:
- userId → USERS.userId
- equipmentId → EQUIPMENT.equipmentId

**Indexes**:
- INDEX on userId for user activity
- INDEX on equipmentId for equipment history
- INDEX on timestamp for time-range queries
- COMPOSITE INDEX (userId, timestamp)

---

### 5. MAINTENANCE
**Purpose**: Tracks equipment maintenance records and schedules

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| maintenanceId | VARCHAR(36) | PRIMARY KEY | Unique maintenance record ID |
| equipmentId | VARCHAR(36) | FOREIGN KEY, NOT NULL | Equipment requiring maintenance |
| technician | VARCHAR(36) | FOREIGN KEY | Assigned technician (nullable) |
| maintenanceDate | DATE | NOT NULL | Date maintenance was performed |
| nextDueDate | DATE | | Scheduled date for next maintenance |
| maintenanceType | VARCHAR(100) | | Type: PREVENTIVE, CORRECTIVE, INSPECTION |
| description | TEXT | | Details of work performed |
| partsCost | FLOAT | | Cost of replacement parts |
| laborCost | FLOAT | | Cost of labor |
| status | ENUM | | Status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED |
| createdAt | TIMESTAMP | | Record creation timestamp |

**Foreign Keys**:
- equipmentId → EQUIPMENT.equipmentId
- technician → USERS.userId

**Indexes**:
- INDEX on equipmentId for equipment history
- INDEX on nextDueDate for scheduling
- INDEX on status for tracking
- INDEX on maintenanceDate for reporting

---

### 6. EQUIPMENT_USERS (Junction Table)
**Purpose**: Manages many-to-many relationship between equipment and users

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| equipmentUserId | VARCHAR(36) | PRIMARY KEY | Unique record identifier |
| equipmentId | VARCHAR(36) | FOREIGN KEY, NOT NULL | Equipment reference |
| userId | VARCHAR(36) | FOREIGN KEY, NOT NULL | User reference |
| assignmentDate | DATE | NOT NULL | Date assignment was made |
| revocationDate | DATE | | Date assignment was revoked (nullable) |

**Foreign Keys**:
- equipmentId → EQUIPMENT.equipmentId
- userId → USERS.userId

**Constraints**:
- UNIQUE COMPOSITE KEY (equipmentId, userId) to prevent duplicates
- Cannot revoke before assignment

**Indexes**:
- COMPOSITE INDEX (equipmentId, userId)
- INDEX on userId for user's equipment list
- INDEX on equipmentId for equipment's user list

---

## Entity Relationships

### 1. Users → CheckInOut (One-to-Many)
- **Cardinality**: 1:M
- **Type**: Strong relationship
- **Description**: One user can create many check-in/out records
- **Constraint**: NOT NULL foreign key
- **Deletion**: RESTRICT (cannot delete user with active check-in/out records)

```
USERS (1) ──── creates ──── (M) CHECK_IN_OUT
```

---

### 2. Equipment → Maintenance (One-to-Many)
- **Cardinality**: 1:M
- **Type**: Strong relationship
- **Description**: One equipment has multiple maintenance records
- **Constraint**: NOT NULL foreign key
- **Deletion**: CASCADE (delete maintenance records when equipment is deleted)

```
EQUIPMENT (1) ──── has ──── (M) MAINTENANCE
```

---

### 3. Users → Maintenance (One-to-Many - Technician)
- **Cardinality**: 1:M
- **Type**: Weak relationship
- **Description**: One user (technician) can perform multiple maintenance tasks
- **Constraint**: NULLABLE foreign key (maintenance can be unassigned)
- **Deletion**: SET NULL (assign maintenance to NULL if technician is deleted)

```
USERS (1) ──── assigned to ──── (M) MAINTENANCE
```

---

### 4. Equipment ↔ Users (Many-to-Many via EQUIPMENT_USERS)
- **Cardinality**: M:M
- **Type**: Strong relationship through junction table
- **Description**: Equipment can be assigned to multiple users, users can have multiple equipment
- **Constraint**: UNIQUE composite key on (equipmentId, userId)
- **Deletion**: CASCADE (delete assignments when equipment or user is deleted)

```
EQUIPMENT (M) ──── assigned to ──── (M) USERS
                  (via EQUIPMENT_USERS)
```

---

### 5. Equipment → CheckInOut (One-to-Many)
- **Cardinality**: 1:M
- **Type**: Strong relationship
- **Description**: Equipment can be checked in/out multiple times
- **Constraint**: NOT NULL foreign key
- **Deletion**: CASCADE (delete check-in/out records when equipment is deleted)

```
EQUIPMENT (1) ──── tracks ──── (M) CHECK_IN_OUT
```

---

## Data Types & Constraints

### Common Constraints

| Constraint | Purpose | Example |
|-----------|---------|---------|
| PRIMARY KEY (PK) | Uniquely identifies each record | userId, equipmentId |
| FOREIGN KEY (FK) | Maintains referential integrity | assignedTo → USERS |
| NOT NULL | Field must have a value | email, password |
| UNIQUE | All values must be distinct | email address |
| ENUM | Restricts to predefined values | role, status, type |
| DEFAULT | Default value if not specified | CURRENT_TIMESTAMP |
| CHECK | Validates data meets condition | quantity >= 0 |

### Data Types

| Type | Usage | Example |
|------|-------|---------|
| VARCHAR(n) | Variable-length text | names, descriptions |
| TEXT | Large text content | notes, descriptions |
| INT/FLOAT | Numeric data | quantity, cost |
| DATE | Date only | expirationDate, maintenanceDate |
| TIMESTAMP | Date and time | createdAt, timestamp |
| ENUM | Predefined categories | role, status, type |
| BOOLEAN | True/false values | isActive, isArchived |

---

## Database Indexing Strategy

### Indexes by Entity

**USERS**
- PRIMARY KEY: userId
- UNIQUE: email
- Non-unique: role (for permission filtering)

**EQUIPMENT**
- PRIMARY KEY: equipmentId
- Foreign Key: assignedTo
- Non-unique: status, category, location
- Composite: (category, status) for filtered searches

**CHEMICALS**
- PRIMARY KEY: chemicalId
- Non-unique: safetyLevel, expirationDate, quantity (for low-stock alerts)
- Composite: (location, safetyLevel) for compliance

**CHECK_IN_OUT**
- PRIMARY KEY: recordId
- Foreign Key: userId, equipmentId
- Composite: (userId, timestamp), (equipmentId, timestamp)
- Non-unique: type, timestamp

**MAINTENANCE**
- PRIMARY KEY: maintenanceId
- Foreign Key: equipmentId, technician
- Non-unique: nextDueDate, status
- Composite: (equipmentId, maintenanceDate)

**EQUIPMENT_USERS**
- PRIMARY KEY: equipmentUserId
- UNIQUE Composite: (equipmentId, userId)
- Foreign Keys: equipmentId, userId

---

## Normalization

The schema follows **Third Normal Form (3NF)**:

✅ **Atomic Values**: All fields contain single values (no repeating groups)
✅ **Functional Dependencies**: Non-key fields depend on the primary key
✅ **No Transitive Dependencies**: Non-key fields depend directly on the primary key

Example: User's email depends on userId, not on any other non-key field.

---

## Sample Queries

### Find all equipment assigned to a user
```sql
SELECT e.* FROM EQUIPMENT e
WHERE e.assignedTo = ? 
   OR e.equipmentId IN (
      SELECT eu.equipmentId FROM EQUIPMENT_USERS eu 
      WHERE eu.userId = ? AND eu.revocationDate IS NULL
   )
```

### Get user's check-in/out history
```sql
SELECT * FROM CHECK_IN_OUT 
WHERE userId = ? 
ORDER BY timestamp DESC
```

### Find overdue maintenance
```sql
SELECT * FROM MAINTENANCE 
WHERE nextDueDate < CURDATE() AND status != 'COMPLETED'
```

### Check chemical inventory alerts
```sql
SELECT * FROM CHEMICALS 
WHERE quantity < reorderThreshold 
   OR expirationDate < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY safetyLevel DESC
```

### Get equipment utilization report
```sql
SELECT e.equipmentId, e.name, COUNT(c.recordId) as checkInOutCount
FROM EQUIPMENT e
LEFT JOIN CHECK_IN_OUT c ON e.equipmentId = c.equipmentId
GROUP BY e.equipmentId
ORDER BY checkInOutCount DESC
```

---

## Referential Integrity Rules

| Relationship | On Delete | On Update | Notes |
|-------------|-----------|-----------|-------|
| Equipment → Maintenance | CASCADE | CASCADE | Delete all maintenance records |
| Users → CheckInOut | RESTRICT | CASCADE | Prevent deletion of active users |
| Users → Maintenance (technician) | SET NULL | CASCADE | Unassign technician |
| Equipment ↔ Users (junction) | CASCADE | CASCADE | Remove assignments |
| Equipment → CheckInOut | CASCADE | CASCADE | Delete history |

---

## Security Considerations

- **Passwords**: Hashed with bcrypt or similar
- **Email**: Indexed as UNIQUE to prevent duplicates
- **Sensitive Data**: SDS documents stored separately with access control
- **Audit Trail**: CHECK_IN_OUT records for accountability
- **Role-Based Access**: USERS.role enforces permissions

---

## Future Enhancements

1. **Audit Logging Table**: Track all data modifications
2. **Notifications Table**: Store pending/sent notifications
3. **Reports Table**: Cache generated reports
4. **API Keys Table**: For external integrations
5. **Custom Fields**: Support user-defined equipment attributes

---

**ER Diagram Version:** 1.0  
**Last Updated:** December 2025  
**Database System:** Firestore/NoSQL or SQL (PostgreSQL/MySQL)  
**Related Documentation:** ARCHITECTURE_DOCUMENTATION.md, PROJECT_INFO.md

## Diagram Conversion

To convert the SVG ER diagram to PNG:

```bash
# Using ImageMagick
convert ER_DIAGRAM.svg ER_DIAGRAM.png

# Using Inkscape
inkscape ER_DIAGRAM.svg -o ER_DIAGRAM.png

# Using online tools
# Visit: https://cloudconvert.com/svg-to-png
```
