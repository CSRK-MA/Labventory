# Lab Inventory Management System - Architecture Documentation

**Project Name:** Labventory / EduTrack Inventory  
**Tech Stack:** React.js, Tailwind CSS, Firebase (Firestore, Authentication)  
**Target Users:** Educational institutions (Admin, Teachers, Lab Assistants, Students)

---

## SECTION 1: DATABASE DESIGN (Relational Model for Documentation)

### 1.1 Entity-Relationship (ER) Diagram Description

#### **Entities and Attributes:**

**1. User**
- UserID (PK) - INTEGER, AUTO_INCREMENT
- Email - VARCHAR(100), UNIQUE, NOT NULL
- PasswordHash - VARCHAR(255), NOT NULL
- FirstName - VARCHAR(50), NOT NULL
- LastName - VARCHAR(50), NOT NULL
- Role - ENUM('admin', 'teacher', 'lab-assistant', 'student'), NOT NULL
- Department - VARCHAR(100)
- Phone - VARCHAR(20)
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- LastLogin - TIMESTAMP
- IsActive - BOOLEAN, DEFAULT TRUE

**2. Lab**
- LabID (PK) - INTEGER, AUTO_INCREMENT
- LabName - VARCHAR(100), NOT NULL
- LabCode - VARCHAR(20), UNIQUE, NOT NULL
- Building - VARCHAR(50)
- RoomNumber - VARCHAR(20)
- Capacity - INTEGER
- Department - VARCHAR(100)
- ManagerID (FK → User.UserID)
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

**3. Category**
- CategoryID (PK) - INTEGER, AUTO_INCREMENT
- CategoryName - VARCHAR(50), UNIQUE, NOT NULL
- Description - TEXT
- Icon - VARCHAR(50)
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

**4. Equipment**
- EquipmentID (PK) - INTEGER, AUTO_INCREMENT
- ItemName - VARCHAR(100), NOT NULL
- ItemCode - VARCHAR(50), UNIQUE, NOT NULL
- QRCode - VARCHAR(100), UNIQUE
- CategoryID (FK → Category.CategoryID)
- LabID (FK → Lab.LabID)
- Brand - VARCHAR(50)
- Model - VARCHAR(50)
- SerialNumber - VARCHAR(100)
- PurchaseDate - DATE
- PurchasePrice - DECIMAL(10, 2)
- Condition - ENUM('excellent', 'good', 'fair', 'poor', 'damaged'), DEFAULT 'good'
- Status - ENUM('available', 'in-use', 'maintenance', 'retired'), DEFAULT 'available'
- Location - VARCHAR(100)
- Description - TEXT
- ImageURL - VARCHAR(255)
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- UpdatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**5. Chemical**
- ChemicalID (PK) - INTEGER, AUTO_INCREMENT
- ChemicalName - VARCHAR(100), NOT NULL
- ChemicalCode - VARCHAR(50), UNIQUE, NOT NULL
- QRCode - VARCHAR(100), UNIQUE
- CASNumber - VARCHAR(20)
- Formula - VARCHAR(100)
- CategoryID (FK → Category.CategoryID)
- LabID (FK → Lab.LabID)
- Quantity - DECIMAL(10, 2), NOT NULL
- Unit - VARCHAR(20) (e.g., 'ml', 'g', 'L', 'kg')
- MinimumStock - DECIMAL(10, 2)
- ExpiryDate - DATE
- HazardLevel - ENUM('low', 'medium', 'high', 'extreme'), DEFAULT 'low'
- StorageRequirements - TEXT
- Supplier - VARCHAR(100)
- PurchaseDate - DATE
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- UpdatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**6. CheckInOut**
- TransactionID (PK) - INTEGER, AUTO_INCREMENT
- ItemType - ENUM('equipment', 'chemical'), NOT NULL
- ItemID - INTEGER, NOT NULL (references EquipmentID or ChemicalID)
- UserID (FK → User.UserID)
- LabID (FK → Lab.LabID)
- Action - ENUM('check-in', 'check-out'), NOT NULL
- Quantity - DECIMAL(10, 2) (for chemicals)
- Purpose - TEXT
- CheckOutTime - TIMESTAMP
- ExpectedReturnTime - TIMESTAMP
- ActualReturnTime - TIMESTAMP
- Condition - ENUM('excellent', 'good', 'fair', 'poor', 'damaged')
- Notes - TEXT
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

**7. Maintenance**
- MaintenanceID (PK) - INTEGER, AUTO_INCREMENT
- EquipmentID (FK → Equipment.EquipmentID)
- MaintenanceType - ENUM('preventive', 'corrective', 'calibration', 'inspection'), NOT NULL
- ScheduledDate - DATE
- CompletedDate - DATE
- PerformedBy - VARCHAR(100)
- TechnicianID (FK → User.UserID)
- Status - ENUM('scheduled', 'in-progress', 'completed', 'cancelled'), DEFAULT 'scheduled'
- Cost - DECIMAL(10, 2)
- Description - TEXT
- Notes - TEXT
- NextMaintenanceDate - DATE
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- UpdatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**8. Notification**
- NotificationID (PK) - INTEGER, AUTO_INCREMENT
- UserID (FK → User.UserID)
- Type - ENUM('low-stock', 'expiry-warning', 'maintenance-due', 'overdue-return', 'system'), NOT NULL
- Title - VARCHAR(200), NOT NULL
- Message - TEXT, NOT NULL
- RelatedEntityType - VARCHAR(50) (e.g., 'equipment', 'chemical', 'maintenance')
- RelatedEntityID - INTEGER
- IsRead - BOOLEAN, DEFAULT FALSE
- Priority - ENUM('low', 'medium', 'high', 'urgent'), DEFAULT 'medium'
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- ReadAt - TIMESTAMP

**9. Report**
- ReportID (PK) - INTEGER, AUTO_INCREMENT
- ReportType - ENUM('usage', 'inventory', 'maintenance', 'chemical', 'custom'), NOT NULL
- GeneratedBy (FK → User.UserID)
- LabID (FK → Lab.LabID)
- ReportTitle - VARCHAR(200), NOT NULL
- StartDate - DATE
- EndDate - DATE
- Format - ENUM('pdf', 'csv', 'excel'), DEFAULT 'pdf'
- FileURL - VARCHAR(255)
- Parameters - JSON
- CreatedAt - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

#### **Relationships and Cardinalities:**

1. **User ↔ Lab** (Many-to-Many through UserLabAccess)
   - One User can access multiple Labs
   - One Lab can be accessed by multiple Users
   - UserLabAccess (UserID, LabID, AccessLevel, CreatedAt)

2. **User → CheckInOut** (One-to-Many)
   - One User can have many CheckInOut transactions
   - One CheckInOut belongs to one User

3. **User → Maintenance** (One-to-Many)
   - One User (technician) can perform many Maintenance tasks
   - One Maintenance task is performed by one User

4. **Lab → Equipment** (One-to-Many)
   - One Lab can have many Equipment items
   - One Equipment belongs to one Lab

5. **Lab → Chemical** (One-to-Many)
   - One Lab can have many Chemicals
   - One Chemical belongs to one Lab

6. **Category → Equipment** (One-to-Many)
   - One Category can have many Equipment items
   - One Equipment belongs to one Category

7. **Category → Chemical** (One-to-Many)
   - One Category can have many Chemicals
   - One Chemical belongs to one Category

8. **Equipment → Maintenance** (One-to-Many)
   - One Equipment can have many Maintenance records
   - One Maintenance record belongs to one Equipment

9. **User → Notification** (One-to-Many)
   - One User can receive many Notifications
   - One Notification is sent to one User

10. **User → Report** (One-to-Many)
    - One User can generate many Reports
    - One Report is generated by one User

---

### 1.2 Relational Schema

```
User(UserID PK, Email, PasswordHash, FirstName, LastName, Role, Department, Phone, CreatedAt, LastLogin, IsActive)

Lab(LabID PK, LabName, LabCode, Building, RoomNumber, Capacity, Department, ManagerID FK → User.UserID, CreatedAt)

Category(CategoryID PK, CategoryName, Description, Icon, CreatedAt)

Equipment(EquipmentID PK, ItemName, ItemCode, QRCode, CategoryID FK → Category.CategoryID, LabID FK → Lab.LabID, Brand, Model, SerialNumber, PurchaseDate, PurchasePrice, Condition, Status, Location, Description, ImageURL, CreatedAt, UpdatedAt)

Chemical(ChemicalID PK, ChemicalName, ChemicalCode, QRCode, CASNumber, Formula, CategoryID FK → Category.CategoryID, LabID FK → Lab.LabID, Quantity, Unit, MinimumStock, ExpiryDate, HazardLevel, StorageRequirements, Supplier, PurchaseDate, CreatedAt, UpdatedAt)

CheckInOut(TransactionID PK, ItemType, ItemID, UserID FK → User.UserID, LabID FK → Lab.LabID, Action, Quantity, Purpose, CheckOutTime, ExpectedReturnTime, ActualReturnTime, Condition, Notes, CreatedAt)

Maintenance(MaintenanceID PK, EquipmentID FK → Equipment.EquipmentID, MaintenanceType, ScheduledDate, CompletedDate, PerformedBy, TechnicianID FK → User.UserID, Status, Cost, Description, Notes, NextMaintenanceDate, CreatedAt, UpdatedAt)

Notification(NotificationID PK, UserID FK → User.UserID, Type, Title, Message, RelatedEntityType, RelatedEntityID, IsRead, Priority, CreatedAt, ReadAt)

Report(ReportID PK, ReportType, GeneratedBy FK → User.UserID, LabID FK → Lab.LabID, ReportTitle, StartDate, EndDate, Format, FileURL, Parameters, CreatedAt)

UserLabAccess(UserID FK → User.UserID, LabID FK → Lab.LabID, AccessLevel, CreatedAt)
  - Composite PK: (UserID, LabID)
```

---

### 1.3 Normalization Analysis

#### **First Normal Form (1NF):**
✅ **Achieved** - All tables have:
- Atomic values (no multi-valued attributes)
- Primary keys defined
- No repeating groups
- Each column contains only one value per row

#### **Second Normal Form (2NF):**
✅ **Achieved** - All tables satisfy 1NF and:
- All non-key attributes are fully functionally dependent on the entire primary key
- No partial dependencies exist
- Example: In Equipment, all attributes (ItemName, Brand, Model, etc.) depend on the complete primary key (EquipmentID), not on any part of it

#### **Third Normal Form (3NF):**
✅ **Achieved** - All tables satisfy 2NF and:
- No transitive dependencies exist
- All non-key attributes depend only on the primary key
- Example: Category is separated from Equipment to avoid transitive dependency (Equipment → CategoryID → CategoryName)
- Lab information is separated to avoid redundancy
- User information is not duplicated across transactions

**Additional Normalization Benefits:**
- **Reduced Redundancy:** Category, Lab, and User data stored once
- **Data Integrity:** Foreign key constraints ensure referential integrity
- **Easier Maintenance:** Updates to category names or lab details require changes in only one place
- **Scalability:** Schema can easily accommodate new equipment types, chemical categories, or user roles

---

### 1.4 SQL Scripts

#### **CREATE TABLE Statements:**

```sql
-- =============================================
-- Lab Inventory Management System - SQL Schema
-- Database: MySQL 8.0+
-- =============================================

-- Drop tables if exists (for development)
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS Maintenance;
DROP TABLE IF EXISTS CheckInOut;
DROP TABLE IF EXISTS UserLabAccess;
DROP TABLE IF EXISTS Chemical;
DROP TABLE IF EXISTS Equipment;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Lab;
DROP TABLE IF EXISTS User;

-- Create User Table
CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Role ENUM('admin', 'teacher', 'lab-assistant', 'student') NOT NULL,
    Department VARCHAR(100),
    Phone VARCHAR(20),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    INDEX idx_email (Email),
    INDEX idx_role (Role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Lab Table
CREATE TABLE Lab (
    LabID INT AUTO_INCREMENT PRIMARY KEY,
    LabName VARCHAR(100) NOT NULL,
    LabCode VARCHAR(20) UNIQUE NOT NULL,
    Building VARCHAR(50),
    RoomNumber VARCHAR(20),
    Capacity INT,
    Department VARCHAR(100),
    ManagerID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ManagerID) REFERENCES User(UserID) ON DELETE SET NULL,
    INDEX idx_labcode (LabCode),
    INDEX idx_department (Department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Category Table
CREATE TABLE Category (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) UNIQUE NOT NULL,
    Description TEXT,
    Icon VARCHAR(50),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Equipment Table
CREATE TABLE Equipment (
    EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    ItemName VARCHAR(100) NOT NULL,
    ItemCode VARCHAR(50) UNIQUE NOT NULL,
    QRCode VARCHAR(100) UNIQUE,
    CategoryID INT NOT NULL,
    LabID INT NOT NULL,
    Brand VARCHAR(50),
    Model VARCHAR(50),
    SerialNumber VARCHAR(100),
    PurchaseDate DATE,
    PurchasePrice DECIMAL(10, 2),
    Condition ENUM('excellent', 'good', 'fair', 'poor', 'damaged') DEFAULT 'good',
    Status ENUM('available', 'in-use', 'maintenance', 'retired') DEFAULT 'available',
    Location VARCHAR(100),
    Description TEXT,
    ImageURL VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID) ON DELETE RESTRICT,
    FOREIGN KEY (LabID) REFERENCES Lab(LabID) ON DELETE CASCADE,
    INDEX idx_itemcode (ItemCode),
    INDEX idx_qrcode (QRCode),
    INDEX idx_status (Status),
    INDEX idx_category (CategoryID),
    INDEX idx_lab (LabID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Chemical Table
CREATE TABLE Chemical (
    ChemicalID INT AUTO_INCREMENT PRIMARY KEY,
    ChemicalName VARCHAR(100) NOT NULL,
    ChemicalCode VARCHAR(50) UNIQUE NOT NULL,
    QRCode VARCHAR(100) UNIQUE,
    CASNumber VARCHAR(20),
    Formula VARCHAR(100),
    CategoryID INT NOT NULL,
    LabID INT NOT NULL,
    Quantity DECIMAL(10, 2) NOT NULL,
    Unit VARCHAR(20) NOT NULL,
    MinimumStock DECIMAL(10, 2),
    ExpiryDate DATE,
    HazardLevel ENUM('low', 'medium', 'high', 'extreme') DEFAULT 'low',
    StorageRequirements TEXT,
    Supplier VARCHAR(100),
    PurchaseDate DATE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID) ON DELETE RESTRICT,
    FOREIGN KEY (LabID) REFERENCES Lab(LabID) ON DELETE CASCADE,
    INDEX idx_chemcode (ChemicalCode),
    INDEX idx_qrcode (QRCode),
    INDEX idx_expiry (ExpiryDate),
    INDEX idx_hazard (HazardLevel),
    INDEX idx_category (CategoryID),
    INDEX idx_lab (LabID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create CheckInOut Table
CREATE TABLE CheckInOut (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    ItemType ENUM('equipment', 'chemical') NOT NULL,
    ItemID INT NOT NULL,
    UserID INT NOT NULL,
    LabID INT NOT NULL,
    Action ENUM('check-in', 'check-out') NOT NULL,
    Quantity DECIMAL(10, 2),
    Purpose TEXT,
    CheckOutTime TIMESTAMP,
    ExpectedReturnTime TIMESTAMP,
    ActualReturnTime TIMESTAMP NULL,
    Condition ENUM('excellent', 'good', 'fair', 'poor', 'damaged'),
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (LabID) REFERENCES Lab(LabID) ON DELETE CASCADE,
    INDEX idx_item (ItemType, ItemID),
    INDEX idx_user (UserID),
    INDEX idx_lab (LabID),
    INDEX idx_action (Action),
    INDEX idx_checkout_time (CheckOutTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Maintenance Table
CREATE TABLE Maintenance (
    MaintenanceID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentID INT NOT NULL,
    MaintenanceType ENUM('preventive', 'corrective', 'calibration', 'inspection') NOT NULL,
    ScheduledDate DATE,
    CompletedDate DATE,
    PerformedBy VARCHAR(100),
    TechnicianID INT,
    Status ENUM('scheduled', 'in-progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    Cost DECIMAL(10, 2),
    Description TEXT,
    Notes TEXT,
    NextMaintenanceDate DATE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID) ON DELETE CASCADE,
    FOREIGN KEY (TechnicianID) REFERENCES User(UserID) ON DELETE SET NULL,
    INDEX idx_equipment (EquipmentID),
    INDEX idx_status (Status),
    INDEX idx_scheduled_date (ScheduledDate),
    INDEX idx_next_maintenance (NextMaintenanceDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Notification Table
CREATE TABLE Notification (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Type ENUM('low-stock', 'expiry-warning', 'maintenance-due', 'overdue-return', 'system') NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Message TEXT NOT NULL,
    RelatedEntityType VARCHAR(50),
    RelatedEntityID INT,
    IsRead BOOLEAN DEFAULT FALSE,
    Priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ReadAt TIMESTAMP NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX idx_user (UserID),
    INDEX idx_type (Type),
    INDEX idx_is_read (IsRead),
    INDEX idx_priority (Priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Report Table
CREATE TABLE Report (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    ReportType ENUM('usage', 'inventory', 'maintenance', 'chemical', 'custom') NOT NULL,
    GeneratedBy INT NOT NULL,
    LabID INT,
    ReportTitle VARCHAR(200) NOT NULL,
    StartDate DATE,
    EndDate DATE,
    Format ENUM('pdf', 'csv', 'excel') DEFAULT 'pdf',
    FileURL VARCHAR(255),
    Parameters JSON,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GeneratedBy) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (LabID) REFERENCES Lab(LabID) ON DELETE SET NULL,
    INDEX idx_report_type (ReportType),
    INDEX idx_generated_by (GeneratedBy),
    INDEX idx_lab (LabID),
    INDEX idx_created_at (CreatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create UserLabAccess Junction Table
CREATE TABLE UserLabAccess (
    UserID INT NOT NULL,
    LabID INT NOT NULL,
    AccessLevel ENUM('view', 'edit', 'manage') DEFAULT 'view',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserID, LabID),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (LabID) REFERENCES Lab(LabID) ON DELETE CASCADE,
    INDEX idx_user (UserID),
    INDEX idx_lab (LabID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **INSERT Statements (Sample Data):**

```sql
-- =============================================
-- Sample Data Insertion
-- =============================================

-- Insert Users
INSERT INTO User (Email, PasswordHash, FirstName, LastName, Role, Department, Phone, IsActive) VALUES
('admin@university.edu', '$2b$10$hashedpassword1', 'John', 'Smith', 'admin', 'Science Department', '+1-555-0101', TRUE),
('teacher1@university.edu', '$2b$10$hashedpassword2', 'Sarah', 'Johnson', 'teacher', 'Chemistry Department', '+1-555-0102', TRUE),
('labassist1@university.edu', '$2b$10$hashedpassword3', 'Michael', 'Brown', 'lab-assistant', 'Physics Department', '+1-555-0103', TRUE),
('student1@university.edu', '$2b$10$hashedpassword4', 'Emily', 'Davis', 'student', 'Chemistry Department', '+1-555-0104', TRUE),
('student2@university.edu', '$2b$10$hashedpassword5', 'Daniel', 'Wilson', 'student', 'Biology Department', '+1-555-0105', TRUE);

-- Insert Labs
INSERT INTO Lab (LabName, LabCode, Building, RoomNumber, Capacity, Department, ManagerID) VALUES
('Chemistry Lab A', 'CHEM-A-101', 'Science Building', '101', 30, 'Chemistry', 2),
('Physics Lab B', 'PHYS-B-201', 'Engineering Building', '201', 25, 'Physics', 1),
('Biology Research Lab', 'BIO-R-301', 'Research Center', '301', 20, 'Biology', 2),
('Computer Lab 1', 'COMP-1-401', 'Technology Building', '401', 40, 'Computer Science', 1);

-- Insert Categories
INSERT INTO Category (CategoryName, Description, Icon) VALUES
('Glassware', 'Laboratory glassware and containers', 'flask'),
('Instruments', 'Measurement and testing instruments', 'gauge'),
('Electronics', 'Electronic equipment and components', 'cpu'),
('Safety Equipment', 'Personal protective and safety equipment', 'shield'),
('Reagents', 'Chemical reagents and compounds', 'droplet'),
('Solvents', 'Organic and inorganic solvents', 'beaker'),
('Acids', 'Acidic compounds', 'alert-triangle'),
('Bases', 'Basic/Alkaline compounds', 'circle');

-- Insert Equipment
INSERT INTO Equipment (ItemName, ItemCode, QRCode, CategoryID, LabID, Brand, Model, SerialNumber, PurchaseDate, PurchasePrice, Condition, Status, Location, Description) VALUES
('Digital pH Meter', 'EQ-PH-001', 'QR001-PH-METER', 2, 1, 'Mettler Toledo', 'SevenCompact S220', 'SN12345678', '2023-01-15', 1250.00, 'excellent', 'available', 'Shelf A-12', 'High precision pH meter with temperature compensation'),
('Hot Plate Stirrer', 'EQ-HS-002', 'QR002-HOTPLATE', 2, 1, 'IKA', 'RCT Basic', 'SN23456789', '2023-02-20', 650.00, 'good', 'available', 'Bench 3', 'Magnetic stirrer with heating function'),
('Analytical Balance', 'EQ-BAL-003', 'QR003-BALANCE', 2, 1, 'Sartorius', 'Entris II', 'SN34567890', '2023-03-10', 2800.00, 'excellent', 'in-use', 'Weighing Room', '0.1mg precision analytical balance'),
('Spectrophotometer', 'EQ-SPEC-004', 'QR004-SPECTRO', 2, 1, 'Thermo Fisher', 'Genesys 30', 'SN45678901', '2022-11-05', 4500.00, 'good', 'available', 'Instrument Room', 'UV-Vis spectrophotometer for absorbance measurements'),
('Centrifuge', 'EQ-CENT-005', 'QR005-CENTRIFUGE', 2, 2, 'Eppendorf', '5424R', 'SN56789012', '2023-04-22', 3200.00, 'excellent', 'available', 'Lab Counter', 'Refrigerated microcentrifuge, 15000 rpm'),
('Oscilloscope', 'EQ-OSC-006', 'QR006-OSCOPE', 3, 2, 'Tektronix', 'TBS2104', 'SN67890123', '2023-01-30', 1800.00, 'good', 'available', 'Electronics Bench', '4-channel digital storage oscilloscope'),
('Microscope', 'EQ-MICRO-007', 'QR007-MICROSCOPE', 2, 3, 'Olympus', 'CX43', 'SN78901234', '2023-05-15', 1950.00, 'excellent', 'available', 'Microscopy Room', 'Binocular compound microscope with LED illumination'),
('Autoclave', 'EQ-AUTO-008', 'QR008-AUTOCLAVE', 2, 3, 'Tuttnauer', '2340M', 'SN89012345', '2022-09-18', 5600.00, 'good', 'maintenance', 'Sterilization Room', '23L manual autoclave sterilizer');

-- Insert Chemicals
INSERT INTO Chemical (ChemicalName, ChemicalCode, QRCode, CASNumber, Formula, CategoryID, LabID, Quantity, Unit, MinimumStock, ExpiryDate, HazardLevel, StorageRequirements, Supplier, PurchaseDate) VALUES
('Hydrochloric Acid 37%', 'CHEM-HCL-001', 'QR101-HCL', '7647-01-0', 'HCl', 7, 1, 2500.00, 'ml', 500.00, '2025-12-31', 'high', 'Store in acid cabinet, well-ventilated area', 'Sigma-Aldrich', '2024-01-10'),
('Sodium Hydroxide Pellets', 'CHEM-NAOH-002', 'QR102-NAOH', '1310-73-2', 'NaOH', 8, 1, 1000.00, 'g', 250.00, '2026-06-30', 'high', 'Keep dry, store in base cabinet', 'Fisher Scientific', '2024-02-15'),
('Ethanol 95%', 'CHEM-ETOH-003', 'QR103-ETHANOL', '64-17-5', 'C2H5OH', 6, 1, 5000.00, 'ml', 1000.00, '2025-09-30', 'medium', 'Flammable storage cabinet, away from heat', 'VWR International', '2024-01-20'),
('Sulfuric Acid 98%', 'CHEM-H2SO4-004', 'QR104-H2SO4', '7664-93-9', 'H2SO4', 7, 1, 1000.00, 'ml', 200.00, '2025-11-30', 'extreme', 'Acid cabinet with secondary containment', 'Merck', '2024-03-05'),
('Sodium Chloride', 'CHEM-NACL-005', 'QR105-NACL', '7647-14-5', 'NaCl', 5, 1, 5000.00, 'g', 1000.00, '2027-12-31', 'low', 'Room temperature, dry place', 'Sigma-Aldrich', '2024-01-12'),
('Acetone', 'CHEM-ACE-006', 'QR106-ACETONE', '67-64-1', 'C3H6O', 6, 1, 2500.00, 'ml', 500.00, '2025-08-31', 'medium', 'Flammable cabinet, grounded container', 'Fisher Scientific', '2024-02-28'),
('Phenolphthalein Indicator', 'CHEM-PHPH-007', 'QR107-PHENOL', '77-09-8', 'C20H14O4', 5, 1, 100.00, 'ml', 25.00, '2025-10-31', 'low', 'Store at room temperature', 'Alfa Aesar', '2024-01-25'),
('Potassium Permanganate', 'CHEM-KMNO4-008', 'QR108-KMNO4', '7722-64-7', 'KMnO4', 5, 1, 500.00, 'g', 100.00, '2026-05-31', 'medium', 'Keep away from organic materials', 'Merck', '2024-03-15');

-- Insert Check-In/Out Transactions
INSERT INTO CheckInOut (ItemType, ItemID, UserID, LabID, Action, Purpose, CheckOutTime, ExpectedReturnTime, Condition, Notes) VALUES
('equipment', 3, 4, 1, 'check-out', 'Organic Chemistry Experiment - Titration', '2024-12-01 09:00:00', '2024-12-01 12:00:00', 'excellent', 'Student experiment group A'),
('equipment', 1, 4, 1, 'check-out', 'pH measurement for buffer solution preparation', '2024-12-02 10:30:00', '2024-12-02 15:00:00', 'excellent', NULL),
('chemical', 3, 5, 1, 'check-out', 'Solvent extraction procedure', '2024-12-03 08:00:00', '2024-12-03 17:00:00', NULL, 'Used 250ml for extraction'),
('equipment', 3, 4, 1, 'check-in', 'Organic Chemistry Experiment - Titration', '2024-12-01 11:45:00', NULL, 'excellent', 'Returned in good condition'),
('equipment', 7, 5, 3, 'check-out', 'Cell morphology study', '2024-12-04 13:00:00', '2024-12-04 16:00:00', 'excellent', 'Biology lab session');

-- Insert Maintenance Records
INSERT INTO Maintenance (EquipmentID, MaintenanceType, ScheduledDate, CompletedDate, PerformedBy, TechnicianID, Status, Cost, Description, Notes, NextMaintenanceDate) VALUES
(8, 'preventive', '2024-12-10', '2024-12-11', 'TechCare Services', 3, 'completed', 450.00, 'Annual pressure vessel inspection and seal replacement', 'All tests passed. New door gasket installed.', '2025-12-10'),
(4, 'calibration', '2024-11-15', '2024-11-15', 'Calibration Lab Inc', 3, 'completed', 280.00, 'Wavelength and absorbance calibration', 'Calibration certificate issued', '2025-05-15'),
(5, 'preventive', '2024-12-20', NULL, NULL, 3, 'scheduled', NULL, 'Routine maintenance and rotor inspection', NULL, '2025-06-20'),
(3, 'calibration', '2024-12-05', '2024-12-06', 'Precision Calibration Co', 3, 'completed', 195.00, 'Weight calibration verification', 'Within tolerance limits', '2025-06-05');

-- Insert Notifications
INSERT INTO Notification (UserID, Type, Title, Message, RelatedEntityType, RelatedEntityID, IsRead, Priority) VALUES
(2, 'low-stock', 'Low Stock Alert: Hydrochloric Acid', 'Hydrochloric Acid 37% (CHEM-HCL-001) is running low. Current: 450ml, Minimum: 500ml', 'chemical', 1, FALSE, 'high'),
(2, 'expiry-warning', 'Expiry Warning: Ethanol 95%', 'Ethanol 95% (CHEM-ETOH-003) will expire in 30 days on 2025-09-30', 'chemical', 3, FALSE, 'medium'),
(3, 'maintenance-due', 'Maintenance Due: Centrifuge', 'Preventive maintenance for Centrifuge (EQ-CENT-005) is scheduled for 2024-12-20', 'equipment', 5, FALSE, 'medium'),
(1, 'system', 'Monthly Report Generated', 'Your monthly lab usage report for November 2024 has been generated and is ready for download', 'report', 1, TRUE, 'low'),
(4, 'overdue-return', 'Overdue Return: Digital pH Meter', 'Equipment Digital pH Meter (EQ-PH-001) was due for return on 2024-12-02 15:00. Please return immediately.', 'equipment', 1, FALSE, 'urgent');

-- Insert Reports
INSERT INTO Report (ReportType, GeneratedBy, LabID, ReportTitle, StartDate, EndDate, Format, FileURL, Parameters) VALUES
('usage', 1, 1, 'November 2024 Lab Usage Report - Chemistry Lab A', '2024-11-01', '2024-11-30', 'pdf', '/reports/2024-11-chemistry-usage.pdf', '{"includeChemicals": true, "includeEquipment": true}'),
('inventory', 1, 1, 'Q4 2024 Inventory Summary', '2024-10-01', '2024-12-31', 'excel', '/reports/2024-q4-inventory.xlsx', '{"groupBy": "category"}'),
('maintenance', 3, NULL, 'Annual Maintenance Report 2024', '2024-01-01', '2024-12-31', 'pdf', '/reports/2024-annual-maintenance.pdf', '{"allLabs": true}'),
('chemical', 2, 1, 'Chemical Expiry Report - Next 90 Days', '2024-12-06', '2025-03-06', 'csv', '/reports/chemical-expiry-90days.csv', '{"expiryWindow": 90}');

-- Insert UserLabAccess
INSERT INTO UserLabAccess (UserID, LabID, AccessLevel) VALUES
(1, 1, 'manage'),
(1, 2, 'manage'),
(1, 3, 'manage'),
(1, 4, 'manage'),
(2, 1, 'manage'),
(2, 3, 'edit'),
(3, 2, 'edit'),
(3, 1, 'edit'),
(4, 1, 'view'),
(5, 3, 'view');

-- Verification Queries
SELECT 'Total Users:' AS Metric, COUNT(*) AS Count FROM User
UNION ALL
SELECT 'Total Labs:', COUNT(*) FROM Lab
UNION ALL
SELECT 'Total Equipment:', COUNT(*) FROM Equipment
UNION ALL
SELECT 'Total Chemicals:', COUNT(*) FROM Chemical
UNION ALL
SELECT 'Total Transactions:', COUNT(*) FROM CheckInOut
UNION ALL
SELECT 'Total Maintenance Records:', COUNT(*) FROM Maintenance
UNION ALL
SELECT 'Unread Notifications:', COUNT(*) FROM Notification WHERE IsRead = FALSE;
```

---

## SECTION 2: OOP / SOFTWARE DESIGN

### 2.1 Class Diagram Description

#### **Core Domain Classes:**

```typescript
// ============================================
// ENTITY CLASSES (Data Models)
// ============================================

class User {
  // Attributes
  - userId: string
  - email: string
  - firstName: string
  - lastName: string
  - role: UserRole ('admin' | 'teacher' | 'lab-assistant' | 'student')
  - department: string
  - phone: string
  - createdAt: Date
  - lastLogin: Date
  - isActive: boolean
  
  // Methods
  + getFullName(): string
  + hasPermission(permission: string): boolean
  + updateProfile(data: Partial<User>): void
  + authenticate(password: string): boolean
}

class Lab {
  // Attributes
  - labId: string
  - labName: string
  - labCode: string
  - building: string
  - roomNumber: string
  - capacity: number
  - department: string
  - managerId: string
  - createdAt: Date
  
  // Methods
  + getLocation(): string
  + isAvailable(): boolean
  + getEquipmentCount(): number
  + getChemicalCount(): number
}

class Category {
  // Attributes
  - categoryId: string
  - categoryName: string
  - description: string
  - icon: string
  
  // Methods
  + getItems(): (Equipment | Chemical)[]
  + getTotalValue(): number
}

class Equipment {
  // Attributes
  - equipmentId: string
  - itemName: string
  - itemCode: string
  - qrCode: string
  - categoryId: string
  - labId: string
  - brand: string
  - model: string
  - serialNumber: string
  - purchaseDate: Date
  - purchasePrice: number
  - condition: EquipmentCondition
  - status: EquipmentStatus
  - location: string
  - description: string
  - imageUrl: string
  
  // Methods
  + isAvailable(): boolean
  + checkOut(userId: string, purpose: string): CheckInOut
  + checkIn(transactionId: string): void
  + scheduleMaintenance(data: MaintenanceData): Maintenance
  + generateQRCode(): string
  + updateCondition(condition: EquipmentCondition): void
}

class Chemical {
  // Attributes
  - chemicalId: string
  - chemicalName: string
  - chemicalCode: string
  - qrCode: string
  - casNumber: string
  - formula: string
  - categoryId: string
  - labId: string
  - quantity: number
  - unit: string
  - minimumStock: number
  - expiryDate: Date
  - hazardLevel: HazardLevel
  - storageRequirements: string
  - supplier: string
  
  // Methods
  + isLowStock(): boolean
  + isExpiringSoon(days: number): boolean
  + consumeQuantity(amount: number): void
  + restockQuantity(amount: number): void
  + getHazardInfo(): HazardInfo
  + generateQRCode(): string
}

class CheckInOut {
  // Attributes
  - transactionId: string
  - itemType: 'equipment' | 'chemical'
  - itemId: string
  - userId: string
  - labId: string
  - action: 'check-in' | 'check-out'
  - quantity: number
  - purpose: string
  - checkOutTime: Date
  - expectedReturnTime: Date
  - actualReturnTime: Date | null
  - condition: EquipmentCondition
  - notes: string
  
  // Methods
  + isOverdue(): boolean
  + getDuration(): number
  + complete(condition: EquipmentCondition): void
  + getItem(): Equipment | Chemical
  + getUser(): User
}

class Maintenance {
  // Attributes
  - maintenanceId: string
  - equipmentId: string
  - maintenanceType: MaintenanceType
  - scheduledDate: Date
  - completedDate: Date | null
  - performedBy: string
  - technicianId: string
  - status: MaintenanceStatus
  - cost: number
  - description: string
  - notes: string
  - nextMaintenanceDate: Date
  
  // Methods
  + isDue(): boolean
  + complete(notes: string, cost: number): void
  + reschedule(newDate: Date): void
  + getEquipment(): Equipment
  + calculateNextDate(): Date
}

class Notification {
  // Attributes
  - notificationId: string
  - userId: string
  - type: NotificationType
  - title: string
  - message: string
  - relatedEntityType: string
  - relatedEntityId: string
  - isRead: boolean
  - priority: Priority
  - createdAt: Date
  
  // Methods
  + markAsRead(): void
  + getRelatedEntity(): any
  + send(): void
}

class Report {
  // Attributes
  - reportId: string
  - reportType: ReportType
  - generatedBy: string
  - labId: string
  - reportTitle: string
  - startDate: Date
  - endDate: Date
  - format: 'pdf' | 'csv' | 'excel'
  - fileUrl: string
  - parameters: Record<string, any>
  
  // Methods
  + generate(): Promise<void>
  + download(): void
  + getGenerator(): User
  + getDataRange(): {start: Date, end: Date}
}

// ============================================
// SERVICE CLASSES (Business Logic)
// ============================================

class EquipmentService {
  // Attributes
  - repository: EquipmentRepository
  - notificationService: NotificationService
  
  // Methods
  + createEquipment(data: EquipmentData): Promise<Equipment>
  + updateEquipment(id: string, data: Partial<EquipmentData>): Promise<Equipment>
  + deleteEquipment(id: string): Promise<void>
  + getEquipmentById(id: string): Promise<Equipment>
  + getAllEquipment(labId?: string): Promise<Equipment[]>
  + searchEquipment(query: string): Promise<Equipment[]>
  + checkOutEquipment(equipmentId: string, userId: string, purpose: string): Promise<CheckInOut>
  + checkInEquipment(transactionId: string, condition: EquipmentCondition): Promise<void>
  + generateQRCode(equipmentId: string): Promise<string>
}

class ChemicalService {
  // Attributes
  - repository: ChemicalRepository
  - notificationService: NotificationService
  
  // Methods
  + createChemical(data: ChemicalData): Promise<Chemical>
  + updateChemical(id: string, data: Partial<ChemicalData>): Promise<Chemical>
  + deleteChemical(id: string): Promise<void>
  + getChemicalById(id: string): Promise<Chemical>
  + getAllChemicals(labId?: string): Promise<Chemical[]>
  + checkLowStock(): Promise<Chemical[]>
  + checkExpiringChemicals(days: number): Promise<Chemical[]>
  + consumeChemical(chemicalId: string, quantity: number): Promise<void>
  + restockChemical(chemicalId: string, quantity: number): Promise<void>
}

class AuthenticationService {
  // Attributes
  - firebaseAuth: FirebaseAuth
  
  // Methods
  + signIn(email: string, password: string): Promise<User>
  + signOut(): Promise<void>
  + signUp(userData: UserRegistration): Promise<User>
  + resetPassword(email: string): Promise<void>
  + getCurrentUser(): Promise<User | null>
  + updatePassword(oldPassword: string, newPassword: string): Promise<void>
}

class NotificationService {
  // Attributes
  - repository: NotificationRepository
  
  // Methods
  + createNotification(data: NotificationData): Promise<Notification>
  + sendLowStockAlert(chemical: Chemical): Promise<void>
  + sendExpiryWarning(chemical: Chemical): Promise<void>
  + sendMaintenanceDue(equipment: Equipment): Promise<void>
  + sendOverdueReturn(transaction: CheckInOut): Promise<void>
  + getUserNotifications(userId: string): Promise<Notification[]>
  + markAsRead(notificationId: string): Promise<void>
}

class ReportService {
  // Attributes
  - repository: ReportRepository
  
  // Methods
  + generateUsageReport(labId: string, startDate: Date, endDate: Date): Promise<Report>
  + generateInventoryReport(labId: string): Promise<Report>
  + generateMaintenanceReport(startDate: Date, endDate: Date): Promise<Report>
  + generateChemicalReport(labId: string): Promise<Report>
  + downloadReport(reportId: string): Promise<Blob>
  + scheduleReport(config: ReportSchedule): Promise<void>
}

class MaintenanceService {
  // Attributes
  - repository: MaintenanceRepository
  - notificationService: NotificationService
  
  // Methods
  + scheduleMaintenance(data: MaintenanceData): Promise<Maintenance>
  + updateMaintenance(id: string, data: Partial<MaintenanceData>): Promise<Maintenance>
  + completeMaintenance(id: string, notes: string, cost: number): Promise<void>
  + getDueMaintenance(): Promise<Maintenance[]>
  + getMaintenanceHistory(equipmentId: string): Promise<Maintenance[]>
}

// ============================================
// REPOSITORY CLASSES (Data Access Layer)
// ============================================

interface IRepository<T> {
  + create(data: T): Promise<T>
  + findById(id: string): Promise<T | null>
  + findAll(filters?: Record<string, any>): Promise<T[]>
  + update(id: string, data: Partial<T>): Promise<T>
  + delete(id: string): Promise<void>
}

class EquipmentRepository implements IRepository<Equipment> {
  - firestore: Firestore
  - collectionName: string = 'equipment'
  
  + create(data: Equipment): Promise<Equipment>
  + findById(id: string): Promise<Equipment | null>
  + findAll(filters?: Record<string, any>): Promise<Equipment[]>
  + update(id: string, data: Partial<Equipment>): Promise<Equipment>
  + delete(id: string): Promise<void>
  + findByLabId(labId: string): Promise<Equipment[]>
  + findByStatus(status: EquipmentStatus): Promise<Equipment[]>
  + search(query: string): Promise<Equipment[]>
}

class ChemicalRepository implements IRepository<Chemical> {
  - firestore: Firestore
  - collectionName: string = 'chemicals'
  
  + create(data: Chemical): Promise<Chemical>
  + findById(id: string): Promise<Chemical | null>
  + findAll(filters?: Record<string, any>): Promise<Chemical[]>
  + update(id: string, data: Partial<Chemical>): Promise<Chemical>
  + delete(id: string): Promise<void>
  + findLowStock(): Promise<Chemical[]>
  + findExpiring(days: number): Promise<Chemical[]>
}

// ============================================
// REACT COMPONENT CLASSES
// ============================================

class DashboardComponent {
  // Props
  + userRole: UserRole
  + onSignOut: () => void
  
  // State
  - currentPage: string
  - sidebarOpen: boolean
  
  // Methods
  + render(): JSX.Element
  + handlePageChange(page: string): void
  + toggleSidebar(): void
}

class EquipmentListComponent {
  // State
  - equipment: Equipment[]
  - loading: boolean
  - error: string | null
  - filters: EquipmentFilters
  
  // Methods
  + componentDidMount(): void
  + loadEquipment(): Promise<void>
  + handleFilterChange(filters: EquipmentFilters): void
  + handleAdd(data: EquipmentData): Promise<void>
  + handleEdit(id: string, data: EquipmentData): Promise<void>
  + handleDelete(id: string): Promise<void>
  + render(): JSX.Element
}

// ============================================
// UTILITY CLASSES
// ============================================

class QRCodeGenerator {
  + static generate(data: string): string
  + static parse(qrCode: string): any
}

class DateUtil {
  + static formatDate(date: Date): string
  + static getDaysDiff(date1: Date, date2: Date): number
  + static isOverdue(expectedDate: Date): boolean
}

class ValidationUtil {
  + static validateEmail(email: string): boolean
  + static validatePhone(phone: string): boolean
  + static validateQuantity(quantity: number): boolean
}
```

#### **Class Relationships:**

1. **Inheritance:**
   - `EquipmentRepository`, `ChemicalRepository`, `UserRepository` all implement `IRepository<T>` interface
   
2. **Composition:**
   - `EquipmentService` HAS-A `EquipmentRepository`
   - `ChemicalService` HAS-A `ChemicalRepository`
   - Services compose repositories to perform data operations

3. **Association:**
   - `Equipment` belongs to `Lab` (many-to-one)
   - `Equipment` belongs to `Category` (many-to-one)
   - `CheckInOut` references `User`, `Equipment/Chemical`, and `Lab`
   - `Maintenance` references `Equipment` and `User`

4. **Dependency:**
   - React Components depend on Service classes
   - Services depend on Repository classes
   - Services depend on Firebase SDK

---

### 2.2 Sequence Diagram - "Add New Equipment" Flow

```
Actor: Admin User
Participant: EquipmentListComponent
Participant: EquipmentService
Participant: EquipmentRepository
Participant: Firestore (Firebase)
Participant: QRCodeGenerator
Participant: NotificationService

1. Admin → EquipmentListComponent: Click "Add Equipment" button
2. EquipmentListComponent → EquipmentListComponent: Open modal/form
3. Admin → EquipmentListComponent: Fill in equipment details
   (itemName, itemCode, category, lab, brand, model, etc.)
4. Admin → EquipmentListComponent: Click "Submit"

5. EquipmentListComponent → EquipmentListComponent: Validate form data
   alt [Validation fails]
     5a. EquipmentListComponent → Admin: Show validation errors
     5b. Admin → EquipmentListComponent: Correct errors and resubmit
   end

6. EquipmentListComponent → EquipmentService: createEquipment(equipmentData)

7. EquipmentService → QRCodeGenerator: generate(itemCode)
8. QRCodeGenerator → EquipmentService: return qrCodeString

9. EquipmentService → EquipmentRepository: create(equipment)

10. EquipmentRepository → Firestore: collection('equipment').add(equipmentData)
11. Firestore → EquipmentRepository: return documentReference

12. EquipmentRepository → Firestore: get document with ID
13. Firestore → EquipmentRepository: return equipmentDocument

14. EquipmentRepository → EquipmentService: return Equipment object

15. EquipmentService → NotificationService: createNotification({
      type: 'system',
      title: 'New Equipment Added',
      message: `${equipment.itemName} has been added to inventory`
    })

16. NotificationService → Firestore: Save notification

17. EquipmentService → EquipmentListComponent: return new Equipment

18. EquipmentListComponent → EquipmentListComponent: Update state (add to equipment list)
19. EquipmentListComponent → Admin: Show success message
20. EquipmentListComponent → EquipmentListComponent: Close modal
21. EquipmentListComponent → EquipmentListComponent: Refresh equipment list display

Note: Error handling occurs at each step
alt [Firebase error]
  EquipmentRepository → EquipmentService: throw Error
  EquipmentService → EquipmentListComponent: throw Error
  EquipmentListComponent → Admin: Show error message
end
```

**Key Flow Steps:**

1. **User Interaction:** Admin clicks add button and fills form
2. **Client-Side Validation:** Form data validated before submission
3. **QR Code Generation:** Unique QR code created for equipment
4. **Data Persistence:** Equipment saved to Firestore
5. **Notification Creation:** System notification sent to relevant users
6. **UI Update:** Component state updated and success shown
7. **Error Handling:** Errors caught and displayed at each layer

---

### 2.3 OOP Principles Application in React

#### **1. Encapsulation**

**Definition:** Hiding internal implementation details and exposing only necessary interfaces.

**Application in React + Firebase:**

```typescript
// ✅ GOOD: Service encapsulates Firebase operations
class EquipmentService {
  private repository: EquipmentRepository;
  private notificationService: NotificationService;

  constructor() {
    this.repository = new EquipmentRepository();
    this.notificationService = new NotificationService();
  }

  // Public interface - hides internal complexity
  async createEquipment(data: EquipmentData): Promise<Equipment> {
    try {
      // Validate data (internal logic)
      this.validateEquipmentData(data);
      
      // Generate QR code (internal logic)
      const qrCode = await QRCodeGenerator.generate(data.itemCode);
      
      // Create equipment with QR code
      const equipment = await this.repository.create({
        ...data,
        qrCode,
        createdAt: new Date(),
        status: 'available'
      });
      
      // Send notification (internal logic)
      await this.notificationService.sendSystemNotification(
        'New Equipment Added',
        `${equipment.itemName} has been added to inventory`
      );
      
      return equipment;
    } catch (error) {
      // Internal error handling
      console.error('Failed to create equipment:', error);
      throw new Error('Equipment creation failed');
    }
  }

  // Private method - encapsulated
  private validateEquipmentData(data: EquipmentData): void {
    if (!data.itemName || !data.itemCode) {
      throw new Error('Item name and code are required');
    }
    if (data.purchasePrice && data.purchasePrice < 0) {
      throw new Error('Purchase price cannot be negative');
    }
  }
}

// React Component - encapsulates UI logic
export function EquipmentListComponent() {
  // Private state (encapsulated)
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Public interface (event handlers)
  const handleAddEquipment = async (data: EquipmentData) => {
    setLoading(true);
    try {
      const equipmentService = new EquipmentService();
      const newEquipment = await equipmentService.createEquipment(data);
      setEquipment([...equipment, newEquipment]);
      toast.success('Equipment added successfully');
    } catch (error) {
      toast.error('Failed to add equipment');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <EquipmentForm onSubmit={handleAddEquipment} />
      <EquipmentTable data={equipment} loading={loading} />
    </div>
  );
}
```

**Benefits:**
- Components don't need to know about Firebase
- Business logic hidden in services
- Easier to test and maintain
- Can swap Firebase for another database without changing components

---

#### **2. Inheritance**

**Definition:** Creating new classes based on existing classes to reuse code and create hierarchies.

**Application in React + Firebase:**

```typescript
// Base Repository Class (Parent)
abstract class BaseRepository<T> {
  protected firestore: Firestore;
  protected collectionName: string;

  constructor(firestore: Firestore, collectionName: string) {
    this.firestore = firestore;
    this.collectionName = collectionName;
  }

  // Common CRUD operations
  async create(data: T): Promise<T> {
    const docRef = await addDoc(
      collection(this.firestore, this.collectionName),
      { ...data, createdAt: serverTimestamp() }
    );
    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as T;
  }

  async findById(id: string): Promise<T | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return this.findById(id) as Promise<T>;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, this.collectionName, id));
  }

  // Abstract method - must be implemented by children
  abstract search(query: string): Promise<T[]>;
}

// Child Class 1: EquipmentRepository (Inherits from BaseRepository)
class EquipmentRepository extends BaseRepository<Equipment> {
  constructor(firestore: Firestore) {
    super(firestore, 'equipment');
  }

  // Implement abstract method
  async search(query: string): Promise<Equipment[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('itemName', '>=', query),
      where('itemName', '<=', query + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
  }

  // Additional specific methods
  async findByStatus(status: EquipmentStatus): Promise<Equipment[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('status', '==', status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
  }
}

// Child Class 2: ChemicalRepository (Inherits from BaseRepository)
class ChemicalRepository extends BaseRepository<Chemical> {
  constructor(firestore: Firestore) {
    super(firestore, 'chemicals');
  }

  // Implement abstract method
  async search(query: string): Promise<Chemical[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('chemicalName', '>=', query),
      where('chemicalName', '<=', query + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chemical));
  }

  // Additional specific methods
  async findLowStock(): Promise<Chemical[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('quantity', '<=', 'minimumStock')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chemical));
  }
}

// React Component Inheritance Example
interface BaseFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Base Form Component
abstract class BaseFormComponent<T> extends React.Component<BaseFormProps> {
  protected state = {
    formData: {} as T,
    errors: {} as Record<string, string>
  };

  protected handleChange = (field: keyof T, value: any) => {
    this.setState({
      formData: { ...this.state.formData, [field]: value }
    });
  };

  protected handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      this.props.onSubmit(this.state.formData);
    } else {
      this.setState({ errors });
    }
  };

  // Abstract method - must be implemented
  abstract validate(): Record<string, string>;
  abstract render(): React.ReactNode;
}

// Concrete Form Component
class EquipmentFormComponent extends BaseFormComponent<EquipmentData> {
  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.state.formData.itemName) {
      errors.itemName = 'Item name is required';
    }
    if (!this.state.formData.itemCode) {
      errors.itemCode = 'Item code is required';
    }
    return errors;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          value={this.state.formData.itemName}
          onChange={(e) => this.handleChange('itemName', e.target.value)}
        />
        {this.state.errors.itemName && <span>{this.state.errors.itemName}</span>}
        {/* ... more fields ... */}
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

**Benefits:**
- Code reuse across repositories
- Consistent CRUD operations
- Easy to add new entity types
- Enforces implementation of required methods

---

#### **3. Polymorphism**

**Definition:** Ability to treat objects of different types through a common interface.

**Application in React + Firebase:**

```typescript
// Interface for all item types
interface IInventoryItem {
  id: string;
  name: string;
  code: string;
  qrCode: string;
  labId: string;
  isAvailable(): boolean;
  getDisplayInfo(): ItemDisplayInfo;
  generateQRCode(): string;
}

// Equipment implements the interface
class Equipment implements IInventoryItem {
  id: string;
  name: string;
  code: string;
  qrCode: string;
  labId: string;
  status: EquipmentStatus;
  
  isAvailable(): boolean {
    return this.status === 'available';
  }
  
  getDisplayInfo(): ItemDisplayInfo {
    return {
      title: this.name,
      subtitle: `${this.brand} ${this.model}`,
      status: this.status,
      icon: 'package'
    };
  }
  
  generateQRCode(): string {
    return QRCodeGenerator.generate(this.code);
  }
}

// Chemical implements the same interface
class Chemical implements IInventoryItem {
  id: string;
  name: string;
  code: string;
  qrCode: string;
  labId: string;
  quantity: number;
  minimumStock: number;
  
  isAvailable(): boolean {
    return this.quantity > 0;
  }
  
  getDisplayInfo(): ItemDisplayInfo {
    return {
      title: this.name,
      subtitle: `${this.quantity}${this.unit} available`,
      status: this.quantity > this.minimumStock ? 'available' : 'low-stock',
      icon: 'flask'
    };
  }
  
  generateQRCode(): string {
    return QRCodeGenerator.generate(this.code);
  }
}

// Service that works with any IInventoryItem
class InventoryService {
  // Polymorphic method - accepts any item implementing IInventoryItem
  async checkOutItem(item: IInventoryItem, userId: string, purpose: string): Promise<CheckInOut> {
    if (!item.isAvailable()) {
      throw new Error(`${item.name} is not available for checkout`);
    }
    
    const transaction = {
      itemType: item instanceof Equipment ? 'equipment' : 'chemical',
      itemId: item.id,
      userId,
      purpose,
      checkOutTime: new Date()
    };
    
    return await this.checkInOutRepository.create(transaction);
  }
  
  // Works with any item type
  async printQRLabel(item: IInventoryItem): Promise<void> {
    const qrCode = item.generateQRCode();
    const displayInfo = item.getDisplayInfo();
    await this.printService.print({ qrCode, ...displayInfo });
  }
}

// React Component using polymorphism
export function InventoryItemCard({ item }: { item: IInventoryItem }) {
  const displayInfo = item.getDisplayInfo();
  
  return (
    <div className="card">
      <Icon name={displayInfo.icon} />
      <h3>{displayInfo.title}</h3>
      <p>{displayInfo.subtitle}</p>
      <StatusBadge status={displayInfo.status} />
      {item.isAvailable() && <button>Check Out</button>}
      <QRCodeDisplay code={item.qrCode} />
    </div>
  );
}

// Usage - both Equipment and Chemical can be used interchangeably
function Example() {
  const items: IInventoryItem[] = [
    new Equipment({ name: 'Microscope', ... }),
    new Chemical({ name: 'HCl', ... }),
    new Equipment({ name: 'pH Meter', ... })
  ];
  
  return (
    <div>
      {items.map(item => (
        <InventoryItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// Polymorphic factory pattern
class ItemFactory {
  static createItem(type: 'equipment' | 'chemical', data: any): IInventoryItem {
    switch (type) {
      case 'equipment':
        return new Equipment(data);
      case 'chemical':
        return new Chemical(data);
      default:
        throw new Error('Unknown item type');
    }
  }
}

// Polymorphic repository operations
interface IRepository<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Different repositories can be used polymorphically
function processRepository<T>(repository: IRepository<T>, id: string) {
  return repository.findById(id);
}

const equipmentRepo: IRepository<Equipment> = new EquipmentRepository(firestore);
const chemicalRepo: IRepository<Chemical> = new ChemicalRepository(firestore);

// Both work with the same function
const equipment = await processRepository(equipmentRepo, 'eq-123');
const chemical = await processRepository(chemicalRepo, 'chem-456');
```

**Benefits:**
- Single component can handle multiple item types
- Easy to add new item types without changing existing code
- Flexible and extensible architecture
- Reduces code duplication

---

## SECTION 3: IMPLEMENTATION GUIDE (React + Firebase)

### 3.1 Firebase Firestore Collections Structure

**Mapping Relational Schema to NoSQL Collections:**

```javascript
// ============================================
// FIRESTORE COLLECTION STRUCTURE
// ============================================

/**
 * COLLECTION: users
 * Document ID: Auto-generated UID from Firebase Auth
 */
{
  "users": {
    "<userId>": {
      "email": "admin@university.edu",
      "firstName": "John",
      "lastName": "Smith",
      "role": "admin",
      "department": "Science Department",
      "phone": "+1-555-0101",
      "createdAt": Timestamp,
      "lastLogin": Timestamp,
      "isActive": true
    }
  }
}

/**
 * COLLECTION: labs
 * Document ID: Auto-generated
 */
{
  "labs": {
    "<labId>": {
      "labName": "Chemistry Lab A",
      "labCode": "CHEM-A-101",
      "building": "Science Building",
      "roomNumber": "101",
      "capacity": 30,
      "department": "Chemistry",
      "managerId": "<userId>",
      "createdAt": Timestamp
    }
  }
}

/**
 * COLLECTION: categories
 * Document ID: Auto-generated
 */
{
  "categories": {
    "<categoryId>": {
      "categoryName": "Glassware",
      "description": "Laboratory glassware and containers",
      "icon": "flask",
      "createdAt": Timestamp
    }
  }
}

/**
 * COLLECTION: equipment
 * Document ID: Auto-generated
 */
{
  "equipment": {
    "<equipmentId>": {
      "itemName": "Digital pH Meter",
      "itemCode": "EQ-PH-001",
      "qrCode": "QR001-PH-METER",
      "categoryId": "<categoryId>",
      "labId": "<labId>",
      "brand": "Mettler Toledo",
      "model": "SevenCompact S220",
      "serialNumber": "SN12345678",
      "purchaseDate": Timestamp,
      "purchasePrice": 1250.00,
      "condition": "excellent",
      "status": "available",
      "location": "Shelf A-12",
      "description": "High precision pH meter",
      "imageUrl": "https://...",
      "createdAt": Timestamp,
      "updatedAt": Timestamp
    }
  }
}

/**
 * COLLECTION: chemicals
 * Document ID: Auto-generated
 */
{
  "chemicals": {
    "<chemicalId>": {
      "chemicalName": "Hydrochloric Acid 37%",
      "chemicalCode": "CHEM-HCL-001",
      "qrCode": "QR101-HCL",
      "casNumber": "7647-01-0",
      "formula": "HCl",
      "categoryId": "<categoryId>",
      "labId": "<labId>",
      "quantity": 2500,
      "unit": "ml",
      "minimumStock": 500,
      "expiryDate": Timestamp,
      "hazardLevel": "high",
      "storageRequirements": "Store in acid cabinet",
      "supplier": "Sigma-Aldrich",
      "purchaseDate": Timestamp,
      "createdAt": Timestamp,
      "updatedAt": Timestamp
    }
  }
}

/**
 * COLLECTION: checkInOut
 * Document ID: Auto-generated
 */
{
  "checkInOut": {
    "<transactionId>": {
      "itemType": "equipment",
      "itemId": "<equipmentId>",
      "userId": "<userId>",
      "labId": "<labId>",
      "action": "check-out",
      "quantity": null,
      "purpose": "pH measurement experiment",
      "checkOutTime": Timestamp,
      "expectedReturnTime": Timestamp,
      "actualReturnTime": null,
      "condition": "excellent",
      "notes": "Student experiment group A",
      "createdAt": Timestamp
    }
  }
}

/**
 * COLLECTION: maintenance
 * Document ID: Auto-generated
 */
{
  "maintenance": {
    "<maintenanceId>": {
      "equipmentId": "<equipmentId>",
      "maintenanceType": "preventive",
      "scheduledDate": Timestamp,
      "completedDate": Timestamp,
      "performedBy": "TechCare Services",
      "technicianId": "<userId>",
      "status": "completed",
      "cost": 450.00,
      "description": "Annual inspection",
      "notes": "All tests passed",
      "nextMaintenanceDate": Timestamp,
      "createdAt": Timestamp,
      "updatedAt": Timestamp
    }
  }
}

/**
 * COLLECTION: notifications
 * Document ID: Auto-generated
 */
{
  "notifications": {
    "<notificationId>": {
      "userId": "<userId>",
      "type": "low-stock",
      "title": "Low Stock Alert",
      "message": "Hydrochloric Acid is running low",
      "relatedEntityType": "chemical",
      "relatedEntityId": "<chemicalId>",
      "isRead": false,
      "priority": "high",
      "createdAt": Timestamp,
      "readAt": null
    }
  }
}

/**
 * COLLECTION: reports
 * Document ID: Auto-generated
 */
{
  "reports": {
    "<reportId>": {
      "reportType": "usage",
      "generatedBy": "<userId>",
      "labId": "<labId>",
      "reportTitle": "November 2024 Usage Report",
      "startDate": Timestamp,
      "endDate": Timestamp,
      "format": "pdf",
      "fileUrl": "/reports/...",
      "parameters": {
        "includeChemicals": true,
        "includeEquipment": true
      },
      "createdAt": Timestamp
    }
  }
}

/**
 * SUBCOLLECTION: userLabAccess (under users)
 * Document ID: labId
 */
{
  "users": {
    "<userId>": {
      // ... user fields ...
      "labAccess": {
        "<labId>": {
          "accessLevel": "manage",
          "createdAt": Timestamp
        }
      }
    }
  }
}
```

**Indexing Strategy:**

```javascript
// Create composite indexes in Firebase Console or firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "equipment",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "labId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "chemicals",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "labId", "order": "ASCENDING" },
        { "fieldPath": "expiryDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "checkInOut",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "checkOutTime", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "isRead", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

### 3.2 React + Firebase Implementation Code

#### **3.2.1 Firebase Initialization**

```typescript
// src/services/firebase/config.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "labventory-xxxxx.firebaseapp.com",
  projectId: "labventory-xxxxx",
  storageBucket: "labventory-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

#### **3.2.2 Service Function - Create/Add Data**

```typescript
// src/services/equipmentService.ts

import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from './firebase/config';
import { Equipment, EquipmentData } from '../types/equipment';

class EquipmentService {
  private collectionName = 'equipment';

  /**
   * Create new equipment
   * @param data Equipment data
   * @returns Created equipment with ID
   */
  async createEquipment(data: EquipmentData): Promise<Equipment> {
    try {
      // Validate required fields
      if (!data.itemName || !data.itemCode) {
        throw new Error('Item name and code are required');
      }

      // Prepare equipment data
      const equipmentData = {
        ...data,
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add to Firestore
      const docRef = await addDoc(
        collection(db, this.collectionName),
        equipmentData
      );

      // Fetch the created document
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Failed to create equipment');
      }

      // Return equipment with ID
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Equipment;

    } catch (error) {
      console.error('Error creating equipment:', error);
      throw new Error('Failed to create equipment');
    }
  }

  /**
   * Create equipment with batch operation
   * @param equipmentList Array of equipment data
   * @returns Array of created equipment
   */
  async createMultipleEquipment(equipmentList: EquipmentData[]): Promise<Equipment[]> {
    const { writeBatch } = await import('firebase/firestore');
    const batch = writeBatch(db);
    const createdEquipment: Equipment[] = [];

    try {
      equipmentList.forEach((data) => {
        const docRef = doc(collection(db, this.collectionName));
        const equipmentData = {
          ...data,
          status: 'available',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        batch.set(docRef, equipmentData);
        createdEquipment.push({ id: docRef.id, ...data } as Equipment);
      });

      await batch.commit();
      return createdEquipment;

    } catch (error) {
      console.error('Error in batch create:', error);
      throw new Error('Failed to create multiple equipment');
    }
  }
}

export const equipmentService = new EquipmentService();
```

#### **3.2.3 Service Function - Read/Fetch Data**

```typescript
// src/services/equipmentService.ts (continued)

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';

class EquipmentService {
  // ... previous methods ...

  /**
   * Get equipment by ID
   * @param equipmentId Equipment document ID
   * @returns Equipment or null
   */
  async getEquipmentById(equipmentId: string): Promise<Equipment | null> {
    try {
      const docRef = doc(db, this.collectionName, equipmentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Equipment;

    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw new Error('Failed to fetch equipment');
    }
  }

  /**
   * Get all equipment
   * @param labId Optional lab filter
   * @returns Array of equipment
   */
  async getAllEquipment(labId?: string): Promise<Equipment[]> {
    try {
      let q;

      if (labId) {
        // Filter by lab
        q = query(
          collection(db, this.collectionName),
          where('labId', '==', labId),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Get all equipment
        q = query(
          collection(db, this.collectionName),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Equipment));

    } catch (error) {
      console.error('Error fetching all equipment:', error);
      throw new Error('Failed to fetch equipment list');
    }
  }

  /**
   * Get equipment by status
   * @param status Equipment status
   * @param labId Optional lab filter
   * @returns Array of equipment
   */
  async getEquipmentByStatus(
    status: 'available' | 'in-use' | 'maintenance' | 'retired',
    labId?: string
  ): Promise<Equipment[]> {
    try {
      const constraints = [
        where('status', '==', status),
        orderBy('updatedAt', 'desc')
      ];

      if (labId) {
        constraints.unshift(where('labId', '==', labId));
      }

      const q = query(
        collection(db, this.collectionName),
        ...constraints
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Equipment));

    } catch (error) {
      console.error('Error fetching equipment by status:', error);
      throw new Error('Failed to fetch equipment');
    }
  }

  /**
   * Search equipment
   * @param searchTerm Search query
   * @returns Array of matching equipment
   */
  async searchEquipment(searchTerm: string): Promise<Equipment[]> {
    try {
      // Note: Firestore doesn't support full-text search
      // This is a basic implementation using "startsWith"
      // For production, consider using Algolia or Elasticsearch

      const searchUpper = searchTerm.toUpperCase();
      
      const q = query(
        collection(db, this.collectionName),
        where('itemName', '>=', searchUpper),
        where('itemName', '<=', searchUpper + '\uf8ff'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Equipment));

    } catch (error) {
      console.error('Error searching equipment:', error);
      throw new Error('Failed to search equipment');
    }
  }

  /**
   * Get paginated equipment
   * @param pageSize Number of items per page
   * @param lastDoc Last document from previous page
   * @returns Paginated equipment and last document
   */
  async getPaginatedEquipment(
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{ equipment: Equipment[], lastDoc: DocumentSnapshot | null }> {
    try {
      const constraints = [
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      ];

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(
        collection(db, this.collectionName),
        ...constraints
      );

      const querySnapshot = await getDocs(q);
      
      const equipment = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Equipment));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { equipment, lastDoc: lastVisible };

    } catch (error) {
      console.error('Error fetching paginated equipment:', error);
      throw new Error('Failed to fetch equipment');
    }
  }

  /**
   * Real-time listener for equipment changes
   * @param labId Lab ID to listen to
   * @param callback Callback function
   * @returns Unsubscribe function
   */
  subscribeToEquipment(
    labId: string,
    callback: (equipment: Equipment[]) => void
  ): () => void {
    const { onSnapshot } = await import('firebase/firestore');
    
    const q = query(
      collection(db, this.collectionName),
      where('labId', '==', labId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const equipment = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Equipment));
      callback(equipment);
    }, (error) => {
      console.error('Error in equipment listener:', error);
    });

    return unsubscribe;
  }
}

export const equipmentService = new EquipmentService();
```

#### **3.2.4 React Component Integration**

```typescript
// src/components/dashboard/EquipmentList.tsx

import { useState, useEffect } from 'react';
import { equipmentService } from '../../services/equipmentService';
import { Equipment, EquipmentData } from '../../types/equipment';
import { toast } from 'sonner@2.0.3';

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load equipment on component mount
  useEffect(() => {
    loadEquipment();
  }, []);

  // Fetch equipment from Firestore
  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
    } catch (err) {
      setError('Failed to load equipment');
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  // Add new equipment
  const handleAddEquipment = async (data: EquipmentData) => {
    try {
      const newEquipment = await equipmentService.createEquipment(data);
      setEquipment([newEquipment, ...equipment]);
      setShowAddModal(false);
      toast.success('Equipment added successfully');
    } catch (err) {
      toast.error('Failed to add equipment');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Equipment Inventory</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <EquipmentCard key={item.id} equipment={item} />
        ))}
      </div>

      {showAddModal && (
        <EquipmentFormModal
          onSubmit={handleAddEquipment}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
```

---

### 3.3 Source Code Organization

```
labventory/
├── public/
│   ├── index.html
│   └── assets/
│       └── images/
├── src/
│   ├── components/              # UI Components
│   │   ├── common/              # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Card.tsx
│   │   ├── dashboard/           # Dashboard-specific components
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── EquipmentList.tsx
│   │   │   ├── ChemicalTracker.tsx
│   │   │   ├── CheckInOut.tsx
│   │   │   ├── MaintenanceTracker.tsx
│   │   │   ├── Reports.tsx
│   │   │   └── Settings.tsx
│   │   ├── forms/               # Form components
│   │   │   ├── EquipmentForm.tsx
│   │   │   ├── ChemicalForm.tsx
│   │   │   ├── CheckInOutForm.tsx
│   │   │   └── MaintenanceForm.tsx
│   │   ├── landing/             # Landing page components
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── UseCases.tsx
│   │   │   ├── DemoPreview.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Footer.tsx
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   │
│   ├── services/                # Business logic & Firebase operations
│   │   ├── firebase/
│   │   │   ├── config.ts        # Firebase initialization
│   │   │   └── firestore.rules  # Firestore security rules
│   │   ├── equipmentService.ts
│   │   ├── chemicalService.ts
│   │   ├── checkInOutService.ts
│   │   ├── maintenanceService.ts
│   │   ├── notificationService.ts
│   │   ├── reportService.ts
│   │   ├── authService.ts
│   │   └── storageService.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEquipment.ts
│   │   ├── useChemicals.ts
│   │   ├── useNotifications.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── equipment.ts
│   │   ├── chemical.ts
│   │   ├── checkInOut.ts
│   │   ├── maintenance.ts
│   │   ├── user.ts
│   │   ├── notification.ts
│   │   └── report.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── qrCodeGenerator.ts
│   │   ├── validation.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── styles/                  # Global styles
│   │   └── globals.css
│   │
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
│
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

**Key Principles:**

1. **Separation of Concerns:**
   - UI components in `/components`
   - Business logic in `/services`
   - Type definitions in `/types`

2. **Layered Architecture:**
   - Presentation Layer: React components
   - Business Logic Layer: Services
   - Data Access Layer: Firebase SDK

3. **Reusability:**
   - Common components shared across app
   - Service functions encapsulate Firebase operations
   - Custom hooks for state management

4. **Maintainability:**
   - Clear folder structure
   - TypeScript for type safety
   - Consistent naming conventions

---

This completes the comprehensive architecture documentation covering database design, OOP principles, and Firebase implementation for your Lab Inventory Management System!

Dashboard mobile responsiveness has been enhanced with improved sidebar navigation, header interactions, and responsive layouts.