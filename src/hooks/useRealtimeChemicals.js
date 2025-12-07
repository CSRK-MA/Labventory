// src/hooks/useRealtimeChemicals.js
// Real-time hook for chemicals with automatic updates and alerts

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase';

/**
 * Real-time Chemicals Hook
 * @param {Object} options - Query options
 * @returns {Object} { chemicals, loading, error }
 */
export function useRealtimeChemicals(options = {}) {
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const constraints = [];
    
    if (options.hazardLevel) {
      constraints.push(where('hazardLevel', '==', options.hazardLevel));
    }
    
    if (options.labId) {
      constraints.push(where('labId', '==', options.labId));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, COLLECTIONS.CHEMICALS), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chemicalData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          expiryDate: doc.data().expiryDate?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));

        setChemicals(chemicalData);
        setLoading(false);
        setError(null);

        console.log('📡 Real-time update: Chemicals data updated', {
          count: chemicalData.length,
          timestamp: new Date().toISOString()
        });
      },
      (err) => {
        console.error('❌ Real-time chemicals error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [options.hazardLevel, options.labId]);

  return { chemicals, loading, error };
}

/**
 * Real-time Low Stock Chemicals Hook
 * @returns {Object} { lowStockChemicals, loading, error }
 */
export function useRealtimeLowStockChemicals() {
  const { chemicals, loading, error } = useRealtimeChemicals();
  const [lowStockChemicals, setLowStockChemicals] = useState([]);

  useEffect(() => {
    if (!loading && chemicals.length >= 0) {
      const lowStock = chemicals.filter(chem => 
        chem.quantity <= chem.minimumStock
      );
      setLowStockChemicals(lowStock);

      if (lowStock.length > 0) {
        console.warn('⚠️ Low stock alert:', lowStock.length, 'chemicals below minimum');
      }
    }
  }, [chemicals, loading]);

  return { lowStockChemicals, loading, error };
}

/**
 * Real-time Expiring Chemicals Hook
 * @param {number} daysAhead - Days to look ahead for expiration
 * @returns {Object} { expiringChemicals, loading, error }
 */
export function useRealtimeExpiringChemicals(daysAhead = 30) {
  const { chemicals, loading, error } = useRealtimeChemicals();
  const [expiringChemicals, setExpiringChemicals] = useState([]);

  useEffect(() => {
    if (!loading && chemicals.length >= 0) {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const expiring = chemicals.filter(chem => {
        if (!chem.expiryDate) return false;
        return chem.expiryDate >= now && chem.expiryDate <= futureDate;
      }).sort((a, b) => a.expiryDate - b.expiryDate);

      setExpiringChemicals(expiring);

      if (expiring.length > 0) {
        console.warn('⚠️ Expiry alert:', expiring.length, `chemicals expiring in ${daysAhead} days`);
      }
    }
  }, [chemicals, loading, daysAhead]);

  return { expiringChemicals, loading, error };
}

/**
 * Real-time Chemical Statistics Hook
 * @returns {Object} { stats, loading, error }
 */
export function useRealtimeChemicalStats() {
  const { chemicals, loading, error } = useRealtimeChemicals();
  const { lowStockChemicals } = useRealtimeLowStockChemicals();
  const { expiringChemicals } = useRealtimeExpiringChemicals(30);

  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    expiringSoon: 0,
    byHazardLevel: {},
    byCategory: {}
  });

  useEffect(() => {
    if (!loading && chemicals.length >= 0) {
      const newStats = {
        total: chemicals.length,
        lowStock: lowStockChemicals.length,
        expiringSoon: expiringChemicals.length,
        byHazardLevel: chemicals.reduce((acc, c) => {
          acc[c.hazardLevel || 'unspecified'] = (acc[c.hazardLevel || 'unspecified'] || 0) + 1;
          return acc;
        }, {}),
        byCategory: chemicals.reduce((acc, c) => {
          acc[c.category] = (acc[c.category] || 0) + 1;
          return acc;
        }, {})
      };

      setStats(newStats);
    }
  }, [chemicals, lowStockChemicals, expiringChemicals, loading]);

  return { stats, loading, error };
}
