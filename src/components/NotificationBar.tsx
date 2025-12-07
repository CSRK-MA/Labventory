import { useState, useEffect } from "react";
import { Bell, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { subscribeToEquipment, subscribeToChemicals } from "../services/firebaseService";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
}

export function NotificationBar() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to equipment changes
    const unsubEquipment = subscribeToEquipment((equipment) => {
      const newNotifications: Notification[] = [];

      // Check for maintenance needed
      const maintenanceNeeded = equipment.filter(e => e.status === "Maintenance");
      if (maintenanceNeeded.length > 0) {
        newNotifications.push({
          id: `maintenance-${Date.now()}`,
          type: 'warning',
          title: 'Maintenance Alert',
          message: `${maintenanceNeeded.length} equipment items need maintenance`,
          timestamp: new Date()
        });
      }

      // Check for low quantity
      const lowQuantity = equipment.filter(e => e.quantity && e.quantity < 2);
      if (lowQuantity.length > 0) {
        newNotifications.push({
          id: `lowqty-${Date.now()}`,
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${lowQuantity.length} equipment items are running low`,
          timestamp: new Date()
        });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 10));
        setUnreadCount(prev => prev + newNotifications.length);
      }
    });

    // Subscribe to chemical changes
    const unsubChemicals = subscribeToChemicals((chemicals) => {
      const newNotifications: Notification[] = [];

      // Check for low stock
      const lowStock = chemicals.filter(c => c.quantity < 1);
      if (lowStock.length > 0) {
        newNotifications.push({
          id: `chem-lowstock-${Date.now()}`,
          type: 'warning',
          title: 'Chemical Low Stock',
          message: `${lowStock.length} chemicals are running low`,
          timestamp: new Date()
        });
      }

      // Check for high hazard
      const highHazard = chemicals.filter(c => c.hazardLevel === "High");
      if (highHazard.length > 3) {
        newNotifications.push({
          id: `hazard-${Date.now()}`,
          type: 'warning',
          title: 'High Hazard Alert',
          message: `${highHazard.length} high hazard chemicals in inventory`,
          timestamp: new Date()
        });
      }

      // Check expiring soon
      const expiringSoon = chemicals.filter(c => {
        if (!c.expiryDate) return false;
        const expiry = c.expiryDate instanceof Date ? c.expiryDate : new Date(c.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      });

      if (expiringSoon.length > 0) {
        newNotifications.push({
          id: `expiry-${Date.now()}`,
          type: 'warning',
          title: 'Expiry Alert',
          message: `${expiringSoon.length} chemicals expiring within 30 days`,
          timestamp: new Date()
        });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 10));
        setUnreadCount(prev => prev + newNotifications.length);
      }
    });

    return () => {
      unsubEquipment();
      unsubChemicals();
    };
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => {
          setShowPanel(!showPanel);
          if (!showPanel) handleMarkAllRead();
        }}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowPanel(false)}
          />
          
          {/* Panel */}
          <div className="fixed top-20 right-4 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-600">{notifications.length} total</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="text-xs text-blue-600 hover:text-blue-700 px-3 py-1 hover:bg-blue-100 rounded transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications</p>
                  <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getColor(notification.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}