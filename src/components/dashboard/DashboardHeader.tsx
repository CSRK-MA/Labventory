import { Search, Bell, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NotificationBar } from "../NotificationBar"; // ✅ ADD
interface DashboardHeaderProps {
  onSignOut: () => void;
  userRole: 'admin' | 'teacher' | 'lab-assistant' |'student' | null;
  toggleSidebar: () => void;
}

export function DashboardHeader({ onSignOut, userRole, toggleSidebar }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const getRoleName = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin';
      case 'teacher':
        return 'Teacher';
      case 'lab-assistant':
        return 'Lab Assistant';
      case 'student':
        return 'Student';
      default:
        return 'User';
    }
  };

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 relative z-20">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        
        {/* Desktop Search Bar */}
        <div className="hidden md:block relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment, chemicals, or logs..."
            className="w-full pl-11 pr-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setShowSearchMobile(!showSearchMobile)}
          className="md:hidden p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
          aria-label="Search"
        >
          {showSearchMobile ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Search className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <NotificationBar/>

        {/* User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
          <div className="text-right hidden lg:block">
            <div className="text-sm text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">{getRoleName()}</div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg active:scale-95 transition-all"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Dropdown Menu - Mobile Optimized */}
            {showUserMenu && (
              <>
                {/* Mobile Overlay */}
                <div 
                  className="md:hidden fixed inset-0 z-30"
                  onClick={() => setShowUserMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 top-12 sm:top-14 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* Mobile User Info */}
                  <div className="lg:hidden p-4 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="text-base text-gray-900">John Doe</div>
                    <div className="text-sm text-gray-600">{getRoleName()}</div>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors text-left"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm sm:text-base text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {showSearchMobile && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-lg z-30 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}