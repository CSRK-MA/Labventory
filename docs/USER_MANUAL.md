# User Manual - EduTrack Laboratory Management System

**Version:** 1.0  
**Last Updated:** December 2025  
**Audience:** All System Users (Admin, Teachers, Lab Assistants, Students)

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Checking In/Out Equipment](#checking-inout-equipment)
4. [Managing Equipment](#managing-equipment)
5. [Managing Chemicals](#managing-chemicals)
6. [Scheduling Maintenance](#scheduling-maintenance)
7. [Generating Reports](#generating-reports)
8. [User Management](#user-management)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## 1. Getting Started

### Accessing EduTrack

1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to: `http://localhost:5173` (development) or your production URL
3. You should see the EduTrack login page

### First Time Login

1. **Enter your email address** in the "Email" field
2. **Enter your password** in the "Password" field
3. **Click "Sign In"** button
4. If credentials are correct, you'll be redirected to the dashboard

### Forgot Password

If you forgot your password:
1. Click **"Forgot Password?"** link on login page
2. Enter your email address
3. Click **"Reset Password"**
4. Check your email for password reset link
5. Follow the link and create a new password
6. Return to login and use new password

### Logging Out

To logout from the system:
1. Click your **profile icon** (top-right corner)
2. Select **"Logout"** from dropdown menu
3. Confirm logout
4. You'll be returned to the login page

---

## 2. Dashboard Overview

### Main Dashboard Screen

When you first login, you'll see the **Dashboard** with these main sections:

#### Left Sidebar
- **Dashboard** — Home/overview page
- **Equipment** — Equipment inventory management
- **Chemicals** — Chemical inventory management
- **Check In/Out** — Check-in/check-out operations
- **Maintenance** — Maintenance scheduling and history
- **Reports** — Generate and download reports
- **User Management** — Manage user accounts (admin only)
- **Settings** — System settings and preferences

#### Main Content Area

**Statistics Cards** (Top Section)
- Total Equipment — Number of equipment items in inventory
- In Use — Items currently checked out
- Maintenance Needed — Equipment requiring maintenance
- Chemicals Expiring Soon — Chemicals expiring within 30 days

**Activity Feed** (Middle Section)
- Recent check-in/out records
- Equipment status changes
- Maintenance updates
- User activities (last 10 entries)

**Alerts Section** (Top-right)
- ⚠️ Chemical expiry warnings (< 30 days)
- 🔧 Equipment maintenance reminders
- ❌ Overdue check-outs
- ✅ System notifications

**Navigation Tips:**
- Click any menu item in the sidebar to navigate
- Breadcrumbs at top show current location
- Use search bar to find specific items
- Dark/Light mode toggle in top-right corner

---

## 3. Checking In/Out Equipment

### Checking Out Equipment

**Method 1: Using QR Code Scanner** (Recommended)

1. Click **"Check In/Out"** in sidebar
2. Click **"Scan QR Code"** button
3. **Point your camera** at equipment QR code
4. System automatically reads code and shows equipment details
5. **Verify equipment name and details**
6. **Enter purpose** (optional) — Why you're checking it out
7. **Select expected return date/time** (if required)
8. Click **"Confirm Check Out"**
9. ✅ Equipment checked out successfully — Confirmation message appears

**Method 2: Manual Entry** (No QR Code Available)

1. Click **"Check In/Out"** in sidebar
2. Click **"Manual Entry"** tab
3. **Search equipment** by typing name in search field
4. **Select equipment** from dropdown list
5. **Verify quantity** (if applicable)
6. **Enter purpose** (optional)
7. **Select expected return date/time**
8. Click **"Confirm Check Out"**
9. ✅ Equipment checked out successfully

### Checking In Equipment

**Method 1: Using QR Code Scanner** (Recommended)

1. Click **"Check In/Out"** in sidebar
2. Click **"Scan QR Code"** button
3. **Point camera at QR code** of equipment being returned
4. System shows equipment details and check-out history
5. **Verify** this is the correct equipment
6. Click **"Confirm Check In"**
7. ✅ Equipment checked in — Status updated to "Available"

**Method 2: Manual Entry**

1. Click **"Check In/Out"** in sidebar
2. Click **"Check In"** tab
3. **Search equipment** by typing name
4. **Select equipment** from results
5. **Verify check-out details** displayed
6. **Add notes** (optional) — Condition, damage, etc.
7. Click **"Confirm Check In"**
8. ✅ Equipment checked in successfully

### Understanding Status Changes

| Status | Meaning |
|--------|---------|
| **Available** | Equipment is ready to use |
| **In Use** | Currently checked out by user |
| **Maintenance** | Being serviced/repaired |
| **Retired** | No longer in use |

### Real-Time Updates

Once you check out or in equipment:
- Status updates immediately (< 2 seconds)
- All users see the updated status
- No manual refresh needed
- Notifications sent to relevant users

---

## 4. Managing Equipment

### Viewing Equipment List

1. Click **"Equipment"** in sidebar
2. See full list of all equipment items
3. Each row shows:
   - **Name** — Equipment name
   - **Category** — Type (heating, analysis, separation, etc.)
   - **Status** — Current status (color-coded)
   - **Location** — Where item is stored
   - **Last Maintenance** — When last serviced

### Searching Equipment

1. On Equipment page, click **Search bar** at top
2. Type equipment name (e.g., "Microscope")
3. Results filter automatically (case-insensitive)
4. Partial matches work (typing "Micro" finds microscopes)

### Filtering Equipment

1. Click **"Filter"** button on Equipment page
2. Select filter criteria:
   - **Status** — Available, In Use, Maintenance, Retired
   - **Category** — Heating, Analysis, Separation, Measuring
   - **Location** — Lab A, Lab B, Lab C, etc.
3. Click **"Apply"** to show filtered results
4. Click **"Clear"** to remove all filters

### Adding New Equipment

1. Click **"Equipment"** in sidebar
2. Click **"Add Equipment"** button (top-right)
3. Fill out the form:
   - **Equipment Name** * (required) — Clear, specific name
   - **Category** * (required) — Select from dropdown
   - **Initial Quantity** * (required) — Number of units
   - **Location** * (required) — Where stored
   - **Condition** — New, Good, Fair, Poor
   - **Purchase Date** — When acquired
   - **Description** (optional) — Notes about equipment
4. Click **"Generate QR Code"** (generates unique code)
5. Click **"Save Equipment"**
6. ✅ Equipment added — Appears in list immediately

**Note:** Print and attach the generated QR code to the physical equipment.

### Editing Equipment

1. In Equipment list, **click equipment name** or **click "Edit" button**
2. Update fields:
   - Name, category, location, condition
   - Leave other fields unchanged if no update needed
3. Click **"Update Equipment"**
4. ✅ Changes saved immediately

### Viewing Equipment Details

1. Click on any **equipment name** in the list
2. Details page shows:
   - Full equipment information
   - Check-in/out history
   - Maintenance records
   - Current user (if checked out)
   - QR code for scanning
3. Click **"Back to List"** to return

### Deleting Equipment

1. In Equipment list, click **"Delete" button** (or three dots menu)
2. **Confirm deletion** in dialog (cannot be undone)
3. ⚠️ Equipment is marked as "Retired" (not physically deleted)
4. Click **"Confirm"**
5. ✅ Equipment status changed to "Retired"

---

## 5. Managing Chemicals

### Viewing Chemical Inventory

1. Click **"Chemicals"** in sidebar
2. See all chemicals with:
   - **Name** — Chemical name
   - **Formula** — Chemical formula (e.g., H₂O)
   - **Quantity** — Amount remaining
   - **Hazard Level** — Low, Medium, High (color-coded)
   - **Expiry Date** — When expires
   - **Status** — Safe, Warning, Critical

### Chemical Expiry Alerts

| Status | Days to Expiry | Action |
|--------|---|--------|
| 🟢 **Safe** | > 90 days | Continue normal use |
| 🟡 **Warning** | 30-90 days | Plan to order replacement |
| 🔴 **Critical** | < 30 days | Order immediately; limit use |
| ⚫ **EXPIRED** | 0 days | Stop use; dispose safely |

### Adding New Chemical

1. Click **"Chemicals"** in sidebar
2. Click **"Add Chemical"** button
3. Fill out the form:
   - **Chemical Name** * (required)
   - **Formula** (optional) — Chemical formula
   - **Quantity** * (required) — Amount available
   - **Unit** * (required) — mL, g, L, kg, etc.
   - **Hazard Level** * (required) — Low, Medium, High
   - **Location** * (required) — Storage location
   - **Expiry Date** * (required) — Expiration date
   - **Supplier** (optional) — Vendor name
4. Click **"Save Chemical"**
5. ✅ Chemical added to inventory

### Tracking Chemical Usage

1. Open **Chemicals** page
2. Click on specific chemical
3. **Click "Check Out"** to record usage
4. Enter **quantity removed**
5. Click **"Confirm"**
6. ✅ Inventory quantity automatically updated

### Viewing Chemical History

1. Click on chemical name
2. **"History" tab** shows:
   - All check-outs
   - Quantity changes
   - User who made changes
   - Timestamps

---

## 6. Scheduling Maintenance

### Creating Maintenance Task

1. Click **"Maintenance"** in sidebar
2. Click **"Schedule Maintenance"** button
3. Fill out the form:
   - **Equipment** * (required) — Select from dropdown
   - **Maintenance Type** * (required) — Repair, Inspection, Calibration, Cleaning
   - **Description** * (required) — What needs to be done
   - **Scheduled Date** * (required) — When to perform
   - **Technician** (optional) — Assign to specific person
   - **Priority** (optional) — High, Medium, Low
   - **Estimated Cost** (optional) — Budget estimate
4. Click **"Create Task"**
5. ✅ Task created; technician receives notification

### Viewing Maintenance Schedule

1. Click **"Maintenance"** in sidebar
2. See all scheduled tasks:
   - Equipment name
   - Maintenance type
   - Status (Pending, In Progress, Completed)
   - Scheduled date
   - Assigned technician

### Updating Maintenance Status

1. Click on maintenance task
2. Click **"Edit"** button
3. Change **Status** to:
   - **Pending** — Waiting to start
   - **In Progress** — Currently being serviced
   - **Completed** — Finished
4. Add **completion notes** (optional)
5. Click **"Update"**
6. ✅ Status updated

---

## 7. Generating Reports

### Generate Equipment Usage Report

1. Click **"Reports"** in sidebar
2. Click **"New Report"** button
3. Select **"Equipment Usage"** from dropdown
4. Choose **date range**:
   - Start date (required)
   - End date (required)
5. Click **"Generate Report"**
6. ⏳ Processing... (usually 5-10 seconds)
7. Report preview shows:
   - Total check-outs in period
   - Most used equipment
   - Usage by user
   - Equipment status summary
8. Click **"Download PDF"** to save

### Generate Chemical Inventory Report

1. Click **"Reports"** in sidebar
2. Click **"New Report"** button
3. Select **"Chemical Inventory"**
4. Choose report type:
   - Current inventory (snapshot)
   - Expiry summary (chemicals expiring soon)
   - Historical usage (consumption over time)
5. Click **"Generate Report"**
6. Review and click **"Download PDF"**

### Generate Maintenance Report

1. Click **"Reports"** in sidebar
2. Select **"Maintenance Schedule"**
3. Choose date range
4. Report includes:
   - Completed maintenance tasks
   - Pending tasks
   - Equipment requiring attention
   - Cost summary
5. Click **"Download PDF"**

### Report Scheduling (Admin Only)

1. Click **"Reports"** → **"Scheduled Reports"**
2. Click **"Create Schedule"**
3. Select **report type**
4. Choose **frequency** (daily, weekly, monthly)
5. Select **recipients** (email addresses)
6. Click **"Schedule"**
7. ✅ Reports will be sent automatically

---

## 8. User Management

### Admin Only Feature

Only **Admin** users can access User Management. Students and teachers cannot access this section.

### Adding New User

1. Click **"User Management"** (admin only)
2. Click **"Add User"** button
3. Fill out the form:
   - **Email Address** * (required) — Unique email
   - **Full Name** * (required)
   - **Role** * (required) — Admin, Teacher, Lab Assistant, Student
   - **Department** (optional)
   - **Phone** (optional)
4. Click **"Send Invite"**
5. ✅ User receives email with setup link

### Changing User Role

1. In User Management, find user in list
2. Click **"Edit"** button
3. Change **Role** dropdown
4. Click **"Update"**
5. ⚠️ User permissions updated immediately

### Deactivating User

1. Find user in User Management
2. Click **three dots menu** → **"Deactivate"**
3. Confirm deactivation
4. ✅ User cannot login (account not deleted)

### Viewing User Activity

1. Click on user name
2. **Activity tab** shows:
   - Login history
   - Check-in/out records
   - Equipment managed
   - Reports accessed

---

## 9. Troubleshooting

### Common Issues & Solutions

#### Issue: Cannot Login

**Problem:** "Invalid email or password" error

**Solutions:**
1. Verify email address is correct (case-sensitive)
2. Check password — no spaces at beginning/end
3. Click "Forgot Password" to reset
4. Ensure CAPS LOCK is not on
5. Contact admin if account doesn't exist

#### Issue: QR Code Scanner Not Working

**Problem:** Camera permission denied or scanner not responding

**Solutions:**
1. Check **browser permissions** → Allow camera access
2. Ensure **good lighting** — QR code should be clearly visible
3. **Hold camera steady** — Keep QR code in frame
4. Try **manual entry** instead of scanning
5. Make sure **QR code is printed clearly** — Not faded/damaged
6. Try different browser if issue persists

#### Issue: Equipment List Takes Long Time to Load

**Problem:** Page is slow or freezes

**Solutions:**
1. Use **Search** to narrow down results
2. Apply **Filters** to show fewer items
3. Clear browser **cache** (Ctrl+Shift+Del)
4. Refresh page (F5)
5. Close other browser tabs
6. Check internet connection speed

#### Issue: Real-Time Updates Not Working

**Problem:** Equipment status doesn't update when another user checks out

**Solutions:**
1. Refresh page (F5)
2. Check internet connection
3. Try accessing from different device
4. Wait a few seconds (real-time sync has < 2s delay)
5. Contact admin if issue persists

#### Issue: Cannot Generate Report

**Problem:** Report generation fails or times out

**Solutions:**
1. Try with a **smaller date range** (fewer records)
2. Clear **browser cache**
3. Try a **different browser**
4. Wait a few minutes and retry
5. Contact admin if issue continues

#### Issue: Character Encoding Issues

**Problem:** Special characters (é, ñ, ü) show incorrectly

**Solutions:**
1. Ensure browser is set to **UTF-8 encoding**
   - Chrome: Settings → Appearance → Default Encoding
   - Firefox: View → Character Encoding → UTF-8
2. Refresh page (F5)

#### Issue: Cannot Upload Files

**Problem:** System doesn't allow certain file types

**Solutions:**
1. Ensure file is in supported format (PDF, CSV, XLS)
2. Check file size — Most files < 10 MB
3. Rename file if special characters in name
4. Contact admin for large file uploads

---

## 10. FAQ

### General Questions

**Q: What is EduTrack?**  
A: EduTrack is a laboratory equipment and chemical inventory management system. It tracks equipment availability, manages chemical expiry, schedules maintenance, and generates reports.

**Q: Do I need special equipment to use EduTrack?**  
A: No. You only need a web browser and internet connection. QR code scanning requires a smartphone or device with camera.

**Q: Can I access EduTrack on mobile?**  
A: Yes. The system is responsive and works on phones and tablets. QR code scanning works best on mobile devices.

**Q: Is my data secure?**  
A: Yes. EduTrack uses secure authentication, encrypted connections (HTTPS), and firestore security rules to protect your data.

### Account & Login

**Q: How do I change my password?**  
A: Click profile icon (top-right) → "Settings" → "Change Password" → Enter old and new password.

**Q: What if I forget my login email?**  
A: Contact your lab administrator or check your original account setup email.

**Q: Can I have multiple accounts?**  
A: Each user should have one account. Contact admin if you need a new account.

**Q: How long am I logged in?**  
A: Sessions expire after 30 minutes of inactivity for security. You'll be logged out automatically.

### Equipment Management

**Q: How do I know which equipment needs maintenance?**  
A: The dashboard shows equipment needing maintenance. Check the "Alerts" section or view the "Maintenance" page.

**Q: Can I check out equipment for someone else?**  
A: Typically no. Each user should check out their own equipment. Contact admin if you need to check out for another user.

**Q: What if QR code is damaged?**  
A: Use the manual entry method instead. Contact admin to reprint or generate new QR code.

**Q: How long can I check out equipment?**  
A: This depends on lab policy. Select "expected return date" when checking out. Ask your lab manager for specific guidelines.

### Chemical Management

**Q: What do the hazard level colors mean?**  
A: 
- 🟢 Green = Low hazard (safe)
- 🟡 Yellow = Medium hazard (handle with care)
- 🔴 Red = High hazard (follow safety protocols)

**Q: What happens to expired chemicals?**  
A: They must be disposed of safely. Contact your lab manager for disposal procedures. Do not use expired chemicals.

**Q: Can I add chemicals myself?**  
A: Only admin and teachers can add chemicals. Students should ask a teacher or lab assistant.

### Reports

**Q: How detailed are the reports?**  
A: Reports include summary statistics, charts, and detailed tables. They can be customized by date range.

**Q: Can I schedule automatic reports?**  
A: Yes (admin only). Go to "Reports" → "Scheduled Reports" to set up recurring reports via email.

**Q: What formats are supported?**  
A: Reports are generated as PDF files. You can open these with any PDF reader.

**Q: Can I export data to Excel?**  
A: Yes. Download the PDF and you can copy data into Excel if needed.

### Troubleshooting

**Q: System keeps logging me out**  
A: You may have inactivity. Sessions expire after 30 minutes without activity. Log back in and keep browser window active.

**Q: I see different data than my coworker**  
A: This may be due to role-based access. Different roles see different data. Ask admin if you need access to specific data.

**Q: Is there a tutorial or training?**  
A: This user manual is the primary resource. Contact your lab manager for additional training sessions.

**Q: Who do I contact for technical support?**  
A: Contact your IT administrator or lab manager. Include error messages and steps to reproduce the issue.

### Best Practices

**Q: When should I check equipment back in?**  
A: As soon as you finish using it. This makes equipment available for other users immediately.

**Q: How often should reports be generated?**  
A: Typically weekly or monthly. Ask your lab manager about reporting schedule.

**Q: Should I use QR code or manual entry?**  
A: QR codes are faster and less error-prone. Use manual entry only if QR code is unavailable.

**Q: What should I do if equipment is damaged?**  
A: Immediately notify the lab manager. Add a note during check-in describing the damage. Schedule maintenance if needed.

---

## Support & Contact

### Getting Help

If you encounter issues or have questions:

1. **Check this user manual** — Most questions are answered here
2. **Check FAQ section** — Common issues and solutions
3. **Ask your lab manager** — For policy questions
4. **Contact IT administrator** — For technical issues
5. **Email support** — Submit detailed description of issue

### When Reporting Issues

Please include:
- What you were trying to do
- What error you received (screenshot if possible)
- When the issue occurred
- What browser/device you're using
- Steps to reproduce the issue

### System Maintenance

The system may be temporarily unavailable for:
- Security updates (usually off-hours)
- Data backups (automatic)
- System maintenance (announced in advance)

Check the dashboard for maintenance notices.

---

## Quick Reference

### Common Tasks at a Glance

| Task | Steps | Time |
|------|-------|------|
| **Check Out Equipment** | Check In/Out → Scan QR → Confirm | < 1 min |
| **Check In Equipment** | Check In/Out → Scan QR → Confirm | < 1 min |
| **Add New Equipment** | Equipment → Add → Fill Form → Save | 2-3 min |
| **Generate Report** | Reports → Select Type → Choose Dates → Generate | 1-2 min |
| **View Maintenance** | Maintenance → See Schedule | < 1 min |
| **Check Chemical Status** | Chemicals → Review Expiry Status | < 1 min |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F5` | Refresh page |
| `Ctrl + K` | Search (when available) |
| `Ctrl + /` | Help menu |
| `Esc` | Close dialogs |

### Color Codes

| Color | Meaning |
|-------|---------|
| 🟢 Green | Available/Safe/Good |
| 🟡 Yellow | In Use/Warning/Caution |
| 🔴 Red | Maintenance/Critical/Alert |
| ⚫ Black/Gray | Retired/Expired/Inactive |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial release |

---

**Questions or suggestions about this manual?**  
Contact your lab administrator or development team.

**Last Updated:** December 7, 2025  
**EduTrack Version:** 1.0  
**Status:** ✅ Production Ready
