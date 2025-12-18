# Installation Guide - EduTrack Laboratory Management System

**Version:** 0.1.0  
**Last Updated:** December 2025

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Firebase Configuration](#firebase-configuration)
5. [Running the Application](#running-the-application)
6. [Building for Production](#building-for-production)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** v18.0.0 or higher
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
  
- **npm** (usually comes with Node.js) v9.0.0 or higher
  - Verify installation: `npm --version`
  
- **Git** (optional, for cloning repository)
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

### Accounts Required

- **Google Account** — Required for Firebase setup
  - Sign up at: https://accounts.google.com

- **Firebase Account** (free tier available)
  - Create at: https://console.firebase.google.com/

### Text Editor or IDE (Optional)

- **Visual Studio Code** (recommended)
  - Download from: https://code.visualstudio.com/
  
- **WebStorm**, **Sublime Text**, or any other code editor

---

## System Requirements

| Requirement | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4 GB | 8 GB or more |
| Disk Space | 500 MB | 2 GB |
| Node.js | 18.0.0 | 20.0.0+ |
| npm | 9.0.0 | 10.0.0+ |
| OS | Windows, macOS, Linux | Windows 11+, macOS 12+, Latest Linux |
| Browser | Modern ES6+ support | Chrome, Firefox, Safari, Edge (latest) |

---

## Installation Steps

### Step 1: Extract Project Files

**If you received a ZIP file:**

1. Locate the downloaded `Labventory.zip` file
2. Right-click and select "Extract All..."
3. Choose a location (e.g., `C:\Users\YourName\Documents\`)
4. Click "Extract"

**If cloning from GitHub:**

```bash
git clone https://github.com/CSRK-MA/Labventory.git
cd Labventory
```

### Step 2: Open Terminal in Project Directory

**Windows (PowerShell):**
1. Open File Explorer
2. Navigate to the project folder
3. Click the address bar and type `powershell`
4. Press Enter
5. Terminal will open in the project directory

**Alternative - Command Prompt:**
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Type: `cd C:\path\to\Labventory` (use your actual path)

**macOS/Linux:**
1. Open Terminal
2. Type: `cd /path/to/Labventory`

### Step 3: Install Dependencies

Run the following command in your terminal:

```bash
npm install
```

This will:
- Download all required packages
- Install dependencies listed in `package.json`
- Create a `node_modules` folder (may take 2-5 minutes)

**Expected output:**
```
added XXX packages in X.XXs
```

**If you have errors:**
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Step 4: Verify Installation

Confirm that installation was successful:

```bash
npm list --depth=0
```

You should see a list of installed packages without errors.

---

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `Labventory` (or your preferred name)
4. Click "Continue"
5. Select or create a Google Cloud billing account (free tier available)
6. Click "Create project"
7. Wait for project creation (1-2 minutes)
8. Click "Continue"

### Step 2: Set Up Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click "Get started"
3. Click **Email/Password** option
4. Enable "Email/Password" toggle
5. Click "Save"

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click "Create database"
3. Select region (choose closest to you)
4. Start in **Test mode** (for development)
5. Click "Create"
6. Wait for database creation (1-2 minutes)

### Step 4: Get Firebase Credentials

1. In Firebase Console, click **Settings** (gear icon, top-left)
2. Select **Project settings**
3. Scroll to **Your apps** section
4. If no app exists, click **Add app** and select **Web** (`</>`icon)
5. Register app with name `Labventory`
6. Copy the Firebase configuration (all values in the `const firebaseConfig` block)

### Step 5: Configure Application

1. In your project folder, open `src/firebase.js` in a text editor
2. Replace the placeholder values with your Firebase credentials:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",           // Paste your apiKey
  authDomain: "your-project.firebaseapp.com",  // Paste your authDomain
  projectId: "your-project-id",          // Paste your projectId
  storageBucket: "your-project.appspot.com",   // Paste your storageBucket
  messagingSenderId: "YOUR_SENDER_ID_HERE",    // Paste your messagingSenderId
  appId: "YOUR_APP_ID_HERE"              // Paste your appId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

3. Save the file (`Ctrl + S` or `Cmd + S`)

### Step 6: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click **Rules** tab
3. Replace default rules with content from `src/firestore.rules`
4. Click **Publish**

For detailed rule setup, see `docs/FIREBASE_SETUP_GUIDE.md`

---

## Running the Application

### Development Mode

Start the development server with live reload:

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Access the Application

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to: `http://localhost:5173`
3. You should see the EduTrack login page

### First Login

1. You'll need to create an account or use Firebase authentication
2. See `docs/FIREBASE_SETUP_GUIDE.md` for user account creation
3. After login, you'll access the dashboard based on your user role

### Stopping the Server

Press `Ctrl + C` in the terminal to stop the development server.

---

## Building for Production

### Create Production Build

To build the application for deployment:

```bash
npm run build
```

This will:
- Compile TypeScript and React code
- Optimize assets (minification, bundling)
- Generate output in the `dist/` folder
- Complete in 30-60 seconds

**Expected output:**
```
dist/index.html                          0.XX kB │ gzip: 0.XX kB
dist/assets/index-XXXX.js              XXX.XX kB │ gzip: XXX.XX kB
dist/assets/index-XXXX.css               XX.XX kB │ gzip: XX.XX kB

✓ built in XXs
```

### Preview Production Build Locally

Test the production build before deployment:

```bash
npm run preview
```

Then open: `http://localhost:4173`

### Build Output Structure

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-XXXXX.js      # Bundled JavaScript
│   └── index-XXXXX.css     # Bundled CSS
└── favicon.ico             # Website icon
```

### Deploy to Production

The `dist/` folder contents can be deployed to:
- **Firebase Hosting** (recommended)
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Any static web server**

See `docs/PROJECT_INFO.md` for deployment instructions.

---

## Troubleshooting

### Common Installation Issues

#### Issue: "Node.js is not recognized"

**Solution:**
1. Uninstall Node.js completely
2. Restart your computer
3. Download and install latest Node.js from https://nodejs.org/
4. Restart terminal and try again

#### Issue: "npm: command not found" on macOS/Linux

**Solution:**
```bash
# Check if npm is installed
which npm

# If not found, install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js
brew install node
```

#### Issue: "Port 5173 is already in use"

**Solution:**
```bash
# Kill process on port 5173
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# macOS/Linux:
lsof -ti :5173 | xargs kill -9

# Then run npm run dev again
npm run dev
```

#### Issue: "Firebase credentials not found"

**Solution:**
1. Verify `src/firebase.js` exists and contains your credentials
2. Check that all Firebase values are correct:
   - `apiKey` should start with `AIza`
   - `projectId` should match your Firebase project name
3. Ensure there are no extra quotes or spaces in the configuration

#### Issue: "npm install fails with permission denied"

**Solution (macOS/Linux):**
```bash
# Use sudo (not recommended for security)
sudo npm install

# Or better: fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install
```

#### Issue: "Build fails with TypeScript errors"

**Solution:**
1. Ensure Node.js version is 18+: `node --version`
2. Clear node_modules and reinstall:
   ```bash
   rm -r node_modules
   npm install
   ```
3. Check for syntax errors in your code
4. Run `npm run build` again

### Performance Issues

| Issue | Solution |
|-------|----------|
| Slow `npm install` | Use faster registry: `npm config set registry https://registry.npmjs.org/` |
| High RAM usage | Close other applications, increase Node.js heap: `export NODE_OPTIONS=--max-old-space-size=4096` |
| Slow startup (`npm run dev`) | Ensure SSD drive; disable antivirus scanning of node_modules |
| Build takes too long | Update Node.js to latest version |

### Verification Checklist

Before reporting issues, verify:

- [ ] Node.js version 18+: `node --version`
- [ ] npm version 9+: `npm --version`
- [ ] `src/firebase.js` has correct credentials
- [ ] `node_modules/` folder exists
- [ ] No syntax errors in code
- [ ] Port 5173 is available
- [ ] Internet connection is active
- [ ] Firestore database is created and accessible
- [ ] Firebase Authentication is enabled

---

## Next Steps

### After Installation

1. **Read Documentation**
   - Start with `docs/PROJECT_INFO.md` for project overview
   - See `docs/NAVIGATION_FLOW.md` for application structure

2. **Set Up User Accounts**
   - Create admin account through Firebase Console
   - Use app to create teacher/student accounts
   - See `docs/FIREBASE_SETUP_GUIDE.md` for details

3. **Add Sample Data**
   - Use the dashboard to add equipment and chemicals
   - Create check-in/out records
   - Schedule maintenance tasks

4. **Explore Features**
   - Test QR code generation and scanning
   - Generate reports
   - Try different user roles

5. **Customize for Your Lab**
   - Update equipment categories
   - Configure chemical hazard levels
   - Set maintenance schedules
   - Customize user roles and permissions

### Useful Documentation

| Document | Purpose |
|----------|---------|
| `docs/PROJECT_INFO.md` | Project overview and features |
| `docs/FIREBASE_SETUP_GUIDE.md` | Detailed Firebase setup |
| `docs/NAVIGATION_FLOW.md` | Application routing and navigation |
| `docs/OOP_DESIGN_NOTE.md` | Architecture and design patterns |
| `docs/USE_CASES.md` | User stories and workflows |
| `README.md` | Quick reference and links |

### Getting Help

**Documentation Resources:**
- Firebase Documentation: https://firebase.google.com/docs
- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs/

**Support Channels:**
1. Check relevant documentation files in `docs/`
2. Review GitHub issues: https://github.com/CSRK-MA/Labventory/issues
3. Contact development team through project repository

---

## System Health Check Script

To verify your environment is properly configured, create a file `verify-setup.js`:

```javascript
const fs = require('fs');
const path = require('path');

console.log('🔍 EduTrack Installation Verification\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✓ Node.js version: ${nodeVersion}`);

// Check npm
const npmPath = require.resolve('npm');
console.log(`✓ npm is available`);

// Check project structure
const requiredDirs = ['src', 'src/components', 'src/services', 'node_modules'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✓ Directory exists: ${dir}/`);
  } else {
    console.log(`✗ Missing directory: ${dir}/`);
  }
});

// Check firebase.js
const firebaseFile = path.join(__dirname, 'src/firebase.js');
if (fs.existsSync(firebaseFile)) {
  const content = fs.readFileSync(firebaseFile, 'utf8');
  if (content.includes('apiKey')) {
    console.log(`✓ Firebase configuration file found`);
  } else {
    console.log(`⚠ Firebase config appears incomplete`);
  }
} else {
  console.log(`✗ Firebase configuration file not found`);
}

console.log('\n✅ Setup verification complete!\n');
```

Run with: `node verify-setup.js`

---

## Environment Variables (Optional)

For advanced configuration, create a `.env.local` file in the root directory:

```env
# Firebase Configuration (optional - can also be in src/firebase.js)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Application Settings
VITE_APP_TITLE=EduTrack
VITE_APP_VERSION=0.1.0
```

---

## Summary

**Quick Reference:**

```bash
# 1. Install dependencies
npm install

# 2. Configure Firebase (edit src/firebase.js)
# (Add your credentials)

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173

# 5. Build for production (when ready)
npm run build
```

---

## Support & Contact

For issues or questions:
- 📧 GitHub Issues: https://github.com/CSRK-MA/Labventory/issues
- 📚 Documentation: See `docs/` folder
- 🔗 Repository: https://github.com/CSRK-MA/Labventory

---

**Last Updated:** December 2025  
**Installation Guide Version:** 1.0  
**Compatible With:** EduTrack v0.1.0+
