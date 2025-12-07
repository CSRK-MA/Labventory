// src/components/firebase/ViewData.jsx
// Component for viewing/reading equipment data from Firestore

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebase';
import { Package, Trash2, RefreshCw, Search, Filter } from 'lucide-react';

export function ViewData() {
  // State management
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data from Firestore
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError('');

      // Create query with ordering
      const q = query(
        collection(db, COLLECTIONS.EQUIPMENT),
        orderBy('createdAt', 'desc')
      );

      // Get documents
      const querySnapshot = await getDocs(q);
      
      // Map documents to array
      const equipmentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date for display
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      setEquipment(equipmentData);
      console.log('Fetched equipment:', equipmentData.length, 'items');

    } catch (err) {
      console.error('Error fetching equipment: ', err);
      setError('Failed to load equipment: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchEquipment();
  };

  // Handle delete
  const handleDelete = async (id, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, COLLECTIONS.EQUIPMENT, id));
      setEquipment(equipment.filter(item => item.id !== id));
      alert('✅ Equipment deleted successfully!');
    } catch (err) {
      console.error('Error deleting equipment: ', err);
      alert('❌ Error: Failed to delete equipment. Please try again.');
    }
  };

  // Filter and search logic
  const filteredEquipment = equipment.filter(item => {
    // Filter by status
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    
    // Search by name, code, brand, or model
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === '' || 
      item.itemName?.toLowerCase().includes(searchLower) ||
      item.itemCode?.toLowerCase().includes(searchLower) ||
      item.brand?.toLowerCase().includes(searchLower) ||
      item.model?.toLowerCase().includes(searchLower);

    return statusMatch && searchMatch;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      'available': 'bg-green-100 text-green-800 border-green-200',
      'in-use': 'bg-blue-100 text-blue-800 border-blue-200',
      'maintenance': 'bg-orange-100 text-orange-800 border-orange-200',
      'retired': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get condition badge color
  const getConditionColor = (condition) => {
    const colors = {
      'excellent': 'bg-green-100 text-green-700',
      'good': 'bg-blue-100 text-blue-700',
      'fair': 'bg-yellow-100 text-yellow-700',
      'poor': 'bg-orange-100 text-orange-700',
      'damaged': 'bg-red-100 text-red-700'
    };
    return colors[condition] || 'bg-gray-100 text-gray-700';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading equipment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
                Equipment Inventory
              </h2>
              <p className="text-gray-600">
                Total: {filteredEquipment.length} item{filteredEquipment.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, code, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="in-use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm sm:text-base">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {filteredEquipment.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">No equipment found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first equipment item'}
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        {filteredEquipment.length > 0 && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Item</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Code</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Brand/Model</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Condition</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Price</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-gray-900">{item.itemName}</div>
                        <div className="text-xs text-gray-500">{item.serialNumber || 'No S/N'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {item.itemCode}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{item.brand || '-'}</div>
                        <div className="text-xs text-gray-500">{item.model || '-'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{item.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{item.location || '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">
                        ${item.purchasePrice?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id, item.itemName)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card View */}
        {filteredEquipment.length > 0 && (
          <div className="lg:hidden space-y-4">
            {filteredEquipment.map((item) => (
              <div 
                key={item.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg text-gray-900 mb-1 truncate">
                      {item.itemName}
                    </h3>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.itemCode}
                    </code>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id, item.itemName)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95 ml-2 flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Brand</div>
                    <div className="text-sm text-gray-900">{item.brand || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Model</div>
                    <div className="text-sm text-gray-900">{item.model || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Location</div>
                    <div className="text-sm text-gray-900">{item.location || '-'}</div>
                  </div>
                </div>

                {/* Status and Condition */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-900">
                    ${item.purchasePrice?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredEquipment.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl text-green-600">
                  {equipment.filter(i => i.status === 'available').length}
                </div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-blue-600">
                  {equipment.filter(i => i.status === 'in-use').length}
                </div>
                <div className="text-xs text-gray-600">In Use</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-orange-600">
                  {equipment.filter(i => i.status === 'maintenance').length}
                </div>
                <div className="text-xs text-gray-600">Maintenance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-purple-600">
                  ${equipment.reduce((sum, item) => sum + (item.purchasePrice || 0), 0).toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
