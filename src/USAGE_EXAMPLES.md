# Firebase Helper Functions - Usage Examples
## Complete Code Examples for Lab Inventory Management

---

## 📚 Table of Contents

1. [Basic CRUD Operations](#basic-crud-operations)
2. [Filtering and Querying](#filtering-and-querying)
3. [Search Operations](#search-operations)
4. [Statistics and Analytics](#statistics-and-analytics)
5. [Real-World Use Cases](#real-world-use-cases)
6. [React Component Examples](#react-component-examples)
7. [Error Handling](#error-handling)

---

## Basic CRUD Operations

### CREATE: Add Equipment

```javascript
import { addEquipment } from './services/firebaseHelpers';

// Example 1: Add basic equipment
async function addBasicEquipment() {
  try {
    const newEquipment = await addEquipment({
      itemName: "Digital Microscope",
      itemCode: "EQ-MICRO-001",
      category: "Instruments",
      status: "available",
      condition: "excellent"
    });
    
    console.log('Equipment added:', newEquipment);
    alert(`Added: ${newEquipment.itemName} (ID: ${newEquipment.id})`);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add equipment');
  }
}

// Example 2: Add complete equipment with all fields
async function addCompleteEquipment() {
  try {
    const equipment = await addEquipment({
      itemName: "Digital pH Meter",
      itemCode: "EQ-PH-001",
      category: "Instruments",
      brand: "Mettler Toledo",
      model: "SevenCompact S220",
      serialNumber: "SN12345678",
      purchasePrice: 1250.00,
      condition: "excellent",
      status: "available",
      location: "Chemistry Lab, Shelf A-12",
      description: "High precision pH meter with automatic temperature compensation. Includes electrode and calibration solutions."
    });
    
    console.log('Complete equipment added:', equipment);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Add multiple equipment items
import { batchAddEquipment } from './services/firebaseHelpers';

async function addMultipleItems() {
  const equipmentList = [
    { itemName: "Beaker 250ml", itemCode: "EQ-BKR-001", category: "Glassware", status: "available" },
    { itemName: "Beaker 500ml", itemCode: "EQ-BKR-002", category: "Glassware", status: "available" },
    { itemName: "Test Tube", itemCode: "EQ-TT-001", category: "Glassware", status: "available" }
  ];

  try {
    const addedItems = await batchAddEquipment(equipmentList);
    console.log(`Added ${addedItems.length} items`);
  } catch (error) {
    console.error('Batch add failed:', error);
  }
}
```

### READ: Get Equipment

```javascript
import { 
  getAllEquipment, 
  getEquipmentById 
} from './services/firebaseHelpers';

// Example 1: Get all equipment
async function loadAllEquipment() {
  try {
    const equipment = await getAllEquipment();
    console.log('Total equipment:', equipment.length);
    equipment.forEach(item => {
      console.log(`${item.itemCode}: ${item.itemName} - ${item.status}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Get equipment by ID
async function loadEquipmentById(equipmentId) {
  try {
    const equipment = await getEquipmentById(equipmentId);
    
    if (equipment) {
      console.log('Found:', equipment);
      console.log(`Name: ${equipment.itemName}`);
      console.log(`Code: ${equipment.itemCode}`);
      console.log(`Status: ${equipment.status}`);
    } else {
      console.log('Equipment not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Get limited number of items
async function loadRecentEquipment() {
  try {
    const recentEquipment = await getAllEquipment({ limit: 10 });
    console.log('Recent 10 items:', recentEquipment);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### UPDATE: Modify Equipment

```javascript
import { 
  updateEquipment, 
  updateEquipmentStatus 
} from './services/firebaseHelpers';

// Example 1: Update equipment details
async function editEquipment(equipmentId) {
  try {
    const updated = await updateEquipment(equipmentId, {
      location: "Biology Lab, Cabinet B-5",
      condition: "good",
      description: "Updated description with new information"
    });
    
    console.log('Updated equipment:', updated);
    alert('Equipment updated successfully');
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to update equipment');
  }
}

// Example 2: Update only status (quick status change)
async function checkOutEquipment(equipmentId) {
  try {
    await updateEquipmentStatus(equipmentId, 'in-use');
    console.log('Equipment checked out');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function sendToMaintenance(equipmentId) {
  try {
    await updateEquipmentStatus(equipmentId, 'maintenance');
    console.log('Equipment sent to maintenance');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function returnEquipment(equipmentId) {
  try {
    await updateEquipmentStatus(equipmentId, 'available');
    console.log('Equipment returned and available');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### DELETE: Remove Equipment

```javascript
import { deleteEquipment } from './services/firebaseHelpers';

// Example 1: Delete with confirmation
async function removeEquipment(equipmentId, itemName) {
  const confirmed = confirm(`Are you sure you want to delete "${itemName}"?\nThis action cannot be undone.`);
  
  if (!confirmed) {
    console.log('Deletion cancelled');
    return;
  }

  try {
    await deleteEquipment(equipmentId);
    console.log('Equipment deleted successfully');
    alert(`${itemName} has been deleted`);
  } catch (error) {
    console.error('Error deleting equipment:', error);
    alert('Failed to delete equipment');
  }
}

// Example 2: Delete multiple items
async function bulkDelete(equipmentIds) {
  const confirmed = confirm(`Delete ${equipmentIds.length} items?`);
  if (!confirmed) return;

  try {
    const promises = equipmentIds.map(id => deleteEquipment(id));
    await Promise.all(promises);
    console.log(`Deleted ${equipmentIds.length} items`);
  } catch (error) {
    console.error('Bulk delete failed:', error);
  }
}
```

---

## Filtering and Querying

### Filter by Status

```javascript
import { getAllEquipment } from './services/firebaseHelpers';

// Get only available equipment
async function getAvailableEquipment() {
  const available = await getAllEquipment({ status: 'available' });
  console.log('Available equipment:', available.length);
  return available;
}

// Get equipment in maintenance
async function getMaintenanceEquipment() {
  const maintenance = await getAllEquipment({ status: 'maintenance' });
  console.log('In maintenance:', maintenance.length);
  return maintenance;
}

// Get equipment currently in use
async function getInUseEquipment() {
  const inUse = await getAllEquipment({ status: 'in-use' });
  console.log('Currently in use:', inUse.length);
  return inUse;
}
```

### Filter by Category

```javascript
// Get all instruments
async function getInstruments() {
  const instruments = await getAllEquipment({ category: 'Instruments' });
  console.log('Instruments:', instruments);
  return instruments;
}

// Get all glassware
async function getGlassware() {
  const glassware = await getAllEquipment({ category: 'Glassware' });
  console.log('Glassware:', glassware);
  return glassware;
}
```

### Combine Multiple Filters

```javascript
// Get available instruments only
async function getAvailableInstruments() {
  const allInstruments = await getAllEquipment({ category: 'Instruments' });
  const available = allInstruments.filter(item => item.status === 'available');
  console.log('Available instruments:', available);
  return available;
}

// Get equipment by price range (client-side filtering)
async function getExpensiveEquipment(minPrice = 1000) {
  const allEquipment = await getAllEquipment();
  const expensive = allEquipment.filter(item => item.purchasePrice >= minPrice);
  console.log(`Equipment over $${minPrice}:`, expensive.length);
  return expensive;
}
```

---

## Search Operations

### Basic Search

```javascript
import { searchEquipment } from './services/firebaseHelpers';

// Search by name
async function searchByName(searchTerm) {
  try {
    const results = await searchEquipment(searchTerm);
    console.log(`Found ${results.length} items matching "${searchTerm}"`);
    
    results.forEach(item => {
      console.log(`- ${item.itemName} (${item.itemCode})`);
    });
    
    return results;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

// Examples
searchByName('microscope');
searchByName('pH');
searchByName('EQ-');
```

### Advanced Search

```javascript
// Search with live results
function LiveSearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchEquipment(searchTerm);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearching(false);
      }
    }, 300); // Wait 300ms after typing stops

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search equipment..."
      />
      {searching && <div>Searching...</div>}
      <div>
        {results.map(item => (
          <div key={item.id}>{item.itemName}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## Statistics and Analytics

### Equipment Statistics

```javascript
import { getEquipmentStats } from './services/firebaseHelpers';

async function displayEquipmentStats() {
  try {
    const stats = await getEquipmentStats();
    
    console.log('=== Equipment Statistics ===');
    console.log(`Total Items: ${stats.total}`);
    console.log(`Available: ${stats.available}`);
    console.log(`In Use: ${stats.inUse}`);
    console.log(`Maintenance: ${stats.maintenance}`);
    console.log(`Retired: ${stats.retired}`);
    console.log(`Total Value: $${stats.totalValue.toFixed(2)}`);
    
    console.log('\nBy Category:');
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
  }
}

// Dashboard display
function EquipmentDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const data = await getEquipmentStats();
    setStats(data);
  }

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total" value={stats.total} color="blue" />
      <StatCard title="Available" value={stats.available} color="green" />
      <StatCard title="In Use" value={stats.inUse} color="orange" />
      <StatCard title="Maintenance" value={stats.maintenance} color="red" />
    </div>
  );
}
```

### Chemical Statistics

```javascript
import { getChemicalStats } from './services/firebaseHelpers';

async function displayChemicalStats() {
  try {
    const stats = await getChemicalStats();
    
    console.log('=== Chemical Statistics ===');
    console.log(`Total Chemicals: ${stats.total}`);
    console.log(`Low Stock: ${stats.lowStock}`);
    console.log(`Expiring Soon: ${stats.expiringSoon}`);
    
    console.log('\nBy Hazard Level:');
    Object.entries(stats.byHazardLevel).forEach(([level, count]) => {
      console.log(`  ${level}: ${count}`);
    });
    
    return stats;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## Real-World Use Cases

### Use Case 1: Equipment Check-Out System

```javascript
import { 
  getEquipmentById, 
  updateEquipmentStatus,
  createCheckInOut 
} from './services/firebaseHelpers';

async function checkOutEquipmentToStudent(equipmentId, studentId, purpose) {
  try {
    // 1. Get equipment details
    const equipment = await getEquipmentById(equipmentId);
    
    if (!equipment) {
      throw new Error('Equipment not found');
    }
    
    // 2. Check if available
    if (equipment.status !== 'available') {
      throw new Error(`Equipment is ${equipment.status}, not available`);
    }
    
    // 3. Update status to in-use
    await updateEquipmentStatus(equipmentId, 'in-use');
    
    // 4. Create check-out transaction
    const transaction = await createCheckInOut({
      itemType: 'equipment',
      itemId: equipmentId,
      userId: studentId,
      action: 'check-out',
      purpose: purpose,
      checkOutTime: new Date(),
      expectedReturnTime: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours
    });
    
    console.log('Check-out successful:', transaction);
    alert(`${equipment.itemName} checked out successfully`);
    
    return transaction;
  } catch (error) {
    console.error('Check-out failed:', error);
    alert(`Check-out failed: ${error.message}`);
    throw error;
  }
}

// Usage
checkOutEquipmentToStudent('eq-123', 'student-456', 'Chemistry Lab Experiment');
```

### Use Case 2: Low Stock Alert System

```javascript
import { getLowStockChemicals } from './services/firebaseHelpers';

async function checkAndAlertLowStock() {
  try {
    const lowStockItems = await getLowStockChemicals();
    
    if (lowStockItems.length === 0) {
      console.log('All chemicals are adequately stocked');
      return;
    }
    
    console.log(`⚠️ ${lowStockItems.length} chemicals are running low:`);
    
    lowStockItems.forEach(chemical => {
      const percentage = (chemical.quantity / chemical.minimumStock) * 100;
      console.log(`- ${chemical.chemicalName}: ${chemical.quantity}${chemical.unit} (${percentage.toFixed(0)}% of minimum)`);
    });
    
    // Send notification (pseudo-code)
    // sendEmailAlert('lab-manager@university.edu', lowStockItems);
    
    return lowStockItems;
  } catch (error) {
    console.error('Error checking stock:', error);
  }
}

// Run daily
setInterval(checkAndAlertLowStock, 24 * 60 * 60 * 1000); // Every 24 hours
```

### Use Case 3: Expiry Warning System

```javascript
import { getExpiringChemicals } from './services/firebaseHelpers';

async function checkExpiringChemicals(daysAhead = 30) {
  try {
    const expiring = await getExpiringChemicals(daysAhead);
    
    if (expiring.length === 0) {
      console.log('No chemicals expiring soon');
      return;
    }
    
    console.log(`⚠️ ${expiring.length} chemicals expiring in next ${daysAhead} days:`);
    
    expiring.forEach(chemical => {
      const daysLeft = Math.ceil((chemical.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      console.log(`- ${chemical.chemicalName}: Expires in ${daysLeft} days (${chemical.expiryDate.toLocaleDateString()})`);
    });
    
    return expiring;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check weekly
checkExpiringChemicals(30);
```

### Use Case 4: Maintenance Schedule

```javascript
async function scheduleMaintenanceDueSoon() {
  try {
    // Get all equipment
    const allEquipment = await getAllEquipment();
    
    // Filter equipment that hasn't been maintained in 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const needsMaintenance = allEquipment.filter(equipment => {
      return equipment.lastMaintenanceDate < sixMonthsAgo;
    });
    
    console.log(`${needsMaintenance.length} items need maintenance`);
    
    // Schedule maintenance (pseudo-code)
    needsMaintenance.forEach(equipment => {
      console.log(`Schedule maintenance for: ${equipment.itemName}`);
      // createMaintenanceTask(equipment.id);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## React Component Examples

### Complete CRUD Component

```jsx
import { useState, useEffect } from 'react';
import {
  getAllEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment
} from './services/firebaseHelpers';

function EquipmentManager() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    status: 'available'
  });

  // Load equipment on mount
  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    try {
      setLoading(true);
      const data = await getAllEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing
        await updateEquipment(editingId, formData);
        alert('Equipment updated');
      } else {
        // Add new
        await addEquipment(formData);
        alert('Equipment added');
      }
      
      // Reload and reset
      loadEquipment();
      resetForm();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete ${name}?`)) return;
    
    try {
      await deleteEquipment(id);
      loadEquipment();
      alert('Deleted successfully');
    } catch (error) {
      alert('Delete failed');
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setFormData({
      itemName: item.itemName,
      itemCode: item.itemCode,
      category: item.category,
      status: item.status
    });
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      itemName: '',
      itemCode: '',
      category: '',
      status: 'available'
    });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Equipment Manager</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          value={formData.itemName}
          onChange={(e) => setFormData({...formData, itemName: e.target.value})}
          placeholder="Item Name"
          required
        />
        <input
          value={formData.itemCode}
          onChange={(e) => setFormData({...formData, itemCode: e.target.value})}
          placeholder="Item Code"
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        >
          <option value="">Select Category</option>
          <option value="Instruments">Instruments</option>
          <option value="Glassware">Glassware</option>
        </select>
        <button type="submit">
          {editingId ? 'Update' : 'Add'} Equipment
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      {/* List */}
      <div>
        {equipment.map(item => (
          <div key={item.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
            <h3>{item.itemName}</h3>
            <p>Code: {item.itemCode}</p>
            <p>Category: {item.category}</p>
            <p>Status: {item.status}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id, item.itemName)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Error Handling

### Proper Error Handling Pattern

```javascript
async function safeOperation() {
  try {
    // Attempt operation
    const result = await addEquipment({
      itemName: "Test Equipment",
      itemCode: "TEST-001",
      category: "Test"
    });
    
    // Success handling
    console.log('Success:', result);
    return { success: true, data: result };
    
  } catch (error) {
    // Error handling
    console.error('Operation failed:', error);
    
    // Log to error tracking service (e.g., Sentry)
    // logError(error);
    
    // User-friendly error message
    let message = 'An unexpected error occurred';
    
    if (error.code === 'permission-denied') {
      message = 'You do not have permission to perform this action';
    } else if (error.code === 'not-found') {
      message = 'The requested item was not found';
    } else if (error.message) {
      message = error.message;
    }
    
    alert(message);
    
    return { success: false, error: message };
  }
}
```

---

**🎉 You're ready to build amazing features!** Use these examples as templates for your own implementations.
