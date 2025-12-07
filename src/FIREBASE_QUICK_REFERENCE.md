# Firebase Quick Reference Guide
## Lab Inventory Management System

---

## 📦 Installation Command

```bash
npm install firebase
```

---

## 🔧 Files Created

| File | Purpose |
|------|---------|
| `/src/firebase.js` | Firebase initialization and configuration |
| `/src/components/firebase/AddData.jsx` | Component for adding equipment (CREATE) |
| `/src/components/firebase/ViewData.jsx` | Component for viewing equipment (READ) |
| `/src/services/firebaseHelpers.js` | Helper functions for all CRUD operations |
| `/src/AppFirebaseExample.jsx` | Example app showing integration |
| `/FIREBASE_SETUP_GUIDE.md` | Complete setup instructions |

---

## 🚀 Quick Start (3 Steps)

### 1. Configure Firebase

Replace placeholders in `/src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",           // ← Replace this
  authDomain: "your-project.firebaseapp.com", // ← Replace this
  projectId: "your-project-id",            // ← Replace this
  storageBucket: "your-project.appspot.com", // ← Replace this
  messagingSenderId: "123456789",          // ← Replace this
  appId: "1:123456789:web:abc123",         // ← Replace this
};
```

### 2. Enable Firestore

1. Go to Firebase Console
2. Click "Firestore Database"
3. Click "Create database"
4. Choose "Start in test mode"
5. Click "Enable"

### 3. Use in Your App

```javascript
// In your App.jsx
import { AddData } from './components/firebase/AddData';
import { ViewData } from './components/firebase/ViewData';

function App() {
  return (
    <div>
      <AddData />
      <ViewData />
    </div>
  );
}
```

---

## 💻 Usage Examples

### Example 1: Add Equipment (Using Component)

```jsx
import { AddData } from './components/firebase/AddData';

function MyApp() {
  return <AddData />;
}
```

The form includes:
- ✅ Item Name (required)
- ✅ Item Code (required)
- ✅ Category (required)
- Brand, Model, Serial Number
- Purchase Price, Location
- Condition, Status
- Description

### Example 2: View Equipment (Using Component)

```jsx
import { ViewData } from './components/firebase/ViewData';

function MyApp() {
  return <ViewData />;
}
```

Features:
- ✅ Display all equipment in responsive table/cards
- ✅ Search by name, code, brand, model
- ✅ Filter by status (available, in-use, maintenance, retired)
- ✅ Delete functionality
- ✅ Refresh button
- ✅ Summary statistics

### Example 3: Using Helper Functions

```javascript
import { 
  addEquipment, 
  getAllEquipment, 
  updateEquipment,
  deleteEquipment 
} from './services/firebaseHelpers';

// Add equipment
const newEquipment = await addEquipment({
  itemName: "Microscope",
  itemCode: "EQ-MICRO-001",
  category: "Instruments",
  brand: "Olympus",
  status: "available"
});

// Get all equipment
const allEquipment = await getAllEquipment();

// Get filtered equipment
const availableEquipment = await getAllEquipment({ 
  status: 'available' 
});

// Update equipment
await updateEquipment('equipmentId123', {
  status: 'in-use',
  location: 'Lab Room 102'
});

// Delete equipment
await deleteEquipment('equipmentId123');
```

---

## 📋 Available Helper Functions

### Create Operations
```javascript
addEquipment(equipmentData)           // Add equipment
addChemical(chemicalData)             // Add chemical
createCheckInOut(transactionData)     // Create transaction
batchAddEquipment(equipmentList)      // Batch add
```

### Read Operations
```javascript
getAllEquipment(options)              // Get all equipment
getEquipmentById(id)                  // Get by ID
getAllChemicals(options)              // Get all chemicals
getLowStockChemicals()                // Get low stock items
getExpiringChemicals(daysAhead)       // Get expiring chemicals
getCheckInOutHistory(options)         // Get transaction history
```

### Update Operations
```javascript
updateEquipment(id, updates)          // Update equipment
updateEquipmentStatus(id, status)     // Update status only
updateChemical(id, updates)           // Update chemical
updateChemicalQuantity(id, quantity)  // Update quantity only
```

### Delete Operations
```javascript
deleteEquipment(id)                   // Delete equipment
deleteChemical(id)                    // Delete chemical
deleteCheckInOut(id)                  // Delete transaction
```

### Search Operations
```javascript
searchEquipment(searchTerm)           // Search equipment
searchChemicals(searchTerm)           // Search chemicals
```

### Statistics
```javascript
getEquipmentStats()                   // Get equipment statistics
getChemicalStats()                    // Get chemical statistics
```

---

## 🎨 Component Features

### AddData Component Features:
- ✅ Full equipment form with validation
- ✅ Required field indicators
- ✅ Dropdown selects for categories and status
- ✅ Number input for price
- ✅ Textarea for description
- ✅ Loading states with spinner
- ✅ Success/error messages
- ✅ Form reset functionality
- ✅ Mobile responsive design
- ✅ Beautiful gradient UI

### ViewData Component Features:
- ✅ Responsive table (desktop) and cards (mobile)
- ✅ Real-time search with instant filtering
- ✅ Status filter dropdown
- ✅ Color-coded status badges
- ✅ Condition badges
- ✅ Delete with confirmation
- ✅ Refresh button with loading state
- ✅ Empty state handling
- ✅ Summary statistics
- ✅ Total value calculation
- ✅ Item count by status

---

## 🎯 Common Use Cases

### Use Case 1: Add Equipment and View Immediately

```jsx
import { useState } from 'react';
import { AddData } from './components/firebase/AddData';
import { ViewData } from './components/firebase/ViewData';

function App() {
  const [view, setView] = useState('list');

  return (
    <div>
      <button onClick={() => setView('add')}>Add Equipment</button>
      <button onClick={() => setView('list')}>View List</button>
      
      {view === 'add' ? <AddData /> : <ViewData />}
    </div>
  );
}
```

### Use Case 2: Custom Equipment List with Helper Functions

```jsx
import { useState, useEffect } from 'react';
import { getAllEquipment } from './services/firebaseHelpers';

function EquipmentDashboard() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const data = await getAllEquipment({ status: 'available' });
      setEquipment(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available Equipment</h2>
      {equipment.map(item => (
        <div key={item.id}>
          <h3>{item.itemName}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Use Case 3: Search with Custom UI

```jsx
import { useState } from 'react';
import { searchEquipment } from './services/firebaseHelpers';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await searchEquipment(query);
    setResults(data);
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search equipment..."
      />
      <button onClick={handleSearch}>Search</button>
      
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

## 🔐 Security Rules (Copy-Paste Ready)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /equipment/{equipmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /chemicals/{chemicalId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /checkInOut/{transactionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**For Development (30 days):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 1, 15);
    }
  }
}
```

---

## 🐛 Common Errors & Fixes

### Error: "Firebase: No Firebase App"
**Fix:** Make sure `firebase.js` is imported before using any Firebase functions

### Error: "Missing or insufficient permissions"
**Fix:** Update Firestore security rules to allow access

### Error: "Module not found: firebase"
**Fix:** Run `npm install firebase` and restart dev server

### Error: Data not showing
**Fix:** 
1. Check Firebase Console → Firestore → Verify data exists
2. Check browser console for errors
3. Verify collection name is correct: `equipment`

---

## 📊 Data Structure

```javascript
{
  // Equipment Document
  itemName: "Digital pH Meter",
  itemCode: "EQ-PH-001",
  category: "Instruments",
  brand: "Mettler Toledo",
  model: "SevenCompact S220",
  serialNumber: "SN12345678",
  purchasePrice: 1250.00,
  condition: "excellent",
  status: "available",
  location: "Shelf A-12",
  description: "High precision pH meter",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 💡 Pro Tips

1. **Use Environment Variables** for API keys in production
2. **Create Indexes** for complex queries in Firebase Console
3. **Enable Offline Persistence** for better UX:
   ```javascript
   import { enableIndexedDbPersistence } from 'firebase/firestore';
   enableIndexedDbPersistence(db);
   ```
4. **Monitor Usage** in Firebase Console to avoid exceeding free tier
5. **Backup Data** regularly using Firestore export feature

---

## 📱 Testing Checklist

- [ ] Firebase config replaced with actual credentials
- [ ] Firestore database enabled
- [ ] AddData form submits successfully
- [ ] Data appears in Firebase Console
- [ ] ViewData displays the added data
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Delete functionality works
- [ ] Mobile responsive on all devices
- [ ] No console errors

---

## 🎓 Next Steps

1. **Add Authentication:** Implement Firebase Auth for user login
2. **Add Chemicals:** Create similar components for chemicals
3. **Add Images:** Use Firebase Storage for equipment images
4. **Add Real-time:** Use `onSnapshot` for live updates
5. **Add Pagination:** Implement for large datasets
6. **Add Export:** Export data to CSV/Excel
7. **Deploy:** Deploy to Firebase Hosting or Vercel

---

## 📚 Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Firestore Queries:** https://firebase.google.com/docs/firestore/query-data/queries
- **React + Firebase:** https://firebase.google.com/docs/web/setup

---

**Need Help?** Check the full setup guide in `/FIREBASE_SETUP_GUIDE.md`
