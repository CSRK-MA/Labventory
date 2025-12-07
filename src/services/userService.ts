import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export type UserRole = 'admin' | 'teacher' | 'lab-assistant' | 'student'; 

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: [
    'equipment:create',
    'equipment:read',
    'equipment:update',
    'equipment:delete',
    'chemical:create',
    'chemical:read',
    'chemical:update',
    'chemical:delete',
    'checkinout:create',
    'checkinout:read',
    'maintenance:create',
    'maintenance:read',
    'maintenance:update',
    'reports:generate',
    'users:manage',
    'settings:modify'
  ],
  teacher: [
    'equipment:read',
    'equipment:update',
    'chemical:read',
    'chemical:update',
    'checkinout:create',
    'checkinout:read',
    'maintenance:read',
    'reports:view'
  ],
  'lab-assistant': [
    'equipment:read',
    'chemical:read',
    'checkinout:create',
    'checkinout:read',
    'maintenance:create',
    'maintenance:read'
  ],
  // ✅ ADD STUDENT - Read-only access
  'student': [
    'equipment:read',
    'chemical:read',
    'checkinout:read',
    'maintenance:read',
    'reports:view'
  ]
};

// Create or update user profile
export const createUserProfile = async (uid: string, email: string, role: UserRole = 'lab-assistant') => {
  try {
    const userRef = doc(db, 'users', uid);
    const userProfile: UserProfile = {
      uid,
      email,
      role,
      permissions: ROLE_PERMISSIONS[role],
      createdAt: new Date()
    };
    
    await setDoc(userRef, userProfile);
    return { success: true, profile: userProfile };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user role
export const updateUserRole = async (uid: string, newRole: UserRole) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole]
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error };
  }
};

// Check if user has permission
export const hasPermission = (userProfile: UserProfile | null, permission: string): boolean => {
  if (!userProfile) return false;
  return userProfile.permissions.includes(permission);
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users: UserProfile[] = [];
    usersSnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};