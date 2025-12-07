// src/hooks/useRealtimeEquipment.js
// Real-time hook for equipment data with automatic updates

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase';

/**
 * Real-time Equipment Hook
 * @param {Object} options - Query options { status, category, labId, limit }
 * @returns {Object} { equipment, loading, error, unsubscribe }
 */
export function useRealtimeEquipment(options = {}) {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Build query constraints
    const constraints = [];
    
    if (options.status) {
      constraints.push(where('status', '==', options.status));
    }
    
    if (options.category) {
      constraints.push(where('category', '==', options.category));
    }
    
    if (options.labId) {
      constraints.push(where('labId', '==', options.labId));
    }
    
    // Always order by creation date
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    // Create query
    const q = query(collection(db, COLLECTIONS.EQUIPMENT), ...constraints);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const equipmentData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          lastMaintenanceDate: doc.data().lastMaintenanceDate?.toDate(),
          nextMaintenanceDate: doc.data().nextMaintenanceDate?.toDate()
        }));

        setEquipment(equipmentData);
        setLoading(false);
        setError(null);

        console.log('📡 Real-time update: Equipment data updated', {
          count: equipmentData.length,
          timestamp: new Date().toISOString()
        });
      },
      (err) => {
        console.error('❌ Real-time equipment error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('🔌 Unsubscribing from equipment listener');
      unsubscribe();
    };
  }, [options.status, options.category, options.labId, options.limit]);

  return { equipment, loading, error };
}

/**
 * Real-time Equipment Statistics Hook
 * @returns {Object} { stats, loading, error }
 */
export function useRealtimeEquipmentStats() {
  const { equipment, loading, error } = useRealtimeEquipment();
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
    retired: 0,
    totalValue: 0,
    byCategory: {},
    byCondition: {}
  });

  useEffect(() => {
    if (!loading && equipment.length >= 0) {
      const newStats = {
        total: equipment.length,
        available: equipment.filter(e => e.status === 'available').length,
        inUse: equipment.filter(e => e.status === 'in-use').length,
        maintenance: equipment.filter(e => e.status === 'maintenance').length,
        retired: equipment.filter(e => e.status === 'retired').length,
        totalValue: equipment.reduce((sum, e) => sum + (e.purchasePrice || 0), 0),
        byCategory: equipment.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + 1;
          return acc;
        }, {}),
        byCondition: equipment.reduce((acc, e) => {
          acc[e.condition] = (acc[e.condition] || 0) + 1;
          return acc;
        }, {})
      };

      setStats(newStats);
      
      console.log('📊 Stats updated:', {
        total: newStats.total,
        available: newStats.available,
        inUse: newStats.inUse
      });
    }
  }, [equipment, loading]);

  return { stats, loading, error };
}

/**
 * Real-time Single Equipment Hook
 * @param {string} equipmentId - Equipment document ID
 * @returns {Object} { equipment, loading, error }
 */
export function useRealtimeEquipmentById(equipmentId) {
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!equipmentId) {
      setEquipment(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, COLLECTIONS.EQUIPMENT, equipmentId);

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setEquipment({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          });
        } else {
          setEquipment(null);
          setError('Equipment not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('❌ Real-time equipment error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [equipmentId]);

  return { equipment, loading, error };
}
