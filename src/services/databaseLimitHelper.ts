/**
 * Database Operations with Built-in Limits & Safety Checks
 * 
 * This module provides wrapper functions around Firestore operations
 * with automatic handling of limits and best practices
 */

import {
  collection,
  writeBatch,
  getDocs,
  query,
  limit,
  startAfter,
  Query,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// ============================================
// CONFIGURATION & LIMITS
// ============================================

const LIMITS = {
  MAX_BATCH_SIZE: 500,
  MAX_QUERY_RESULTS: 20000,
  MAX_DOCUMENT_SIZE: 1048576, // 1 MB
  RECOMMENDED_BATCH_SIZE: 100, // Conservative
  RECOMMENDED_DOC_SIZE: 102400, // 100 KB
  PAGE_SIZE: 50, // Default pagination size
};

interface PageInfo {
  pageSize: number;
  hasNextPage: boolean;
  lastDoc?: DocumentData;
}

interface PaginationResult<T> {
  data: T[];
  pageInfo: PageInfo;
  total?: number;
}

// ============================================
// BATCH OPERATIONS WITH SAFETY
// ============================================

/**
 * Safe batch write operation
 * Automatically chunks documents if > 500
 */
export const safeBatchWrite = async (
  collectionName: string,
  documents: any[],
  operation: 'set' | 'update' | 'delete' = 'set'
): Promise<{ success: boolean; written: number; errors: any[] }> => {
  if (!documents.length) {
    return { success: true, written: 0, errors: [] };
  }

  const errors: any[] = [];
  let written = 0;

  // Split into chunks of LIMITS.MAX_BATCH_SIZE
  for (let i = 0; i < documents.length; i += LIMITS.MAX_BATCH_SIZE) {
    const chunk = documents.slice(i, i + LIMITS.MAX_BATCH_SIZE);
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionName);

    try {
      for (const doc of chunk) {
        const docRef = doc.id ? doc(collectionRef, doc.id) : doc(collectionRef);
        
        switch (operation) {
          case 'set':
            batch.set(docRef, doc.data || doc);
            break;
          case 'update':
            batch.update(docRef, doc.data || doc);
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      }

      await batch.commit();
      written += chunk.length;
    } catch (error) {
      errors.push({
        chunk: i / LIMITS.MAX_BATCH_SIZE,
        error
      });
    }
  }

  return {
    success: errors.length === 0,
    written,
    errors
  };
};

// ============================================
// PAGINATION HELPER
// ============================================

/**
 * Safe paginated query
 * Returns data with pagination info
 */
export const paginatedQuery = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  pageSize: number = LIMITS.PAGE_SIZE,
  lastDocData?: DocumentData
): Promise<PaginationResult<T>> => {
  try {
    // Build query with constraints + limit
    const queryConstraints = [
      ...constraints,
      limit(pageSize + 1) // Fetch one extra to check if more exists
    ];

    // Add pagination constraint
    if (lastDocData) {
      queryConstraints.splice(queryConstraints.length - 1, 0, startAfter(lastDocData));
    }

    const q = query(collection(db, collectionName), ...queryConstraints);
    const snapshot = await getDocs(q);

    const docs = snapshot.docs.slice(0, pageSize).map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    const hasNextPage = snapshot.docs.length > pageSize;
    const lastDoc = docs.length > 0 ? snapshot.docs[pageSize - 1] : undefined;

    return {
      data: docs,
      pageInfo: {
        pageSize: docs.length,
        hasNextPage,
        lastDoc: lastDoc?.data()
      }
    };
  } catch (error) {
    console.error('Pagination query error:', error);
    return {
      data: [],
      pageInfo: {
        pageSize: 0,
        hasNextPage: false
      }
    };
  }
};

// ============================================
// SAFE DATA FETCHING
// ============================================

/**
 * Fetch with automatic size checking
 */
export const safeFetchCollection = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  maxDocuments: number = 1000
): Promise<{ data: T[]; warnings: string[]; info: string }> => {
  const warnings: string[] = [];

  try {
    const queryConstraints = [
      ...constraints,
      limit(maxDocuments + 1) // Fetch one extra to detect overflow
    ];

    const q = query(collection(db, collectionName), ...queryConstraints);
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > maxDocuments) {
      warnings.push(
        `Collection returned ${snapshot.docs.length} documents. ` +
        `Results limited to first ${maxDocuments}. Use pagination for complete results.`
      );
    }

    const data = snapshot.docs
      .slice(0, maxDocuments)
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

    return {
      data,
      warnings,
      info: `Fetched ${data.length} documents from ${collectionName}`
    };
  } catch (error: any) {
    return {
      data: [],
      warnings: [error.message],
      info: `Error fetching from ${collectionName}`
    };
  }
};

// ============================================
// DATA SIZE VALIDATION
// ============================================

/**
 * Check document size before writing
 */
export const validateDocumentSize = (doc: any): { valid: boolean; message: string; sizeKB: number } => {
  const jsonString = JSON.stringify(doc);
  const sizeBytes = new Blob([jsonString]).size;
  const sizeKB = sizeBytes / 1024;

  if (sizeBytes > LIMITS.MAX_DOCUMENT_SIZE) {
    return {
      valid: false,
      message: `Document exceeds 1 MB limit (${sizeKB.toFixed(2)} KB)`,
      sizeKB
    };
  }

  if (sizeKB > LIMITS.RECOMMENDED_DOC_SIZE / 1024) {
    return {
      valid: true,
      message: `Warning: Document is ${sizeKB.toFixed(2)} KB. Recommended < 100 KB for optimal performance`,
      sizeKB
    };
  }

  return {
    valid: true,
    message: `Document size OK (${sizeKB.toFixed(2)} KB)`,
    sizeKB
  };
};

// ============================================
// ARRAY FIELD OPTIMIZATION
// ============================================

/**
 * Split array fields into subcollection if too large
 */
export const handleLargeArray = (
  arrayField: any[],
  threshold: number = 1000
): { useArray: boolean; recommendation: string } => {
  if (arrayField.length > threshold) {
    return {
      useArray: false,
      recommendation: `Array has ${arrayField.length} elements. Use subcollection instead.`
    };
  }

  if (arrayField.length > 100) {
    return {
      useArray: true,
      recommendation: `Array has ${arrayField.length} elements. Consider subcollection for better performance.`
    };
  }

  return {
    useArray: true,
    recommendation: `Array size is optimal (${arrayField.length} elements)`
  };
};

// ============================================
// WRITE RATE LIMITER
// ============================================

/**
 * Implement exponential backoff for rate limiting
 */
export const writeWithBackoff = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  initialDelayMs: number = 100
): Promise<{ success: boolean; data?: any; error?: string }> => {
  let delayMs = initialDelayMs;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error: any) {
      // Check if rate limit error
      if (error.code === 'resource-exhausted' || error.code === 'aborted') {
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
          delayMs *= 2; // Exponential backoff
        } else {
          return { success: false, error: `Failed after ${maxRetries} retries: ${error.message}` };
        }
      } else {
        return { success: false, error: error.message };
      }
    }
  }

  return { success: false, error: 'Unknown error in write operation' };
};

// ============================================
// PERFORMANCE MONITORING
// ============================================

interface OperationMetrics {
  operation: string;
  durationMs: number;
  documentCount: number;
  successRate: number;
  bytesTransferred: number;
}

export const measureOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  estimatedBytes: number = 0
): Promise<{ result: T; metrics: OperationMetrics }> => {
  const startTime = performance.now();
  const result = await operation();
  const duration = performance.now() - startTime;

  const metrics: OperationMetrics = {
    operation: operationName,
    durationMs: duration,
    documentCount: Array.isArray(result) ? result.length : 1,
    successRate: 100,
    bytesTransferred: estimatedBytes
  };

  // Log if operation was slow
  if (duration > 5000) {
    console.warn(`⚠️ Slow operation: ${operationName} took ${duration.toFixed(2)}ms`);
  }

  return { result, metrics };
};

// ============================================
// EXPORT CONFIGURATION
// ============================================

export const getDatabaseLimits = () => ({
  ...LIMITS,
  recommendations: {
    documentSize: 'Keep < 100 KB for optimal performance',
    batchSize: 'Use 100-500 documents per batch',
    paginationSize: '50-100 documents per page',
    queryConcurrency: '< 100 concurrent queries',
    realtimeListeners: '< 100 concurrent listeners'
  }
});

// ============================================
// HEALTH CHECK
// ============================================

export const performDatabaseHealthCheck = async (): Promise<{
  healthy: boolean;
  checks: Array<{ name: string; status: 'pass' | 'fail' | 'warn'; message: string }>;
}> => {
  const checks = [];

  try {
    // Test simple read
    const q = query(collection(db, 'equipment'), limit(1));
    const snapshot = await getDocs(q);
    checks.push({
      name: 'Basic Read Operation',
      status: 'pass',
      message: 'Successfully read from database'
    });
  } catch (error: any) {
    checks.push({
      name: 'Basic Read Operation',
      status: 'fail',
      message: error.message
    });
  }

  return {
    healthy: checks.every(c => c.status !== 'fail'),
    checks
  };
};

export { LIMITS };
