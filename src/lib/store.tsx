import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
export interface Equipment {
  id: string;
  name: string;
  category: string;
  lab: string;
  status: 'Available' | 'In Use' | 'Maintenance';
  condition: string;
  lastMaintenance: string;
  location: string;
  description?: string;
  purchaseDate?: string;
  cost?: string;
}

export interface Chemical {
  id: string;
  name: string;
  formula: string;
  quantity: string;
  unit: string;
  hazardLevel: 'High' | 'Medium' | 'Low';
  expiryDate: string;
  location: string;
  supplier: string;
  description?: string;
}

export interface CheckoutLog {
  id: string;
  equipmentId: string;
  equipment: string;
  userId: string;
  user: string;
  userRole: string;
  action: 'Checked Out' | 'Returned';
  timestamp: string;
  expectedReturn: string;
  status: 'Active' | 'Completed' | 'Overdue';
  notes?: string;
}

export interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipment: string;
  type: string;
  scheduledDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Scheduled';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  notes?: string;
  completedDate?: string;
}

interface AppState {
  equipment: Equipment[];
  chemicals: Chemical[];
  checkoutLogs: CheckoutLog[];
  maintenanceTasks: MaintenanceTask[];
}

interface AppContextType extends AppState {
  // Equipment
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  
  // Chemicals
  addChemical: (chemical: Omit<Chemical, 'id'>) => void;
  updateChemical: (id: string, chemical: Partial<Chemical>) => void;
  deleteChemical: (id: string) => void;
  
  // Checkout
  checkoutEquipment: (log: Omit<CheckoutLog, 'id' | 'timestamp' | 'status'>) => void;
  checkinEquipment: (logId: string) => void;
  
  // Maintenance
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  updateMaintenanceTask: (id: string, task: Partial<MaintenanceTask>) => void;
  deleteMaintenanceTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial data
const initialEquipment: Equipment[] = [
  {
    id: "M-234",
    name: "Digital Microscope",
    category: "Biology",
    lab: "Lab A",
    status: "Available",
    condition: "Good",
    lastMaintenance: "2024-11-15",
    location: "Shelf 3A",
    description: "High-resolution digital microscope with camera",
    purchaseDate: "2023-01-15",
    cost: "$2,500"
  },
  {
    id: "C-445",
    name: "Centrifuge",
    category: "Chemistry",
    lab: "Lab B",
    status: "In Use",
    condition: "Excellent",
    lastMaintenance: "2024-10-20",
    location: "Bench 2",
    description: "High-speed laboratory centrifuge",
    purchaseDate: "2022-08-10",
    cost: "$3,200"
  },
  {
    id: "B-102",
    name: "Bunsen Burner",
    category: "Chemistry",
    lab: "Lab A",
    status: "Available",
    condition: "Good",
    lastMaintenance: "2024-09-05",
    location: "Cabinet 1",
    purchaseDate: "2021-03-20",
    cost: "$150"
  },
  {
    id: "P-567",
    name: "pH Meter",
    category: "Chemistry",
    lab: "Lab C",
    status: "Maintenance",
    condition: "Fair",
    lastMaintenance: "2024-11-28",
    location: "Repair Room",
    purchaseDate: "2022-06-12",
    cost: "$450"
  },
  {
    id: "S-889",
    name: "Spectrophotometer",
    category: "Physics",
    lab: "Lab B",
    status: "Available",
    condition: "Excellent",
    lastMaintenance: "2024-11-10",
    location: "Counter 4",
    purchaseDate: "2023-09-05",
    cost: "$5,800"
  }
];

const initialChemicals: Chemical[] = [
  {
    id: "CH-001",
    name: "Hydrochloric Acid",
    formula: "HCl",
    quantity: "2.5",
    unit: "Liters",
    hazardLevel: "High",
    expiryDate: "2025-06-15",
    location: "Cabinet A1",
    supplier: "ChemSupply Co."
  },
  {
    id: "CH-002",
    name: "Sodium Hydroxide",
    formula: "NaOH",
    quantity: "1.8",
    unit: "Kilograms",
    hazardLevel: "High",
    expiryDate: "2025-03-20",
    location: "Cabinet A2",
    supplier: "LabChem Inc."
  },
  {
    id: "CH-003",
    name: "Ethanol",
    formula: "C2H5OH",
    quantity: "5.0",
    unit: "Liters",
    hazardLevel: "Medium",
    expiryDate: "2025-12-01",
    location: "Cabinet B1",
    supplier: "ChemSupply Co."
  },
  {
    id: "CH-004",
    name: "Acetic Acid",
    formula: "CH3COOH",
    quantity: "0.5",
    unit: "Liters",
    hazardLevel: "Medium",
    expiryDate: "2025-01-10",
    location: "Cabinet A3",
    supplier: "ScienceLab Supplies"
  },
  {
    id: "CH-005",
    name: "Distilled Water",
    formula: "H2O",
    quantity: "20.0",
    unit: "Liters",
    hazardLevel: "Low",
    expiryDate: "2026-01-01",
    location: "Storage Room",
    supplier: "LabChem Inc."
  }
];

const initialCheckoutLogs: CheckoutLog[] = [
  {
    id: "LOG-001",
    equipmentId: "M-234",
    equipment: "Microscope #M-234",
    userId: "U-001",
    user: "Sarah Mitchell",
    userRole: "Teacher",
    action: "Checked Out",
    timestamp: "2024-12-01 09:30 AM",
    expectedReturn: "2024-12-01 03:00 PM",
    status: "Active"
  },
  {
    id: "LOG-002",
    equipmentId: "B-102",
    equipment: "Bunsen Burner #B-102",
    userId: "U-002",
    user: "James Chen",
    userRole: "Student",
    action: "Returned",
    timestamp: "2024-12-01 08:45 AM",
    expectedReturn: "2024-12-01 12:00 PM",
    status: "Completed"
  },
  {
    id: "LOG-003",
    equipmentId: "P-567",
    equipment: "pH Meter #P-567",
    userId: "U-003",
    user: "Maria Rodriguez",
    userRole: "Lab Assistant",
    action: "Checked Out",
    timestamp: "2024-12-01 07:15 AM",
    expectedReturn: "2024-12-01 02:00 PM",
    status: "Overdue"
  },
  {
    id: "LOG-004",
    equipmentId: "C-445",
    equipment: "Centrifuge #C-445",
    userId: "U-004",
    user: "David Kim",
    userRole: "Teacher",
    action: "Checked Out",
    timestamp: "2024-12-01 06:30 AM",
    expectedReturn: "2024-12-01 04:00 PM",
    status: "Active"
  }
];

const initialMaintenanceTasks: MaintenanceTask[] = [
  {
    id: "M-001",
    equipmentId: "C-445",
    equipment: "Centrifuge #C-445",
    type: "Scheduled Maintenance",
    scheduledDate: "2024-12-05",
    status: "Pending",
    priority: "Medium",
    assignedTo: "Lab Technician"
  },
  {
    id: "M-002",
    equipmentId: "P-567",
    equipment: "pH Meter #P-567",
    type: "Repair",
    scheduledDate: "2024-11-28",
    status: "In Progress",
    priority: "High",
    assignedTo: "John Smith"
  },
  {
    id: "M-003",
    equipmentId: "M-234",
    equipment: "Microscope #M-234",
    type: "Calibration",
    scheduledDate: "2024-12-10",
    status: "Scheduled",
    priority: "Low",
    assignedTo: "Sarah Johnson"
  },
  {
    id: "M-004",
    equipmentId: "S-889",
    equipment: "Spectrophotometer #S-889",
    type: "Scheduled Maintenance",
    scheduledDate: "2024-11-25",
    status: "Completed",
    priority: "Medium",
    assignedTo: "Lab Technician",
    completedDate: "2024-11-25"
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [checkoutLogs, setCheckoutLogs] = useState<CheckoutLog[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedEquipment = localStorage.getItem('equipment');
    const savedChemicals = localStorage.getItem('chemicals');
    const savedCheckoutLogs = localStorage.getItem('checkoutLogs');
    const savedMaintenanceTasks = localStorage.getItem('maintenanceTasks');

    setEquipment(savedEquipment ? JSON.parse(savedEquipment) : initialEquipment);
    setChemicals(savedChemicals ? JSON.parse(savedChemicals) : initialChemicals);
    setCheckoutLogs(savedCheckoutLogs ? JSON.parse(savedCheckoutLogs) : initialCheckoutLogs);
    setMaintenanceTasks(savedMaintenanceTasks ? JSON.parse(savedMaintenanceTasks) : initialMaintenanceTasks);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (equipment.length > 0) {
      localStorage.setItem('equipment', JSON.stringify(equipment));
    }
  }, [equipment]);

  useEffect(() => {
    if (chemicals.length > 0) {
      localStorage.setItem('chemicals', JSON.stringify(chemicals));
    }
  }, [chemicals]);

  useEffect(() => {
    if (checkoutLogs.length > 0) {
      localStorage.setItem('checkoutLogs', JSON.stringify(checkoutLogs));
    }
  }, [checkoutLogs]);

  useEffect(() => {
    if (maintenanceTasks.length > 0) {
      localStorage.setItem('maintenanceTasks', JSON.stringify(maintenanceTasks));
    }
  }, [maintenanceTasks]);

  // Equipment operations
  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const id = `E-${Date.now()}`;
    setEquipment([...equipment, { ...newEquipment, id }]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(equipment.map(eq => eq.id === id ? { ...eq, ...updates } : eq));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
  };

  // Chemical operations
  const addChemical = (newChemical: Omit<Chemical, 'id'>) => {
    const id = `CH-${Date.now()}`;
    setChemicals([...chemicals, { ...newChemical, id }]);
  };

  const updateChemical = (id: string, updates: Partial<Chemical>) => {
    setChemicals(chemicals.map(chem => chem.id === id ? { ...chem, ...updates } : chem));
  };

  const deleteChemical = (id: string) => {
    setChemicals(chemicals.filter(chem => chem.id !== id));
  };

  // Checkout operations
  const checkoutEquipment = (log: Omit<CheckoutLog, 'id' | 'timestamp' | 'status'>) => {
    const id = `LOG-${Date.now()}`;
    const timestamp = new Date().toLocaleString();
    const newLog: CheckoutLog = { ...log, id, timestamp, status: 'Active' };
    setCheckoutLogs([newLog, ...checkoutLogs]);
    
    // Update equipment status
    if (log.action === 'Checked Out') {
      updateEquipment(log.equipmentId, { status: 'In Use' });
    }
  };

  const checkinEquipment = (logId: string) => {
    const log = checkoutLogs.find(l => l.id === logId);
    if (log) {
      setCheckoutLogs(checkoutLogs.map(l =>
        l.id === logId ? { ...l, action: 'Returned', status: 'Completed' } : l
      ));
      updateEquipment(log.equipmentId, { status: 'Available' });
    }
  };

  // Maintenance operations
  const addMaintenanceTask = (task: Omit<MaintenanceTask, 'id'>) => {
    const id = `M-${Date.now()}`;
    setMaintenanceTasks([...maintenanceTasks, { ...task, id }]);
  };

  const updateMaintenanceTask = (id: string, updates: Partial<MaintenanceTask>) => {
    setMaintenanceTasks(maintenanceTasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
    
    // If task is completed, update equipment status
    if (updates.status === 'Completed') {
      const task = maintenanceTasks.find(t => t.id === id);
      if (task) {
        updateEquipment(task.equipmentId, { 
          status: 'Available',
          lastMaintenance: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const deleteMaintenanceTask = (id: string) => {
    setMaintenanceTasks(maintenanceTasks.filter(task => task.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        equipment,
        chemicals,
        checkoutLogs,
        maintenanceTasks,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addChemical,
        updateChemical,
        deleteChemical,
        checkoutEquipment,
        checkinEquipment,
        addMaintenanceTask,
        updateMaintenanceTask,
        deleteMaintenanceTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
