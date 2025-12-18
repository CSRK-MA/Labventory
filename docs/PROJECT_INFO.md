# EduTrack - Project Information

## Project Overview

**Project Name:** Labventory (EduTrack Inventory Platform)  
**Version:** 0.1.0  
**Status:** In Development  
**Repository:** https://github.com/CSRK-MA/Labventory  
**Figma Design:** https://www.figma.com/design/7yZuoqpqEpZOPytjVSd6nR/EduTrack-Inventory-Platform

## Purpose

EduTrack is a comprehensive laboratory and equipment inventory management platform designed to streamline the tracking, maintenance, and management of laboratory equipment, chemicals, and assets. It provides real-time monitoring, QR code-based check-in/out systems, and comprehensive reporting capabilities.

## Technology Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** CSS with custom components
- **UI Library:** Radix UI components
- **State Management:** React Context (UserContext)
- **Forms:** React Hook Form

### Backend
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Deployment:** GitHub Pages (https://CSRK-MA.github.io/Labventory/)

### Key Dependencies
- **QR Code:** html5-qrcode, jsqr, qrcode.react, react-qr-code
- **UI Components:** 
  - Radix UI (accordion, alert-dialog, dropdown-menu, dialog, etc.)
  - lucide-react (icons)
  - cmdk (command palette)
  - embla-carousel-react (carousel)
- **Firebase:** firebase 12.6.0
- **Form Handling:** react-hook-form
- **Layout:** react-resizable-panels
- **Theming:** next-themes

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx              # Main dashboard component
│   ├── DemoPreview.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── LandingPage.tsx
│   ├── SignIn.tsx
│   ├── PermissionGuard.tsx
│   ├── dashboard/                 # Dashboard sub-components
│   │   ├── CheckInOut.tsx
│   │   ├── ChemicalTracker.tsx
│   │   ├── CustomDataEntry.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── EquipmentList.tsx
│   │   ├── MaintenanceTracker.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   ├── UserManagement.tsx
│   │   └── RealtimeDashboard.jsx
│   ├── qr/                        # QR code functionality
│   │   ├── QRCheckInOut.jsx
│   │   ├── QRGenerator.jsx
│   │   └── QRScanner.jsx
│   ├── firebase/                  # Firebase integration
│   │   ├── AddData.jsx
│   │   └── ViewData.jsx
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/                        # UI component library (Radix UI)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── sidebar.tsx
│       └── [20+ more UI components]
├── contexts/
│   └── UserContext.tsx            # User authentication context
├── hooks/
│   ├── useRealtimeCheckInOut.js   # Real-time check-in/out updates
│   ├── useRealtimeChemicals.js    # Real-time chemical tracking
│   └── useRealtimeEquipment.js    # Real-time equipment updates
├── services/
│   ├── firebaseService.ts         # Firebase service layer
│   ├── firebaseHelpers.js         # Firebase utility functions
│   └── userService.ts             # User service functions
├── lib/
│   └── store.tsx                  # Zustand or state management
├── styles/
│   └── globals.css                # Global styles
├── firebase.js                    # Firebase configuration
├── firestore.rules                # Firestore security rules
├── App.tsx                        # Root component
├── main.tsx                       # Entry point
└── index.css                      # CSS entry point
```

## Key Features

### 1. **Dashboard**
   - Overview of all inventory
   - Real-time statistics
   - Quick access to main features

### 2. **Equipment Management**
   - Equipment list and inventory
   - Equipment tracking
   - Maintenance scheduling

### 3. **Chemical Tracking**
   - Chemical inventory management
   - Usage tracking
   - Safety compliance

### 4. **Check-In/Check-Out System**
   - QR code-based check-in
   - QR code-based check-out
   - Real-time status updates

### 5. **QR Code Functionality**
   - Generate QR codes for equipment
   - Scan QR codes for quick actions
   - Check-in/out via QR scanning

### 6. **Reporting**
   - Generate comprehensive reports
   - Export functionality
   - Historical data tracking

### 7. **User Management**
   - Role-based access control (PermissionGuard)
   - User authentication
   - Settings management

### 8. **Real-Time Updates**
   - Live data synchronization via Firebase
   - Custom hooks for real-time data
   - WebSocket-like functionality through Firestore

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- Firebase project setup

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Files & Documentation

- `FIREBASE_SETUP_GUIDE.md` - Firebase configuration guide
- `FIREBASE_INTEGRATION_SUMMARY.md` - Firebase integration overview
- `ARCHITECTURE_DOCUMENTATION.md` - System architecture
- `PRODUCTION_READY_SYSTEM.md` - Production deployment guide
- `REALTIME_SYSTEM_GUIDE.md` - Real-time feature documentation
- `SIDEBAR_FIX_SUMMARY.md` - UI/UX improvements
- `USAGE_EXAMPLES.md` - Code examples and usage patterns

## Firebase Integration

- **Firestore:** Real-time database for all data
- **Authentication:** User sign-in and access control
- **Security Rules:** Defined in `firestore.rules`
- **Real-time Listeners:** Custom hooks for live updates

## Development Workflow

1. Development: `npm run dev`
2. Type checking: TypeScript support enabled
3. Building: `npm run build`
4. Deployment: GitHub Pages (via package.json homepage)

## Current Status

- Core dashboard and navigation implemented
- QR code scanning and generation functional
- Firebase integration complete
- Real-time data synchronization working
- UI components library established
- User authentication system in place

## Team & Attribution

See `Attributions.md` for credits and acknowledgments.

## Future Enhancements

- Enhanced reporting capabilities
- Mobile app version
- Advanced analytics
- Integration with external APIs
- Automated inventory alerts

---

**Last Updated:** December 2025  
**Repository Owner:** CSRK-MA
