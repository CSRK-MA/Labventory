// src/services/firebaseHelpers.js
// Additional Firebase helper functions for CRUD operations

import { 
  collection, 
  addDoc, 
  getDoc,
  getDocs, 
  updateDoc,
  deleteDoc,
  doc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase';

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Add a new equipment item
 * @param {Object} equipmentData - Equipment data object
 * @returns {Promise<Object>} Created equipment with ID
 */
export const addEquipment = async (equipmentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EQUIPMENT), {
      ...equipmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error adding equipment:', error);
    throw error;
  }
};

/**
 * Add a new chemical
 * @param {Object} chemicalData - Chemical data object
 * @returns {Promise<Object>} Created chemical with ID
 */
export const addChemical = async (chemicalData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CHEMICALS), {
      ...chemicalData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error adding chemical:', error);
    throw error;
  }
};

/**
 * Create a check-in/out transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Created transaction with ID
 */
export const createCheckInOut = async (transactionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CHECKINOUT), {
      ...transactionData,
      createdAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get all equipment items
 * @param {Object} options - Query options (labId, status, category)
 * @returns {Promise<Array>} Array of equipment items
 */
export const getAllEquipment = async (options = {}) => {
  try {
    let q = collection(db, COLLECTIONS.EQUIPMENT);
    
    // Build query with filters
    const constraints = [];
    
    if (options.labId) {
      constraints.push(where('labId', '==', options.labId));
    }
    
    if (options.status) {
      constraints.push(where('status', '==', options.status));
    }
    
    if (options.category) {
      constraints.push(where('category', '==', options.category));
    }
    
    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Add limit if specified
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

/**
 * Get equipment by ID
 * @param {string} equipmentId - Equipment document ID
 * @returns {Promise<Object|null>} Equipment object or null
 */
export const getEquipmentById = async (equipmentId) => {
  try {
    const docRef = doc(db, COLLECTIONS.EQUIPMENT, equipmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    throw error;
  }
};

/**
 * Get all chemicals
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of chemicals
 */
export const getAllChemicals = async (options = {}) => {
  try {
    let q = collection(db, COLLECTIONS.CHEMICALS);
    const constraints = [];
    
    if (options.labId) {
      constraints.push(where('labId', '==', options.labId));
    }
    
    if (options.hazardLevel) {
      constraints.push(where('hazardLevel', '==', options.hazardLevel));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      expiryDate: doc.data().expiryDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching chemicals:', error);
    throw error;
  }
};

/**
 * Get low stock chemicals
 * @returns {Promise<Array>} Array of chemicals with low stock
 */
export const getLowStockChemicals = async () => {
  try {
    // Note: Firestore doesn't support comparing two fields directly
    // This would need to be filtered client-side or use Cloud Functions
    const allChemicals = await getAllChemicals();
    return allChemicals.filter(chem => chem.quantity <= chem.minimumStock);
  } catch (error) {
    console.error('Error fetching low stock chemicals:', error);
    throw error;
  }
};

/**
 * Get expiring chemicals
 * @param {number} daysAhead - Number of days to check ahead
 * @returns {Promise<Array>} Array of expiring chemicals
 */
export const getExpiringChemicals = async (daysAhead = 30) => {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    const q = query(
      collection(db, COLLECTIONS.CHEMICALS),
      where('expiryDate', '<=', Timestamp.fromDate(futureDate)),
      where('expiryDate', '>=', Timestamp.now()),
      orderBy('expiryDate', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      expiryDate: doc.data().expiryDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching expiring chemicals:', error);
    throw error;
  }
};

/**
 * Get check-in/out history
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Array of transactions
 */
export const getCheckInOutHistory = async (options = {}) => {
  try {
    let q = collection(db, COLLECTIONS.CHECKINOUT);
    const constraints = [];
    
    if (options.userId) {
      constraints.push(where('userId', '==', options.userId));
    }
    
    if (options.itemId) {
      constraints.push(where('itemId', '==', options.itemId));
    }
    
    if (options.action) {
      constraints.push(where('action', '==', options.action));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkOutTime: doc.data().checkOutTime?.toDate(),
      expectedReturnTime: doc.data().expectedReturnTime?.toDate(),
      actualReturnTime: doc.data().actualReturnTime?.toDate(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching check-in/out history:', error);
    throw error;
  }
};

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update equipment
 * @param {string} equipmentId - Equipment ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated equipment
 */
export const updateEquipment = async (equipmentId, updates) => {
  try {
    const docRef = doc(db, COLLECTIONS.EQUIPMENT, equipmentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return await getEquipmentById(equipmentId);
  } catch (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }
};

/**
 * Update equipment status
 * @param {string} equipmentId - Equipment ID
 * @param {string} status - New status (available, in-use, maintenance, retired)
 * @returns {Promise<Object>} Updated equipment
 */
export const updateEquipmentStatus = async (equipmentId, status) => {
  return await updateEquipment(equipmentId, { status });
};

/**
 * Update chemical quantity
 * @param {string} chemicalId - Chemical ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated chemical
 */
export const updateChemicalQuantity = async (chemicalId, quantity) => {
  try {
    const docRef = doc(db, COLLECTIONS.CHEMICALS, chemicalId);
    await updateDoc(docRef, {
      quantity,
      updatedAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error updating chemical quantity:', error);
    throw error;
  }
};

/**
 * Update chemical
 * @param {string} chemicalId - Chemical ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated chemical
 */
export const updateChemical = async (chemicalId, updates) => {
  try {
    const docRef = doc(db, COLLECTIONS.CHEMICALS, chemicalId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error updating chemical:', error);
    throw error;
  }
};

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete equipment
 * @param {string} equipmentId - Equipment ID
 * @returns {Promise<void>}
 */
export const deleteEquipment = async (equipmentId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EQUIPMENT, equipmentId));
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
};

/**
 * Delete chemical
 * @param {string} chemicalId - Chemical ID
 * @returns {Promise<void>}
 */
export const deleteChemical = async (chemicalId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CHEMICALS, chemicalId));
  } catch (error) {
    console.error('Error deleting chemical:', error);
    throw error;
  }
};

/**
 * Delete check-in/out transaction
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<void>}
 */
export const deleteCheckInOut = async (transactionId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CHECKINOUT, transactionId));
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// ============================================
// SEARCH OPERATIONS
// ============================================

/**
 * Search equipment by name or code
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} Matching equipment items
 */
export const searchEquipment = async (searchTerm) => {
  try {
    // Note: This is a basic implementation
    // For full-text search, consider using Algolia or ElasticSearch
    const searchUpper = searchTerm.toUpperCase();
    
    const allEquipment = await getAllEquipment();
    
    return allEquipment.filter(item => 
      item.itemName?.toUpperCase().includes(searchUpper) ||
      item.itemCode?.toUpperCase().includes(searchUpper) ||
      item.brand?.toUpperCase().includes(searchUpper) ||
      item.model?.toUpperCase().includes(searchUpper) ||
      item.serialNumber?.toUpperCase().includes(searchUpper)
    );
  } catch (error) {
    console.error('Error searching equipment:', error);
    throw error;
  }
};

/**
 * Search chemicals
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} Matching chemicals
 */
export const searchChemicals = async (searchTerm) => {
  try {
    const searchUpper = searchTerm.toUpperCase();
    const allChemicals = await getAllChemicals();
    
    return allChemicals.filter(item => 
      item.chemicalName?.toUpperCase().includes(searchUpper) ||
      item.chemicalCode?.toUpperCase().includes(searchUpper) ||
      item.casNumber?.toUpperCase().includes(searchUpper) ||
      item.formula?.toUpperCase().includes(searchUpper)
    );
  } catch (error) {
    console.error('Error searching chemicals:', error);
    throw error;
  }
};

// ============================================
// STATISTICS AND REPORTS
// ============================================

/**
 * Get equipment statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getEquipmentStats = async () => {
  try {
    const allEquipment = await getAllEquipment();
    
    return {
      total: allEquipment.length,
      available: allEquipment.filter(e => e.status === 'available').length,
      inUse: allEquipment.filter(e => e.status === 'in-use').length,
      maintenance: allEquipment.filter(e => e.status === 'maintenance').length,
      retired: allEquipment.filter(e => e.status === 'retired').length,
      totalValue: allEquipment.reduce((sum, e) => sum + (e.purchasePrice || 0), 0),
      byCategory: allEquipment.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + 1;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting equipment stats:', error);
    throw error;
  }
};

/**
 * Get chemical statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getChemicalStats = async () => {
  try {
    const allChemicals = await getAllChemicals();
    const lowStock = allChemicals.filter(c => c.quantity <= c.minimumStock);
    
    const now = new Date();
    const expiringSoon = allChemicals.filter(c => {
      if (!c.expiryDate) return false;
      const daysUntilExpiry = (c.expiryDate - now) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    });
    
    return {
      total: allChemicals.length,
      lowStock: lowStock.length,
      expiringSoon: expiringSoon.length,
      byHazardLevel: allChemicals.reduce((acc, c) => {
        acc[c.hazardLevel] = (acc[c.hazardLevel] || 0) + 1;
        return acc;
      }, {}),
      byCategory: allChemicals.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting chemical stats:', error);
    throw error;
  }
};

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Batch add equipment items
 * @param {Array} equipmentList - Array of equipment objects
 * @returns {Promise<Array>} Array of created equipment with IDs
 */
export const batchAddEquipment = async (equipmentList) => {
  try {
    const promises = equipmentList.map(equipment => addEquipment(equipment));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error batch adding equipment:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  // Create
  addEquipment,
  addChemical,
  createCheckInOut,
  
  // Read
  getAllEquipment,
  getEquipmentById,
  getAllChemicals,
  getLowStockChemicals,
  getExpiringChemicals,
  getCheckInOutHistory,
  
  // Update
  updateEquipment,
  updateEquipmentStatus,
  updateChemical,
  updateChemicalQuantity,
  
  // Delete
  deleteEquipment,
  deleteChemical,
  deleteCheckInOut,
  
  // Search
  searchEquipment,
  searchChemicals,
  
  // Statistics
  getEquipmentStats,
  getChemicalStats,
  
  // Batch
  batchAddEquipment
};
