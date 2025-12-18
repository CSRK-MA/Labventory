# Hide Equipment from Reports - Feature Guide

## Overview

You can now hide specific equipment from reports while still being able to update their quantity and track them in the system.

**Use Case**: Equipment at a specific location that shouldn't appear in official reports but needs to be tracked.

---

## How to Use

### Step 1: Mark Equipment as Hidden

1. Open **Equipment Manager**
2. Click **View** (Eye icon) on an equipment item
3. In the equipment details modal, you'll see a **"Report Visibility"** section
4. Click **"Hide from Reports"** button
   - Status changes to: "Hidden from reports (but can still update quantity)"
   - Button changes to red

### Step 2: Update Hidden Equipment

- You can still edit and update the quantity of hidden equipment
- All CRUD operations work normally
- Equipment is just excluded from reports

### Step 3: Show in Reports Again

1. View the equipment again
2. Click **"Show in Reports"** button
3. Equipment will appear in next generated report

---

## Report Features

### Filter by Location
When generating an **Equipment Usage Report**:
1. Enter a location in **"Filter by Location"** field
   - Example: "Room 101", "Lab A", "Cabinet B"
2. Only equipment from that location will be included

### Include Hidden Equipment
When generating an **Equipment Usage Report**:
1. Check **"Include Hidden Equipment"** checkbox
2. Report will show all equipment, including hidden ones
3. Leave unchecked (default) to exclude hidden equipment

---

## What Appears in Reports

### By Default
- ✅ All visible equipment
- ✅ From all locations
- ❌ Hidden equipment is EXCLUDED

### With Filters Applied
- ✅ Only equipment matching location filter
- ✅ Still excludes hidden equipment (unless option checked)
- ✅ Other report types unaffected

---

## Database Changes

### New Field Added to Equipment
```typescript
export interface Equipment {
  // ... existing fields ...
  hideFromReports?: boolean;  // New field (optional, defaults to false)
}
```

**Note**: Existing equipment automatically has `hideFromReports = false` (visible in reports)

---

## UI Changes

### Equipment Details Modal
Added a new **"Report Visibility"** section showing:
- Current status (Hidden or Visible)
- Description of what it means
- Toggle button to change status

**Visual Indicators**:
- 👁️ Green Eye icon = Visible in reports
- 👁️‍🗨️ Red Eye icon = Hidden from reports

### Reports Generation Page
Added two new optional fields for Equipment reports:
1. **Filter by Location** - Text input (optional)
2. **Include Hidden Equipment** - Checkbox (optional)

---

## Example Workflow

### Scenario
You have equipment at a temporary location that shouldn't appear in official reports.

### Steps
1. Equipment added normally with location "Storage Room A"
2. Later, mark it as hidden: Equipment Details → "Hide from Reports"
3. Generate report: Will NOT include this equipment
4. Update quantity: Still works perfectly
5. When needed, show again: Equipment Details → "Show in Reports"

---

## API Functions

### In reportService.ts
```typescript
// Generate equipment report (excludes hidden by default)
generateEquipmentUsageReport(
  includeHidden?: boolean,    // If true, includes hidden equipment
  filterLocation?: string     // Optional location filter
): Promise<ReportData>
```

### In firebaseService.ts
```typescript
// Equipment interface now includes:
interface Equipment {
  // ... other fields ...
  hideFromReports?: boolean;
}
```

---

## Technical Details

### Report Generation Logic
1. Fetch all equipment from Firestore
2. Filter out `hideFromReports: true` items (unless `includeHidden=true`)
3. Filter by location (if provided)
4. Generate report with remaining items
5. Export as PDF or CSV

### No Data Deletion
- Hidden equipment is NOT deleted
- Data is preserved
- Can be shown again anytime
- Quantity updates work normally

---

## Testing the Feature

### Test 1: Hide Equipment
1. Add equipment "Microscope" at "Room 101"
2. Generate Equipment Report → "Microscope" appears
3. View "Microscope" details → Click "Hide from Reports"
4. Generate report again → "Microscope" does NOT appear ✅

### Test 2: Update Hidden Equipment
1. Keep equipment hidden
2. Edit the equipment to change quantity
3. Verify it updates successfully ✅

### Test 3: Show Again
1. View hidden equipment
2. Click "Show in Reports"
3. Generate report → Equipment appears again ✅

### Test 4: Filter by Location
1. Add equipment at "Lab A" and "Lab B"
2. Generate report with location filter "Lab A"
3. Only "Lab A" equipment appears ✅

---

## Key Features

✅ Hide equipment from reports without deleting  
✅ Still update quantity of hidden equipment  
✅ Filter reports by location  
✅ Include/exclude hidden equipment in reports  
✅ Toggle visibility on/off anytime  
✅ No data loss or corruption  
✅ Backward compatible with existing data  

---

## FAQ

**Q: Will hidden equipment be deleted?**  
A: No, it's preserved and can be shown again anytime.

**Q: Can I still edit hidden equipment?**  
A: Yes! All edit operations work normally, just excluded from reports.

**Q: What if I filter by location AND hide equipment?**  
A: Location filter applies first, then hidden equipment is excluded (unless "Include Hidden" is checked).

**Q: Does this affect other reports?**  
A: No, only Equipment Usage Report is affected. Chemical, Maintenance, and Check-in/Out reports are unchanged.

**Q: Can I undo hiding?**  
A: Yes, just view the equipment and click "Show in Reports" again.

---

## Build Status

✅ Build passing  
✅ All features working  
✅ No TypeScript errors  
✅ Ready for production  

---

## Files Modified

1. `src/services/firebaseService.ts` - Added `hideFromReports` field
2. `src/services/reportService.ts` - Added filtering logic
3. `src/components/dashboard/EquipmentList.tsx` - Added toggle UI
4. `src/components/dashboard/Reports.tsx` - Added filter options

---

**Feature Status**: ✅ COMPLETE & READY TO USE

