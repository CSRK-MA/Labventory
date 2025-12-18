# Sample SQL Queries - EduTrack Database

**Document:** Sample SQL queries for reporting and analysis  
**Last Updated:** December 2025  
**Database:** Firebase Firestore (with SQL-equivalent operations)

---

## 📋 Table of Contents

1. [Query 1: Active Users (Last 7 Days)](#query-1-active-users-last-7-days)
2. [Query 2: Equipment Maintenance Schedule](#query-2-equipment-maintenance-schedule)
3. [Query 3: Chemical Inventory Status](#query-3-chemical-inventory-status)
4. [Query 4: Most Used Equipment](#query-4-most-used-equipment)
5. [Query 5: Overdue Check-Outs](#query-5-overdue-check-outs)
6. [Firestore Equivalents](#firestore-equivalents)

---

## Query 1: Active Users (Last 7 Days)

### SQL Query

```sql
-- Query 1: Active users with check-in activity in the last 7 days
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.role,
    COUNT(c.id) as total_check_ins,
    MAX(c.timestamp) as last_activity
FROM users u
INNER JOIN check_in_out c ON u.user_id = c.user_id
WHERE c.timestamp > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY u.user_id, u.name, u.email, u.role
ORDER BY total_check_ins DESC;
```

### Expected Output

```
+--------+------------------+------------------------------+--------+-----------------+---------------------+
| user_id| name             | email                        | role   | total_check_ins | last_activity       |
+--------+------------------+------------------------------+--------+-----------------+---------------------+
| U001   | Dr. Alice Smith  | alice.smith@lab.edu           | admin  | 12              | 2025-12-07 14:30:00 |
| U002   | John Anderson    | john.anderson@lab.edu         | teacher| 8               | 2025-12-07 13:45:00 |
| U003   | Sarah Johnson    | sarah.johnson@lab.edu         | lab-asst| 15             | 2025-12-07 15:20:00 |
| U004   | Mike Chen        | mike.chen@student.edu         | student| 3               | 2025-12-06 10:15:00 |
| U005   | Emma Davis       | emma.davis@student.edu        | student| 5               | 2025-12-07 09:30:00 |
+--------+------------------+------------------------------+--------+-----------------+---------------------+

5 rows in set (0.015 sec)
```

### Query Purpose & Insights

| Metric | Purpose |
|--------|---------|
| **total_check_ins** | Identifies most active users |
| **last_activity** | Tracks current engagement levels |
| **role** | Analyzes usage by user type |
| **Time range** | Last 7 days filters recent activity |

### Use Cases

- Monitor lab usage patterns
- Identify inactive users
- Track staff engagement
- Generate usage reports

---

## Query 2: Equipment Maintenance Schedule

### SQL Query

```sql
-- Query 2: Equipment requiring maintenance (overdue by 90+ days)
SELECT 
    e.equipment_id,
    e.name,
    e.category,
    e.status,
    e.last_maintenance,
    DATEDIFF(NOW(), e.last_maintenance) as days_since_maintenance,
    CASE 
        WHEN DATEDIFF(NOW(), e.last_maintenance) > 180 THEN 'Critical'
        WHEN DATEDIFF(NOW(), e.last_maintenance) > 90 THEN 'Urgent'
        ELSE 'Upcoming'
    END as maintenance_priority,
    m.total_maintenance_records
FROM equipment e
LEFT JOIN (
    SELECT equipment_id, COUNT(*) as total_maintenance_records
    FROM maintenance
    GROUP BY equipment_id
) m ON e.equipment_id = m.equipment_id
WHERE DATEDIFF(NOW(), e.last_maintenance) > 90
ORDER BY days_since_maintenance DESC;
```

### Expected Output

```
+--------------+------------------------+------------+-----------+-------------------+------------------------+---------------------+-----------------------------+
| equipment_id | name                   | category   | status    | last_maintenance  | days_since_maintenance | maintenance_priority | total_maintenance_records |
+--------------+------------------------+------------+-----------+-------------------+------------------------+---------------------+-----------------------------+
| EQ001        | Bunsen Burner - Lab A  | heating    | Available | 2025-05-10        | 211                    | Critical            | 8                          |
| EQ002        | Microscope - Lab B     | analysis   | Available | 2025-06-15        | 175                    | Critical            | 12                         |
| EQ003        | Centrifuge - Lab C     | separation | Available | 2025-08-01        | 128                    | Urgent              | 5                          |
| EQ004        | Spectrophotometer - Lab A| analysis  | Available | 2025-07-20        | 140                    | Urgent              | 6                          |
| EQ005        | Balance Scale - Lab B  | measuring  | Available | 2025-06-30        | 160                    | Urgent              | 4                          |
+--------------+------------------------+------------+-----------+-------------------+------------------------+---------------------+-----------------------------+

5 rows in set (0.022 sec)
```

### Query Purpose & Insights

| Metric | Purpose |
|--------|---------|
| **days_since_maintenance** | Quantifies maintenance gap |
| **maintenance_priority** | Categorizes urgency (Critical/Urgent/Upcoming) |
| **total_maintenance_records** | Shows maintenance history depth |
| **status** | Ensures item is not already retired |

### Use Cases

- Schedule preventive maintenance
- Identify equipment requiring immediate attention
- Plan maintenance budgets
- Track maintenance frequency

---

## Query 3: Chemical Inventory Status

### SQL Query

```sql
-- Query 3: Chemical inventory with expiry tracking
SELECT 
    ch.chemical_id,
    ch.name,
    ch.formula,
    ch.quantity,
    ch.unit,
    ch.hazard_level,
    ch.expiry_date,
    DATEDIFF(ch.expiry_date, NOW()) as days_until_expiry,
    CASE 
        WHEN DATEDIFF(ch.expiry_date, NOW()) < 0 THEN 'EXPIRED'
        WHEN DATEDIFF(ch.expiry_date, NOW()) < 30 THEN 'Critical (< 30 days)'
        WHEN DATEDIFF(ch.expiry_date, NOW()) < 90 THEN 'Warning (< 90 days)'
        ELSE 'Safe'
    END as expiry_status,
    ch.location,
    ch.supplier
FROM chemicals ch
WHERE ch.quantity > 0
ORDER BY DATEDIFF(ch.expiry_date, NOW()) ASC;
```

### Expected Output

```
+------------+-----------------------------+----------+----------+------+--------------+---------------------+-------------------+-----------------------+-----------+-------------------+
| chemical_id| name                        | formula  | quantity | unit | hazard_level | expiry_date         | days_until_expiry | expiry_status         | location  | supplier          |
+------------+-----------------------------+----------+----------+------+--------------+---------------------+-------------------+-----------------------+-----------+-------------------+
| CH001      | Sodium Hydroxide            | NaOH     | 500      | mL   | High         | 2025-12-15          | 8                 | Critical (< 30 days)  | Lab A-01  | ChemSupply Inc    |
| CH002      | Hydrochloric Acid           | HCl      | 250      | mL   | High         | 2025-12-28          | 21                | Critical (< 30 days)  | Lab B-02  | ChemSupply Inc    |
| CH003      | Ethanol (95%)               | C2H5OH   | 1000     | mL   | Medium       | 2026-02-14          | 69                | Warning (< 90 days)   | Lab C-03  | BioChemicals Ltd  |
| CH004      | Acetone                     | C3H6O    | 750      | mL   | Medium       | 2026-05-10          | 155               | Safe                  | Lab A-04  | PureLabs Corp     |
| CH005      | Methanol                    | CH3OH    | 500      | mL   | High         | 2026-06-30          | 176               | Safe                  | Lab B-01  | ChemSupply Inc    |
+------------+-----------------------------+----------+----------+------+--------------+---------------------+-------------------+-----------------------+-----------+-------------------+

5 rows in set (0.018 sec)
```

### Query Purpose & Insights

| Metric | Purpose |
|--------|---------|
| **days_until_expiry** | Quantifies remaining shelf life |
| **expiry_status** | Categorizes chemical safety status |
| **hazard_level** | Prioritizes high-risk chemicals |
| **quantity** | Filters out depleted items |

### Use Cases

- Track chemical expiry dates
- Prevent use of expired chemicals
- Plan procurement schedules
- Ensure lab safety compliance

---

## Query 4: Most Used Equipment

### SQL Query

```sql
-- Query 4: Equipment usage statistics (last 30 days)
SELECT 
    e.equipment_id,
    e.name,
    e.category,
    e.location,
    COUNT(c.id) as total_check_outs,
    COUNT(DISTINCT c.user_id) as unique_users,
    AVG(TIMESTAMPDIFF(HOUR, c.check_out_time, c.check_in_time)) as avg_usage_hours,
    MIN(c.check_out_time) as first_use,
    MAX(c.check_out_time) as last_use
FROM equipment e
LEFT JOIN check_in_out c ON e.equipment_id = c.equipment_id 
    AND c.check_out_time > DATE_SUB(NOW(), INTERVAL 30 DAY)
    AND c.action = 'check-out'
GROUP BY e.equipment_id, e.name, e.category, e.location
HAVING total_check_outs > 0
ORDER BY total_check_outs DESC;
```

### Expected Output

```
+--------------+------------------------+----------+----------+-----------------+---------------+------------------+---------------------+---------------------+
| equipment_id | name                   | category | location | total_check_outs| unique_users  | avg_usage_hours  | first_use           | last_use            |
+--------------+------------------------+----------+----------+-----------------+---------------+------------------+---------------------+---------------------+
| EQ001        | Bunsen Burner - Lab A  | heating  | Lab A-01 | 28              | 12            | 2.5              | 2025-11-10 09:00:00 | 2025-12-07 14:30:00 |
| EQ002        | Microscope - Lab B     | analysis | Lab B-02 | 24              | 8             | 1.8              | 2025-11-12 10:15:00 | 2025-12-07 13:45:00 |
| EQ003        | Centrifuge - Lab C     | separation| Lab C-03 | 18              | 7             | 3.2              | 2025-11-15 11:30:00 | 2025-12-06 15:20:00 |
| EQ004        | Spectrophotometer      | analysis | Lab A-04 | 15              | 6             | 1.5              | 2025-11-20 08:00:00 | 2025-12-07 09:30:00 |
| EQ005        | Balance Scale - Lab B  | measuring| Lab B-01 | 12              | 9             | 0.75             | 2025-11-25 14:00:00 | 2025-12-05 16:45:00 |
+--------------+------------------------+----------+----------+-----------------+---------------+------------------+---------------------+---------------------+

5 rows in set (0.025 sec)
```

### Query Purpose & Insights

| Metric | Purpose |
|--------|---------|
| **total_check_outs** | Measures equipment popularity |
| **unique_users** | Shows user reach of equipment |
| **avg_usage_hours** | Indicates typical session length |
| **time range** | Last 30 days focuses on recent usage |

### Use Cases

- Identify heavily used equipment
- Plan replacement/expansion needs
- Optimize equipment distribution
- Track resource utilization

---

## Query 5: Overdue Check-Outs

### SQL Query

```sql
-- Query 5: Equipment checked out beyond expected return time
SELECT 
    c.id as checkout_id,
    u.name as user_name,
    u.email,
    e.name as equipment_name,
    e.equipment_id,
    c.check_out_time,
    c.expected_return_time,
    NOW() as current_time,
    TIMESTAMPDIFF(DAY, c.expected_return_time, NOW()) as days_overdue,
    TIMESTAMPDIFF(HOUR, c.expected_return_time, NOW()) as hours_overdue,
    CASE 
        WHEN TIMESTAMPDIFF(DAY, c.expected_return_time, NOW()) > 7 THEN 'Critical'
        WHEN TIMESTAMPDIFF(DAY, c.expected_return_time, NOW()) > 3 THEN 'Urgent'
        ELSE 'Overdue'
    END as overdue_status
FROM check_in_out c
INNER JOIN users u ON c.user_id = u.user_id
INNER JOIN equipment e ON c.equipment_id = e.equipment_id
WHERE c.check_in_time IS NULL 
    AND c.expected_return_time < NOW()
ORDER BY days_overdue DESC;
```

### Expected Output

```
+------------+------------------+----------------------+------------------------+----------+--------------------------+------------------------+---------------------+---------------+---------------+-------------------+
| checkout_id| user_name        | email                | equipment_name         | equip_id | check_out_time           | expected_return_time   | current_time        | days_overdue  | hours_overdue | overdue_status    |
+------------+------------------+----------------------+------------------------+----------+--------------------------+------------------------+---------------------+---------------+---------------+-------------------+
| CO001      | Mike Chen        | mike.chen@student.edu| Spectrophotometer      | EQ004    | 2025-11-28 09:00:00      | 2025-12-01 09:00:00    | 2025-12-07 15:30:00 | 6             | 150           | Critical          |
| CO002      | Emma Davis       | emma.davis@student.ed| Balance Scale - Lab B   | EQ005    | 2025-11-30 10:00:00      | 2025-12-03 10:00:00    | 2025-12-07 15:30:00 | 4             | 101           | Urgent            |
| CO003      | Alex Martinez    | alex.martinez@lab.ed | Bunsen Burner - Lab A   | EQ001    | 2025-12-04 14:00:00      | 2025-12-05 14:00:00    | 2025-12-07 15:30:00 | 2             | 49            | Overdue           |
+------------+------------------+----------------------+------------------------+----------+--------------------------+------------------------+---------------------+---------------+---------------+-------------------+

3 rows in set (0.020 sec)
```

### Query Purpose & Insights

| Metric | Purpose |
|--------|---------|
| **days_overdue** | Measures extent of delay |
| **overdue_status** | Prioritizes follow-up actions |
| **user contact** | Enables user notifications |
| **equipment_id** | Identifies missing items |

### Use Cases

- Send overdue reminders to users
- Recover missing equipment
- Enforce checkout policies
- Track accountability

---

## Firestore Equivalents

Since EduTrack uses Firebase Firestore, here are the equivalent queries using Firestore's API:

### Query 1: Active Users (Last 7 Days) - Firestore

```javascript
// Firestore equivalent of SQL Query 1
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

async function getActiveUsers() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const checkInOutRef = collection(db, 'check_in_out');
  const q = query(
    checkInOutRef,
    where('timestamp', '>=', sevenDaysAgo),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  // Aggregate results in client code
  const userActivity = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!userActivity[data.userId]) {
      userActivity[data.userId] = {
        checkIns: 0,
        lastActivity: data.timestamp
      };
    }
    userActivity[data.userId].checkIns++;
  });
  
  return userActivity;
}
```

### Query 2: Equipment Maintenance - Firestore

```javascript
// Firestore equivalent of SQL Query 2
async function getEquipmentNeedingMaintenance() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  const equipmentRef = collection(db, 'equipment');
  const q = query(
    equipmentRef,
    where('lastMaintenance', '<', ninetyDaysAgo),
    orderBy('lastMaintenance', 'asc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    daysSinceMaintenance: Math.floor(
      (Date.now() - doc.data().lastMaintenance.toDate()) / (1000 * 60 * 60 * 24)
    )
  }));
}
```

### Query 3: Chemical Inventory - Firestore

```javascript
// Firestore equivalent of SQL Query 3
async function getChemicalExpiryStatus() {
  const chemicalRef = collection(db, 'chemicals');
  const q = query(
    chemicalRef,
    where('quantity', '>', 0),
    orderBy('expiryDate', 'asc')
  );
  
  const snapshot = await getDocs(q);
  const now = new Date();
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const expiryDate = data.expiryDate.toDate();
    const daysUntilExpiry = Math.floor(
      (expiryDate - now) / (1000 * 60 * 60 * 24)
    );
    
    let expiryStatus = 'Safe';
    if (daysUntilExpiry < 0) expiryStatus = 'EXPIRED';
    else if (daysUntilExpiry < 30) expiryStatus = 'Critical (< 30 days)';
    else if (daysUntilExpiry < 90) expiryStatus = 'Warning (< 90 days)';
    
    return {
      id: doc.id,
      ...data,
      daysUntilExpiry,
      expiryStatus
    };
  });
}
```

### Query 4: Most Used Equipment - Firestore

```javascript
// Firestore equivalent of SQL Query 4
async function getMostUsedEquipment(days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const checkInOutRef = collection(db, 'check_in_out');
  const q = query(
    checkInOutRef,
    where('checkOutTime', '>=', startDate),
    where('action', '==', 'check-out'),
    orderBy('checkOutTime', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  // Aggregate usage statistics
  const equipmentUsage = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    const equipId = data.equipmentId;
    
    if (!equipmentUsage[equipId]) {
      equipmentUsage[equipId] = {
        totalCheckouts: 0,
        uniqueUsers: new Set(),
        firstUse: data.checkOutTime,
        lastUse: data.checkOutTime
      };
    }
    
    equipmentUsage[equipId].totalCheckouts++;
    equipmentUsage[equipId].uniqueUsers.add(data.userId);
    equipmentUsage[equipId].lastUse = data.checkOutTime;
  });
  
  return equipmentUsage;
}
```

### Query 5: Overdue Check-Outs - Firestore

```javascript
// Firestore equivalent of SQL Query 5
async function getOverdueCheckouts() {
  const checkInOutRef = collection(db, 'check_in_out');
  const now = new Date();
  
  const q = query(
    checkInOutRef,
    where('checkInTime', '==', null),
    where('expectedReturnTime', '<', now),
    orderBy('expectedReturnTime', 'asc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const expectedReturn = data.expectedReturnTime.toDate();
    const daysOverdue = Math.floor(
      (now - expectedReturn) / (1000 * 60 * 60 * 24)
    );
    const hoursOverdue = Math.floor(
      (now - expectedReturn) / (1000 * 60 * 60)
    );
    
    let overdueStatus = 'Overdue';
    if (daysOverdue > 7) overdueStatus = 'Critical';
    else if (daysOverdue > 3) overdueStatus = 'Urgent';
    
    return {
      id: doc.id,
      ...data,
      daysOverdue,
      hoursOverdue,
      overdueStatus
    };
  });
}
```

---

## Key Statistics from Sample Data

### Summary Metrics

| Metric | Value | Insight |
|--------|-------|---------|
| **Total Active Users (7 days)** | 5 | Moderate lab engagement |
| **Equipment Needing Maintenance** | 5 | ~25% of inventory needs attention |
| **Chemical Expiry Issues** | 2 critical, 1 warning | Safety protocol review needed |
| **Equipment Usage Concentration** | Top 5 = 97 checkouts | High utilization of core equipment |
| **Overdue Checkouts** | 3 items | Equipment recovery action needed |

### Performance Insights

- **Busiest Users:** Lab assistants have highest checkout frequency
- **Most Used Equipment:** Bunsen burners and microscopes (heating/analysis)
- **Critical Issues:** 2 chemical expiries within 30 days require immediate action
- **Maintenance Backlog:** 211 days since last maintenance on oldest item

---

## How to Run These Queries

### Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Click **Run a new query**
5. Use the Firestore query builder to filter collections
6. See JavaScript code examples above for programmatic approach

### Using Firebase Admin SDK

```javascript
const admin = require('firebase-admin');

const db = admin.firestore();

// Example: Run Query 2
async function runMaintenanceQuery() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  const snapshot = await db.collection('equipment')
    .where('lastMaintenance', '<', ninetyDaysAgo)
    .orderBy('lastMaintenance', 'asc')
    .get();
  
  console.log(`Found ${snapshot.size} equipment items needing maintenance`);
  snapshot.forEach(doc => {
    console.log(doc.data());
  });
}
```

---

## Notes & Best Practices

### Query Optimization

- **Index Usage:** Firestore automatically creates indexes for common queries
- **Pagination:** Implement pagination for large result sets
- **Real-time Updates:** Use `onSnapshot()` for live data instead of polling

### Sample Data Limitations

- Sample outputs use realistic but generated data
- Actual results vary based on your lab's specific equipment and usage
- Timestamps reflect current date (December 7, 2025 simulations)

### Security Considerations

- Ensure Firestore security rules match query access patterns
- Restrict sensitive data (chemical quantities, user contact info)
- Audit access to equipment and chemical data
- See `src/firestore.rules` for implemented security rules

---

## Related Documentation

- `docs/DATABASE_SCHEMA.sql` — Database schema reference
- `docs/ER_DIAGRAM.md` — Entity relationship diagram
- `docs/FIREBASE_INTEGRATION_SUMMARY.md` — Firebase data structure details
- `src/services/firebaseService.ts` — Service layer queries

---

**Last Updated:** December 2025  
**Sample Data Generated:** For illustration purposes  
**Firestore API Version:** v9+  
**Firebase SDK:** 12.6.0+
