# OOP Design Note: EduTrack Architecture

**Document:** Object-Oriented Programming Principles in EduTrack  
**Last Updated:** December 2025  
**Purpose:** Document how OOP principles are applied across the application architecture

---

## Table of Contents

1. [Encapsulation](#encapsulation)
2. [Inheritance](#inheritance)
3. [Polymorphism](#polymorphism)
4. [Summary & Benefits](#summary--benefits)

---

## Encapsulation

Encapsulation bundles data and methods together while hiding internal complexity. EduTrack implements encapsulation through context providers, service modules, and state management.

### 1. User Data Protection via UserContext

**File:** `src/contexts/UserContext.tsx`

The `UserContext` encapsulates user authentication state and profile information:

```typescript
interface UserContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const refreshUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };
  
  // ... subscription and cleanup logic
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
```

**Key Points:**
- User data is private to the context; direct manipulation is prevented.
- Only `userProfile`, `loading`, and `refreshUserProfile()` are exposed.
- Components access user data exclusively through the `useUser()` hook, ensuring centralized control.
- Authentication state changes automatically trigger profile updates.

### 2. Firebase Services Encapsulation

**File:** `src/services/firebaseService.ts`

Firebase operations are encapsulated in a dedicated service module:

```typescript
// Equipment Types
export interface Equipment {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired';
  location: string;
  condition?: string;
  purchaseDate?: Date;
  lastMaintenance?: Date;
  createdAt?: Date;
}

// Equipment operations
export const addEquipment = async (equipment: Equipment) => {
  try {
    const docRef = await addDoc(collection(db, 'equipment'), {
      ...equipment,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    // error handling
  }
};

export const subscribeToEquipment = (callback: (data: Equipment[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'equipment'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Equipment[];
    callback(data);
  });
  return unsubscribe;
};
```

**Key Points:**
- All Firestore operations (CRUD) are abstracted behind service functions.
- Internal Firebase implementation details are hidden; only data contracts (interfaces) are exposed.
- Real-time subscriptions are managed within the service, preventing scattered Firestore calls.
- Error handling is centralized within service methods.
- Similar patterns apply to Chemical, Maintenance, and CheckInOut operations.

### 3. State Management in store.tsx

**File:** `src/lib/store.tsx`

The application store encapsulates global state and provides a controlled interface:

```typescript
interface AppState {
  equipment: Equipment[];
  chemicals: Chemical[];
  checkoutLogs: CheckoutLog[];
  maintenanceTasks: MaintenanceTask[];
}

interface AppContextType extends AppState {
  // Equipment mutations
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  
  // Chemical mutations
  addChemical: (chemical: Omit<Chemical, 'id'>) => void;
  updateChemical: (id: string, chemical: Partial<Chemical>) => void;
  deleteChemical: (id: string) => void;
  
  // Checkout operations
  checkoutEquipment: (log: Omit<CheckoutLog, 'id' | 'timestamp' | 'status'>) => void;
  checkinEquipment: (logId: string) => void;
  
  // Maintenance operations
  // ...
}
```

**Key Points:**
- State is not directly accessible; components must use provided methods.
- State mutations are controlled; invalid operations are prevented at the API level.
- Each entity (Equipment, Chemical, Checkout, Maintenance) has explicit methods for CRUD operations.
- State initialization and synchronization logic is hidden from consumers.

---

## Inheritance

Inheritance allows classes/components to extend functionality and share common behavior. EduTrack leverages React component inheritance patterns.

### 1. Base Dashboard Component Pattern

**File:** `src/components/dashboard/DashboardOverview.tsx` (and related dashboard components)

A common dashboard structure is shared across multiple dashboard views:

```typescript
interface DashboardOverviewProps {
  userRole: 'admin' | 'teacher' | 'lab-assistant' | 'student' | null;
}

export function DashboardOverview({ userRole }: DashboardOverviewProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Shared real-time subscription pattern
  useEffect(() => {
    const unsubEquipment = subscribeToEquipment((data) => {
      setEquipment(data);
      setLoading(false);
    });
    return () => unsubEquipment();
  }, []);

  useEffect(() => {
    const unsubChemicals = subscribeToChemicals((data) => {
      setChemicals(data);
    });
    return () => unsubChemicals();
  }, []);

  // Role-based rendering logic
  // Specific dashboard views (CheckInOut, ChemicalTracker, etc.) 
  // extend this with specialized components
}
```

**Related Components:**
- `src/components/dashboard/CheckInOut.tsx` — Extends dashboard pattern for check-in/out operations
- `src/components/dashboard/ChemicalTracker.tsx` — Extends dashboard pattern for chemical tracking
- `src/components/dashboard/EquipmentList.tsx` — Extends dashboard pattern for equipment management
- `src/components/dashboard/MaintenanceTracker.tsx` — Extends dashboard pattern for maintenance

**Key Points:**
- All dashboard views follow the same subscription and state management pattern.
- Base behaviors (real-time updates, loading states, error handling) are replicated and specialized.
- Role-based logic (`userRole` prop) is inherited/shared across dashboard variants.

### 2. UI Component Hierarchy

**File:** `src/components/ui/` (button.tsx, card.tsx, form.tsx, etc.)

UI components follow a consistent inheritance pattern from React base components:

```typescript
// Base button component (abstracted from shadcn/ui)
import * as React from "react"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Inheritance Chain:**
- React.HTMLAttributes → Base HTML elements
- Shadcn/ui components (Button, Card, Dialog, etc.) → Extendable UI primitives
- EduTrack dashboard components → Use these base components

**Key Points:**
- All UI components inherit from React.Component or use hooks for shared functionality.
- Button variants (primary, secondary, destructive) are implemented through class/style inheritance.
- Form components inherit base input behaviors and add domain-specific validation.

---

## Polymorphism

Polymorphism allows objects of different types to be treated uniformly through a common interface. EduTrack implements polymorphism for role-based access and report handling.

### 1. Role-Based Polymorphic Behavior

**User Roles:**
- `admin` — Full system access, can manage users and system settings
- `teacher` — Can view and manage classroom equipment/chemicals
- `lab-assistant` — Can perform check-ins/check-outs and basic maintenance
- `student` — Can view available equipment and request checkouts

**Implementation Pattern:**

```typescript
// DashboardOverview.tsx
export function DashboardOverview({ userRole }: DashboardOverviewProps) {
  const renderDashboardContent = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard equipment={equipment} chemicals={chemicals} />;
      case 'teacher':
        return <TeacherDashboard equipment={equipment} />;
      case 'lab-assistant':
        return <LabAssistantDashboard equipment={equipment} />;
      case 'student':
        return <StudentDashboard equipment={equipment} />;
      default:
        return <PublicDashboard />;
    }
  };

  return <div>{renderDashboardContent()}</div>;
}
```

**Role-Specific Behaviors:**

| Role | Permissions | Visible Data |
|------|-----------|--------------|
| Admin | CRUD all resources, manage users, system settings | Everything |
| Teacher | CRUD equipment/chemicals, view reports, manage classes | Class-specific data |
| Lab Assistant | Check-in/out, perform maintenance, view logs | Checkout logs, maintenance tasks |
| Student | Request checkouts, view availability | Available equipment only |

**Polymorphic Interface:**
All roles satisfy a common interface for viewing data, but with different data exposure levels:

```typescript
interface RoleAction {
  viewEquipment: (filters?: FilterCriteria) => Equipment[];
  performCheckout?: (equipmentId: string) => void;
  approvCheckout?: (checkoutId: string) => void;
  manageMaintenance?: (equipmentId: string) => void;
  // ... more actions
}
```

### 2. Report Types with Polymorphic Interface

**Common Report Interface:**

```typescript
interface Report {
  id: string;
  title: string;
  type: 'equipment-usage' | 'chemical-inventory' | 'maintenance-schedule' | 'user-activity';
  generatedDate: Date;
  data: any[];
  exportAs: (format: 'pdf' | 'csv' | 'json') => void;
  generate: () => Promise<void>;
}
```

**Concrete Report Implementations:**

1. **Equipment Usage Report** — Tracks equipment check-in/out frequency
2. **Chemical Inventory Report** — Monitors stock levels and expiry dates
3. **Maintenance Schedule Report** — Lists pending and completed maintenance tasks
4. **User Activity Report** — Logs user interactions and access patterns

**Polymorphic Behavior:**

```typescript
const reports: Report[] = [
  new EquipmentUsageReport(equipment, checkoutLogs),
  new ChemicalInventoryReport(chemicals),
  new MaintenanceScheduleReport(maintenanceTasks),
  new UserActivityReport(activityLogs)
];

// All reports implement the same interface
reports.forEach(report => {
  report.generate().then(() => {
    report.exportAs('pdf');
  });
});
```

**Key Points:**
- Each report type encapsulates its own data processing logic.
- The report generator doesn't need to know specific report types; it calls the common interface.
- New report types can be added without modifying existing code (Open/Closed Principle).

---

## Summary & Benefits

### OOP Principles Applied

| Principle | Implementation | Benefit |
|-----------|---|---|
| **Encapsulation** | UserContext, firebaseService, store.tsx | Data protection, controlled access, centralized logic |
| **Inheritance** | Dashboard component patterns, UI hierarchy | Code reuse, consistent behavior, extensibility |
| **Polymorphism** | Role-based views, report types | Flexible behavior, scalable architecture, easy to extend |

### Architectural Benefits

1. **Maintainability** — Clear separation of concerns makes code easier to understand and modify.
2. **Reusability** — Common patterns (subscription, state mutation, role checks) are repeated across components.
3. **Extensibility** — New dashboard views, report types, or roles can be added with minimal changes to existing code.
4. **Testability** — Encapsulated services and clear interfaces enable unit testing.
5. **Scalability** — OOP structure supports adding new features without growing complexity.

### Design Patterns Used

- **Context Provider Pattern** — Encapsulation of global state (UserContext, AppStore)
- **Repository Pattern** — Service layer abstracts data access (firebaseService.ts)
- **Strategy Pattern** — Role-based behavior polymorphism
- **Factory Pattern** — Report generation based on type
- **Observer Pattern** — Real-time subscriptions to Firebase collections

---

## References

- `src/contexts/UserContext.tsx` — User encapsulation
- `src/services/firebaseService.ts` — Service encapsulation
- `src/lib/store.tsx` — State management encapsulation
- `src/components/dashboard/` — Dashboard component inheritance
- `src/components/ui/` — UI component inheritance
- `src/components/PermissionGuard.tsx` — Role-based polymorphism implementation

---

**End of Document**
