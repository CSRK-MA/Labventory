// src/components/dashboard/RealtimeDashboard.jsx
// Real-time Dashboard with live updates

import { useRealtimeEquipmentStats } from '../../hooks/useRealtimeEquipment';
import { useRealtimeChemicalStats, useRealtimeLowStockChemicals, useRealtimeExpiringChemicals } from '../../hooks/useRealtimeChemicals';
import { useRealtimeActiveCheckouts, useRealtimeOverdueItems } from '../../hooks/useRealtimeCheckInOut';
import { Package, FlaskConical, Activity, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export function RealtimeDashboard() {
  // Real-time data hooks
  const { stats: equipmentStats, loading: equipmentLoading } = useRealtimeEquipmentStats();
  const { stats: chemicalStats, loading: chemicalLoading } = useRealtimeChemicalStats();
  const { lowStockChemicals } = useRealtimeLowStockChemicals();
  const { expiringChemicals } = useRealtimeExpiringChemicals(30);
  const { activeCheckouts } = useRealtimeActiveCheckouts();
  const { overdueItems } = useRealtimeOverdueItems();

  const loading = equipmentLoading || chemicalLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Indicator */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <div>
            <p className="text-sm text-green-800">
              <span>Live Connection Active</span> • 
              <span className="ml-2">Last updated: {new Date().toLocaleTimeString()}</span>
            </p>
            <p className="text-xs text-green-600">
              All data updates automatically in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Equipment Available */}
        <StatCard
          title="Available"
          value={equipmentStats.available}
          total={equipmentStats.total}
          icon={Package}
          color="green"
          trend={equipmentStats.available > equipmentStats.inUse ? 'up' : 'down'}
        />

        {/* Equipment In Use */}
        <StatCard
          title="In Use"
          value={equipmentStats.inUse}
          total={equipmentStats.total}
          icon={Activity}
          color="blue"
          subtitle={`${activeCheckouts.length} active checkouts`}
        />

        {/* Equipment Maintenance */}
        <StatCard
          title="Maintenance"
          value={equipmentStats.maintenance}
          total={equipmentStats.total}
          icon={AlertTriangle}
          color="orange"
          alert={equipmentStats.maintenance > 0}
        />

        {/* Total Inventory Value */}
        <StatCard
          title="Total Value"
          value={`$${equipmentStats.totalValue.toLocaleString()}`}
          icon={TrendingUp}
          color="purple"
          subtitle={`${equipmentStats.total} items`}
        />
      </div>

      {/* Alerts Section */}
      {(lowStockChemicals.length > 0 || expiringChemicals.length > 0 || overdueItems.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Low Stock Alert */}
          {lowStockChemicals.length > 0 && (
            <AlertCard
              title="Low Stock Chemicals"
              count={lowStockChemicals.length}
              items={lowStockChemicals.slice(0, 3)}
              color="red"
              icon={FlaskConical}
            />
          )}

          {/* Expiring Soon Alert */}
          {expiringChemicals.length > 0 && (
            <AlertCard
              title="Expiring Soon"
              count={expiringChemicals.length}
              items={expiringChemicals.slice(0, 3)}
              color="orange"
              icon={AlertTriangle}
            />
          )}

          {/* Overdue Items Alert */}
          {overdueItems.length > 0 && (
            <AlertCard
              title="Overdue Returns"
              count={overdueItems.length}
              items={overdueItems.slice(0, 3)}
              color="red"
              icon={AlertTriangle}
            />
          )}
        </div>
      )}

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment by Category */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg mb-4 text-gray-900">Equipment by Category</h3>
          <div className="space-y-3">
            {Object.entries(equipmentStats.byCategory).map(([category, count]) => (
              <CategoryBar
                key={category}
                label={category}
                value={count}
                total={equipmentStats.total}
              />
            ))}
          </div>
        </div>

        {/* Chemicals by Hazard Level */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg mb-4 text-gray-900">Chemicals by Hazard Level</h3>
          <div className="space-y-3">
            {Object.entries(chemicalStats.byHazardLevel).map(([level, count]) => (
              <CategoryBar
                key={level}
                label={level}
                value={count}
                total={chemicalStats.total}
                color={getHazardColor(level)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Log */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-900">Recent Activity</h3>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Real-time activity log will be displayed here
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, total, icon: Icon, color, trend, subtitle, alert }) {
  const colorClasses = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-indigo-600',
    orange: 'from-orange-500 to-red-600',
    purple: 'from-purple-500 to-pink-600',
    red: 'from-red-500 to-rose-600'
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${alert ? 'ring-2 ring-orange-500' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        )}
      </div>
      <div className="text-3xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      {total && (
        <div className="mt-2 text-xs text-gray-500">of {total} total</div>
      )}
      {subtitle && (
        <div className="mt-2 text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  );
}

// Alert Card Component
function AlertCard({ title, count, items, color, icon: Icon }) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5" />
        <div>
          <div className="text-sm">{title}</div>
          <div className="text-2xl">{count}</div>
        </div>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="text-xs opacity-80 truncate">
            • {item.itemName || item.chemicalName || 'Item'}
          </div>
        ))}
      </div>
    </div>
  );
}

// Category Bar Component
function CategoryBar({ label, value, total, color = 'blue' }) {
  const percentage = (value / total) * 100;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-600">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Helper function for hazard color
function getHazardColor(level) {
  const colors = {
    'high': 'red',
    'medium': 'orange',
    'low': 'yellow',
    'minimal': 'green',
    'unspecified': 'blue'
  };
  return colors[level.toLowerCase()] || 'blue';
}
