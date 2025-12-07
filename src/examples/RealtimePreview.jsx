// src/examples/RealtimePreview.jsx
// Complete Working Preview of Real-Time System with Data Flow Visualization

import { useState } from 'react';
import { useRealtimeEquipmentStats } from '../hooks/useRealtimeEquipment';
import { useRealtimeChemicals, useRealtimeLowStockChemicals } from '../hooks/useRealtimeChemicals';
import { useRealtimeActiveCheckouts } from '../hooks/useRealtimeCheckInOut';
import { Activity, Database, Zap, Eye, AlertTriangle } from 'lucide-react';

export function RealtimePreview() {
  const [dataFlow, setDataFlow] = useState([]);
  const { stats, loading: statsLoading } = useRealtimeEquipmentStats();
  const { chemicals, loading: chemLoading } = useRealtimeChemicals({ limit: 5 });
  const { lowStockChemicals } = useRealtimeLowStockChemicals();
  const { activeCheckouts } = useRealtimeActiveCheckouts();

  // Log data flow events
  const logDataFlow = (event) => {
    const timestamp = new Date().toLocaleTimeString();
    setDataFlow(prev => [
      { ...event, timestamp },
      ...prev.slice(0, 9) // Keep last 10 events
    ]);
  };

  // Simulate data flow logging
  useState(() => {
    if (!statsLoading && stats) {
      logDataFlow({
        type: 'stats-update',
        message: 'Equipment statistics updated',
        data: { available: stats.available, inUse: stats.inUse }
      });
    }
  }, [stats]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl mb-2">Real-Time System Preview</h1>
            <p className="text-blue-100">
              Live data updates with Firebase • No page refresh needed
            </p>
          </div>
        </div>
        
        {/* Live Connection Indicator */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg px-4 py-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm">
            Connected to Firebase • Real-time listeners active
          </span>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: System Architecture */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Data Flow
          </h2>
          
          <div className="space-y-3">
            {/* Flow Step 1 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                1
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">Firebase Firestore</div>
                <div className="text-xs text-gray-600">Data source</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="ml-4 border-l-2 border-dashed border-gray-300 h-6"></div>

            {/* Flow Step 2 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">
                2
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">onSnapshot Listeners</div>
                <div className="text-xs text-gray-600">Real-time subscriptions</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="ml-4 border-l-2 border-dashed border-gray-300 h-6"></div>

            {/* Flow Step 3 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                3
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">React Hooks</div>
                <div className="text-xs text-gray-600">State management</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="ml-4 border-l-2 border-dashed border-gray-300 h-6"></div>

            {/* Flow Step 4 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm">
                4
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">UI Components</div>
                <div className="text-xs text-gray-600">Auto-update display</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Active Listeners</div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600 animate-pulse" />
              <span className="text-sm text-gray-900">4 real-time subscriptions</span>
            </div>
          </div>
        </div>

        {/* Middle & Right: Live Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Live Equipment Statistics
            </h2>
            
            {statsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatBox
                  label="Total"
                  value={stats.total}
                  color="blue"
                  pulse
                />
                <StatBox
                  label="Available"
                  value={stats.available}
                  color="green"
                  pulse
                />
                <StatBox
                  label="In Use"
                  value={stats.inUse}
                  color="orange"
                  pulse
                />
                <StatBox
                  label="Maintenance"
                  value={stats.maintenance}
                  color="red"
                  pulse
                />
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>These numbers update automatically when data changes</span>
              </div>
            </div>
          </div>

          {/* Active Checkouts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl text-gray-900 mb-4">Active Checkouts</h2>
            <div className="text-3xl text-blue-600 mb-2">{activeCheckouts.length}</div>
            <div className="text-sm text-gray-600">Items currently in use</div>
            <div className="mt-3 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>

          {/* Chemicals Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl text-gray-900 mb-4">Recent Chemicals (Live)</h2>
            
            {chemLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {chemicals.slice(0, 5).map((chem, index) => (
                  <div
                    key={chem.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{
                      animation: `fadeIn 0.5s ease-in ${index * 0.1}s`
                    }}
                  >
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{chem.chemicalName}</div>
                      <div className="text-xs text-gray-600">{chem.chemicalCode}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {chem.quantity} {chem.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lowStockChemicals.length > 0 && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-orange-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lowStockChemicals.length} chemicals below minimum stock</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Event Log */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl text-gray-900 mb-4">Real-Time Event Log</h2>
        
        {dataFlow.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Waiting for data updates...
          </div>
        ) : (
          <div className="space-y-2">
            {dataFlow.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                style={{
                  animation: `slideIn 0.3s ease-out`
                }}
              >
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{event.message}</span>
                    <span className="text-xs text-gray-500">{event.timestamp}</span>
                  </div>
                  {event.data && (
                    <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <h2 className="text-xl text-gray-900 mb-4">How Real-Time Updates Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-2">1. Database Change</h3>
            <p className="text-xs text-gray-600">
              When data changes in Firestore (add, update, delete), Firebase sends a notification to all connected clients.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-2">2. Listener Triggered</h3>
            <p className="text-xs text-gray-600">
              The `onSnapshot` listener receives the update and passes new data to React hooks.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-2">3. State Updated</h3>
            <p className="text-xs text-gray-600">
              React hooks update component state automatically with the new data.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-2">4. UI Re-renders</h3>
            <p className="text-xs text-gray-600">
              Components re-render with updated data. User sees changes instantly without refresh.
            </p>
          </div>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h2 className="text-xl text-gray-900 mb-3">🧪 Test Real-Time Updates</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>To see real-time updates in action:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Open this page in two browser windows side-by-side</li>
            <li>In one window, add or update equipment/chemicals</li>
            <li>Watch the other window update automatically!</li>
            <li>No refresh needed - updates happen instantly</li>
          </ol>
          <p className="mt-4 text-blue-700">
            💡 This is the power of Firebase real-time database with React hooks!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

// Stat Box Component
function StatBox({ label, value, color, pulse }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4 text-white ${pulse ? 'animate-pulse' : ''}`}>
      <div className="text-2xl sm:text-3xl mb-1">{value}</div>
      <div className="text-xs sm:text-sm opacity-90">{label}</div>
    </div>
  );
}
