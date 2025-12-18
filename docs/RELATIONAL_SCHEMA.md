# Relational Schema & Normalization

## Overview

This document describes the relational schema for the EduTrack Inventory Platform, including table definitions, attributes, constraints, and normalization analysis. While EduTrack uses Firebase Firestore (NoSQL), this document presents the logical relational model for better understanding of data structure and relationships.

---

## Table Definitions

### 1. USERS Table

**Purpose**: Store user account information and authentication details

```
USERS(
  userId PK VARCHAR(36),
  email UNIQUE VARCHAR(255),
  name VARCHAR(255),
  password HASHED VARCHAR(255),
  role ENUM(ADMIN, LAB_MANAGER, SAFETY_OFFICER, TECHNICIAN, LAB_USER),
  department VARCHAR(100),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  lastLogin TIMESTAMP
)
```

**Attributes**:
| Attribute | Type | Constraints | Purpose |
|-----------|------|-------------|---------|
| userId | VARCHAR(36) | PK, NOT NULL | Unique user identifier (UUID) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| name | VARCHAR(255) | NOT NULL | User's full name |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL | User's role/permissions |
| department | VARCHAR(100) | | Lab/department affiliation |
| isActive | BOOLEAN | DEFAULT TRUE | Account status |
| createdAt | TIMESTAMP | NOT NULL | Account creation time |
| updatedAt | TIMESTAMP | | Last modification time |
| lastLogin | TIMESTAMP | | Last login timestamp |

**Primary Key**: userId
**Candidate Keys**: email (unique identifier)
**Indexes**: 
- UNIQUE INDEX on email
- INDEX on role for permission queries

---

### 2. EQUIPMENT Table

**Purpose**: Store equipment/asset inventory information

```
EQUIPMENT(
  equipmentId PK VARCHAR(36),
  name VARCHAR(255),
  type VARCHAR(100),
  category VARCHAR(100),
  status ENUM(AVAILABLE, IN_USE, MAINTENANCE, RETIRED),
  location VARCHAR(255),
  assignedTo FK VARCHAR(36) REFERENCES USERS(userId),
  purchaseDate DATE,
  lastMaintenance DATE,
  qrCode VARCHAR(500),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

**Attributes**:
| Attribute | Type | Constraints | Purpose |
|-----------|------|-------------|---------|
| equipmentId | VARCHAR(36) | PK, NOT NULL | Unique equipment identifier |
| name | VARCHAR(255) | NOT NULL | Equipment name/model |
| type | VARCHAR(100) | | Equipment type |
| category | VARCHAR(100) | | Equipment category |
| status | ENUM | NOT NULL | Current status |
| location | VARCHAR(255) | | Physical location |
| assignedTo | VARCHAR(36) | FK, NULLABLE | Current assigned user |
| purchaseDate | DATE | | Equipment purchase date |
| lastMaintenance | DATE | | Last maintenance date |
| qrCode | VARCHAR(500) | UNIQUE | QR code identifier |
| createdAt | TIMESTAMP | NOT NULL | Record creation time |
| updatedAt | TIMESTAMP | | Last modification time |

**Primary Key**: equipmentId
**Foreign Keys**: 
- assignedTo → USERS(userId) [NULLABLE, SET NULL on delete]
**Indexes**:
- INDEX on status
- INDEX on location
- INDEX on category
- COMPOSITE INDEX (status, location)

---

### 3. CHEMICALS Table

**Purpose**: Store chemical inventory and safety information

```
CHEMICALS(
  chemicalId PK VARCHAR(36),
  name VARCHAR(255),
  formula VARCHAR(100),
  quantity FLOAT,
  unit VARCHAR(50),
  safetyLevel ENUM(LOW, MEDIUM, HIGH, CRITICAL),
  location VARCHAR(255),
  reorderThreshold FLOAT,
  expirationDate DATE,
  sdsDocumentUrl VARCHAR(500),
  casNumber VARCHAR(50),
  supplier VARCHAR(255),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

**Attributes**:
| Attribute | Type | Constraints | Purpose |
|-----------|------|-------------|---------|
| chemicalId | VARCHAR(36) | PK, NOT NULL | Unique chemical identifier |
| name | VARCHAR(255) | NOT NULL | Chemical name |
| formula | VARCHAR(100) | | Chemical formula |
| quantity | FLOAT | NOT NULL, CHECK >= 0 | Current stock quantity |
| unit | VARCHAR(50) | NOT NULL | Measurement unit |
| safetyLevel | ENUM | NOT NULL | Safety classification |
| location | VARCHAR(255) | | Storage location |
| reorderThreshold | FLOAT | | Minimum stock level |
| expirationDate | DATE | | Shelf-life expiration |
| sdsDocumentUrl | VARCHAR(500) | | Safety Data Sheet URL |
| casNumber | VARCHAR(50) | | CAS Registry Number |
| supplier | VARCHAR(255) | | Supplier/manufacturer |
| createdAt | TIMESTAMP | NOT NULL | Record creation time |
| updatedAt | TIMESTAMP | | Last modification time |

**Primary Key**: chemicalId
**Candidate Keys**: casNumber (unique chemical identifier)
**Indexes**:
- INDEX on safetyLevel (compliance queries)
- INDEX on expirationDate (expiration alerts)
- INDEX on quantity (low-stock alerts)
- COMPOSITE INDEX (location, safetyLevel)

---

### 4. CHECK_IN_OUT Table

**Purpose**: Record equipment check-in and check-out transactions

```
CHECK_IN_OUT(
  recordId PK VARCHAR(36),
  userId FK VARCHAR(36) REFERENCES USERS(userId),
  equipmentId FK VARCHAR(36) REFERENCES EQUIPMENT(equipmentId),
  type ENUM(CHECK_IN, CHECK_OUT),
  timestamp TIMESTAMP,
  location VARCHAR(255),
  notes TEXT,
  createdAt TIMESTAMP
)
```

**Attributes**:
| Attribute | Type | Constraints | Purpose |
|-----------|------|-------------|---------|
| recordId | VARCHAR(36) | PK, NOT NULL | Unique record identifier |
| userId | VARCHAR(36) | FK, NOT NULL | User performing transaction |
| equipmentId | VARCHAR(36) | FK, NOT NULL | Equipment being checked |
| type | ENUM | NOT NULL | CHECK_IN or CHECK_OUT |
| timestamp | TIMESTAMP | NOT NULL | Transaction date/time |
| location | VARCHAR(255) | | Transaction location |
| notes | TEXT | | Additional comments |
| createdAt | TIMESTAMP | NOT NULL | Record creation time |

**Primary Key**: recordId
**Foreign Keys**:
- userId → USERS(userId) [RESTRICT on delete]
- equipmentId → EQUIPMENT(equipmentId) [CASCADE on delete]
**Indexes**:
- COMPOSITE INDEX (userId, timestamp)
- COMPOSITE INDEX (equipmentId, timestamp)
- INDEX on type (filter by check-in/out)
- INDEX on timestamp (time-range queries)

---

### 5. MAINTENANCE Table

**Purpose**: Track equipment maintenance records and schedules

```
MAINTENANCE(
  maintenanceId PK VARCHAR(36),
  equipmentId FK VARCHAR(36) REFERENCES EQUIPMENT(equipmentId),
  technicianId FK VARCHAR(36) REFERENCES USERS(userId),
  maintenanceDate DATE,
  nextDueDate DATE,
  maintenanceType ENUM(PREVENTIVE, CORRECTIVE, INSPECTION),
  description TEXT,
  partsCost FLOAT CHECK >= 0,
  laborCost FLOAT CHECK >= 0,
  status ENUM(PENDING, IN_PROGRESS, COMPLETED, CANCELLED),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

**Attributes**:
| Attribute | Type | Constraints | Purpose |
|-----------|------|-------------|---------|
| maintenanceId | VARCHAR(36) | PK, NOT NULL | Unique maintenance record ID |
| equipmentId | VARCHAR(36) | FK, NOT NULL | Equipment requiring maintenance |
| technicianId | VARCHAR(36) | FK, NULLABLE | Assigned technician |
| maintenanceDate | DATE | NOT NULL | Date maintenance performed |
| nextDueDate | DATE | | Scheduled date for next maintenance |
| maintenanceType | ENUM | NOT NULL | Type of maintenance |
| description | TEXT | | Work performed details |
| partsCost | FLOAT | CHECK >= 0 | Cost of replacement parts |
| laborCost | FLOAT | CHECK >= 0 | Cost of labor |
| status | ENUM | NOT NULL | Current status |
| createdAt | TIMESTAMP | NOT NULL | Record creation time |
| updatedAt | TIMESTAMP | | Last modification time |

**Primary Key**: maintenanceId
**Foreign Keys**:
- equipmentId → EQUIPMENT(equipmentId) [CASCADE on delete]
- technicianId → USERS(userId) [SET NULL on delete]
**Indexes**:
- COMPOSITE INDEX (equipmentId, maintenanceDate)
- INDEX on nextDueDate (scheduling queries)
- INDEX on status (tracking)
- INDEX on technicianId (technician workload)

---

### 6. EQUIPMENT_USERS Table (Junction Table)

**Purpose**: Manage many-to-many relationship between equipment and users

```
EQUIPMENT_USERS(
  equipmentUserId PK VARCHAR(36),
  equipmentId FK VARCHAR(36) REFERENCES EQUIPMENT(equipmentId),
  userId FK VARCHAR(36) REFERENCES USERS(userId),
  assignmentDate DATE,
  revocationDate DATE,
  UNIQUE(equipmentId, userId),
  CHECK(revocationDate IS NULL OR revocationDate >= assignmentDate)
)
```

**Attributes**:
| Attribute | Type | Constraints | Purpose |
|-----------|------|-------------|---------|
| equipmentUserId | VARCHAR(36) | PK, NOT NULL | Unique record identifier |
| equipmentId | VARCHAR(36) | FK, NOT NULL | Equipment reference |
| userId | VARCHAR(36) | FK, NOT NULL | User reference |
| assignmentDate | DATE | NOT NULL | Assignment date |
| revocationDate | DATE | NULLABLE | Revocation date (if any) |

**Primary Key**: equipmentUserId
**Composite Unique Key**: (equipmentId, userId)
**Foreign Keys**:
- equipmentId → EQUIPMENT(equipmentId) [CASCADE on delete]
- userId → USERS(userId) [CASCADE on delete]
**Indexes**:
- UNIQUE COMPOSITE INDEX (equipmentId, userId)
- INDEX on userId (user's equipment)
- INDEX on equipmentId (equipment's users)
- INDEX on revocationDate (active assignments)

---

## Normalization Analysis

### First Normal Form (1NF)

**Requirement**: All attributes must be atomic (contain only single values, no repeating groups)

**Analysis**:

✅ **USERS Table - COMPLIANT**
- All attributes are atomic
- No repeating groups
- No multi-valued attributes

✅ **EQUIPMENT Table - COMPLIANT**
- All attributes are atomic
- No repeating groups (location is single value, not comma-separated)

✅ **CHEMICALS Table - COMPLIANT**
- All attributes are atomic
- Formula, CAS Number are single values
- Quantity is numeric (single value)

✅ **CHECK_IN_OUT Table - COMPLIANT**
- All attributes are atomic
- Type is single ENUM value
- No repeating transaction records within one attribute

✅ **MAINTENANCE Table - COMPLIANT**
- All attributes are atomic
- Description is TEXT (single value, not repeating)
- No repeating maintenance records within one attribute

✅ **EQUIPMENT_USERS Table - COMPLIANT**
- All attributes are atomic
- Represents single assignment relationship

**Conclusion**: All tables **SATISFY 1NF** ✅

---

### Second Normal Form (2NF)

**Requirements**:
1. Table must satisfy 1NF ✅
2. Every non-key attribute must be fully dependent on the entire primary key (no partial dependencies)

**Analysis**:

✅ **USERS Table - COMPLIANT**
- Primary Key: userId (single attribute)
- All non-key attributes (email, name, password, role, etc.) depend on userId
- No partial dependencies possible with single-attribute key

✅ **EQUIPMENT Table - COMPLIANT**
- Primary Key: equipmentId (single attribute)
- All non-key attributes depend on equipmentId
  - name, type, status depend on knowing which equipment
  - assignedTo depends on equipmentId (which equipment is assigned)
- No partial dependencies

✅ **CHEMICALS Table - COMPLIANT**
- Primary Key: chemicalId (single attribute)
- All non-key attributes depend on chemicalId
  - name, formula, quantity depend on knowing which chemical
  - safetyLevel depends on chemicalId
- No partial dependencies

✅ **CHECK_IN_OUT Table - COMPLIANT**
- Primary Key: recordId (single attribute)
- All non-key attributes depend on recordId
  - userId, equipmentId, type, timestamp all depend on which check-in/out record
- No partial dependencies
- Foreign keys (userId, equipmentId) reference other tables but don't violate 2NF

✅ **MAINTENANCE Table - COMPLIANT**
- Primary Key: maintenanceId (single attribute)
- All non-key attributes depend on maintenanceId
  - equipmentId, technicianId, maintenanceDate all depend on which maintenance task
- No partial dependencies

✅ **EQUIPMENT_USERS Table - COMPLIANT**
- Primary Key: equipmentUserId (single attribute)
- All non-key attributes depend on equipmentUserId
  - equipmentId, userId, assignmentDate depend on the assignment record
- Composite unique constraint (equipmentId, userId) doesn't create partial dependency issues
  - equipmentId alone ≠ sufficient to determine assignmentDate (need to know which user)
  - userId alone ≠ sufficient to determine assignmentDate (need to know which equipment)

**Conclusion**: All tables **SATISFY 2NF** ✅

---

### Third Normal Form (3NF)

**Requirements**:
1. Table must satisfy 2NF ✅
2. No non-key attribute can depend transitively on the primary key (no transitive dependencies)

**Analysis**:

✅ **USERS Table - COMPLIANT**
- Primary Key: userId
- Non-key attributes: email, name, password, role, department, isActive, createdAt, updatedAt, lastLogin
- All attributes depend directly on userId
- No transitive dependencies detected
  - Example: name does NOT depend on email; both depend on userId
  - Example: role does NOT depend on department; both depend on userId

✅ **EQUIPMENT Table - COMPLIANT**
- Primary Key: equipmentId
- Non-key attributes: name, type, category, status, location, assignedTo, purchaseDate, lastMaintenance, qrCode, createdAt, updatedAt
- All attributes depend directly on equipmentId
- No transitive dependencies detected
  - Example: status does NOT depend on location; both depend on equipmentId
  - Example: assignedTo (FK) references another table but doesn't create transitive dependency
  - The location attribute doesn't imply other attributes

✅ **CHEMICALS Table - COMPLIANT**
- Primary Key: chemicalId
- Non-key attributes: name, formula, quantity, unit, safetyLevel, location, reorderThreshold, expirationDate, sdsDocumentUrl, casNumber, supplier, createdAt, updatedAt
- All attributes depend directly on chemicalId
- No transitive dependencies detected
  - Example: formula does NOT depend on safetyLevel; both depend on chemicalId
  - Example: supplier is independent of quantity; both depend on chemicalId
  - CAS Number is a property of the chemical, not derived from other attributes

✅ **CHECK_IN_OUT Table - COMPLIANT**
- Primary Key: recordId
- Non-key attributes: userId, equipmentId, type, timestamp, location, notes, createdAt
- All attributes depend directly on recordId
- No transitive dependencies detected
  - Example: userId does NOT depend on equipmentId; both depend on recordId
  - Example: type (CHECK_IN vs CHECK_OUT) is independent of timestamp

✅ **MAINTENANCE Table - COMPLIANT**
- Primary Key: maintenanceId
- Non-key attributes: equipmentId, technicianId, maintenanceDate, nextDueDate, maintenanceType, description, partsCost, laborCost, status, createdAt, updatedAt
- All attributes depend directly on maintenanceId
- No transitive dependencies detected
  - Example: maintenanceType does NOT depend on maintenanceDate; both depend on maintenanceId
  - Example: partsCost does NOT depend on laborCost; both depend on maintenanceId
  - NOTE: nextDueDate could theoretically be calculated from maintenanceDate + maintenance interval, but it's still directly dependent on maintenanceId as it's explicitly stored

✅ **EQUIPMENT_USERS Table - COMPLIANT**
- Primary Key: equipmentUserId
- Non-key attributes: equipmentId, userId, assignmentDate, revocationDate
- All attributes depend directly on equipmentUserId
- No transitive dependencies detected
  - Example: assignmentDate does NOT depend on revocationDate; both depend on equipmentUserId
  - Foreign keys (equipmentId, userId) reference other entities but don't create transitive dependencies

**Conclusion**: All tables **SATISFY 3NF** ✅

---

## Normalization Summary

| Table | 1NF | 2NF | 3NF | Status |
|-------|-----|-----|-----|--------|
| USERS | ✅ | ✅ | ✅ | NORMALIZED |
| EQUIPMENT | ✅ | ✅ | ✅ | NORMALIZED |
| CHEMICALS | ✅ | ✅ | ✅ | NORMALIZED |
| CHECK_IN_OUT | ✅ | ✅ | ✅ | NORMALIZED |
| MAINTENANCE | ✅ | ✅ | ✅ | NORMALIZED |
| EQUIPMENT_USERS | ✅ | ✅ | ✅ | NORMALIZED |

**Overall Database Status**: **3NF COMPLIANT** ✅

---

## Key Constraints & Integrity Rules

### Entity Integrity
- Every table has a PRIMARY KEY
- Primary key values are NOT NULL
- Primary key values are UNIQUE

### Referential Integrity
| FK Relationship | Action on Delete | Action on Update | Rationale |
|-----------------|------------------|------------------|-----------|
| EQUIPMENT.assignedTo → USERS | SET NULL | CASCADE | Equipment can exist without user |
| CHECK_IN_OUT.userId → USERS | RESTRICT | CASCADE | Cannot delete user with transactions |
| CHECK_IN_OUT.equipmentId → EQUIPMENT | CASCADE | CASCADE | Delete transactions when equipment deleted |
| MAINTENANCE.equipmentId → EQUIPMENT | CASCADE | CASCADE | Delete maintenance when equipment deleted |
| MAINTENANCE.technicianId → USERS | SET NULL | CASCADE | Maintenance can exist without technician |
| EQUIPMENT_USERS.equipmentId → EQUIPMENT | CASCADE | CASCADE | Delete assignments when equipment deleted |
| EQUIPMENT_USERS.userId → USERS | CASCADE | CASCADE | Delete assignments when user deleted |

### Domain Constraints
- USERS.role: Must be one of {ADMIN, LAB_MANAGER, SAFETY_OFFICER, TECHNICIAN, LAB_USER}
- EQUIPMENT.status: Must be one of {AVAILABLE, IN_USE, MAINTENANCE, RETIRED}
- CHEMICALS.safetyLevel: Must be one of {LOW, MEDIUM, HIGH, CRITICAL}
- CHEMICALS.quantity: Must be >= 0
- CHECK_IN_OUT.type: Must be one of {CHECK_IN, CHECK_OUT}
- MAINTENANCE.maintenanceType: Must be one of {PREVENTIVE, CORRECTIVE, INSPECTION}
- MAINTENANCE.status: Must be one of {PENDING, IN_PROGRESS, COMPLETED, CANCELLED}
- MAINTENANCE.partsCost, laborCost: Must be >= 0
- EQUIPMENT_USERS.revocationDate >= EQUIPMENT_USERS.assignmentDate (if revocationDate exists)

---

## Firestore Collection Mapping

While EduTrack uses Firebase Firestore (NoSQL), the above relational schema maps to Firestore collections as follows:

### Collection Structure

```
/users
  {userId}
    - email: string
    - name: string
    - password: string (hashed)
    - role: string
    - department: string
    - isActive: boolean
    - createdAt: timestamp
    - updatedAt: timestamp
    - lastLogin: timestamp

/equipment
  {equipmentId}
    - name: string
    - type: string
    - category: string
    - status: string
    - location: string
    - assignedTo: reference (Users/{userId})
    - purchaseDate: timestamp
    - lastMaintenance: timestamp
    - qrCode: string
    - createdAt: timestamp
    - updatedAt: timestamp

/chemicals
  {chemicalId}
    - name: string
    - formula: string
    - quantity: number
    - unit: string
    - safetyLevel: string
    - location: string
    - reorderThreshold: number
    - expirationDate: timestamp
    - sdsDocumentUrl: string
    - casNumber: string
    - supplier: string
    - createdAt: timestamp
    - updatedAt: timestamp

/checkInOut
  {recordId}
    - userId: reference (Users/{userId})
    - equipmentId: reference (Equipment/{equipmentId})
    - type: string (CHECK_IN|CHECK_OUT)
    - timestamp: timestamp
    - location: string
    - notes: string
    - createdAt: timestamp

/maintenance
  {maintenanceId}
    - equipmentId: reference (Equipment/{equipmentId})
    - technicianId: reference (Users/{userId})
    - maintenanceDate: timestamp
    - nextDueDate: timestamp
    - maintenanceType: string
    - description: string
    - partsCost: number
    - laborCost: number
    - status: string
    - createdAt: timestamp
    - updatedAt: timestamp

/equipmentUsers
  {equipmentUserId}
    - equipmentId: reference (Equipment/{equipmentId})
    - userId: reference (Users/{userId})
    - assignmentDate: timestamp
    - revocationDate: timestamp
```

### Firestore Composite Indexes

For complex queries, create these composite indexes:

1. **checkInOut**: (userId, timestamp DESC)
2. **checkInOut**: (equipmentId, timestamp DESC)
3. **equipment**: (status, location)
4. **chemicals**: (location, safetyLevel)
5. **maintenance**: (equipmentId, maintenanceDate DESC)

---

## Advantages of This Schema

✅ **Data Integrity**: Foreign keys ensure referential integrity
✅ **Normalized**: Eliminates data redundancy and anomalies
✅ **Query Efficiency**: Proper indexing enables fast queries
✅ **Scalability**: Junction table supports flexible assignments
✅ **Maintainability**: Clear relationships and dependencies
✅ **Compliance**: Audit trails with timestamps
✅ **Security**: Hashed passwords, role-based access

---

## Potential Query Examples

### Find all equipment currently assigned to a user
```sql
SELECT e.* FROM EQUIPMENT e
WHERE e.assignedTo = 'user123'
   OR e.equipmentId IN (
      SELECT eu.equipmentId FROM EQUIPMENT_USERS eu
      WHERE eu.userId = 'user123' AND eu.revocationDate IS NULL
   )
```

### Get user's check-in/out history
```sql
SELECT cio.*, e.name as equipmentName, u.name as userName
FROM CHECK_IN_OUT cio
JOIN EQUIPMENT e ON cio.equipmentId = e.equipmentId
JOIN USERS u ON cio.userId = u.userId
WHERE cio.userId = 'user123'
ORDER BY cio.timestamp DESC
```

### Find overdue maintenance
```sql
SELECT m.*, e.name as equipmentName, u.name as technicianName
FROM MAINTENANCE m
JOIN EQUIPMENT e ON m.equipmentId = e.equipmentId
LEFT JOIN USERS u ON m.technicianId = u.userId
WHERE m.nextDueDate < CURDATE() AND m.status != 'COMPLETED'
ORDER BY m.nextDueDate ASC
```

### Chemical inventory low-stock alert
```sql
SELECT c.*
FROM CHEMICALS c
WHERE c.quantity < c.reorderThreshold
   OR c.expirationDate < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY c.safetyLevel DESC, c.quantity ASC
```

### Equipment utilization report
```sql
SELECT e.name, COUNT(cio.recordId) as checkInOutCount
FROM EQUIPMENT e
LEFT JOIN CHECK_IN_OUT cio ON e.equipmentId = cio.equipmentId
GROUP BY e.equipmentId
ORDER BY checkInOutCount DESC
```

---

## Future Normalization Considerations

### BCNF (Boyce-Codd Normal Form)
The schema is compatible with BCNF, which provides additional constraint that every determinant is a candidate key. Current schema satisfies this constraint.

### Denormalization Opportunities (if needed)
- Cache frequently accessed user names in CHECK_IN_OUT (denormalization for performance)
- Store equipment status counts in dashboard collection for real-time stats
- Maintain materialized view of active assignments

---

**Schema Version**: 1.0  
**Last Updated**: December 2025  
**Normalization Level**: 3NF (Third Normal Form)  
**Database System**: Firestore (with relational principles)  
**Related Documentation**: ER_DIAGRAM.md, ARCHITECTURE_DOCUMENTATION.md
