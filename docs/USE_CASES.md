# Use Cases - EduTrack Inventory Platform

## Overview

This document describes the primary use cases for the EduTrack Inventory Platform, detailing the interactions between actors and the system to accomplish key business objectives.

---

## Use Case 1: Check-In/Check-Out System

### Actors
- **Lab User** (Primary)
- **System Admin** (Secondary)

### Description
Users scan QR codes to check in/out of the lab and associated equipment, creating an audit trail and enabling real-time tracking of asset location and availability.

### Preconditions
- User is authenticated in the system
- Equipment has been assigned a QR code
- User has permission to access the check-in/out feature

### Main Flow

1. **User initiates check-in/out action**
   - User navigates to the Check-In/Check-Out dashboard
   - User selects either "Check In" or "Check Out" option

2. **System displays QR scanner**
   - QR scanner interface loads
   - Camera permission is requested (if not already granted)

3. **User scans QR code**
   - User points device camera at equipment QR code
   - QR code is successfully scanned
   - System extracts equipment ID from QR data

4. **System processes transaction**
   - System validates equipment exists and is available
   - System validates user has appropriate permissions
   - System records timestamp and user information
   - System updates equipment status in real-time

5. **System provides confirmation**
   - Success message displayed with equipment details
   - Equipment status updated in dashboard
   - Notification sent to relevant parties
   - Transaction logged to database

### Alternative Flows

**A1: Invalid QR Code**
- Scanner detects invalid QR code format
- System displays error message
- User is prompted to scan again

**A2: Equipment Not Found**
- Equipment ID from QR code doesn't exist in system
- System alerts user and admin
- User is given option to contact admin

**A3: Permission Denied**
- User doesn't have permission to access equipment
- System displays access denied message
- Admin is notified of attempted unauthorized access

**A4: Equipment Unavailable**
- Equipment is already checked out or in maintenance
- System displays unavailability status
- User is informed of expected availability date

### Postconditions
- Equipment status is updated in real-time
- Check-in/out record is created and stored
- Relevant parties are notified
- Dashboard reflects the current state

### Business Rules
- Each check-out must be paired with a check-in
- Only authorized users can perform check-in/out
- All transactions are logged for audit purposes
- Equipment status must be updated within 5 seconds of scan

---

## Use Case 2: Equipment Management

### Actors
- **Lab Manager** (Primary)
- **Technician** (Primary)
- **System Admin** (Secondary)

### Description
Manage equipment status, maintenance schedules, and lifecycle events including equipment creation, updates, maintenance tracking, and retirement.

### Preconditions
- User has Lab Manager or Technician role
- Equipment database is accessible
- Maintenance schedule templates exist (optional)

### Main Flow

1. **Manager/Technician accesses Equipment Management**
   - User navigates to Equipment Management section
   - System displays current equipment inventory
   - Filters and search functionality available

2. **View Equipment Details**
   - User selects equipment from list
   - System displays comprehensive equipment information:
     - Equipment ID, name, category
     - Current status (available, in-use, maintenance, retired)
     - Location and last check-in/out
     - Maintenance history
     - QR code

3. **Update Equipment Status**
   - User marks equipment as in-use, maintenance, or retired
   - System validates status transition
   - Timestamp is recorded

4. **Schedule Maintenance**
   - User selects "Schedule Maintenance"
   - User selects maintenance type and due date
   - System creates maintenance task
   - Notifications sent to assigned technician

5. **Track Maintenance**
   - Technician views assigned maintenance tasks
   - Technician completes maintenance and records details:
     - Work performed
     - Parts replaced
     - Next maintenance date
     - Cost (if applicable)
   - System updates equipment status to "available"

6. **System provides confirmation**
   - Maintenance record is saved
   - Status updates reflected in real-time
   - Relevant personnel notified

### Alternative Flows

**A1: Equipment Not Found**
- Equipment ID doesn't exist in system
- System displays error
- User is provided with option to create new equipment

**A2: Invalid Status Transition**
- Equipment cannot transition to requested status
- System explains restrictions
- User is guided on valid next steps

### Postconditions
- Equipment records are up-to-date
- Maintenance schedule is maintained
- All changes are audited and logged
- Dashboard reflects current equipment state

### Business Rules
- Equipment cannot be checked out if in maintenance
- Maintenance schedule must be completed before equipment returns to service
- All status changes require user authentication
- Maintenance history must be retained for compliance

---

## Use Case 3: Chemical Inventory Tracking

### Actors
- **Safety Officer** (Primary)
- **Lab User** (Primary)
- **System Admin** (Secondary)

### Description
Monitor chemical usage and stock levels, manage chemical safety information, set reorder thresholds, and maintain compliance records.

### Preconditions
- User has appropriate permissions for chemical tracking
- Chemical database is populated
- Chemical Safety Data Sheets (SDS) are available

### Main Flow

1. **User accesses Chemical Inventory**
   - User navigates to Chemical Tracker dashboard
   - System displays current chemical inventory
   - Color-coded alerts for low stock, expired items

2. **View Chemical Details**
   - User selects chemical from inventory
   - System displays:
     - Chemical name, formula, CAS number
     - Current stock level and unit
     - Reorder threshold
     - Location(s)
     - Expiration date
     - Safety information and SDS link

3. **Record Chemical Usage**
   - Lab user logs chemical usage from dashboard
   - System records:
     - Quantity used
     - Purpose/project
     - User information
     - Timestamp
   - Stock level automatically decrements

4. **Monitor Stock Levels**
   - System continuously tracks stock levels
   - When stock reaches reorder threshold:
     - Safety Officer receives alert
     - Alert displayed in dashboard
     - Notification sent via email/SMS

5. **Reorder Chemicals**
   - Safety Officer reviews low-stock alerts
   - Safety Officer initiates reorder
   - System tracks reorder status

6. **Receive New Stock**
   - Safety Officer logs received shipment
   - System updates stock level
   - Expiration dates are recorded
   - Inventory updated in real-time

### Alternative Flows

**A1: Expired Chemical Detected**
- System identifies expired chemical
- Automatic alert generated
- Safety Officer notified
- Chemical marked as unavailable

**A2: Stock Discrepancy**
- Physical count differs from system record
- Safety Officer performs inventory reconciliation
- System updates records with variance note

**A3: Safety Concern Identified**
- Hazardous chemical near low stock
- System escalates alert to Safety Officer
- Additional approval required for usage

### Postconditions
- Chemical inventory is accurate and current
- Safety alerts are active and monitored
- Usage history is documented
- Reorder process is initiated when needed

### Business Rules
- All chemical usage must be logged
- Expired chemicals must be flagged immediately
- Stock thresholds configured by Safety Officer
- Hazardous chemicals require special handling documentation
- Compliance records maintained for regulatory requirements

---

## Use Case 4: User Management & Permissions

### Actors
- **System Admin** (Primary)
- **Organization Manager** (Secondary)

### Description
Manage user accounts, assign roles, and control access to system features and data based on organizational hierarchy and responsibilities.

### Preconditions
- User is System Admin
- User management interface is accessible
- Role templates are defined

### Main Flow

1. **Admin accesses User Management**
   - Admin navigates to User Management section
   - System displays list of users with current roles

2. **View User Details**
   - Admin selects user from list
   - System displays:
     - User name, email, department
     - Current roles and permissions
     - Last login and activity
     - Account status

3. **Create New User**
   - Admin clicks "Add New User"
   - Admin enters user information:
     - Name, email, department
     - Role assignment
   - System sends invitation email to user
   - User sets password and completes onboarding

4. **Update User Permissions**
   - Admin selects user to modify
   - Admin selects new role:
     - Lab User (basic access)
     - Lab Manager (equipment management)
     - Safety Officer (chemical tracking)
     - Technician (maintenance)
     - System Admin (full access)
   - System applies new permissions immediately

5. **Manage Role Definitions**
   - Admin can view/edit role templates
   - Admin configures feature access per role
   - Admin sets data visibility rules per role

6. **Audit User Activity**
   - Admin views user activity logs
   - System displays:
     - Login timestamps
     - Actions performed
     - Data accessed
   - Filters available by date, user, action type

### Alternative Flows

**A1: Duplicate User Email**
- System detects email already in use
- Admin prompted to use different email
- Option to merge accounts if appropriate

**A2: User Deactivation**
- Admin marks user as inactive
- User access immediately revoked
- Historical data retained for audit

### Postconditions
- User accounts are properly configured
- Role-based access control is enforced
- Activity is logged and auditable
- Permission changes take effect immediately

### Business Rules
- Each user must have at least one role
- System Admin role cannot be deleted
- Permission changes are logged with timestamp and admin ID
- Users are notified of role changes via email
- Inactive users are logged out automatically

---

## Use Case 5: Reporting & Analytics

### Actors
- **Lab Manager** (Primary)
- **System Admin** (Primary)
- **Safety Officer** (Secondary)

### Description
Generate comprehensive reports on equipment usage, maintenance schedules, chemical inventory, and system analytics to support decision-making and compliance.

### Preconditions
- User has Lab Manager or Admin role
- Historical data exists in system
- Report templates are available

### Main Flow

1. **User accesses Reporting Dashboard**
   - User navigates to Reports section
   - System displays available report types
   - Dashboard shows key metrics and KPIs

2. **Select Report Type**
   - User selects from report options:
     - Equipment Usage Report
     - Maintenance Schedule Report
     - Chemical Inventory Report
     - User Activity Report
     - System Performance Report
     - Custom Report Builder

3. **Configure Report Parameters**
   - User sets report criteria:
     - Date range
     - Equipment/Chemical filters
     - Grouping options (by user, location, category)
     - Metric selection
   - User previews report

4. **Generate Report**
   - System aggregates data from database
   - System calculates metrics and statistics
   - System formats report
   - Real-time data included

5. **View & Export Report**
   - Report displayed in dashboard
   - System provides export options:
     - PDF download
     - Excel spreadsheet
     - CSV format
     - Email delivery
   - Charts and graphs included

6. **Schedule Reports**
   - User can schedule recurring reports
   - System generates and emails automatically
   - Schedule maintained until cancelled

### Report Types

**Equipment Usage Report**
- Total check-ins/outs per equipment
- Peak usage times
- Most/least used equipment
- Average utilization rate
- Equipment downtime statistics

**Maintenance Schedule Report**
- Upcoming maintenance tasks
- Overdue maintenance
- Maintenance completion rates
- Average time-to-repair
- Maintenance cost analysis

**Chemical Inventory Report**
- Current stock levels
- Usage trends by chemical
- Reorder frequency
- Chemical waste/disposal
- Compliance status

**User Activity Report**
- User login frequency
- Feature usage statistics
- Data access patterns
- User training completion
- Permission usage

**System Performance Report**
- System uptime
- Response times
- Database performance
- Error rates
- User concurrent access

### Alternative Flows

**A1: Custom Report Creation**
- User builds custom report with selected fields
- System saves as template for reuse
- User can share template with others

**A2: Report Export Error**
- Export fails (e.g., large dataset)
- System emails report instead
- User notified of completion

### Postconditions
- Reports are generated and available
- Data is exportable in multiple formats
- Historical records are preserved
- Insights support decision-making

### Business Rules
- Reports contain only data user has access to
- Historical reports are archived
- Report generation is logged for audit
- Large reports are processed asynchronously
- Data older than 7 years may be archived

---

## Summary Table

| Use Case | Primary Actors | Key Features | Frequency |
|----------|---|---|---|
| Check-In/Check-Out | Lab User, Admin | QR scanning, status tracking, audit trail | Multiple times daily |
| Equipment Management | Lab Manager, Technician | Status tracking, maintenance scheduling, lifecycle management | Daily |
| Chemical Inventory | Safety Officer, Lab User | Stock tracking, usage logging, compliance | Daily |
| User Management | System Admin | Role assignment, permission control, activity audit | Weekly |
| Reporting & Analytics | Lab Manager, Admin | Report generation, data export, KPI tracking | Weekly/Monthly |

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Related Documentation:** PROJECT_INFO.md, ARCHITECTURE_DOCUMENTATION.md
