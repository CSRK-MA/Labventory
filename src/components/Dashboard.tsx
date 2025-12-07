import { useState, useEffect } from "react";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { EquipmentList } from "./dashboard/EquipmentList";
import { ChemicalTracker } from "./dashboard/ChemicalTracker";
import { CheckInOut } from "./dashboard/CheckInOut";
import { MaintenanceTracker } from "./dashboard/MaintenanceTracker";
import { Reports } from "./dashboard/Reports";
import { Settings } from "./dashboard/Settings";
import { UserManagement } from "./dashboard/UserManagement";  // ✅ ADD THIS
import { CustomDataEntry } from "./dashboard/CustomDataEntry"; // ✅ ADD

interface DashboardProps {
  userRole: 'admin' | 'teacher' | 'lab-assistant' | 'student' | null;
  onSignOut: () => void;
}

export function Dashboard({ userRole, onSignOut }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<string>('overview');
  
  // Initialize sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024; // Open on desktop, closed on mobile
    }
    return true;
  });

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <DashboardOverview userRole={userRole} />;
      case 'equipment':
        return <EquipmentList />;
      case 'chemicals':
        return <ChemicalTracker />;
      case 'checkinout':
        return <CheckInOut />;
      case 'maintenance':
        return <MaintenanceTracker />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <UserManagement />;
      case 'customdata': // ✅ ADD THIS
        return <CustomDataEntry />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <DashboardSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      {/* Main Content Area - Adjusts based on sidebar state */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Header - Fixed at top of content area */}
        <DashboardHeader
          onSignOut={onSignOut}
          userRole={userRole}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}