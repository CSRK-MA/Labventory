# Firebase Integration Setup Guide
## Lab Inventory Management System

This guide will walk you through setting up Firebase Firestore for your React application.

---

## 📋 Prerequisites

- Node.js installed (v14 or higher)
- A React project created with Vite or Create React App
- A Google account for Firebase Console

---

## 🚀 Step-by-Step Setup

### Step 1: Install Firebase

Open your terminal in the project root directory and run:

```bash
npm install firebase
```

Or if you use yarn:

```bash
yarn add firebase
```

**Additional dependencies for icons (already in your project):**
```bash
npm install lucide-react
```

---

### Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `labventory` (or your preferred name)
4. Click **Continue**
5. Choose whether to enable Google Analytics (optional)
6. Click **Create project**
7. Wait for project creation to complete
8. Click **Continue** when ready

---

### Step 3: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Lab Inventory Web App`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click **Register app**
5. **Copy the Firebase configuration object** - you'll need this next

The configuration will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "labventory-xxxxx.firebaseapp.com",
  projectId: "labventory-xxxxx",
  storageBucket: "labventory-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

---

### Step 4: Configure Firebase in Your Project

1. Open the file: `src/firebase.js` (already created)
2. **Replace the placeholder values** with your actual Firebase configuration:

```javascript
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// 👇 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-actual-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID",
  measurementId: "YOUR_ACTUAL_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

export const COLLECTIONS = {
  EQUIPMENT: 'equipment',
  CHEMICALS: 'chemicals',
  CHECKINOUT: 'checkInOut',
  MAINTENANCE: 'maintenance',
  USERS: 'users',
  LABS: 'labs',
  CATEGORIES: 'categories',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports'
};
```

---

### Step 5: Enable Firestore Database

1. In Firebase Console, click **"Build"** → **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - ⚠️ **Important:** This allows read/write access for 30 days. Update rules for production!
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **"Enable"**
6. Wait for database provisioning to complete

---

### Step 6: Update Firestore Security Rules (Important!)

After testing, update your security rules for production:

1. In Firebase Console → Firestore Database → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Equipment collection
    match /equipment/{equipmentId} {
      // Allow read access to authenticated users
      allow read: if request.auth != null;
      
      // Allow write access to authenticated users with admin or teacher role
      allow write: if request.auth != null 
        && (request.auth.token.role == 'admin' || request.auth.token.role == 'teacher');
    }
    
    // Chemicals collection
    match /chemicals/{chemicalId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && (request.auth.token.role == 'admin' || request.auth.token.role == 'teacher');
    }
    
    // Check-in/out collection
    match /checkInOut/{transactionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && (request.auth.token.role == 'admin' || request.auth.token.role == 'teacher');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

---

### Step 7: Integrate Components in Your App

#### Option A: Using the Example App (Recommended for Testing)

1. Import the example app in your `main.jsx` or `index.jsx`:

```javascript
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppFirebaseExample from './AppFirebaseExample';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppFirebaseExample />
  </React.StrictMode>
);
```

#### Option B: Integrate into Existing App.jsx

```javascript
// src/App.jsx
import { useState } from 'react';
import { AddData } from './components/firebase/AddData';
import { ViewData } from './components/firebase/ViewData';

function App() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl">Lab Inventory Management</h1>
      </header>

      <main className="container mx-auto p-6">
        {/* Toggle between views */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {showAddForm ? 'View Equipment' : 'Add Equipment'}
          </button>
        </div>

        {/* Show appropriate component */}
        {showAddForm ? <AddData /> : <ViewData />}
      </main>
    </div>
  );
}

export default App;
```

---

## 🧪 Testing Your Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:5173` (or the URL shown)

3. **Test Add Data:**
   - Click on "Add Data" tab
   - Fill in the form with equipment details
   - Click "Add Equipment"
   - You should see a success alert

4. **Test View Data:**
   - Click on "View Data" tab
   - You should see the equipment you just added
   - Try the search and filter features

5. **Verify in Firebase Console:**
   - Go to Firebase Console → Firestore Database
   - You should see the `equipment` collection
   - Click on it to see your documents

---

## 📊 Firestore Data Structure

Your data will be stored in this structure:

```
equipment (collection)
  └── {auto-generated-id} (document)
      ├── itemName: "Digital pH Meter"
      ├── itemCode: "EQ-PH-001"
      ├── category: "Instruments"
      ├── brand: "Mettler Toledo"
      ├── model: "SevenCompact S220"
      ├── serialNumber: "SN12345678"
      ├── purchasePrice: 1250.00
      ├── condition: "excellent"
      ├── status: "available"
      ├── location: "Shelf A-12"
      ├── description: "High precision pH meter"
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp
```

---

## 🔧 Troubleshooting

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Make sure you've replaced the placeholder values in `src/firebase.js` with your actual Firebase configuration.

### Issue: "Missing or insufficient permissions"
**Solution:** 
- Make sure Firestore is enabled in Firebase Console
- Check that security rules are set to "test mode" or properly configured
- Verify the collection name matches: `equipment`

### Issue: "Module not found: firebase"
**Solution:** Run `npm install firebase` again and restart your dev server

### Issue: Data not showing up
**Solution:**
- Check browser console for errors
- Verify Firebase configuration is correct
- Check Firestore security rules
- Make sure you're using the correct collection name

### Issue: "Cannot read property 'toDate' of undefined"
**Solution:** This happens when `createdAt` is null. The code handles this gracefully, but you can also add timestamps explicitly when creating documents.

---

## 🎯 Next Steps

1. **Add Authentication:**
   - Implement Firebase Authentication for user login
   - Protect routes based on user roles
   - Store user data in Firestore

2. **Add More Features:**
   - Update functionality (edit equipment)
   - Image upload using Firebase Storage
   - Real-time listeners for live updates
   - Export data to CSV/PDF

3. **Optimize Performance:**
   - Implement pagination for large datasets
   - Add indexes for complex queries
   - Use query caching

4. **Deploy:**
   - Build for production: `npm run build`
   - Deploy to Firebase Hosting, Vercel, or Netlify

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Get Started](https://firebase.google.com/docs/firestore/quickstart)
- [React Firebase Tutorial](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## 💡 Pro Tips

1. **Use Environment Variables** for Firebase config in production:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     // ... etc
   };
   ```

2. **Create indexes** for complex queries in Firebase Console

3. **Monitor usage** in Firebase Console → Usage tab to avoid exceeding free tier limits

4. **Backup your data** regularly using Firestore export feature

5. **Use TypeScript** for better type safety with Firebase

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] `npm install firebase` completed
- [ ] `src/firebase.js` configured with actual credentials
- [ ] Firestore database enabled
- [ ] Security rules updated
- [ ] Components imported in App
- [ ] Application tested successfully
- [ ] Data visible in Firebase Console

---

**🎉 Congratulations!** Your Firebase integration is complete and ready to use!

If you encounter any issues, check the troubleshooting section or refer to the Firebase documentation.
