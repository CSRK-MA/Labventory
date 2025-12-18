# Duplicate Detection System - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  EquipmentList Component          ChemicalTracker Component      │
│  ────────────────────────         ─────────────────────────      │
│  • Add Equipment Form              • Add Chemical Form           │
│  • Duplicate Error Alert           • Duplicate Error Alert       │
│  • Update/Cancel/Create Options    • Update/Cancel/Create Opts  │
│                                                                   │
└──────────────┬───────────────────────────────────┬──────────────┘
               │                                   │
               ▼                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                                │
├──────────────────────────────────────────────────────────────────┤
│                  duplicateDetection.ts                            │
│                                                                   │
│  Equipment Functions:              Chemical Functions:          │
│  • checkEquipmentDuplicate()       • checkChemicalDuplicate()   │
│  • updateExistingEquipment()       • updateExistingChemical()   │
│                                                                   │
│  Maintenance Functions:            Utility Functions:           │
│  • checkMaintenanceDuplicate()     • checkMultipleDuplicates()  │
│  • updateExistingMaintenance()     • importWithHandling()       │
│                                                                   │
└──────────────┬───────────────────────────────────┬──────────────┘
               │                                   │
               ▼                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                     FIREBASE LAYER                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Firestore Collections:                                           │
│  • equipment (name field)                                        │
│  • chemicals (name + formula fields)                             │
│  • maintenance (equipmentId, type, date fields)                  │
│                                                                   │
│  Queries & Operations:                                           │
│  • getDocs() - Check for existing records                        │
│  • updateDoc() - Update existing records                         │
│  • Error handling & retries                                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagram - Adding Equipment

```
START: User clicks "Add Equipment"
  │
  ├─► Equipment Form Opens
  │   └─► User fills in fields
  │       • Name: "Microscope"
  │       • Category: "Biology"
  │       • Location: "Room 101"
  │
  ├─► User clicks "Add Equipment" button
  │
  ├─► System checks Firestore
  │   │ Query: where('name' == 'Microscope')
  │   │
  │   ├─► NO RECORDS FOUND
  │   │   └─► Equipment Added ✅
  │   │       └─► Toast: "Equipment added successfully!"
  │   │           └─► Modal closes
  │   │
  │   └─► RECORD FOUND (Duplicate!)
  │       └─► Error Alert Displayed
  │           ├─► Shows existing equipment details
  │           │   • Location: "Room 101"
  │           │   • Quantity: 3
  │           │
  │           └─► Three Options Appear:
  │               │
  │               ├─► [Cancel]
  │               │   └─► Modal closes, nothing saved
  │               │
  │               ├─► [Create Anyway]
  │               │   └─► Removes alert
  │               │       └─► Allows adding duplicate
  │               │
  │               └─► [Update Existing]
  │                   └─► Updates existing record
  │                       └─► Toast: "Equipment updated!"
  │                           └─► Modal closes
  │
  └─► END
```

---

## User Flow Diagram - Adding Chemical

```
START: User clicks "Add Chemical"
  │
  ├─► Chemical Form Opens
  │   └─► User fills in fields
  │       • Name: "Sulfuric Acid"
  │       • Formula: "H₂SO₄"
  │       • Quantity: 10
  │       • Unit: "Liters"
  │       • Location: "Cabinet A"
  │
  ├─► User clicks "Add Chemical" button
  │
  ├─► System checks Firestore
  │   │ Query: where('name' == 'Sulfuric Acid')
  │   │         AND where('formula' == 'H₂SO₄')
  │   │
  │   ├─► NO RECORDS FOUND
  │   │   └─► Chemical Added ✅
  │   │       └─► Toast: "Chemical added successfully!"
  │   │           └─► Modal closes
  │   │
  │   └─► RECORD FOUND (Duplicate!)
  │       └─► Error Alert Displayed
  │           ├─► Shows existing chemical details
  │           │   • Formula: "H₂SO₄"
  │           │   • Quantity: 5.0 Liters
  │           │   • Location: "Cabinet A"
  │           │
  │           └─► Three Options Appear:
  │               │
  │               ├─► [Cancel]
  │               │   └─► Modal closes, nothing saved
  │               │
  │               ├─► [Create Anyway]
  │               │   └─► Removes alert
  │               │       └─► Allows adding duplicate
  │               │
  │               └─► [Update Existing]
  │                   └─► Updates existing record
  │                       └─► Toast: "Chemical updated!"
  │                           └─► Modal closes
  │
  └─► END
```

---

## Decision Tree - Duplicate Detection

```
┌─ IS DUPLICATE? ──────────────────────────────────────┐
│                                                       │
├─► NO (New Record)                                   │
│   └─► ✅ ALLOW CREATION                             │
│       └─► Equipment/Chemical saved to database      │
│           └─► User sees success toast              │
│               └─► Modal closes                     │
│                                                     │
└─► YES (Duplicate Found)                            │
    ├─► Show Error Alert ⚠️                           │
    │   ├─ Red warning box                           │
    │   ├─ "Duplicate [Equipment/Chemical] Found"    │
    │   ├─ Show existing record details              │
    │   └─ Offer three options                       │
    │                                                 │
    └─► User chooses:                                │
        │                                             │
        ├─► [CANCEL]                                 │
        │   └─► 🚫 DISCARD                          │
        │       └─► Modal closes                    │
        │           └─► No data saved               │
        │                                             │
        ├─► [CREATE ANYWAY]                          │
        │   └─► ✅ ALLOW DUPLICATE                  │
        │       └─► Equipment/Chemical saved        │
        │           └─► Duplicate record created   │
        │               └─► User sees success toast│
        │                   └─► Modal closes       │
        │                                             │
        └─► [UPDATE EXISTING]                        │
            └─► 🔄 MERGE DATA                        │
                └─► Existing record updated         │
                    └─► New data merged in          │
                        └─► User sees success toast│
                            └─► Modal closes       │
```

---

## Component State Machine

```
                    ┌─────────────────────┐
                    │   Form Closed       │
                    │  (No Modal)         │
                    └────────────┬────────┘
                                 │
                    User clicks "Add" button
                                 │
                    ┌────────────▼────────────┐
                    │   Form Open             │
                    │  (Modal Visible)        │
                    │  - duplicateError=null  │
                    │  - showUpdateOption=f   │
                    │  - isLoading=false      │
                    └────────────┬────────────┘
                                 │
                  User clicks "Add Equipment/Chemical"
                                 │
                    ┌────────────▼────────────┐
                    │   Checking...           │
                    │  - isLoading=true       │
                    │  (Loading spinner)      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
        ┌───────────▼───────────┐  ┌────────▼──────────┐
        │ No Duplicate          │  │ Duplicate Found   │
        │ - Save to database    │  │ - duplicateError  │
        │ - Show success toast  │  │   = result        │
        │ - Close modal         │  │ - showUpdateOpt   │
        │                       │  │   = true          │
        └───────────┬───────────┘  └────────┬──────────┘
                    │                        │
                    │                  Three Options:
                    │                        │
                    │    ┌───────────────────┼───────────────────┐
                    │    │                   │                   │
                    │    ▼                   ▼                   ▼
                    │ [Cancel]         [Create Anyway]     [Update Existing]
                    │    │                   │                   │
                    │    │                   │              - Update DB
                    │    │                   │              - Show success
                    │    │                   │              - Close modal
                    │    │                   │                   │
                    └────┴───────────────────┴───────────────────┘
                                            │
                    ┌───────────────────────▼────────────────────┐
                    │   Form Closed                              │
                    │  (Modal Hidden, Back to Normal)            │
                    │  - duplicateError = null                   │
                    │  - showUpdateOption = false                │
                    │  - isLoading = false                       │
                    └────────────────────────────────────────────┘
```

---

## Error Alert UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│                  Add New Equipment Modal                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Form fields:                                                 │
│  [Equipment Name: "Microscope"]                              │
│  [Category: "Biology"]                                       │
│  [Quantity: "1"]                                             │
│  [Location: "Room 101"]                                      │
│  [Status: "Available"]                                       │
│  [Condition: "Good"]                                         │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ⚠️  ERROR ALERT (Red Box)                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ⚠️ Duplicate Equipment Found                            ││
│  │                                                          ││
│  │ Equipment "Microscope" already exists. You can update  ││
│  │ the existing record instead.                           ││
│  │                                                          ││
│  │ Existing Equipment:                                    ││
│  │ Location: Room 101                                     ││
│  │ Quantity: 3                                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Action Buttons:                                              │
│  ┌──────────────┬─────────────────┬──────────────────────┐  │
│  │   [Cancel]   │[Create Anyway]  │[Update Existing]    │  │
│  │   (gray)     │   (orange)      │  (green gradient)   │  │
│  └──────────────┴─────────────────┴──────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────┐
│   User      │
│   Input     │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Component State      │
│ • formData           │
│ • isLoading = true   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Duplicate Detection Service      │
│                                  │
│ checkEquipmentDuplicate(name)    │
│   • Query Firestore              │
│   • Compare results              │
│   • Return DuplicateCheckResult  │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ DuplicateCheckResult Object         │
│                                     │
│ {                                   │
│   isDuplicate: true/false           │
│   existingId?: "doc-id-123"         │
│   existingData?: { ... }            │
│   message: "..."                    │
│   suggestions: { ... }              │
│ }                                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Component Decision               │
│                                  │
│ if (isDuplicate)                 │
│   → Show error UI                │
│   → setShowUpdateOption(true)    │
│   → setDuplicateError(result)    │
│ else                             │
│   → Save to Firestore            │
│   → Show success toast           │
│   → Close modal                  │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ User Action                      │
│                                  │
│ • Cancel                         │
│ • Create Anyway                  │
│ • Update Existing                │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Final Outcome                    │
│                                  │
│ • Modal closes                   │
│ • Toast shown                    │
│ • Database updated or unchanged  │
└──────────────────────────────────┘
```

---

## Collection Query Diagram

```
EQUIPMENT COLLECTION
┌───────────────────────────────────────┐
│ Equipment Documents                   │
├───────────────────────────────────────┤
│ ID: doc-001                           │
│ • name: "Microscope"  ◄─── CHECK     │
│ • category: "Biology"                 │
│ • location: "Room 101"                │
│ • quantity: 3                         │
│                                       │
│ ID: doc-002                           │
│ • name: "Bunsen Burner"               │
│ • category: "Chemistry"               │
│ • location: "Lab A"                   │
│ • quantity: 5                         │
└───────────────────────────────────────┘

Query: where('name' == 'Microscope')
Result: 1 document found (DUPLICATE!)


CHEMICALS COLLECTION
┌───────────────────────────────────────┐
│ Chemical Documents                    │
├───────────────────────────────────────┤
│ ID: chem-001                          │
│ • name: "Sulfuric Acid"   ◄─── CHECK │
│ • formula: "H₂SO₄"        ◄─── CHECK │
│ • quantity: 5.0                       │
│ • unit: "Liters"                      │
│ • location: "Cabinet A"               │
│                                       │
│ ID: chem-002                          │
│ • name: "Hydrochloric Acid"           │
│ • formula: "HCl"                      │
│ • quantity: 2.5                       │
│ • unit: "Liters"                      │
│ • location: "Cabinet B"               │
└───────────────────────────────────────┘

Query: where('name' == 'Sulfuric Acid' AND 'formula' == 'H₂SO₄')
Result: 1 document found (DUPLICATE!)
```

---

## State Variables Summary

```
┌─────────────────────────────────────────────────────────┐
│           Component State Variables                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ duplicateError: any | null                             │
│ ├─ null → No duplicate found / alert not shown         │
│ └─ Object → Duplicate found, shows error details       │
│    ├─ isDuplicate: true                                │
│    ├─ existingId: "doc-id"                             │
│    ├─ existingData: { ... existing record ... }        │
│    ├─ message: "Equipment already exists..."           │
│    └─ suggestions: { canUpdate, canCreateNew }         │
│                                                          │
│ showUpdateOption: boolean                              │
│ ├─ false → Alert not shown / default state             │
│ └─ true → Alert visible, update option available      │
│                                                          │
│ isLoading: boolean                                     │
│ ├─ false → Not checking, buttons active                │
│ └─ true → Checking database, buttons disabled          │
│                                                          │
│ formData: Partial<Equipment> | Partial<Chemical>      │
│ └─ Current form values being entered                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Integration Points

```
┌────────────────────────────────────────────────────────┐
│              CURRENT INTEGRATION STATUS                 │
├────────────────────────────────────────────────────────┤
│                                                         │
│ ✅ EquipmentList.tsx                                  │
│    ├─ Import: duplicateDetection functions             │
│    ├─ State: 3 new variables added                    │
│    ├─ Function: handleAddEquipment() modified          │
│    ├─ Function: handleUpdateExistingEquipment() new    │
│    └─ UI: Error alert & buttons added                 │
│                                                         │
│ ✅ ChemicalTracker.tsx                                │
│    ├─ Import: duplicateDetection functions             │
│    ├─ State: 3 new variables added                    │
│    ├─ Function: handleAddChemical() modified           │
│    ├─ Function: handleUpdateExistingChemical() new     │
│    └─ UI: Error alert & buttons added                 │
│                                                         │
│ ⏳ MaintenanceTracker.tsx (Ready for integration)     │
│    ├─ Service functions available                      │
│    ├─ Same pattern as Equipment/Chemical               │
│    └─ Awaiting component modification                 │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

This visual guide helps understand the complete duplicate detection system flow, architecture, and integration!

