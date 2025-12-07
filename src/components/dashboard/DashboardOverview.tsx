import { useState, useEffect } from "react";
import { 
  Package, 
  FlaskConical, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react";
import { 
  subscribeToEquipment, 
  subscribeToChemicals,
  Equipment,
  Chemical
} from "../../services/firebaseService";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";

interface DashboardOverviewProps {
  userRole: 'admin' | 'teacher' | 'lab-assistant' | 'student' | null;
}

export function DashboardOverview({ userRole }: DashboardOverviewProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time equipment subscription
  useEffect(() => {
    try {
      const unsubEquipment = subscribeToEquipment((data) => {
        setEquipment(data);
        setLoading(false);
      });

      return () => unsubEquipment();
    } catch (error) {
      console.error('Error subscribing to equipment:', error);
      setLoading(false);
    }
  }, []);

  // Real-time chemicals subscription
  useEffect(() => {
    try {
      const unsubChemicals = subscribeToChemicals((data) => {
        setChemicals(data);
      });

      return () => unsubChemicals();
    } catch (error) {
      console.error('Error subscribing to chemicals:', error);
    }
  }, []);

  // Real-time recent activity
  useEffect(() => {
    try {
      const unsubActivity = onSnapshot(
        query(collection(db, 'checkInOut'), orderBy('timestamp', 'desc'), limit(10)),
        (snapshot) => {
          const activities: any[] = [];
          snapshot.forEach((doc) => {
            activities.push({ id: doc.id, ...doc.data() });
          });
          setRecentActivity(activities);
        },
        (error) => {
          console.error('Error listening to activity:', error);
        }
      );

      return () => unsubActivity();
    } catch (error) {
      console.error('Error subscribing to activity:', error);
    }
  }, []);

  // Calculate statistics
  const stats = {
    totalEquipment: equipment.length,
    availableEquipment: equipment.filter(e => e.status === "Available").length,
    inUseEquipment: equipment.filter(e => e.status === "In Use").length,
    maintenanceEquipment: equipment.filter(e => e.status === "Maintenance").length,
    
    totalChemicals: chemicals.length,
    highHazard: chemicals.filter(c => c.hazardLevel === "High").length,
    lowStock: chemicals.filter(c => c.quantity < 1).length,
    
    recentCheckouts: recentActivity.filter(a => a.action === "check-out").length,
    recentCheckins: recentActivity.filter(a => a.action === "check-in").length,
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      let d: Date;
      if (typeof date === 'object' && 'toDate' in date) {
        d = date.toDate();
      } else if (date instanceof Date) {
        d = date;
      } else {
        d = new Date(date);
      }
      return d.toLocaleString();
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to Labventory! {userRole === 'admin' ? '👑' : userRole === 'teacher' ? '👨‍🏫' : userRole === 'lab-assistant' ? '🔬' : '🎓'}
            </h1>
            <p className="text-blue-100">
              You're signed in as <span className="font-semibold capitalize">{userRole?.replace('-', ' ')}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Main Statistics - Real-Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Equipment */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Equipment</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalEquipment}</p>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
              {stats.availableEquipment} Available
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {stats.inUseEquipment} In Use
            </span>
          </div>
        </div>

        {/* Total Chemicals */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Chemicals</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalChemicals}</p>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
              {stats.highHazard} High Hazard
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
              {stats.lowStock} Low Stock
            </span>
          </div>
        </div>

        {/* Maintenance Needed */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <Activity className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Maintenance</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.maintenanceEquipment}</p>
          <p className="mt-3 text-xs text-gray-600">
            Equipment requiring attention
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Recent Activity</h3>
          <p className="text-3xl font-bold text-gray-900">{recentActivity.length}</p>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {stats.recentCheckouts} Out
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
              {stats.recentCheckins} In
            </span>
          </div>
        </div>
      </div>

      {/* Equipment Status Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Equipment Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Available</span>
              <span className="text-lg font-bold text-green-600">{stats.availableEquipment}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">In Use</span>
              <span className="text-lg font-bold text-blue-600">{stats.inUseEquipment}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-gray-700">Maintenance</span>
              <span className="text-lg font-bold text-orange-600">{stats.maintenanceEquipment}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Chemical Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">High Hazard</span>
              <span className="text-lg font-bold text-red-600">{stats.highHazard}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-gray-700">Low Stock</span>
              <span className="text-lg font-bold text-orange-600">{stats.lowStock}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Total Stock</span>
              <span className="text-lg font-bold text-blue-600">{stats.totalChemicals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed - Real-Time */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity Feed
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>No recent activity</p>
            </div>
          ) : (
            recentActivity.slice(0, 10).map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.action === 'check-out' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {activity.action === 'check-out' ? '📤' : '📥'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.itemName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.action === 'check-out' ? 'Checked out' : 'Checked in'} by {activity.userName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      activity.itemType === 'equipment'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {activity.itemType}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions (Role-based) */}
      {(userRole === 'admin' || userRole === 'teacher') && (
        <div className="grid md:grid-cols-3 gap-6">
          <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 text-left hover:shadow-xl transition-all">
            <Package className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Add Equipment</h3>
            <p className="text-sm text-blue-100">Add new equipment to inventory</p>
          </button>
          <button className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 text-left hover:shadow-xl transition-all">
            <FlaskConical className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Add Chemical</h3>
            <p className="text-sm text-purple-100">Register new chemicals</p>
          </button>
          <button className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 text-left hover:shadow-xl transition-all">
            <Activity className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">View Reports</h3>
            <p className="text-sm text-green-100">Generate activity reports</p>
          </button>
        </div>
      )}
    </div>
  );
}