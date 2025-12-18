-- ============================================================================
-- EduTrack Inventory Platform - Database Schema SQL Scripts
-- Database: EduTrack
-- Created: December 2025
-- Purpose: Define tables, relationships, indexes, and sample data
-- ============================================================================

-- ============================================================================
-- SECTION 1: DATABASE CREATION
-- ============================================================================

-- Create database (if using MySQL/PostgreSQL)
-- Uncomment for actual database creation:
-- CREATE DATABASE IF NOT EXISTS edutrack;
-- USE edutrack;

-- Set character set and collation
-- For MySQL:
-- ALTER DATABASE edutrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 2: TABLE CREATION
-- ============================================================================

-- ============================================================================
-- TABLE: users
-- Purpose: Store user account and authentication information
-- ============================================================================

CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique user identifier (UUID)',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'User email address',
    name VARCHAR(100) NOT NULL COMMENT 'User full name',
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password (bcrypt)',
    role VARCHAR(30) NOT NULL DEFAULT 'lab_user' COMMENT 'User role: admin, lab_manager, safety_officer, technician, lab_user',
    department VARCHAR(100) COMMENT 'Department or lab affiliation',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Account active status',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    last_login TIMESTAMP NULL COMMENT 'Last login timestamp',
    
    -- Constraints
    CONSTRAINT chk_role CHECK (role IN ('admin', 'lab_manager', 'safety_officer', 'technician', 'lab_user')),
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%.%')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts and authentication';

-- Create indexes for users table
CREATE UNIQUE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_created_at ON users(created_at);
CREATE INDEX idx_is_active ON users(is_active);

-- ============================================================================
-- TABLE: equipment
-- Purpose: Store equipment and asset inventory information
-- ============================================================================

CREATE TABLE equipment (
    equipment_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique equipment identifier (UUID)',
    name VARCHAR(150) NOT NULL COMMENT 'Equipment name or model',
    type VARCHAR(50) COMMENT 'Equipment type (e.g., microscope, scale)',
    category VARCHAR(50) COMMENT 'Equipment category',
    status VARCHAR(30) NOT NULL DEFAULT 'available' COMMENT 'Status: available, in_use, maintenance, retired',
    location VARCHAR(150) COMMENT 'Physical location in lab',
    assigned_to VARCHAR(36) COMMENT 'Currently assigned user (FK)',
    purchase_date DATE COMMENT 'Equipment purchase date',
    last_maintenance DATE COMMENT 'Last maintenance date',
    qr_code VARCHAR(500) UNIQUE COMMENT 'QR code identifier',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Constraints
    CONSTRAINT fk_equipment_user FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('available', 'in_use', 'maintenance', 'retired'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Equipment inventory and asset tracking';

-- Create indexes for equipment table
CREATE INDEX idx_status ON equipment(status);
CREATE INDEX idx_location ON equipment(location);
CREATE INDEX idx_category ON equipment(category);
CREATE INDEX idx_assigned_to ON equipment(assigned_to);
CREATE INDEX idx_equipment_status_location ON equipment(status, location);

-- ============================================================================
-- TABLE: chemicals
-- Purpose: Store chemical inventory and safety information
-- ============================================================================

CREATE TABLE chemicals (
    chemical_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique chemical identifier (UUID)',
    name VARCHAR(150) NOT NULL COMMENT 'Chemical name',
    formula VARCHAR(100) COMMENT 'Chemical formula',
    quantity FLOAT NOT NULL DEFAULT 0 COMMENT 'Current quantity in stock',
    unit VARCHAR(50) NOT NULL COMMENT 'Unit of measurement (ml, g, L, etc.)',
    safety_level VARCHAR(20) NOT NULL DEFAULT 'medium' COMMENT 'Safety level: low, medium, high, critical',
    location VARCHAR(150) COMMENT 'Storage location',
    reorder_threshold FLOAT COMMENT 'Minimum quantity before reorder alert',
    expiration_date DATE COMMENT 'Shelf-life or expiration date',
    sds_document_url VARCHAR(500) COMMENT 'URL to Safety Data Sheet',
    cas_number VARCHAR(20) UNIQUE COMMENT 'CAS Registry Number',
    supplier VARCHAR(150) COMMENT 'Supplier or manufacturer name',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Constraints
    CONSTRAINT chk_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_safety_level CHECK (safety_level IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT chk_threshold CHECK (reorder_threshold >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chemical inventory and safety information';

-- Create indexes for chemicals table
CREATE INDEX idx_safety_level ON chemicals(safety_level);
CREATE INDEX idx_expiration_date ON chemicals(expiration_date);
CREATE INDEX idx_quantity ON chemicals(quantity);
CREATE INDEX idx_chemical_location_safety ON chemicals(location, safety_level);
CREATE UNIQUE INDEX idx_cas_number ON chemicals(cas_number);

-- ============================================================================
-- TABLE: check_in_out
-- Purpose: Record equipment check-in and check-out transactions
-- ============================================================================

CREATE TABLE check_in_out (
    record_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique transaction record identifier (UUID)',
    user_id VARCHAR(36) NOT NULL COMMENT 'User performing check-in/out (FK)',
    equipment_id VARCHAR(36) NOT NULL COMMENT 'Equipment being checked (FK)',
    type VARCHAR(20) NOT NULL COMMENT 'Type: check_in or check_out',
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date and time of transaction',
    location VARCHAR(150) COMMENT 'Location where transaction occurred',
    notes TEXT COMMENT 'Additional notes or comments',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    
    -- Constraints
    CONSTRAINT fk_checkin_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_checkin_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_type CHECK (type IN ('check_in', 'check_out'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Equipment check-in/out transaction log';

-- Create indexes for check_in_out table
CREATE INDEX idx_user_timestamp ON check_in_out(user_id, timestamp DESC);
CREATE INDEX idx_equipment_timestamp ON check_in_out(equipment_id, timestamp DESC);
CREATE INDEX idx_type ON check_in_out(type);
CREATE INDEX idx_checkin_timestamp ON check_in_out(timestamp);

-- ============================================================================
-- TABLE: maintenance
-- Purpose: Track equipment maintenance records and schedules
-- ============================================================================

CREATE TABLE maintenance (
    maintenance_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique maintenance record identifier (UUID)',
    equipment_id VARCHAR(36) NOT NULL COMMENT 'Equipment requiring maintenance (FK)',
    technician_id VARCHAR(36) COMMENT 'Assigned technician (FK)',
    maintenance_date DATE NOT NULL COMMENT 'Date maintenance was performed',
    next_due_date DATE COMMENT 'Scheduled date for next maintenance',
    maintenance_type VARCHAR(30) NOT NULL DEFAULT 'preventive' COMMENT 'Type: preventive, corrective, inspection',
    description TEXT COMMENT 'Details of work performed',
    parts_cost FLOAT DEFAULT 0 COMMENT 'Cost of replacement parts',
    labor_cost FLOAT DEFAULT 0 COMMENT 'Cost of labor',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'Status: pending, in_progress, completed, cancelled',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Constraints
    CONSTRAINT fk_maintenance_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_maintenance_technician FOREIGN KEY (technician_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_maintenance_type CHECK (maintenance_type IN ('preventive', 'corrective', 'inspection')),
    CONSTRAINT chk_maintenance_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    CONSTRAINT chk_parts_cost CHECK (parts_cost >= 0),
    CONSTRAINT chk_labor_cost CHECK (labor_cost >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Equipment maintenance tracking and scheduling';

-- Create indexes for maintenance table
CREATE INDEX idx_equipment_maintenance_date ON maintenance(equipment_id, maintenance_date DESC);
CREATE INDEX idx_next_due_date ON maintenance(next_due_date);
CREATE INDEX idx_maintenance_status ON maintenance(status);
CREATE INDEX idx_technician_id ON maintenance(technician_id);

-- ============================================================================
-- TABLE: equipment_users (Junction Table)
-- Purpose: Manage many-to-many relationship between equipment and users
-- ============================================================================

CREATE TABLE equipment_users (
    equipment_user_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique junction record identifier (UUID)',
    equipment_id VARCHAR(36) NOT NULL COMMENT 'Equipment reference (FK)',
    user_id VARCHAR(36) NOT NULL COMMENT 'User reference (FK)',
    assignment_date DATE NOT NULL COMMENT 'Date assignment was made',
    revocation_date DATE COMMENT 'Date assignment was revoked (NULL if active)',
    
    -- Constraints
    CONSTRAINT fk_equip_user_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_equip_user_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT unique_equip_user UNIQUE KEY (equipment_id, user_id),
    CONSTRAINT chk_revocation_date CHECK (revocation_date IS NULL OR revocation_date >= assignment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Many-to-many relationship between equipment and users';

-- Create indexes for equipment_users table
CREATE UNIQUE INDEX idx_equip_user_pair ON equipment_users(equipment_id, user_id);
CREATE INDEX idx_equip_user_user ON equipment_users(user_id);
CREATE INDEX idx_equip_user_equipment ON equipment_users(equipment_id);
CREATE INDEX idx_equip_user_revocation ON equipment_users(revocation_date);

-- ============================================================================
-- SECTION 3: SAMPLE DATA INSERTION
-- ============================================================================

-- ============================================================================
-- Insert Sample Users
-- ============================================================================

INSERT INTO users (user_id, email, name, password, role, department, is_active, created_at) VALUES
('user-001', 'admin@edutrack.lab', 'John Administrator', 'hashed_password_admin', 'admin', 'Administration', TRUE, NOW()),
('user-002', 'jane.manager@edutrack.lab', 'Jane Manager', 'hashed_password_mgr', 'lab_manager', 'Chemistry Lab', TRUE, NOW()),
('user-003', 'safety@edutrack.lab', 'Safety Officer', 'hashed_password_safety', 'safety_officer', 'Safety Department', TRUE, NOW()),
('user-004', 'tech001@edutrack.lab', 'Mike Technician', 'hashed_password_tech', 'technician', 'Maintenance', TRUE, NOW()),
('user-005', 'john.smith@edutrack.lab', 'John Smith', 'hashed_password_user1', 'lab_user', 'Chemistry Lab', TRUE, NOW()),
('user-006', 'sarah.jones@edutrack.lab', 'Sarah Jones', 'hashed_password_user2', 'lab_user', 'Biology Lab', TRUE, NOW()),
('user-007', 'mark.brown@edutrack.lab', 'Mark Brown', 'hashed_password_user3', 'lab_user', 'Physics Lab', TRUE, NOW());

-- ============================================================================
-- Insert Sample Equipment
-- ============================================================================

INSERT INTO equipment (equipment_id, name, type, category, status, location, assigned_to, purchase_date, last_maintenance, created_at) VALUES
('equip-001', 'Optical Microscope Model XL-1000', 'microscope', 'Optical Equipment', 'available', 'Chemistry Lab - Shelf A1', 'user-005', '2023-01-15', '2025-10-20', NOW()),
('equip-002', 'Digital Balance Precision Scale', 'scale', 'Measurement', 'in_use', 'Chemistry Lab - Counter B2', 'user-006', '2022-06-10', '2025-09-15', NOW()),
('equip-003', 'Spectrophotometer UV-VIS 3000', 'spectrophotometer', 'Analysis', 'maintenance', 'Chemistry Lab - Cabinet C1', NULL, '2021-03-20', '2025-11-01', NOW()),
('equip-004', 'Centrifuge High-Speed Medical', 'centrifuge', 'Sample Preparation', 'available', 'Biology Lab - Room 101', 'user-007', '2023-08-05', '2025-08-30', NOW()),
('equip-005', 'pH Meter Digital Advanced', 'ph_meter', 'Measurement', 'available', 'Chemistry Lab - Counter B1', NULL, '2024-02-12', '2025-10-10', NOW()),
('equip-006', 'Oscilloscope Digital 100MHz', 'oscilloscope', 'Electronics', 'in_use', 'Physics Lab - Bench D1', 'user-007', '2022-11-08', '2025-07-20', NOW()),
('equip-007', 'Autoclave Sterilizer Class B', 'autoclave', 'Sterilization', 'available', 'Biology Lab - Room 102', NULL, '2023-05-18', '2025-09-05', NOW());

-- ============================================================================
-- Insert Sample Chemicals
-- ============================================================================

INSERT INTO chemicals (chemical_id, name, formula, quantity, unit, safety_level, location, reorder_threshold, expiration_date, sds_document_url, cas_number, supplier) VALUES
('chem-001', 'Hydrochloric Acid 37%', 'HCl', 2.5, 'L', 'high', 'Chemistry Lab - Cabinet A1', 1.0, '2026-06-15', '/sds/hcl_37.pdf', '7732-18-5', 'Chemical Suppliers Inc.'),
('chem-002', 'Sodium Hydroxide Pellets', 'NaOH', 500.0, 'g', 'high', 'Chemistry Lab - Cabinet A2', 200.0, '2027-03-20', '/sds/naoh_pellets.pdf', '1310-73-2', 'Reagent Chemicals Ltd.'),
('chem-003', 'Ethanol 95% Denatured', 'C2H6O', 5.0, 'L', 'medium', 'Chemistry Lab - Cabinet B1', 2.0, '2025-12-31', '/sds/ethanol_95.pdf', '64-17-5', 'Solvent Distributors'),
('chem-004', 'Acetone Lab Grade', 'C3H6O', 1.0, 'L', 'medium', 'Chemistry Lab - Cabinet B2', 0.5, '2026-08-10', '/sds/acetone.pdf', '67-64-1', 'Chemical Suppliers Inc.'),
('chem-005', 'Acetic Acid Glacial', 'CH3COOH', 3.0, 'L', 'medium', 'Chemistry Lab - Cabinet B3', 1.5, '2026-05-25', '/sds/acetic_acid.pdf', '64-19-7', 'Reagent Chemicals Ltd.'),
('chem-006', 'Methanol Pure', 'CH3OH', 2.0, 'L', 'high', 'Chemistry Lab - Cabinet C1', 1.0, '2026-02-14', '/sds/methanol.pdf', '67-56-1', 'Solvent Distributors'),
('chem-007', 'Sulfuric Acid Concentrated 98%', 'H2SO4', 1.5, 'L', 'critical', 'Chemistry Lab - Cabinet C2', 0.5, '2027-01-30', '/sds/h2so4_98.pdf', '7664-93-9', 'Chemical Suppliers Inc.'),
('chem-008', 'Phosphate Buffer Solution pH 7.2', 'PBS', 500.0, 'mL', 'low', 'Biology Lab - Fridge 1', 100.0, '2026-04-15', '/sds/pbs.pdf', '14265-44-2', 'Bio-Solutions Corp.');

-- ============================================================================
-- Insert Sample Check-In/Out Records
-- ============================================================================

INSERT INTO check_in_out (record_id, user_id, equipment_id, type, timestamp, location, notes) VALUES
('cio-001', 'user-005', 'equip-001', 'check_out', '2025-12-07 09:30:00', 'Chemistry Lab', 'Starting microscopy experiment'),
('cio-002', 'user-006', 'equip-002', 'check_out', '2025-12-07 10:15:00', 'Chemistry Lab', 'Weighing samples for analysis'),
('cio-003', 'user-007', 'equip-006', 'check_out', '2025-12-07 10:45:00', 'Physics Lab', 'Electronic measurements'),
('cio-004', 'user-005', 'equip-001', 'check_in', '2025-12-07 14:20:00', 'Chemistry Lab', 'Microscopy complete, equipment clean'),
('cio-005', 'user-006', 'equip-002', 'check_in', '2025-12-07 15:00:00', 'Chemistry Lab', 'Sample weighing done, cleaned'),
('cio-006', 'user-007', 'equip-004', 'check_out', '2025-12-07 16:00:00', 'Biology Lab', 'Sample centrifugation needed'),
('cio-007', 'user-006', 'equip-005', 'check_out', '2025-12-06 13:30:00', 'Chemistry Lab', 'pH testing for solutions'),
('cio-008', 'user-006', 'equip-005', 'check_in', '2025-12-06 16:45:00', 'Chemistry Lab', 'pH testing complete, calibrated'),
('cio-009', 'user-007', 'equip-004', 'check_in', '2025-12-07 17:30:00', 'Biology Lab', 'Centrifugation complete'),
('cio-010', 'user-007', 'equip-006', 'check_in', '2025-12-07 18:15:00', 'Physics Lab', 'Measurements complete, powered down');

-- ============================================================================
-- Insert Sample Maintenance Records
-- ============================================================================

INSERT INTO maintenance (maintenance_id, equipment_id, technician_id, maintenance_date, next_due_date, maintenance_type, description, parts_cost, labor_cost, status) VALUES
('maint-001', 'equip-001', 'user-004', '2025-10-20', '2026-04-20', 'preventive', 'Cleaned optics, calibrated, tested all functions', 150.00, 100.00, 'completed'),
('maint-002', 'equip-002', 'user-004', '2025-09-15', '2026-03-15', 'preventive', 'Calibration and verification of scale accuracy', 50.00, 75.00, 'completed'),
('maint-003', 'equip-003', 'user-004', '2025-11-01', '2025-12-15', 'corrective', 'Lamp replacement and optical alignment', 450.00, 200.00, 'in_progress'),
('maint-004', 'equip-004', 'user-004', '2025-08-30', '2026-02-28', 'preventive', 'Rotor inspection, bearing lubrication, safety check', 200.00, 125.00, 'completed'),
('maint-005', 'equip-006', 'user-004', '2025-07-20', '2026-01-20', 'preventive', 'Probe calibration, performance verification', 100.00, 80.00, 'completed'),
('maint-006', 'equip-003', NULL, '2025-12-15', NULL, 'preventive', 'Scheduled preventive maintenance - pending assignment', 0.00, 0.00, 'pending'),
('maint-007', 'equip-007', NULL, '2026-03-07', NULL, 'preventive', 'Annual sterilization test and safety inspection', 0.00, 0.00, 'pending');

-- ============================================================================
-- Insert Sample Equipment-User Assignments
-- ============================================================================

INSERT INTO equipment_users (equipment_user_id, equipment_id, user_id, assignment_date, revocation_date) VALUES
('eu-001', 'equip-001', 'user-005', '2025-08-01', NULL),
('eu-002', 'equip-002', 'user-006', '2025-07-15', NULL),
('eu-003', 'equip-006', 'user-007', '2025-09-01', NULL),
('eu-004', 'equip-001', 'user-006', '2024-06-01', '2025-07-31'),
('eu-005', 'equip-004', 'user-007', '2025-10-01', NULL),
('eu-006', 'equip-005', 'user-005', '2025-11-01', NULL);

-- ============================================================================
-- SECTION 4: VIEW CREATION (Optional - for common queries)
-- ============================================================================

-- ============================================================================
-- View: Active Equipment Assignments
-- ============================================================================

CREATE VIEW view_active_assignments AS
SELECT 
    eu.equipment_id,
    e.name AS equipment_name,
    e.status,
    eu.user_id,
    u.name AS user_name,
    u.email AS user_email,
    eu.assignment_date,
    DATEDIFF(CURDATE(), eu.assignment_date) AS days_assigned
FROM equipment_users eu
JOIN equipment e ON eu.equipment_id = e.equipment_id
JOIN users u ON eu.user_id = u.user_id
WHERE eu.revocation_date IS NULL
ORDER BY e.name, u.name;

-- ============================================================================
-- View: Equipment Check-In/Out History
-- ============================================================================

CREATE VIEW view_checkin_out_history AS
SELECT 
    cio.record_id,
    cio.timestamp,
    cio.type,
    u.name AS user_name,
    u.email AS user_email,
    e.name AS equipment_name,
    e.status AS equipment_status,
    cio.location,
    cio.notes
FROM check_in_out cio
JOIN users u ON cio.user_id = u.user_id
JOIN equipment e ON cio.equipment_id = e.equipment_id
ORDER BY cio.timestamp DESC;

-- ============================================================================
-- View: Overdue Maintenance
-- ============================================================================

CREATE VIEW view_overdue_maintenance AS
SELECT 
    m.maintenance_id,
    e.name AS equipment_name,
    e.equipment_id,
    m.next_due_date,
    DATEDIFF(CURDATE(), m.next_due_date) AS days_overdue,
    u.name AS technician_name,
    m.status,
    m.maintenance_type
FROM maintenance m
JOIN equipment e ON m.equipment_id = e.equipment_id
LEFT JOIN users u ON m.technician_id = u.user_id
WHERE m.next_due_date < CURDATE() AND m.status != 'completed'
ORDER BY m.next_due_date ASC;

-- ============================================================================
-- View: Low Stock Chemicals
-- ============================================================================

CREATE VIEW view_low_stock_chemicals AS
SELECT 
    chemical_id,
    name,
    quantity,
    unit,
    reorder_threshold,
    (reorder_threshold - quantity) AS shortage_amount,
    safety_level,
    location,
    supplier,
    DATEDIFF(expiration_date, CURDATE()) AS days_until_expiration
FROM chemicals
WHERE quantity < reorder_threshold
   OR expiration_date < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY safety_level DESC, shortage_amount DESC;

-- ============================================================================
-- View: Equipment Utilization Report
-- ============================================================================

CREATE VIEW view_equipment_utilization AS
SELECT 
    e.equipment_id,
    e.name AS equipment_name,
    e.status,
    COUNT(cio.record_id) AS total_transactions,
    COUNT(CASE WHEN cio.type = 'check_out' THEN 1 END) AS checkout_count,
    MAX(cio.timestamp) AS last_used,
    DATEDIFF(CURDATE(), MAX(cio.timestamp)) AS days_since_last_use
FROM equipment e
LEFT JOIN check_in_out cio ON e.equipment_id = cio.equipment_id
GROUP BY e.equipment_id
ORDER BY total_transactions DESC;

-- ============================================================================
-- SECTION 5: STORED PROCEDURES (Optional - for common operations)
-- ============================================================================

-- ============================================================================
-- Procedure: Log Equipment Check-In
-- ============================================================================

DELIMITER //

CREATE PROCEDURE sp_log_checkin(
    IN p_user_id VARCHAR(36),
    IN p_equipment_id VARCHAR(36),
    IN p_location VARCHAR(150),
    IN p_notes TEXT
)
BEGIN
    DECLARE v_record_id VARCHAR(36);
    
    -- Generate UUID
    SET v_record_id = UUID();
    
    -- Insert check-in record
    INSERT INTO check_in_out (record_id, user_id, equipment_id, type, timestamp, location, notes)
    VALUES (v_record_id, p_user_id, p_equipment_id, 'check_in', NOW(), p_location, p_notes);
    
    -- Return the new record ID
    SELECT v_record_id AS record_id;
END //

DELIMITER ;

-- ============================================================================
-- Procedure: Log Equipment Check-Out
-- ============================================================================

DELIMITER //

CREATE PROCEDURE sp_log_checkout(
    IN p_user_id VARCHAR(36),
    IN p_equipment_id VARCHAR(36),
    IN p_location VARCHAR(150),
    IN p_notes TEXT
)
BEGIN
    DECLARE v_record_id VARCHAR(36);
    
    -- Generate UUID
    SET v_record_id = UUID();
    
    -- Insert check-out record
    INSERT INTO check_in_out (record_id, user_id, equipment_id, type, timestamp, location, notes)
    VALUES (v_record_id, p_user_id, p_equipment_id, 'check_out', NOW(), p_location, p_notes);
    
    -- Return the new record ID
    SELECT v_record_id AS record_id;
END //

DELIMITER ;

-- ============================================================================
-- SECTION 6: USEFUL QUERIES
-- ============================================================================

-- Query 1: Find all equipment assigned to a specific user
-- SELECT * FROM equipment WHERE assigned_to = 'user-005';

-- Query 2: Get user's complete check-in/out history
-- SELECT * FROM view_checkin_out_history WHERE user_name = 'John Smith' ORDER BY timestamp DESC;

-- Query 3: Find equipment currently in use
-- SELECT name, assigned_to, status FROM equipment WHERE status = 'in_use';

-- Query 4: Chemical inventory report
-- SELECT name, quantity, unit, reorder_threshold, safety_level FROM chemicals ORDER BY safety_level DESC;

-- Query 5: List all overdue maintenance
-- SELECT * FROM view_overdue_maintenance;

-- Query 6: Equipment utilization statistics
-- SELECT * FROM view_equipment_utilization ORDER BY days_since_last_use ASC;

-- Query 7: User activity log
-- SELECT u.name, COUNT(*) as transaction_count, MAX(cio.timestamp) as last_activity
-- FROM check_in_out cio
-- JOIN users u ON cio.user_id = u.user_id
-- GROUP BY cio.user_id ORDER BY transaction_count DESC;

-- Query 8: Maintenance cost summary
-- SELECT equipment_id, SUM(parts_cost + labor_cost) as total_cost
-- FROM maintenance WHERE status = 'completed' GROUP BY equipment_id;

-- Query 9: Find expired or expiring chemicals
-- SELECT name, expiration_date, DATEDIFF(expiration_date, CURDATE()) as days_remaining
-- FROM chemicals WHERE expiration_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
-- ORDER BY expiration_date ASC;

-- Query 10: Active maintenance tasks
-- SELECT * FROM maintenance WHERE status IN ('pending', 'in_progress') ORDER BY maintenance_date ASC;

-- ============================================================================
-- SECTION 7: BACKUP AND RECOVERY NOTES
-- ============================================================================

-- Backup command (execute from terminal):
-- mysqldump -u username -p edutrack > edutrack_backup.sql

-- Restore command (execute from terminal):
-- mysql -u username -p edutrack < edutrack_backup.sql

-- Export specific table to CSV:
-- SELECT * INTO OUTFILE '/tmp/users_export.csv' FIELDS TERMINATED BY ',' FROM users;

-- ============================================================================
-- END OF SQL SCRIPT
-- ============================================================================
-- Created: December 2025
-- Version: 1.0
-- For: EduTrack Inventory Platform
-- ============================================================================
