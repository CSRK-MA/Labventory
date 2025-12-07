import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

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

// Chemical Types
export interface Chemical {
  id?: string;
  name: string;
  formula: string;
  quantity: number;
  unit: string;
  hazardLevel: 'Low' | 'Medium' | 'High';
  location: string;
  expiryDate?: Date;
  supplier?: string;
  createdAt?: Date;
}

// Check In/Out Types
export interface CheckInOut {
  id?: string;
  itemId: string;
  itemName: string;
  itemType: 'equipment' | 'chemical';
  userName: string;
  userEmail: string;
  action: 'check-in' | 'check-out';
  quantity: number;
  purpose?: string;
  timestamp: Date;
}

// Maintenance Types
export interface Maintenance {
  id?: string;
  equipmentId: string;
  equipmentName: string;
  type: 'Repair' | 'Inspection' | 'Calibration' | 'Cleaning';
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  scheduledDate: Date;
  completedDate?: Date;
  technician?: string;
  cost?: number;
}

// ============================================
// EQUIPMENT OPERATIONS
// ============================================

export const addEquipment = async (equipment: Equipment) => {
  try {
    const docRef = await addDoc(collection(db, 'equipment'), {
      ...equipment,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding equipment:', error);
    return { success: false, error };
  }
};

export const updateEquipment = async (id: string, equipment: Partial<Equipment>) => {
  try {
    await updateDoc(doc(db, 'equipment', id), equipment);
    return { success: true };
  } catch (error) {
    console.error('Error updating equipment:', error);
    return { success: false, error };
  }
};

export const deleteEquipment = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'equipment', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return { success: false, error };
  }
};

export const getEquipment = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'equipment'));
    const equipment: Equipment[] = [];
    querySnapshot.forEach((doc) => {
      equipment.push({ id: doc.id, ...doc.data() } as Equipment);
    });
    return equipment;
  } catch (error) {
    console.error('Error getting equipment:', error);
    return [];
  }
};

export const subscribeToEquipment = (callback: (equipment: Equipment[]) => void) => {
  try {
    const q = query(collection(db, 'equipment'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const equipment: Equipment[] = [];
      snapshot.forEach((doc) => {
        equipment.push({ id: doc.id, ...doc.data() } as Equipment);
      });
      callback(equipment);
    }, (error) => {
      console.error('Error in subscribeToEquipment:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up equipment subscription:', error);
    return () => {};
  }
};

// ============================================
// CHEMICAL OPERATIONS
// ============================================

export const addChemical = async (chemical: Chemical) => {
  try {
    const docRef = await addDoc(collection(db, 'chemicals'), {
      ...chemical,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding chemical:', error);
    return { success: false, error };
  }
};

export const updateChemical = async (id: string, chemical: Partial<Chemical>) => {
  try {
    await updateDoc(doc(db, 'chemicals', id), chemical);
    return { success: true };
  } catch (error) {
    console.error('Error updating chemical:', error);
    return { success: false, error };
  }
};

export const deleteChemical = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'chemicals', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting chemical:', error);
    return { success: false, error };
  }
};

export const getChemicals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'chemicals'));
    const chemicals: Chemical[] = [];
    querySnapshot.forEach((doc) => {
      chemicals.push({ id: doc.id, ...doc.data() } as Chemical);
    });
    return chemicals;
  } catch (error) {
    console.error('Error getting chemicals:', error);
    return [];
  }
};

export const subscribeToChemicals = (callback: (chemicals: Chemical[]) => void) => {
  try {
    const q = query(collection(db, 'chemicals'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const chemicals: Chemical[] = [];
      snapshot.forEach((doc) => {
        chemicals.push({ id: doc.id, ...doc.data() } as Chemical);
      });
      callback(chemicals);
    }, (error) => {
      console.error('Error in subscribeToChemicals:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up chemicals subscription:', error);
    return () => {};
  }
};

// ============================================
// CHECK IN/OUT OPERATIONS
// ============================================

export const addCheckInOut = async (checkInOut: CheckInOut) => {
  try {
    const docRef = await addDoc(collection(db, 'checkInOut'), {
      ...checkInOut,
      timestamp: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding check in/out:', error);
    return { success: false, error };
  }
};

export const getCheckInOutHistory = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'checkInOut'));
    const history: CheckInOut[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as CheckInOut);
    });
    return history;
  } catch (error) {
    console.error('Error getting check in/out history:', error);
    return [];
  }
};

// ============================================
// MAINTENANCE OPERATIONS
// ============================================

export const addMaintenance = async (maintenance: Maintenance) => {
  try {
    const docRef = await addDoc(collection(db, 'maintenance'), maintenance);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding maintenance:', error);
    return { success: false, error };
  }
};

export const updateMaintenance = async (id: string, maintenance: Partial<Maintenance>) => {
  try {
    await updateDoc(doc(db, 'maintenance', id), maintenance);
    return { success: true };
  } catch (error) {
    console.error('Error updating maintenance:', error);
    return { success: false, error };
  }
};

export const getMaintenanceRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'maintenance'));
    const records: Maintenance[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as Maintenance);
    });
    return records;
  } catch (error) {
    console.error('Error getting maintenance records:', error);
    return [];
  }
};