# Duplicate Data Detection & Prevention System

## Overview

The Duplicate Data Detection System prevents users from accidentally adding duplicate equipment, chemicals, or maintenance records. When a potential duplicate is detected, users are given three options:

1. **Cancel** - Discard the entry entirely
2. **Create Anyway** - Proceed with adding the duplicate (if needed)
3. **Update Existing** - Merge the data into the existing record

---

## Features

### ✅ Smart Detection

- **Equipment**: Checks if equipment name already exists
- **Chemicals**: Checks both chemical name and formula combination
- **Maintenance**: Checks for same equipment, maintenance type, and date combination

### ✅ User-Friendly Interface

- Clear error messages explaining the duplicate
- Shows existing record details for reference
- Three action options to handle the situation

### ✅ Real-time Checking

- Validates against database before submission
- Uses Firestore queries for accuracy
- Supports concurrent operations safely

---

## Implementation

### Service Layer: `duplicateDetection.ts`

The core service provides the following functions:

#### Equipment Functions

```typescript
// Check if equipment name already exists
checkEquipmentDuplicate(equipmentName: string, excludeId?: string): Promise<DuplicateCheckResult>

// Update existing equipment instead of creating duplicate
updateExistingEquipment(existingId: string, updates: Partial<Equipment>): Promise<Result>
```

#### Chemical Functions

```typescript
// Check if chemical (name + formula) already exists
checkChemicalDuplicate(name: string, formula?: string, excludeId?: string): Promise<DuplicateCheckResult>

// Update existing chemical instead of creating duplicate
updateExistingChemical(existingId: string, updates: Partial<Chemical>): Promise<Result>
```

#### Maintenance Functions

```typescript
// Check if maintenance record (equipment + type + date) already exists
checkMaintenanceDuplicate(
  equipmentId: string,
  maintenanceType: string,
  scheduledDate: Date,
  excludeId?: string
): Promise<DuplicateCheckResult>

// Update existing maintenance record
updateExistingMaintenance(existingId: string, updates: Partial<Maintenance>): Promise<Result>
```

#### Batch Operations

```typescript
// Check multiple items for duplicates at once
checkMultipleDuplicates(
  items: Array<{ type: 'equipment' | 'chemical' | 'maintenance'; data: any }>,
  excludeIds?: string[]
): Promise<Array<DuplicateCheckResult & { itemIndex: number }>>

// Import items with automatic duplicate handling
importWithDuplicateHandling(
  items: Array<{ type: 'equipment' | 'chemical'; data: any }>,
  options: ImportOptions
): Promise<ImportSummary>
```

---

## UI Components

### EquipmentList Component

**Location**: `src/components/dashboard/EquipmentList.tsx`

**Added State**:
```typescript
const [duplicateError, setDuplicateError] = useState<any>(null);
const [showUpdateOption, setShowUpdateOption] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

**Modified Functions**:
- `handleAddEquipment()` - Now checks for duplicates before adding
- `handleUpdateExistingEquipment()` - New function to update existing equipment

**UI Elements**:
- Duplicate error alert (red warning box)
- Shows existing equipment details (location, quantity)
- Three action buttons: Cancel, Create Anyway, Update Existing

### ChemicalTracker Component

**Location**: `src/components/dashboard/ChemicalTracker.tsx`

**Added State**:
```typescript
const [duplicateError, setDuplicateError] = useState<any>(null);
const [showUpdateOption, setShowUpdateOption] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

**Modified Functions**:
- `handleAddChemical()` - Now checks for duplicates before adding
- `handleUpdateExistingChemical()` - New function to update existing chemical

**UI Elements**:
- Duplicate error alert (red warning box)
- Shows existing chemical details (formula, quantity, unit, location)
- Three action buttons: Cancel, Create Anyway, Update Existing

---

## Workflow

### Adding Equipment

```
User clicks "Add Equipment" 
  ↓
User fills in form
  ↓
User clicks "Add Equipment" button
  ↓
System checks for duplicate equipment name
  ├─ No duplicate found
  │   ↓
  │   Equipment added ✅
  │
  └─ Duplicate found
      ↓
      Error alert displayed with existing details
      ↓
      User chooses:
      ├─ Cancel → Modal closes, no changes
      ├─ Create Anyway → Proceed with adding (duplicate created)
      └─ Update Existing → Merge into existing record ✅
```

### Adding Chemical

```
User clicks "Add Chemical"
  ↓
User fills in form
  ↓
User clicks "Add Chemical" button
  ↓
System checks for duplicate (name + formula)
  ├─ No duplicate found
  │   ↓
  │   Chemical added ✅
  │
  └─ Duplicate found
      ↓
      Error alert displayed with existing details
      ↓
      User chooses:
      ├─ Cancel → Modal closes, no changes
      ├─ Create Anyway → Proceed with adding (duplicate created)
      └─ Update Existing → Merge into existing record ✅
```

---

## Return Types

### DuplicateCheckResult

```typescript
interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingId?: string;           // ID of existing record if duplicate
  existingData?: any;            // Full data of existing record
  message: string;               // Human-readable message
  suggestions: {
    canUpdate: boolean;          // Whether update is possible
    canCreateNew: boolean;       // Whether new creation is allowed
  };
}
```

### ImportSummary

```typescript
{
  imported: number;              // Records successfully added
  skipped: number;               // Records skipped (duplicates)
  updated: number;               // Records updated instead
  errors: Array<{
    index: number;
    error: string;
  }>;
}
```

---

## Usage Examples

### Basic Duplicate Check

```typescript
import { checkEquipmentDuplicate } from './services/duplicateDetection';

const result = await checkEquipmentDuplicate('Microscope');
if (result.isDuplicate) {
  console.log('Equipment already exists:', result.existingData);
}
```

### Update Instead of Create

```typescript
import { updateExistingEquipment } from './services/duplicateDetection';

const result = await updateExistingEquipment(existingId, {
  quantity: 5,
  location: 'Room 101'
});
```

### Batch Import with Duplicate Handling

```typescript
import { importWithDuplicateHandling } from './services/duplicateDetection';

const items = [
  { type: 'equipment' as const, data: { name: 'Microscope', ... } },
  { type: 'chemical' as const, data: { name: 'Sulfuric Acid', ... } },
];

const summary = await importWithDuplicateHandling(items, {
  onDuplicate: 'update'  // 'skip' | 'update' | 'create'
});

console.log(`Imported: ${summary.imported}, Updated: ${summary.updated}, Skipped: ${summary.skipped}`);
```

---

## Error Messages

### Equipment Duplicates

```
⚠️ Duplicate Equipment Found
Equipment "Microscope" already exists. You can update the existing record instead.

Existing Equipment:
Location: Room 101
Quantity: 3
```

### Chemical Duplicates

```
⚠️ Duplicate Chemical Found
Chemical "H₂SO₄ (Sulfuric Acid)" already exists. You can update the quantity instead.

Existing Chemical:
Formula: H₂SO₄
Quantity: 5.0 Liters
Location: Cabinet A
```

---

## Database Queries

The system uses Firestore queries to check for duplicates:

### Equipment Query
```typescript
where('name', '==', equipmentName.trim())
```

### Chemical Query
```typescript
where('name', '==', name.trim())
where('formula', '==', formula.trim())
```

### Maintenance Query
```typescript
where('equipmentId', '==', equipmentId)
// Then filters by type and date in application code
```

---

## Performance Considerations

### Query Optimization
- Equipment check: Single document read
- Chemical check: Single document read (composite index on name + formula)
- Maintenance check: Uses equipment ID for efficient filtering

### Best Practices
- `excludeId` parameter prevents false positives during edits
- Batch operations use efficient chunking
- Timestamps are properly converted from Firestore format

---

## Integration Checklist

- ✅ `duplicateDetection.ts` service created
- ✅ Equipment duplicate detection integrated
- ✅ Chemical duplicate detection integrated
- ✅ Maintenance system ready for integration
- ✅ UI components updated with error handling
- ✅ User feedback messages implemented
- ✅ Build verified successful

---

## Next Steps

Optional enhancements that can be added:

1. **MaintenanceTracker Integration** - Add duplicate detection for maintenance schedules
2. **Batch Import UI** - Create interface for importing CSV/Excel with duplicate handling
3. **Analytics Dashboard** - Track duplicate detection events
4. **Custom Rules** - Allow users to define what constitutes a duplicate
5. **Notification System** - Alert when duplicates are created or merged

---

## Testing

To test the duplicate detection system:

1. **Equipment Test**:
   - Add equipment named "Microscope"
   - Try adding another "Microscope"
   - Should see duplicate alert with existing details
   - Can update or create anyway

2. **Chemical Test**:
   - Add chemical with name "Sulfuric Acid" and formula "H₂SO₄"
   - Try adding same chemical again
   - Should see duplicate alert
   - Option to update quantity

3. **Error Handling**:
   - Try with missing required fields
   - Check network error handling
   - Verify loading states

---

## Support

For questions or issues with duplicate detection:

1. Check `duplicateDetection.ts` for available functions
2. Review error messages in UI components
3. Check browser console for detailed error logs
4. Verify Firestore connection and permissions

