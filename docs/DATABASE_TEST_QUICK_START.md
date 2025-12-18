# Database Limitation Testing - Quick Start Guide

## What's Included

Your EduTrack application now has comprehensive database limitation testing tools:

### 1. **DatabaseLimitTest Component** (`src/components/dashboard/DatabaseLimitTest.tsx`)
- Interactive UI for running tests
- Visual results with metrics
- Firestore limits reference
- Expandable test details

### 2. **Database Limit Test Service** (`src/services/databaseLimitTest.ts`)
- 7 comprehensive tests
- Performance metrics
- Limit information
- Pass/fail indicators

### 3. **Database Helper Utility** (`src/services/databaseLimitHelper.ts`)
- Safe batch operations with auto-chunking
- Pagination helpers
- Document size validation
- Write rate limiting with backoff
- Performance monitoring

### 4. **Documentation** (`DATABASE_LIMITATIONS_GUIDE.md`)
- Complete Firestore quotas & limits
- EduTrack-specific recommendations
- Testing procedures
- Optimization strategies
- Cost estimation

---

## Running Tests

### From Component (Not Yet Integrated)

To add the test component to your dashboard:

1. **Find Dashboard Router** (`src/components/dashboard/DashboardSidebar.tsx` or main router)

2. **Add to navigation**:
   ```tsx
   import { DatabaseLimitTest } from './DatabaseLimitTest';
   
   // Add route or menu item
   <Link to="/dashboard/database-test">Database Tests</Link>
   ```

3. **Add route**:
   ```tsx
   <Route path="/database-test" element={<DatabaseLimitTest />} />
   ```

### From Console

```typescript
// In browser console or test file
import { runAllDatabaseTests } from 'src/services/databaseLimitTest';

const results = await runAllDatabaseTests();
console.table(results);
```

---

## Tests Included

### 1. **Document Size Limit** (1 MB)
- Creates a document near the 1 MB limit
- **Expected Result**: ✅ Succeeds
- **Takes**: ~500ms
- **Cost**: 1 write operation

### 2. **Batch Write Limit** (500 docs)
- Writes 500 documents in a single batch
- **Expected Result**: ✅ Succeeds in 500-2000ms
- **Takes**: Depends on network
- **Cost**: 500 write operations

### 3. **Concurrent Operations**
- Runs 10 simultaneous queries
- **Expected Result**: ✅ All complete < 5 seconds
- **Takes**: 1-5 seconds
- **Cost**: 10 read operations

### 4. **Collection Size Limits**
- Checks current document counts
- **Expected Result**: ✅ Returns counts from all collections
- **Takes**: 2-5 seconds
- **Cost**: 1 read per collection

### 5. **Query Complexity**
- Tests complex queries with filters & ordering
- **Expected Result**: ✅ Queries succeed (may need index)
- **Takes**: 1-3 seconds
- **Cost**: 3 read operations

### 6. **Field Value Limits**
- Tests large strings, arrays, and nested objects
- **Expected Result**: ✅ Stores all field types
- **Takes**: ~1 second
- **Cost**: 1 write operation

### 7. **Report Generation** (Large Dataset)
- Simulates fetching all report data
- **Expected Result**: ✅ Completes in < 30 seconds
- **Takes**: Depends on data size
- **Cost**: 4 read operations (one per collection)

---

## Expected Results

### All Tests Pass ✅
```
Total Tests: 7
Passed: 7 ✅
Failed: 0 ❌
Success Rate: 100%
```

### Current Data Size
```
Equipment: 0 - 10,000 documents
Chemicals: 0 - 5,000 documents  
Check-in/Out: 0 - 100,000 documents
Maintenance: 0 - 10,000 documents
```

### Performance Baseline
```
Document write: 50-100ms
Query: 30-100ms
Batch write (500): 500-2000ms
Report generation: < 5 seconds
```

---

## Cost Analysis

### Test Cost
Running all 7 tests:
- **Reads**: ~15 operations
- **Writes**: ~505 operations
- **Total**: ~520 operations
- **Cost**: ~$0.00003 (paid plans only)

### Recommended Testing Frequency
- **Initial setup**: Once (today)
- **After major data additions**: Monthly
- **Production monitoring**: Weekly (optional)

---

## Using Database Helpers

### Safe Batch Writing

```typescript
import { safeBatchWrite } from 'src/services/databaseLimitHelper';

const equipment = [
  { name: 'Microscope', ...},
  { name: 'Centrifuge', ...},
  // ... up to millions of items
];

const result = await safeBatchWrite('equipment', equipment, 'set');
console.log(`Written: ${result.written}/${equipment.length}`);
```

**Benefits**:
- Automatically chunks into 500-document batches
- Handles all batches sequentially
- Returns success count and errors
- Much faster than individual writes

### Pagination

```typescript
import { paginatedQuery } from 'src/services/databaseLimitHelper';
import { where, orderBy } from 'firebase/firestore';

// First page
const page1 = await paginatedQuery(
  'equipment',
  [where('status', '==', 'Available')],
  50 // page size
);

console.log(page1.data); // 50 items
console.log(page1.pageInfo.hasNextPage); // true/false

// Next page
if (page1.pageInfo.hasNextPage) {
  const page2 = await paginatedQuery(
    'equipment',
    [where('status', '==', 'Available')],
    50,
    page1.pageInfo.lastDoc // For pagination
  );
}
```

### Document Size Validation

```typescript
import { validateDocumentSize } from 'src/services/databaseLimitHelper';

const equipment = {
  name: 'Expensive Lab Equipment',
  largeDescription: 'x'.repeat(500000),
  // ... more fields
};

const validation = validateDocumentSize(equipment);
if (validation.valid) {
  // Safe to save
  await addDoc(collection(db, 'equipment'), equipment);
}
```

### Write Rate Limiting

```typescript
import { writeWithBackoff } from 'src/services/databaseLimitHelper';

const result = await writeWithBackoff(
  async () => {
    return await addDoc(collection(db, 'equipment'), newEquipment);
  },
  3, // max 3 retries
  100 // initial delay 100ms (exponential backoff)
);

if (result.success) {
  console.log('Written:', result.data);
} else {
  console.error('Failed:', result.error);
}
```

---

## Firestore Limits Reference

| Limit | Value | Recommendation |
|-------|-------|-----------------|
| Document Size | 1 MB | Keep < 100 KB |
| Batch Size | 500 docs | Use 100-500 |
| String Field | 1.4 MB | Use Cloud Storage for large files |
| Array Field | 20,000 elements | Use subcollections if larger |
| Query Results | 20,000 docs | Paginate large results |
| Composite Indexes | 200 per DB | Monitor & clean up |
| Concurrent Listeners | 100 | Detach unused ones |
| Write Rate | 1/sec per doc | Shard if faster needed |

---

## Monitoring Your Data

### Check Collection Sizes

```typescript
import { getCountFromServer } from 'firebase/firestore';

async function checkSizes() {
  const collections = ['equipment', 'chemicals', 'checkInOut', 'maintenance'];
  
  for (const name of collections) {
    const count = await getCountFromServer(collection(db, name));
    console.log(`${name}: ${count.data().count} documents`);
  }
}
```

### Optimize Queries

```typescript
// Before (slow - no index)
getDocs(query(
  collection(db, 'equipment'),
  where('status', '==', 'Available'),
  where('category', '==', 'Lab'),
  orderBy('purchaseDate')
)); // Needs composite index

// After (fast - uses index)
getDocs(query(
  collection(db, 'equipment'),
  where('status', '==', 'Available'),
  limit(50)
)); // Single filter is fast
```

---

## Troubleshooting

### "Composite index needed"
**Solution**: Click the link in Firebase error to auto-create index, or create manually in Firestore Console

### "Document exceeds 1 MB"
**Solution**: Split into multiple documents or use Cloud Storage

### "Rate limit exceeded (429)"
**Solution**: Use `writeWithBackoff()` helper or reduce concurrent operations

### "Slow queries"
**Solution**: Add proper indexes or reduce query scope with `limit()`

---

## Next Steps

1. **Run the tests** to establish baseline performance
2. **Monitor monthly** as data grows
3. **Archive old logs** when Check-in/Out exceeds 500K
4. **Use pagination** for reports with 1000+ items
5. **Implement caching** for frequently accessed data

---

## Documentation Files

- 📄 **DATABASE_LIMITATIONS_GUIDE.md** - Complete reference
- 📄 **databaseLimitTest.ts** - Test implementation
- 📄 **databaseLimitHelper.ts** - Helper functions
- 📄 **DatabaseLimitTest.tsx** - UI component

---

## Questions?

Refer to:
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Quotas & Limits](https://firebase.google.com/docs/firestore/quotas)
- DATABASE_LIMITATIONS_GUIDE.md in this project

---

**Happy testing!** 🧪
