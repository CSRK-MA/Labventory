import { useState, useEffect } from "react";
import { Database } from "lucide-react"; // ✅ ADD
import { 
  LayoutDashboard, 
  Package, 
  FlaskConical, 
  ClipboardList, 
  Wrench, 
  FileText, 
  Settings as SettingsIcon,
  Users,
  Beaker,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { subscribeToEquipment, subscribeToChemicals, Equipment, Chemical } from "../../services/firebaseService";

interface DashboardSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'admin' | 'teacher' | 'lab-assistant' | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'teacher', 'lab-assistant', 'student'] },
  { id: 'equipment', label: 'Equipment', icon: Package, roles: ['admin', 'teacher', 'lab-assistant', 'student'] },
  { id: 'chemicals', label: 'Chemicals', icon: FlaskConical, roles: ['admin', 'teacher', 'lab-assistant', 'student'] },
  { id: 'checkinout', label: 'Check In/Out', icon: ClipboardList, roles: ['admin', 'teacher', 'lab-assistant'] },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin', 'teacher', 'lab-assistant'] },
  { id: 'customdata', label: 'Custom Data', icon: Database, roles: ['admin'] }, // ✅ ADD THIS - Admin only
  { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'teacher', 'student'] },
  { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, roles: ['admin', 'teacher', 'lab-assistant', 'student'] },
];

export function DashboardSidebar({ currentPage, setCurrentPage, userRole, isOpen, setIsOpen }: DashboardSidebarProps) {
  // ✅ Real-time data states
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [stats, setStats] = useState({
    available: 0,
    inUse: 0,
    maintenance: 0,
    lowStock: 0
  });

  // ✅ Subscribe to real-time data
  useEffect(() => {
    const unsubEquipment = subscribeToEquipment((equipmentData) => {
      setEquipment(equipmentData);
    });

    const unsubChemicals = subscribeToChemicals((chemicalData) => {
      setChemicals(chemicalData);
    });

    return () => {
      unsubEquipment();
      unsubChemicals();
    };
  }, []);

  // ✅ Calculate stats from real data
  useEffect(() => {
    const availableEquipment = equipment.filter(e => e.status === "Available").length;
    const inUseEquipment = equipment.filter(e => e.status === "In Use").length;
    const maintenanceEquipment = equipment.filter(e => e.status === "Maintenance").length;
    const lowStockChemicals = chemicals.filter(c => c.quantity < 1).length;

    setStats({
      available: availableEquipment,
      inUse: inUseEquipment,
      maintenance: maintenanceEquipment,
      lowStock: lowStockChemicals
    });
  }, [equipment, chemicals]);

  const visibleMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole || 'lab-assistant')
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'w-64' : 'lg:w-20'}`}>
        
        {/* Logo - Fixed at top */}
        <div className="h-16 sm:h-20 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Beaker className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                Labventory
              </span>
            </div>
          )}
          {!isOpen && (
            <div className="hidden lg:flex items-center justify-center w-full">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Beaker className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 transition-colors shadow-md z-50"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
        </button>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg transition-all active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${!isOpen && 'lg:justify-center'}`}
                title={!isOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="text-sm sm:text-base flex items-center gap-2">
                    {item.label}
                    {item.id === 'users' && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Role & Live Stats - Fixed at bottom */}
        {isOpen && (
          <div className="flex-shrink-0 m-4 space-y-3">
            {/* User Role Badge */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {userRole === 'admin' ? '👑' : userRole === 'teacher' ? '👨‍🏫' : '🔬'}
                </div>
                <div>
                  <div className="text-xs text-gray-500">Signed in as</div>
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {userRole?.replace('-', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-xs font-medium text-gray-700">Live Stats</div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Available</span>
                  <span className="text-sm font-semibold text-green-600">{stats.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">In Use</span>
                  <span className="text-sm font-semibold text-blue-600">{stats.inUse}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Maintenance</span>
                  <span className="text-sm font-semibold text-orange-600">{stats.maintenance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Low Stock</span>
                  <span className="text-sm font-semibold text-red-600">{stats.lowStock}</span>
                </div>
              </div>
            </div>

            {/* Total Items Count */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-600">Total Items</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {equipment.length + chemicals.length}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>🔬 {equipment.length}</div>
                  <div>🧪 {chemicals.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}