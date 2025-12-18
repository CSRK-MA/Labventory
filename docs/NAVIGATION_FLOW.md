# Navigation/Screen Flow Diagram

## Overview

This document describes the navigation hierarchy and screen flow for the EduTrack Inventory Platform.

## Visual Flow Diagram

An interactive SVG version of this diagram is available in `NAVIGATION_FLOW.svg`

## Text-Based Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EduTrack Navigation Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

                                ┌──────────────┐
                                │  Login/SignIn │
                                └──────┬───────┘
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │    Main Dashboard       │
                         │  (Role-Based Access)    │
                         └────────────┬────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
    ┌─────────────────┐       ┌──────────────────┐      ┌──────────────────┐
    │ Check-In/Out    │       │ Equipment Mgmt   │      │ Chemical Track   │
    │                 │       │                  │      │                  │
    │ • QR Scanner    │       │ • View/Edit      │      │ • Stock Levels   │
    │ • Status Track  │       │ • Maintenance    │      │ • Usage Logs     │
    └────────┬────────┘       └────────┬─────────┘      └────────┬─────────┘
             │                        │                         │
             ▼                        ▼                         ▼
      ┌────────────────┐     ┌────────────────┐      ┌────────────────┐
      │  QR Scanner    │     │ Equipment List │      │ Stock Levels   │
      └────────────────┘     └────────────────┘      └────────────────┘
                                     │
                                     ▼
                             ┌────────────────┐
                             │  Maintenance   │
                             │  Schedule      │
                             └────────────────┘


                                  │          │
                                  │          │
                    ┌─────────────┘          └─────────────┐
                    │                                      │
                    ▼                                      ▼
           ┌─────────────────┐                    ┌─────────────────┐
           │ Reports         │                    │ Settings/Admin  │
           │                 │                    │                 │
           │ • Equipment     │                    │ • Settings      │
           │ • Chemical      │                    │ • User Mgmt     │
           └─────────────────┘                    └────────┬────────┘
                                                          │
                            ┌─────────────────────────────┼──────────────────┐
                            │                             │                  │
                            ▼                             ▼                  ▼
                  ┌────────────────┐         ┌──────────────────┐    ┌────────────────┐
                  │ Profile        │         │ Create/Edit      │    │ Role Mgmt &    │
                  │ Preferences    │         │ Users            │    │ Permissions    │
                  └────────────────┘         └──────────────────┘    └────────────────┘
```

## Detailed Screen Hierarchy

### Level 1: Authentication
- **Login/SignIn Screen**
  - Email/Username input
  - Password input
  - Sign-in button
  - Forgot password link
  - Sign-up option (if enabled)

### Level 2: Main Dashboard
- **Dashboard Overview**
  - User greeting
  - Quick stats
  - Navigation menu
  - Role-based access control
  - Notifications/alerts panel

### Level 3: Core Features

#### 3.1 Check-In/Check-Out Module
- **QR Scanner Screen**
  - Camera feed
  - Scan button
  - Manual input option
  - Confirmation modal
  - History view

#### 3.2 Equipment Management
- **Equipment List Screen**
  - Filterable equipment table
  - Search functionality
  - Status indicators
  - Quick actions
  - Equipment details modal

- **Maintenance Tracking Screen**
  - Scheduled maintenance tasks
  - Maintenance history
  - Schedule new maintenance
  - Work order creation
  - Cost tracking

#### 3.3 Chemical Inventory
- **Stock Levels Screen**
  - Chemical inventory table
  - Stock status indicators
  - Reorder alerts
  - Low stock warnings
  - Expiration date tracking

- **Usage Logs Screen**
  - Log chemical usage
  - View usage history
  - Filter by user/date/chemical
  - Export usage data

#### 3.4 Reports
- **Equipment Report**
  - Usage statistics
  - Utilization rates
  - Maintenance summary
  - Cost analysis
  - Export options

- **Chemical Report**
  - Consumption trends
  - Cost analysis
  - Compliance status
  - Reorder history
  - Export options

### Level 4: Settings & Administration

#### 4.1 User Settings
- **Profile Screen**
  - View/edit user information
  - Change password
  - Profile picture
  - Contact information

- **Preferences Screen**
  - Display preferences
  - Notification settings
  - Language/locale
  - Data privacy settings
  - API key management

#### 4.2 User Management (Admin Only)
- **Create/Edit Users Screen**
  - Add new user
  - Edit user information
  - Assign roles
  - Set department
  - Activate/deactivate users

- **Role & Permissions Screen**
  - View role definitions
  - Manage permissions
  - Custom role creation
  - Permission matrix
  - Access level control

## Navigation Rules

### Authentication Flow
1. Unauthenticated users → Login screen
2. Valid credentials → Dashboard
3. Session timeout → Login screen with message

### Role-Based Access
- **Lab User**: Check-In/Out, Chemical Tracking (limited)
- **Lab Manager**: Equipment Mgmt, Chemical Tracking, Reports
- **Safety Officer**: Chemical Tracking (full), User Activity
- **Technician**: Equipment Mgmt (maintenance), Equipment List
- **System Admin**: All features + User Management

### Navigation Shortcuts
- Logo click: Return to Dashboard
- Back button: Return to previous screen
- Breadcrumbs: Navigate up hierarchy
- Sidebar: Quick access to main features

## Mobile Navigation

For mobile/tablet devices:
- Hamburger menu instead of sidebar
- Bottom navigation tabs (Dashboard, Features, Settings)
- Simplified modals and overlays
- Touch-optimized buttons and inputs

## Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Skip links for main content
- Logical tab order
- ARIA labels and descriptions

## Navigation States

- **Active**: Current page highlighted
- **Disabled**: Unavailable options grayed out
- **Loading**: Progress indicators shown
- **Error**: Error messages and recovery options
- **Success**: Confirmation messages

---

**Diagram Version:** 1.0  
**Last Updated:** December 2025  
**Related Documentation:** USE_CASES.md, PROJECT_INFO.md

## Converting to PNG

To convert the SVG to PNG for presentation purposes, use one of these methods:

1. **Online conversion**: Use an online SVG to PNG converter
2. **Command line**: 
   ```bash
   # Using ImageMagick
   convert NAVIGATION_FLOW.svg NAVIGATION_FLOW.png
   
   # Using Inkscape
   inkscape NAVIGATION_FLOW.svg -o NAVIGATION_FLOW.png
   ```
3. **Browser**: Open SVG in browser and screenshot
4. **Design tools**: Import SVG into Draw.io, Figma, or Lucidchart for editing
