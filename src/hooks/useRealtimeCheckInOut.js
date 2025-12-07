// src/hooks/useRealtimeCheckInOut.js
// Real-time hook for check-in/out transactions

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
 * Real-time Check-In/Out Hook
 * @param {Object} options - Query options { userId, itemId, action, limit }
 * @returns {Object} { transactions, loading, error }
 */
export function useRealtimeCheckInOut(options = {}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    const q = query(collection(db, COLLECTIONS.CHECKINOUT), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const transactionData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          checkOutTime: doc.data().checkOutTime?.toDate(),
          expectedReturnTime: doc.data().expectedReturnTime?.toDate(),
          actualReturnTime: doc.data().actualReturnTime?.toDate(),
          createdAt: doc.data().createdAt?.toDate()
        }));

        setTransactions(transactionData);
        setLoading(false);
        setError(null);

        console.log('📡 Real-time update: Check-in/out data updated', {
          count: transactionData.length,
          timestamp: new Date().toISOString()
        });
      },
      (err) => {
        console.error('❌ Real-time check-in/out error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [options.userId, options.itemId, options.action, options.limit]);

  return { transactions, loading, error };
}

/**
 * Real-time Active Checkouts Hook (items currently checked out)
 * @returns {Object} { activeCheckouts, loading, error }
 */
export function useRealtimeActiveCheckouts() {
  const [activeCheckouts, setActiveCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.CHECKINOUT),
      where('action', '==', 'check-out'),
      where('returned', '==', false),
      orderBy('checkOutTime', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const checkouts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          checkOutTime: doc.data().checkOutTime?.toDate(),
          expectedReturnTime: doc.data().expectedReturnTime?.toDate()
        }));

        setActiveCheckouts(checkouts);
        setLoading(false);
        setError(null);

        console.log('📡 Active checkouts:', checkouts.length);
      },
      (err) => {
        console.error('❌ Real-time active checkouts error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { activeCheckouts, loading, error };
}

/**
 * Real-time Overdue Items Hook
 * @returns {Object} { overdueItems, loading, error }
 */
export function useRealtimeOverdueItems() {
  const { activeCheckouts, loading, error } = useRealtimeActiveCheckouts();
  const [overdueItems, setOverdueItems] = useState([]);

  useEffect(() => {
    if (!loading && activeCheckouts.length >= 0) {
      const now = new Date();
      const overdue = activeCheckouts.filter(checkout => 
        checkout.expectedReturnTime && checkout.expectedReturnTime < now
      );

      setOverdueItems(overdue);

      if (overdue.length > 0) {
        console.warn('⚠️ Overdue items:', overdue.length);
      }
    }
  }, [activeCheckouts, loading]);

  return { overdueItems, loading, error };
}
