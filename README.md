
# Laboratory Management System

**EduTrack** is a comprehensive laboratory equipment and chemical inventory management system with real-time tracking, QR code scanning, and role-based access control. Built with React, TypeScript, Firebase, and Vite.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [User Roles](#user-roles)
- [Architecture](#architecture)
- [Contributing](#contributing)

---

## ✨ Features

### Core Features
- **Real-Time Check-In/Out** — Instant equipment checkout and return with live updates
- **QR Code Integration** — Generate and scan QR codes for equipment tracking
- **Equipment Tracking** — Comprehensive equipment inventory with status monitoring
- **Chemical Inventory** — Manage hazardous chemicals with expiry tracking
- **Maintenance Scheduling** — Track equipment maintenance history and schedule future maintenance
- **Multi-User Support** — Role-based access control (Admin, Teacher, Lab Assistant, Student)
- **Real-Time Database** — Firebase Firestore for instant data synchronization
- **Custom Data Entry** — Flexible forms for adding custom equipment and chemical data

### Advanced Features
- **Activity Dashboard** — Real-time activity logs and analytics
- **User Management** — Create, update, and manage user accounts and roles
- **Report Generation** — Equipment usage, chemical inventory, and maintenance reports
- **Permission Guards** — Role-based UI and feature access control
- **Settings Management** — User preferences and system configuration
- **Notification System** — Real-time alerts for maintenance schedules and important events

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ and npm/yarn
- Google account for Firebase setup
- Git (for cloning the repository)

### Installation

```bash
# Clone the repository
git clone https://github.com/CSRK-MA/Labventory.git
cd Labventory

# Install dependencies
npm install

# Configure Firebase (see Configuration section below)
# Edit src/firebase.js with your Firebase credentials

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
Labventory/
├── src/
│   ├── components/           # React UI components
│   │   ├── dashboard/       # Dashboard views (Overview, Check-In, etc.)
│   │   ├── ui/              # Shadcn/UI base components
│   │   ├── figma/           # Figma integration components
│   │   ├── firebase/        # Firebase-specific components
│   │   ├── qr/              # QR code generation and scanning
│   │   ├── App.tsx          # Main application component
│   │   ├── Dashboard.tsx    # Dashboard container
│   │   ├── SignIn.tsx       # Authentication UI
│   │   └── Header.tsx       # Navigation header
│   │
│   ├── services/            # Backend integration & utilities
│   │   ├── firebaseService.ts    # Firestore CRUD operations
│   │   ├── firebaseHelpers.js    # Firebase utility functions
│   │   ├── userService.ts        # User management
│   │   └── ...
│   │
│   ├── contexts/            # React Context providers
│   │   └── UserContext.tsx  # Global user authentication state
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useRealtimeCheckInOut.js    # Real-time checkout hook
│   │   ├── useRealtimeChemicals.js     # Real-time chemicals hook
│   │   └── useRealtimeEquipment.js     # Real-time equipment hook
│   │
│   ├── lib/                 # Utilities and stores
│   │   └── store.tsx        # Global state management
│   │
│   ├── styles/              # CSS styles
│   │   └── globals.css      # Global styles
│   │
│   ├── firebase.js          # Firebase configuration
│   ├── firestore.rules      # Firestore security rules
│   ├── main.tsx             # React entry point
│   └── index.css            # Root styles
│
├── docs/                    # Documentation
│   ├── PROJECT_INFO.md              # Project overview
│   ├── DATABASE_SCHEMA.sql          # Database schema
│   ├── ER_DIAGRAM.md                # Entity relationship diagram
│   ├── RELATIONAL_SCHEMA.md         # Relational schema documentation
│   ├── NAVIGATION_FLOW.md           # Application navigation flow
│   ├── OOP_DESIGN_NOTE.md           # OOP design principles
│   ├── FIREBASE_SETUP_GUIDE.md      # Firebase setup instructions
│   ├── FIREBASE_INTEGRATION_SUMMARY.md  # Firebase integration details
│   ├── SEQUENCE_DIAGRAM_CHECKIN.svg     # Check-in sequence diagram
│   ├── ACTIVITY_DIAGRAM_MAINTENANCE.svg # Maintenance activity diagram
│   └── USE_CASES.md                 # Use case documentation
│
├── build/                   # Production build output
├── public/                  # Static assets
├── package.json             # Project dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## 🛠 Technology Stack

### Frontend
- **React 18** — UI library with hooks
- **TypeScript** — Type-safe development
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **Shadcn/UI** — High-quality React component library

### Backend & Database
- **Firebase** — Real-time database and authentication
  - Firestore — NoSQL document database
  - Firebase Authentication — User authentication and management
  - Firebase Hosting — Application deployment

### Libraries & Tools
- **React Hook Form** — Form management
- **React Context API** — Global state management
- **Lucide React** — Icon library
- **QR Code Libraries** — `qrcode.react`, `html5-qrcode`, `jsqr`
- **Radix UI** — Accessible component primitives

---

## ⚙️ Setup & Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/CSRK-MA/Labventory.git
cd Labventory
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Create a Firestore database
4. Enable Firebase Authentication (Email/Password)
5. Copy your Firebase config credentials

6. Create `src/firebase.js` or update existing configuration:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

7. Set up Firestore security rules (`src/firestore.rules`):
   - See `FIREBASE_SETUP_GUIDE.md` for detailed instructions

### Step 4: Start Development Server
```bash
npm run dev
```

Access the application at `http://localhost:5173`

---

## 📚 Configuration

### Firebase Setup
Detailed Firebase integration instructions available in:
- `docs/FIREBASE_SETUP_GUIDE.md` — Complete setup walkthrough
- `docs/FIREBASE_INTEGRATION_SUMMARY.md` — Integration details
- `src/firestore.rules` — Security rules template

### Environment Variables
Create a `.env.local` file for sensitive data:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📜 Available Scripts

### Development
```bash
# Start development server with hot reload
npm run dev
```

### Production
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Other Commands
```bash
# Install dependencies
npm install

# Update dependencies
npm update

# View installed packages
npm list
```

---

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

| Document | Purpose |
|----------|---------|
| `PROJECT_INFO.md` | Project overview and objectives |
| `DATABASE_SCHEMA.sql` | SQL schema for reference |
| `ER_DIAGRAM.md` | Entity relationship diagram |
| `RELATIONAL_SCHEMA.md` | Database structure documentation |
| `NAVIGATION_FLOW.md` | Application navigation and routing |
| `OOP_DESIGN_NOTE.md` | Object-oriented design principles |
| `FIREBASE_SETUP_GUIDE.md` | Firebase configuration |
| `FIREBASE_INTEGRATION_SUMMARY.md` | Firebase integration details |
| `SEQUENCE_DIAGRAM_CHECKIN.svg` | Check-in sequence diagram |
| `ACTIVITY_DIAGRAM_MAINTENANCE.svg` | Maintenance activity diagram |
| `USE_CASES.md` | User stories and use cases |
| `DIAGRAMS_README.md` | Instructions for exporting diagrams to PNG |

---

## 👥 User Roles

The system supports four main user roles with different permissions:

### 1. Admin
- Full system access
- Manage all users and roles
- Configure system settings
- View all reports and analytics

### 2. Teacher
- Manage classroom equipment and chemicals
- View and approve student checkouts
- Schedule equipment maintenance
- Access class-specific reports

### 3. Lab Assistant
- Perform equipment check-in/check-out
- Conduct maintenance tasks
- Update equipment status
- View activity logs

### 4. Student
- View available equipment
- Request equipment checkout
- View checkout history
- Access lab guidelines

---

## 🏗 Architecture

### Component Hierarchy
```
App
├── Header (Navigation)
├── Dashboard (Main container)
│   ├── DashboardSidebar (Navigation menu)
│   ├── DashboardOverview (Statistics & recent activity)
│   ├── CheckInOut (Check-in/check-out operations)
│   ├── ChemicalTracker (Chemical inventory)
│   ├── EquipmentList (Equipment management)
│   ├── MaintenanceTracker (Maintenance scheduling)
│   ├── UserManagement (User administration)
│   ├── Reports (Report generation)
│   └── Settings (Configuration)
└── Footer
```

### Data Flow
```
User Action → Component → Service Layer → Firebase → Real-time Updates → UI
```

### State Management
- **Global State** — `UserContext` for authentication, `AppStore` for application state
- **Local State** — React hooks for component-level state
- **Real-Time Updates** — Firebase subscriptions for instant data sync

---

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team at the project repository

---

## 📚 References

### Official Documentation
- [Firebase Documentation](https://firebase.google.com/docs) — Cloud platform services
- [React Documentation](https://react.dev) — UI library and hooks
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) — Type system reference
- [Vite Documentation](https://vitejs.dev) — Build tool and development server
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) — Utility-first CSS framework
- [Shadcn/UI Components](https://ui.shadcn.com) — Component library reference

### Libraries & Tools
- [qrcode.react](https://www.npmjs.com/package/qrcode.react) — QR code generation
- [html5-qrcode](https://www.npmjs.com/package/html5-qrcode) — QR code scanning
- [jsqr](https://www.npmjs.com/package/jsqr) — QR code decoder
- [React Hook Form](https://react-hook-form.com) — Form management library
- [Radix UI](https://www.radix-ui.com) — Accessible component primitives
- [Lucide React](https://lucide.dev) — Icon library

### Design & Architecture
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/) — Security best practices
- [Web Accessibility (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref/) — Accessibility standards
- [RESTful API Best Practices](https://restfulapi.net/) — API design principles
- [Google Firebase Best Practices](https://firebase.google.com/docs/firestore/best-practices) — Database optimization

### Project Resources
- **Repository:** https://github.com/CSRK-MA/Labventory
- **Figma Design:** https://www.figma.com/design/7yZuoqpqEpZOPytjVSd6nR/EduTrack-Inventory-Platform
- **Issue Tracker:** https://github.com/CSRK-MA/Labventory/issues
- **Project Board:** https://github.com/CSRK-MA/Labventory/projects

### Related Documentation
- `docs/FINAL_REPORT.md` — Comprehensive project report
- `docs/ARCHITECTURE_DOCUMENTATION.md` — System architecture
- `docs/OOP_DESIGN_NOTE.md` — Design patterns used
- `docs/FIREBASE_INTEGRATION_SUMMARY.md` — Firebase implementation
- `docs/TEST_PLAN.md` — Testing methodology and results
- `docs/USER_MANUAL.md` — User guide and FAQ

### Development Tools
- **Node.js/npm** — JavaScript runtime and package manager
- **Git** — Version control system
- **Visual Studio Code** — Recommended code editor
- **Firebase Emulator Suite** — Local Firebase development

### Additional Resources
- [Firestore Query Documentation](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)
- [TypeScript React Patterns](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

## 🔗 Quick Links

- **Repository:** https://github.com/CSRK-MA/Labventory
- **Firebase Console:** https://console.firebase.google.com/
- **React Documentation:** https://react.dev
- **Vite Documentation:** https://vitejs.dev
- **Original Figma Design:** https://www.figma.com/design/7yZuoqpqEpZOPytjVSd6nR/EduTrack-Inventory-Platform

---

**Last Updated:** December 2025  
**Version:** 0.1.0  
**Status:** Active Development  
