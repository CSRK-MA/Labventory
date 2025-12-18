# Database Limitations & Testing Guide

## Overview
This document outlines Firestore limitations and provides comprehensive testing procedures for EduTrack.

---

## Firestore Quotas & Limits

### 1. **Document Size Limit**
- **Limit**: 1 MB per document maximum
- **Recommended**: Keep documents under 100 KB
- **Impact**: Reports may need pagination if documents exceed limits
- **Mitigation**: 
  - Split large documents into subcollections
  - Store large binary data in Cloud Storage
  - Use field-level sharding for large arrays

### 2. **Batch Operation Limits**
- **Limit**: 500 documents per batch write/delete
- **Impact**: Bulk import/export operations
- **Mitigation**:
  ```typescript
  // Split large batches
  const chunkSize = 500;
  for (let i = 0; i < documents.length; i += chunkSize) {
    const batch = writeBatch(db);
    // Process 500 documents at a time
  }
  ```

### 3. **Field Value Limits**
- **String Field**: Up to 1,398,101 bytes (~1.4 MB)
- **Array Field**: Up to 20,000 elements
- **Map/Object Nesting**: No practical limit
- **Mitigation**: Use subcollections for arrays > 1000 elements

### 4. **Collection & Subcollection Limits**
- **No limit** on total documents per collection
- **Composite indexes**: 200 per database
- **Single index**: Scales to 10 million documents
- **Mitigation**: Clean up unused indexes regularly

### 5. **Query Limits**
- **Max documents per query**: 20,000
- **Operators without index**: 
  - Single `where` clause + optional single `orderBy`
  - Multiple `where` clauses require composite index
- **Mitigation**:
  ```typescript
  // This needs a composite index:
  query(
    collection(db, 'equipment'),
    where('status', '==', 'Available'),
    where('category', '==', 'Lab'),
    orderBy('purchaseDate')
  )
  ```

### 6. **Real-time Listener Limits**
- **Concurrent listeners**: 100 per app instance
- **Cost**: Counts as read operation every 10 seconds of connection
- **Mitigation**:
  - Detach listeners when component unmounts
  - Use `onSnapshot` only when needed
  - Consider polling for less critical data

### 7. **Write Rate Limits**
- **Per document**: 1 write per second maximum
- **Per collection**: Scales based on shard count
- **Mitigation**:
  ```typescript
  // Use document IDs as counters
  // Each user ID = separate document = separate write stream
  ```

### 8. **Storage Limits**
- **Storage per project**: Depends on plan
- **File size**: Up to 5 TB per file in Cloud Storage
- **Mitigation**: Monitor usage in Firebase Console

---

## EduTrack Specific Limits

### Current Setup
- **Collections**: 9 (equipment, chemicals, checkInOut, maintenance, users, labs, categories, notifications, reports)
- **Expected document size**: 5-50 KB each
- **Expected yearly growth**: 10,000-50,000 documents

### Recommended Thresholds

#### Equipment Collection
```
Expected documents: 1,000 - 10,000
Avg document size: 3 KB
Safe limit: 50,000 documents
Before scaling: 50,000 documents
Scaling strategy: Shard by lab/location
```

#### Chemicals Collection
```
Expected documents: 1,000 - 5,000
Avg document size: 2 KB
Safe limit: 50,000 documents
Before scaling: 50,000 documents
Scaling strategy: Archive inactive chemicals
```

#### Check-in/Out Logs
```
Expected documents: 10,000 - 100,000+ (grows fastest)
Avg document size: 1 KB
Safe limit: 1,000,000 documents
Before scaling: 500,000 documents
Scaling strategy: Archive old logs, use subcollections by date
```

#### Maintenance Records
```
Expected documents: 1,000 - 10,000
Avg document size: 2.5 KB
Safe limit: 50,000 documents
Before scaling: 50,000 documents
Scaling strategy: Archive completed maintenance
```

---

## Performance Benchmarks

### Typical Operation Times (with good network)

| Operation | Time | Notes |
|-----------|------|-------|
| Single document read | 20-50ms | Cached queries are faster |
| Single document write | 50-100ms | Includes network latency |
| Query 10 documents | 30-100ms | Depends on index usage |
| Batch write 500 docs | 500-2000ms | Faster than individual writes |
| Real-time listener setup | 100-500ms | Initial fetch + listener setup |
| PDF generation (100 docs) | 2-5s | HTML rendering + PDF creation |
| PDF generation (1000 docs) | 15-30s | Requires pagination |
| CSV export (10000 records) | 5-10s | Fetching + formatting |

---

## Testing Procedures

### 1. Document Size Test
```typescript
// Test with 1 MB document
const largeDoc = {
  name: "Large Document",
  largeData: 'x'.repeat(1000000),
  timestamp: Timestamp.now()
};
await addDoc(collection(db, 'testCollection'), largeDoc);
```

**Expected Result**: Succeeds (at or near limit)
**Pass Criteria**: Document is created successfully

---

### 2. Batch Write Test
```typescript
// Write 500 documents in single batch
const batch = writeBatch(db);
for (let i = 0; i < 500; i++) {
  const docRef = doc(collection(db, 'testCollection'));
  batch.set(docRef, { index: i, data: `Doc ${i}` });
}
await batch.commit();
```

**Expected Result**: All 500 documents created in ~500-2000ms
**Pass Criteria**: All documents created, no rate limiting errors

---

### 3. Concurrent Operations Test
```typescript
// Execute 10 concurrent read queries
const results = await Promise.all([
  getDocs(collection(db, 'equipment')),
  getDocs(collection(db, 'chemicals')),
  // ... 8 more queries
]);
```

**Expected Result**: All queries complete in < 5 seconds
**Pass Criteria**: No 429 (rate limit) errors

---

### 4. Query Complexity Test
```typescript
// Test multi-field query (requires composite index)
const q = query(
  collection(db, 'equipment'),
  where('status', '==', 'Available'),
  where('category', '==', 'Lab'),
  orderBy('purchaseDate')
);
await getDocs(q);
```

**Expected Result**: Query succeeds (Firebase may auto-create index)
**Pass Criteria**: Results return within 2 seconds

---

### 5. Real-time Listener Test
```typescript
// Create real-time listener
const unsubscribe = onSnapshot(
  collection(db, 'equipment'),
  (snapshot) => {
    console.log('Data updated:', snapshot.docs.length);
  }
);

// Keep open for 1 minute
// Verify updates appear in < 5 seconds
// Unsubscribe after test
unsubscribe();
```

**Expected Result**: Updates appear < 5 seconds
**Pass Criteria**: Real-time updates working, listener cleans up properly

---

### 6. Write Rate Test
```typescript
// Attempt 2 writes to same document within 1 second
const docRef = doc(db, 'equipment', 'test-doc');
await setDoc(docRef, { version: 1 });
await setDoc(docRef, { version: 2 }); // May rate limit
```

**Expected Result**: First write succeeds, second may fail
**Pass Criteria**: Proper error handling implemented

---

### 7. Report Generation Test

#### Small Dataset (< 100 documents)
```
Time: < 2 seconds
Memory: < 50 MB
All data included: ✅
PDF quality: ✅
```

#### Medium Dataset (100-1000 documents)
```
Time: 2-5 seconds
Memory: 50-200 MB
All data included: ✅
PDF quality: ✅ (may span multiple pages)
```

#### Large Dataset (1000+ documents)
```
Time: 5-30+ seconds
Memory: 200+ MB
Recommendation: Paginate results
Recommendation: Implement progress indicator
Alternative: Use CSV export instead
```

---

## Optimization Strategies

### 1. Query Optimization

**Bad:**
```typescript
// Fetches ALL documents then filters
const docs = await getDocs(collection(db, 'equipment'));
const available = docs.docs.filter(d => d.data().status === 'Available');
```

**Good:**
```typescript
// Filters on server side
const q = query(
  collection(db, 'equipment'),
  where('status', '==', 'Available')
);
const docs = await getDocs(q);
```

**Savings**: 90%+ fewer read operations

---

### 2. Batch Operations

**Bad:**
```typescript
for (const doc of documents) {
  await addDoc(collection(db, 'equipment'), doc); // N operations
}
```

**Good:**
```typescript
const batch = writeBatch(db);
for (const doc of documents) {
  batch.set(doc(collection(db, 'equipment')), doc);
}
await batch.commit(); // 1 operation
```

**Savings**: 500x faster for 500 documents

---

### 3. Pagination

**Bad:**
```typescript
// Load all 100,000 check-in logs at once
const logs = await getDocs(collection(db, 'checkInOut'));
```

**Good:**
```typescript
// Load first 50, then load next on demand
const q = query(
  collection(db, 'checkInOut'),
  orderBy('timestamp', 'desc'),
  limit(50)
);
const first = await getDocs(q);

// For next page, use startAfter
const nextQ = query(
  collection(db, 'checkInOut'),
  orderBy('timestamp', 'desc'),
  startAfter(last),
  limit(50)
);
```

**Savings**: 99% reduction in unnecessary reads

---

### 4. Real-time Listener Management

**Bad:**
```typescript
// Listener never cleaned up
useEffect(() => {
  onSnapshot(collection(db, 'equipment'), (snap) => {
    setEquipment(snap.docs);
  });
}, []); // Missing cleanup
```

**Good:**
```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'equipment'),
    (snap) => {
      setEquipment(snap.docs);
    }
  );
  
  return () => unsubscribe(); // Cleanup
}, []);
```

**Savings**: Free up listener slots, reduce costs

---

### 5. Data Archival

For collections that grow very large (100K+ documents):

```typescript
// Archive old check-in logs
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const q = query(
  collection(db, 'checkInOut'),
  where('timestamp', '<', Timestamp.fromDate(thirtyDaysAgo))
);

const docs = await getDocs(q);
// Move to 'archivedLogs' collection
// Delete from main collection
```

**Benefits**: Faster queries, lower costs

---

## Cost Optimization

### Current Estimate (EduTrack)

**Assumptions**:
- 100 daily active users
- 1,000 equipment items
- 5,000 chemicals
- 50,000 check-in/out logs/year
- 10,000 maintenance records

**Estimated Reads/Month**:
```
Equipment queries: 3,000
Chemical queries: 2,000
Check-in/out reports: 1,000
Maintenance queries: 500
Real-time listeners: 14,400 (100 users × 24 hrs × 6/hr)
Total: ~20,900 reads/month
Cost: $0.10/million = ~$0.002/month
```

**Estimated Writes/Month**:
```
Check-in/out logs: 5,000
Equipment updates: 500
Chemical updates: 500
Maintenance records: 1,000
Total: 7,000 writes/month
Cost: $0.06/million = ~$0.0004/month
```

**Total Estimated Cost**: $0.0024/month (very cheap for hobby tier)

---

## Monitoring & Alerts

### Setup in Firebase Console

1. **Enable Usage Reporting**
   - Go to Firebase Console > Usage
   - Monitor reads, writes, deletes over time

2. **Set up Alerts**
   - Configure alerts if usage exceeds thresholds
   - Example: Alert if > 1M reads/day

3. **Monitor Indexes**
   - Review "Composite Indexes" section
   - Delete unused indexes

4. **Check Quotas**
   - Real-time listeners usage
   - Concurrent connections
   - Database size

---

## Troubleshooting

### Error: "10 ABORTED: Transaction aborted"
**Cause**: Concurrent writes to same document > 1/second
**Solution**: Retry with exponential backoff or use document sharding

### Error: "6 ALREADY_EXISTS"
**Cause**: Attempting to create document that already exists with `set()`
**Solution**: Use `update()` instead or check existence first

### Error: "7 PERMISSION_DENIED"
**Cause**: Security rules prevent operation
**Solution**: Check Firestore rules in Firebase Console

### Error: "14 UNAVAILABLE"
**Cause**: Service temporarily unavailable or rate limited
**Solution**: Implement exponential backoff retry logic

### Slow Queries
**Diagnosis**: Check if query needs composite index
**Solution**: Firebase Console will suggest needed indexes

---

## Testing Implementation

Use the provided `DatabaseLimitTest` component to:
1. Run automated tests
2. View results with detailed metrics
3. Get recommendations for optimization
4. Monitor performance over time

**Access it at**: Dashboard → Settings → Database Test (if enabled)

---

## Conclusion

EduTrack's current setup is well-suited for small to medium deployments (< 1M documents). For larger scale:

- Implement pagination for reports
- Archive old logs monthly
- Use query filters to reduce data transfer
- Monitor usage in Firebase Console
- Consider data sharding for very large collections

Regular testing ensures optimal performance and cost efficiency.
