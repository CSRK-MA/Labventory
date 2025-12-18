/**
 * Duplicate Detection Service
 * 
 * Prevents duplicate data entry and provides options to update existing records
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Equipment, Chemical, Maintenance } from './firebaseService';

interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingId?: string;
  existingData?: any;
  message: string;
  suggestions: {
    canUpdate: boolean;
    canCreateNew: boolean;
  };
}

// ============================================
// EQUIPMENT DUPLICATE DETECTION
// ============================================

/**
 * Check if equipment with same name already exists
 */
export const checkEquipmentDuplicate = async (
  equipmentName: string,
  excludeId?: string
): Promise<DuplicateCheckResult> => {
  try {
    const q = query(
      collection(db, 'equipment'),
      where('name', '==', equipmentName.trim())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        isDuplicate: false,
        message: 'Equipment name is available',
        suggestions: {
          canUpdate: false,
          canCreateNew: true
        }
      };
    }

    const existingDoc = snapshot.docs[0];

    // If checking the same document (update case), it's not a duplicate
    if (excludeId && existingDoc.id === excludeId) {
      return {
        isDuplicate: false,
        message: 'Equipment name is available',
        suggestions: {
          canUpdate: true,
          canCreateNew: true
        }
      };
    }

    return {
      isDuplicate: true,
      existingId: existingDoc.id,
      existingData: existingDoc.data(),
      message: `Equipment "${equipmentName}" already exists. You can update the existing record instead.`,
      suggestions: {
        canUpdate: true,
        canCreateNew: false
      }
    };
  } catch (error) {
    console.error('Error checking equipment duplicate:', error);
    return {
      isDuplicate: false,
      message: 'Unable to check for duplicates',
      suggestions: {
        canUpdate: false,
        canCreateNew: true
      }
    };
  }
};

// ============================================
// CHEMICAL DUPLICATE DETECTION
// ============================================

/**
 * Check if chemical with same name and formula already exists
 */
export const checkChemicalDuplicate = async (
  name: string,
  formula?: string,
  excludeId?: string
): Promise<DuplicateCheckResult> => {
  try {
    let q;

    // If formula provided, check both name and formula
    if (formula) {
      q = query(
        collection(db, 'chemicals'),
        where('name', '==', name.trim()),
        where('formula', '==', formula.trim())
      );
    } else {
      // Otherwise just check name
      q = query(
        collection(db, 'chemicals'),
        where('name', '==', name.trim())
      );
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        isDuplicate: false,
        message: 'Chemical is new and available',
        suggestions: {
          canUpdate: false,
          canCreateNew: true
        }
      };
    }

    const existingDoc = snapshot.docs[0];

    // If checking the same document (update case), it's not a duplicate
    if (excludeId && existingDoc.id === excludeId) {
      return {
        isDuplicate: false,
        message: 'Chemical name is available',
        suggestions: {
          canUpdate: true,
          canCreateNew: true
        }
      };
    }

    return {
      isDuplicate: true,
      existingId: existingDoc.id,
      existingData: existingDoc.data(),
      message: `Chemical "${name}${formula ? ` (${formula})` : ''}" already exists. You can update the quantity instead.`,
      suggestions: {
        canUpdate: true,
        canCreateNew: false
      }
    };
  } catch (error) {
    console.error('Error checking chemical duplicate:', error);
    return {
      isDuplicate: false,
      message: 'Unable to check for duplicates',
      suggestions: {
        canUpdate: false,
        canCreateNew: true
      }
    };
  }
};

// ============================================
// MAINTENANCE DUPLICATE DETECTION
// ============================================

/**
 * Check if maintenance record for same equipment and date already exists
 */
export const checkMaintenanceDuplicate = async (
  equipmentId: string,
  maintenanceType: string,
  scheduledDate: Date,
  excludeId?: string
): Promise<DuplicateCheckResult> => {
  try {
    // Get all maintenance records for this equipment
    const q = query(
      collection(db, 'maintenance'),
      where('equipmentId', '==', equipmentId)
    );

    const snapshot = await getDocs(q);

    // Check if any record matches type and date
    const dateString = new Date(scheduledDate).toDateString();
    const duplicate = snapshot.docs.find(doc => {
      const data = doc.data();
      const docDateString = new Date(data.scheduledDate.toDate()).toDateString();
      return (
        data.type === maintenanceType &&
        docDateString === dateString &&
        (!excludeId || doc.id !== excludeId)
      );
    });

    if (!duplicate) {
      return {
        isDuplicate: false,
        message: 'Maintenance record is new',
        suggestions: {
          canUpdate: false,
          canCreateNew: true
        }
      };
    }

    return {
      isDuplicate: true,
      existingId: duplicate.id,
      existingData: duplicate.data(),
      message: `A "${maintenanceType}" maintenance record already exists for this equipment on this date. You can update it instead.`,
      suggestions: {
        canUpdate: true,
        canCreateNew: false
      }
    };
  } catch (error) {
    console.error('Error checking maintenance duplicate:', error);
    return {
      isDuplicate: false,
      message: 'Unable to check for duplicates',
      suggestions: {
        canUpdate: false,
        canCreateNew: true
      }
    };
  }
};

// ============================================
// UPDATE EXISTING RECORD
// ============================================

/**
 * Update existing equipment instead of creating duplicate
 */
export const updateExistingEquipment = async (
  existingId: string,
  updates: Partial<Equipment>
): Promise<{ success: boolean; message: string }> => {
  try {
    const docRef = doc(db, 'equipment', existingId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });

    return {
      success: true,
      message: `Equipment updated successfully`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error updating equipment: ${error.message}`
    };
  }
};

/**
 * Update existing chemical instead of creating duplicate
 */
export const updateExistingChemical = async (
  existingId: string,
  updates: Partial<Chemical>
): Promise<{ success: boolean; message: string }> => {
  try {
    const docRef = doc(db, 'chemicals', existingId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });

    return {
      success: true,
      message: `Chemical updated successfully`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error updating chemical: ${error.message}`
    };
  }
};

/**
 * Update existing maintenance record
 */
export const updateExistingMaintenance = async (
  existingId: string,
  updates: Partial<Maintenance>
): Promise<{ success: boolean; message: string }> => {
  try {
    const docRef = doc(db, 'maintenance', existingId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });

    return {
      success: true,
      message: `Maintenance record updated successfully`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error updating maintenance: ${error.message}`
    };
  }
};

// ============================================
// BULK DUPLICATE CHECK
// ============================================

/**
 * Check multiple items for duplicates
 */
export const checkMultipleDuplicates = async (
  items: Array<{ type: 'equipment' | 'chemical' | 'maintenance'; data: any }>,
  excludeIds?: string[]
): Promise<Array<DuplicateCheckResult & { itemIndex: number }>> => {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const excludeId = excludeIds?.[i];
    let result: DuplicateCheckResult;

    switch (item.type) {
      case 'equipment':
        result = await checkEquipmentDuplicate(item.data.name, excludeId);
        break;
      case 'chemical':
        result = await checkChemicalDuplicate(
          item.data.name,
          item.data.formula,
          excludeId
        );
        break;
      case 'maintenance':
        result = await checkMaintenanceDuplicate(
          item.data.equipmentId,
          item.data.type,
          item.data.scheduledDate,
          excludeId
        );
        break;
      default:
        result = {
          isDuplicate: false,
          message: 'Unknown type',
          suggestions: { canUpdate: false, canCreateNew: true }
        };
    }

    results.push({
      ...result,
      itemIndex: i
    });
  }

  return results;
};

// ============================================
// BATCH IMPORT WITH DUPLICATE HANDLING
// ============================================

interface ImportOptions {
  onDuplicate: 'skip' | 'update' | 'create'; // What to do when duplicate found
  skipValidation?: boolean;
}

export const importWithDuplicateHandling = async (
  items: Array<{ type: 'equipment' | 'chemical'; data: any }>,
  options: ImportOptions = { onDuplicate: 'skip' }
): Promise<{
  imported: number;
  skipped: number;
  updated: number;
  errors: Array<{ index: number; error: string }>;
}> => {
  let imported = 0;
  let skipped = 0;
  let updated = 0;
  const errors = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    try {
      let duplicateCheck: DuplicateCheckResult;

      if (item.type === 'equipment') {
        duplicateCheck = await checkEquipmentDuplicate(item.data.name);
      } else {
        duplicateCheck = await checkChemicalDuplicate(item.data.name, item.data.formula);
      }

      if (duplicateCheck.isDuplicate) {
        switch (options.onDuplicate) {
          case 'skip':
            skipped++;
            break;
          case 'update':
            if (duplicateCheck.existingId) {
              const result = 
                item.type === 'equipment'
                  ? await updateExistingEquipment(duplicateCheck.existingId, item.data)
                  : await updateExistingChemical(duplicateCheck.existingId, item.data);
              
              if (result.success) {
                updated++;
              } else {
                errors.push({ index: i, error: result.message });
              }
            }
            break;
          case 'create':
            // Allow creating even if duplicate
            imported++;
            break;
        }
      } else {
        imported++;
      }
    } catch (error: any) {
      errors.push({ index: i, error: error.message });
    }
  }

  return {
    imported,
    skipped,
    updated,
    errors
  };
};

export type { DuplicateCheckResult };
