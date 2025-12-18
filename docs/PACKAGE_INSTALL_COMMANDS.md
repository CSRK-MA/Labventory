# 📦 Complete Package Installation Commands

## Quick Install (One Command)

```bash
npm install firebase qrcode.react html5-qrcode lucide-react
```

---

## Individual Package Installation

### Core Firebase
```bash
npm install firebase
```
**Purpose:** Real-time database, authentication, cloud functions
**Version:** ^10.7.1 or latest

### QR Code Generation
```bash
npm install qrcode.react
```
**Purpose:** Generate QR codes as React components
**Version:** ^3.1.0 or latest

### QR Code Scanning
```bash
npm install html5-qrcode
```
**Purpose:** Scan QR codes using device camera
**Version:** ^2.3.8 or latest

### Icons
```bash
npm install lucide-react
```
**Purpose:** Beautiful icon library
**Version:** ^0.294.0 or latest

---

## Optional Packages (Recommended)

### Date Utilities
```bash
npm install date-fns
```
**Purpose:** Date formatting and manipulation
**Use Case:** Format dates in activity logs

### React Router (if not already installed)
```bash
npm install react-router-dom
```
**Purpose:** Client-side routing
**Use Case:** Navigate between pages

### Firebase Admin (for backend/Cloud Functions)
```bash
npm install firebase-admin
```
**Purpose:** Server-side Firebase operations
**Use Case:** Cloud Functions, scheduled tasks

---

## Dev Dependencies

### Firebase CLI (Global)
```bash
npm install -g firebase-tools
```
**Purpose:** Deploy to Firebase, manage project
**Usage:** `firebase deploy`

### TypeScript (if using TS)
```bash
npm install --save-dev typescript @types/react @types/react-dom
```
**Purpose:** Type safety and IntelliSense

---

## Verify Installation

### Check Installed Packages
```bash
npm list firebase qrcode.react html5-qrcode lucide-react
```

### Expected Output
```
your-project@1.0.0
├── firebase@10.7.1
├── html5-qrcode@2.3.8
├── lucide-react@0.294.0
└── qrcode.react@3.1.0
```

---

## Package Sizes (for reference)

| Package | Size (gzipped) | Purpose |
|---------|---------------|---------|
| firebase | ~80 KB | Core Firebase SDK |
| qrcode.react | ~5 KB | QR generation |
| html5-qrcode | ~45 KB | QR scanning |
| lucide-react | ~1 KB each icon | Icons |

**Total:** ~130 KB (acceptable for production)

---

## Import Statements Reference

### Firebase
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
```

### QR Code
```javascript
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
```

### Icons
```javascript
import { Package, QrCode, Camera, Database } from 'lucide-react';
```

---

## Troubleshooting

### Issue: Package Not Found
```bash
# Clear cache and reinstall
npm cache clean --force
npm install
```

### Issue: Version Conflicts
```bash
# Update to latest compatible versions
npm update firebase qrcode.react html5-qrcode lucide-react
```

### Issue: Build Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Complete package.json Example

```json
{
  "name": "lab-inventory-system",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.7.1",
    "qrcode.react": "^3.1.0",
    "html5-qrcode": "^2.3.8",
    "lucide-react": "^0.294.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.7"
  }
}
```

---

## Post-Installation Steps

1. **Verify imports work:**
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { QRCodeSVG } from 'qrcode.react';
   import { Html5QrcodeScanner } from 'html5-qrcode';
   import { Package } from 'lucide-react';
   
   console.log('All packages loaded successfully!');
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Check for errors:**
   - Open browser console
   - Look for import errors
   - Verify no dependency warnings

---

## Firebase-Specific Setup

### After npm install firebase

1. **Initialize Firebase in your project:**
   ```bash
   firebase login
   firebase init
   ```

2. **Select features:**
   - ✅ Firestore
   - ✅ Hosting (optional)
   - ✅ Functions (optional)

3. **Deploy security rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## Browser Requirements

### For QR Scanning (html5-qrcode):
- ✅ Chrome 60+ (recommended)
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers with camera API support

### For Firebase:
- ✅ All modern browsers
- ✅ IE 11 (with polyfills)

---

## Performance Optimization

### Bundle Size Optimization

1. **Import only what you need:**
   ```javascript
   // ❌ Bad - imports everything
   import * as firebase from 'firebase/app';
   
   // ✅ Good - imports only what you need
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   ```

2. **Tree-shaking:**
   - Vite and modern bundlers automatically tree-shake
   - Only production builds include optimizations

3. **Code splitting:**
   ```javascript
   // Lazy load QR scanner
   const QRScanner = lazy(() => import('./components/qr/QRScanner'));
   ```

---

## Quick Reference Commands

```bash
# Install all packages
npm install firebase qrcode.react html5-qrcode lucide-react

# Update packages
npm update

# Check outdated packages
npm outdated

# Remove unused packages
npm prune

# Audit security
npm audit

# Fix security issues
npm audit fix

# Clean install
rm -rf node_modules package-lock.json && npm install

# Install Firebase CLI globally
npm install -g firebase-tools

# Check Firebase CLI version
firebase --version

# Login to Firebase
firebase login

# Deploy to Firebase
firebase deploy
```

---

## Platform-Specific Notes

### Windows
```bash
# Use PowerShell or CMD
npm install firebase qrcode.react html5-qrcode lucide-react
```

### macOS/Linux
```bash
# May need sudo for global packages
sudo npm install -g firebase-tools
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Test
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
```

---

## Summary Checklist

- [ ] All packages installed successfully
- [ ] No error messages in console
- [ ] Firebase config updated
- [ ] QR code components import correctly
- [ ] Icons display properly
- [ ] Development server runs without errors
- [ ] Build completes successfully
- [ ] No TypeScript errors (if using TS)

---

**✅ Installation Complete!**

You're now ready to use the full Lab Inventory System with real-time updates and QR code integration!

**Next Steps:** See `/INSTALLATION_COMPLETE_GUIDE.md` for configuration and usage.
