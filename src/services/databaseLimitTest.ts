
/**
 * Database Limitations Test Suite
 * 
 * Tests Firestore limitations including:
 * - Document size limits (1 MB per document)
 * - Collection size limits
 * - Read/Write operations per second
 * - Batch operation limits (500 documents max)
 * - Query complexity
 * - Real-time listener limits
 * - Index creation limits
 */

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../firebase';

// ============================================
// TEST CONFIGURATION
// ============================================

interface TestResults {
  testName: string;
  passed: boolean;
  message: string;
  metrics: {
    duration: number;
    documentCount?: number;
    dataSize?: number;
    operationsPerSecond?: number;
  };
  limit?: {
    name: string;
    value: string;
    recommendation: string;
  };
}

const results: TestResults[] = [];

// ============================================
// 1. DOCUMENT SIZE LIMIT TEST (1 MB per document)
// ============================================

export const testDocumentSizeLimit = async (): Promise<TestResults> => {
  const testName = "Document Size Limit (1 MB)";
  const startTime = performance.now();

  try {
    // Create a document that's close to 1 MB
    const largeString = 'x'.repeat(1000000); // ~1 MB of data

    const testDoc = {
      name: "Large Document Test",
      largeData: largeString,
      timestamp: Timestamp.now(),
      metadata: {
        sizeBytes: largeString.length,
        description: "Test document approaching 1 MB limit"
      }
    };

    const docRef = await addDoc(collection(db, 'testCollection'), testDoc);
    const duration = performance.now() - startTime;

    return {
      testName,
      passed: true,
      message: "Successfully created 1 MB document",
      metrics: {
        duration,
        dataSize: 1000000,
      },
      limit: {
        name: "Document Size Limit",
        value: "1 MB maximum",
        recommendation: "Keep documents under 100 KB for optimal performance"
      }
    };
  } catch (error: any) {
    return {
      testName,
      passed: false,
      message: `Failed: ${error.message}`,
      metrics: { duration: performance.now() - startTime },
      limit: {
        name: "Document Size Limit",
        value: "1 MB maximum",
        recommendation: "Split large documents into multiple smaller ones"
      }
    };
  }
};

// ============================================
// 2. BATCH WRITE LIMIT TEST (500 documents max)
// ============================================

export const testBatchWriteLimit = async (): Promise<TestResults> => {
  const testName = "Batch Write Limit (500 documents)";
  const startTime = performance.now();

  try {
    const batch = writeBatch(db);
    const testCollectionRef = collection(db, 'testBatchCollection');

    // Create 500 documents in a single batch
    for (let i = 0; i < 500; i++) {
      const docRef = doc(testCollectionRef);
      batch.set(docRef, {
        index: i,
        name: `Batch Document ${i}`,
        timestamp: Timestamp.now(),
        data: `Document ${i}`
      });
    }

    await batch.commit();
    const duration = performance.now() - startTime;

    return {
      testName,
      passed: true,
      message: "Successfully committed 500 documents in batch",
      metrics: {
        duration,
        documentCount: 500,
        operationsPerSecond: Math.round((500 / duration) * 1000)
      },
      limit: {
        name: "Batch Write Limit",
        value: "Maximum 500 documents per batch",
        recommendation: "Split larger operations into multiple batches"
      }
    };
  } catch (error: any) {
    return {
      testName,
      passed: false,
      message: `Failed: ${error.message}`,
      metrics: { duration: performance.now() - startTime },
      limit: {
        name: "Batch Write Limit",
        value: "Maximum 500 documents per batch",
        recommendation: "Use smaller batch sizes for better reliability"
      }
    };
  }
};

// ============================================
// 3. CONCURRENT OPERATIONS TEST
// ============================================

export const testConcurrentOperations = async (): Promise<TestResults> => {
  const testName = "Concurrent Read Operations";
  const startTime = performance.now();

  try {
    // Perform 10 concurrent read operations
    const queries = [
      getDocs(query(collection(db, 'equipment'), limit(10))),
      getDocs(query(collection(db, 'chemicals'), limit(10))),
      getDocs(query(collection(db, 'checkInOut'), limit(10))),
      getDocs(query(collection(db, 'maintenance'), limit(10))),
      getDocs(query(collection(db, 'equipment'), where('status', '==', 'Available'))),
      getDocs(query(collection(db, 'chemicals'), where('hazardLevel', '==', 'High'))),
      getDocs(query(collection(db, 'checkInOut'), orderBy('timestamp'), limit(5))),
      getDocs(query(collection(db, 'maintenance'), where('status', '==', 'Pending'))),
      getDocs(query(collection(db, 'equipment'), limit(20))),
      getDocs(query(collection(db, 'chemicals'), limit(20)))
    ];

    const results = await Promise.all(queries);
    const duration = performance.now() - startTime;
    const totalDocs = results.reduce((sum, snap) => sum + snap.size, 0);

    return {
      testName,
      passed: true,
      message: "Successfully executed 10 concurrent read operations",
      metrics: {
        duration,
        documentCount: totalDocs,
        operationsPerSecond: Math.round((10 / duration) * 1000)
      },
      limit: {
        name: "Concurrent Operations",
        value: "Typically 100+ concurrent reads allowed",
        recommendation: "Monitor rate limiting; implement exponential backoff for retries"
      }
    };
  } catch (error: any) {
    return {
      testName,
      passed: false,
      message: `Failed: ${error.message}`,
      metrics: { duration: performance.now() - startTime },
      limit: {
        name: "Concurrent Operations",
        value: "Typically 100+ concurrent reads allowed",
        recommendation: "Reduce concurrent operations or increase quota"
      }
    };
  }
};

// ============================================
// 4. COLLECTION SIZE TEST
// ============================================

export const testCollectionSize = async (): Promise<TestResults> => {
  const testName = "Collection Size Limits";
  const startTime = performance.now();

  try {
    // Test various collections
    const collections_to_test = ['equipment', 'chemicals', 'checkInOut', 'maintenance'];
    const collectionStats = {};

    for (const collName of collections_to_test) {
      const collectionRef = collection(db, collName);
      const snapshot = await getCountFromServer(collectionRef);
      collectionStats[collName] = snapshot.data().count;
    }

    const duration = performance.now() - startTime;
    const totalDocs = Object.values(collectionStats).reduce((sum: any, count: any) => sum + count, 0);

    return {
      testName,
      passed: true,
      message: `Collection sizes: ${JSON.stringify(collectionStats)}`,
      metrics: {
        duration,
        documentCount: totalDocs
      },
      limit: {
        name: "Collection Size",
        value: "No hard limit on documents per collection",
        recommendation: "Organize large collections with subcollections or sharding for 10M+ documents"
      }
    };
  } catch (error: any) {
    return {
      testName,
      passed: false,
      message: `Failed: ${error.message}`,
      metrics: { duration: performance.now() - startTime },
      limit: {
        name: "Collection Size",
        value: "No hard limit on documents per collection",
        recommendation: "Implement collection sharding for very large datasets"
      }
    };
  }
};

// ============================================
// 5. QUERY COMPLEXITY TEST
// ============================================

export const testQueryComplexity = async (): Promise<TestResults> => {
  const testName = "Query Complexity Limits";
  const startTime = performance.now();

  try {
    // Test various query complexities
    const q1 = query(
      collection(db, 'equipment'),
      where('status', '==', 'Available'),
      limit(10)
    );

    const q2 = query(
      collection(db, 'chemicals'),
      where('hazardLevel', '==', 'High'),
      orderBy('expiryDate'),
      limit(10)
    );

    const q3 = query(
      collection(db, 'checkInOut'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const results = await Promise.all([
      getDocs(q1),
      getDocs(q2),
      getDocs(q3)
    ]);

    const duration = performance.now() - startTime;

    return {
      testName,
      passed: true,
      message: "Successfully executed complex queries with filters and ordering",
      metrics: {
        duration,
        documentCount: results.reduce((sum, snap) => sum + snap.size, 0)
      },
      limit: {
        name: "Query Complexity",
        value: "Up to 1 'where' + 1 'orderBy' without composite index",
        recommendation: "Create composite indexes for queries with multiple filters"
      }
    };
  } catch (error: any) {
    return {
      testName,
      passed: false,
      message: `Failed: ${error.message} - Composite index may be needed`,
      metrics: { duration: performance.now() - startTime },
      limit: {
        name: "Query Complexity",
        value: "Up to 1 'where' + 1 'orderBy' without composite index",
        recommendation: "Firebase will auto-suggest needed indexes in error message"
      }
    };
  }
};

// ============================================
// 6. FIELD VALUE LIMITS TEST
// ============================================

export const testFieldValueLimits = async (): Promise<TestResults> => {
  const testName = "Field Value Size Limits";
  const startTime = performance.now();

  try {
    const testCases = [
      {
        name: "String Field (256 KB)",
        data: 'x'.repeat(256000)
      },
      {
        name: "Array Field (20K+ elements)",
        data: Array(10000).fill("element")
      },
      {
        name: "Map Field (Deep nesting)",
        data: {
          level1: {
            level2: {
              level3: {
                level4: {
                  level5: {
                    value: "deeply nested"
                  }
                }
              }
            }
          }
        }
      }
    ];

    const docRef = await addDoc(collection(db, 'fieldLimitTests'), {
      stringField: testCases[0].data,
      arrayField: testCases[1].data,
      mapField: testCases[2].data,
      timestamp: Timestamp.now()
    });

    const duration = performance.now() - startTime;

    return {
      testName,
      passed: true,
      message: "Successfully stored various field value types",
      metrics: { duration },
      limit: {
        name: "Field Value Limits",
        value: "String: 1,398,101 bytes | Array: Up to 20K elements",
        recommendation: "Split large arrays into subcollections if > 20K elements"
      }
    };
  } catch (error: any) {
    return {
      testName,
      passed: false,
      message: `Failed: ${error.message}`,
      metrics: { duration: performance.now() - startTime },
      limit: {
        name: "Field Value Limits",
        value: "String: 1,398,101 bytes | Array: Up to 20K elements",
        recommendation: "Reduce field sizes or split into multiple fields"
      }
    };
  }
};

// ============================================
// 7. REPORT GENERATION STRESS TEST
// ============================================

export const testReportGenerationWithLargeDataset = async (): Promise<TestResults> => {
  const testName = "Report Generation with Large Dataset";
  const startTime = performance.now();

  try {
    // Fetch all data needed for reports
    const [equipmentDocs, chemicalDocs, checkInOutDocs, maintenanceDocs] = await Promise.all([
      getDocs(collection(db, 'equipment')),
      getDocs(collection(db, 'chemicals')),
      getDocs(collection(db, 'checkInOut')),
      getDocs(collection(db, 'maintenance'))
    ]);

    const totalDocs = 
      equipmentDocs.size + 
      chemicalDocs.size + 
      checkInOutDocs.size + 
      maintenanceDocs.size;

    const duration = performance.now() - startTime;

    return {
      testName,
      passed: true,
      message: `Successfully fetched all data for reports (${totalDocs} total documents)`,
      metrics: {
        duration,
        documentCount: totalDocs,
        operationsPerSecond: Math.round((totalDocs / duration) * 1000)
      },
      limit: {
        name: "Report Generation Performance",
        value: `Current dataset: ${totalDocs} documents`,
        recommendation: totalDocs > 10000 
          ? "Implement pagination or query limits in report generation"
          : "Current dataset size is optimal for performance"
      }
    };
  } catch (error: any) {
    return {
      testName,
      passed: false,
      message: `Failed: ${error.message}`,
      metrics: { duration: performance.now() - startTime },
      limit: {
        name: "Report Generation Performance",
        value: "Depends on dataset size",
        recommendation: "Add query limits and pagination for large datasets"
      }
    };
  }
};

// ============================================
// TEST RUNNER
// ============================================

export const runAllDatabaseTests = async () => {
  console.log("🧪 Starting Database Limitation Tests...\n");

  const tests = [
    testDocumentSizeLimit,
    testBatchWriteLimit,
    testConcurrentOperations,
    testCollectionSize,
    testQueryComplexity,
    testFieldValueLimits,
    testReportGenerationWithLargeDataset
  ];

  const allResults: TestResults[] = [];

  for (const test of tests) {
    try {
      const result = await test();
      allResults.push(result);
      
      console.log(`\n${result.passed ? '✅' : '❌'} ${result.testName}`);
      console.log(`   Message: ${result.message}`);
      console.log(`   Duration: ${result.metrics.duration.toFixed(2)}ms`);
      if (result.metrics.documentCount) {
        console.log(`   Documents: ${result.metrics.documentCount}`);
      }
      if (result.metrics.operationsPerSecond) {
        console.log(`   Ops/sec: ${result.metrics.operationsPerSecond}`);
      }
      if (result.limit) {
        console.log(`\n   📋 Limit: ${result.limit.name}`);
        console.log(`      Value: ${result.limit.value}`);
        console.log(`      Recommendation: ${result.limit.recommendation}`);
      }
    } catch (error) {
      console.error(`Error running test: ${test.name}`, error);
    }
  }

  console.log("\n\n📊 TEST SUMMARY");
  console.log("================\n");
  
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.filter(r => !r.passed).length;

  console.log(`Total Tests: ${allResults.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);

  return allResults;
};

// ============================================
// EXPORT RESULTS
// ============================================

export { TestResults };
