import { useState, useEffect } from "react";
import { FlaskConical, AlertTriangle, Plus, Calendar, X, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  subscribeToChemicals,
  addChemical as addChemicalToDb,
  updateChemical as updateChemicalInDb,
  deleteChemical as deleteChemicalFromDb,
  Chemical
} from "../../services/firebaseService";
import { useUser } from "../../contexts/UserContext";
import { PermissionGuard } from "../PermissionGuard";
import { hasPermission } from "../../services/userService";

export function ChemicalTracker() {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [formData, setFormData] = useState<Partial<Chemical>>({
    name: "",
    formula: "",
    quantity: 0,
    unit: "Liters",
    hazardLevel: "Low",
    expiryDate: undefined,
    location: "",
    supplier: "",
  });
  
  const { userProfile } = useUser();

  // Subscribe to real-time chemical updates
  useEffect(() => {
    const unsubscribe = subscribeToChemicals((chemicalData) => {
      setChemicals(chemicalData);
    });

    return () => unsubscribe();
  }, []);

  const getHazardColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const isExpiringSoon = (expiryDate?: Date | any) => {
    if (!expiryDate) return false;
    const today = new Date();
    let expiry: Date;
    
    // Handle Firestore Timestamp
    if (typeof expiryDate === 'object' && 'toDate' in expiryDate) {
      expiry = expiryDate.toDate();
    } 
    // Handle Date object
    else if (expiryDate instanceof Date) {
      expiry = expiryDate;
    }
    // Handle string
    else {
      expiry = new Date(expiryDate);
    }
    
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && diffDays > 0;
  };

  const isExpired = (expiryDate?: Date | any) => {
    if (!expiryDate) return false;
    const today = new Date();
    let expiry: Date;
    
    // Handle Firestore Timestamp
    if (typeof expiryDate === 'object' && 'toDate' in expiryDate) {
      expiry = expiryDate.toDate();
    } 
    // Handle Date object
    else if (expiryDate instanceof Date) {
      expiry = expiryDate;
    }
    // Handle string
    else {
      expiry = new Date(expiryDate);
    }
    
    return expiry < today;
  };

  const formatDate = (date?: Date | any) => {
    if (!date) return "N/A";
    
    try {
      let d: Date;
      // Handle Firestore Timestamp
      if (typeof date === 'object' && 'toDate' in date) {
        d = date.toDate();
      } 
      // Handle Date object
      else if (date instanceof Date) {
        d = date;
      }
      // Handle string
      else {
        d = new Date(date);
      }
      return d.toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  const expiringSoonCount = chemicals.filter(c => isExpiringSoon(c.expiryDate) && !isExpired(c.expiryDate)).length;
  const highHazardCount = chemicals.filter(c => c.hazardLevel === "High").length;
  const lowStockCount = chemicals.filter(c => c.quantity < 1).length;

  const handleAddChemical = async () => {
    if (!formData.name || !formData.formula || !formData.quantity || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const result = await addChemicalToDb({
      ...formData,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
    } as Chemical);

    if (result.success) {
      toast.success("Chemical added successfully!");
      setShowAddModal(false);
      resetForm();
    } else {
      toast.error("Failed to add chemical");
    }
  };

  const handleEditChemical = async () => {
    if (selectedChemical && selectedChemical.id) {
      const result = await updateChemicalInDb(selectedChemical.id, {
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
      });

      if (result.success) {
        toast.success("Chemical updated successfully!");
        setShowEditModal(false);
        resetForm();
      } else {
        toast.error("Failed to update chemical");
      }
    }
  };

  const handleDeleteChemical = async () => {
    if (selectedChemical && selectedChemical.id) {
      const result = await deleteChemicalFromDb(selectedChemical.id);
      if (result.success) {
        toast.success("Chemical deleted successfully!");
        setShowDeleteModal(false);
        setSelectedChemical(null);
      } else {
        toast.error("Failed to delete chemical");
      }
    }
  };

  const openEditModal = (chemical: Chemical) => {
    setSelectedChemical(chemical);
    
    // Convert Firestore Timestamp to date string
    let expiryDateStr = "";
    if (chemical.expiryDate) {
      try {
        // Handle Firestore Timestamp
        if (typeof chemical.expiryDate === 'object' && 'toDate' in chemical.expiryDate) {
          expiryDateStr = (chemical.expiryDate as any).toDate().toISOString().split('T')[0];
        } 
        // Handle Date object
        else if (chemical.expiryDate instanceof Date) {
          expiryDateStr = chemical.expiryDate.toISOString().split('T')[0];
        }
        // Handle string
        else if (typeof chemical.expiryDate === 'string') {
          expiryDateStr = new Date(chemical.expiryDate).toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error parsing expiry date:', error);
      }
    }
    
    setFormData({
      ...chemical,
      expiryDate: expiryDateStr as any
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (chemical: Chemical) => {
    setSelectedChemical(chemical);
    setShowDeleteModal(true);
  };

  const openViewModal = (chemical: Chemical) => {
    setSelectedChemical(chemical);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      formula: "",
      quantity: 0,
      unit: "Liters",
      hazardLevel: "Low",
      expiryDate: undefined,
      location: "",
      supplier: "",
    });
    setSelectedChemical(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl text-gray-900">Chemical Inventory</h1>
          <p className="text-gray-600 mt-1">Track chemicals, quantities, and safety information</p>
        </div>
        <PermissionGuard userProfile={userProfile} permission="chemical:create">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Chemical
          </button>
        </PermissionGuard>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Chemicals</span>
          </div>
          <div className="text-3xl text-gray-900">{chemicals.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">High Hazard</span>
          </div>
          <div className="text-3xl text-gray-900">{highHazardCount}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Expiring Soon</span>
          </div>
          <div className="text-3xl text-gray-900">{expiringSoonCount}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Low Stock</span>
          </div>
          <div className="text-3xl text-gray-900">{lowStockCount}</div>
        </div>
      </div>

      {/* Expiry Alerts */}
      {expiringSoonCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="text-orange-900 mb-1">Expiry Alerts</h3>
              <p className="text-sm text-orange-700">
                You have {expiringSoonCount} chemicals expiring within the next 60 days. Please review and take necessary action.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chemical List */}
      <div className="grid gap-4">
        {chemicals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">No Chemicals Yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first chemical to the inventory</p>
            <PermissionGuard userProfile={userProfile} permission="chemical:create">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Chemical
              </button>
            </PermissionGuard>
          </div>
        ) : (
          chemicals.map((chemical) => (
            <div
              key={chemical.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg text-gray-900">{chemical.name}</h3>
                      <span className="text-sm text-gray-500">({chemical.formula})</span>
                      {isExpiringSoon(chemical.expiryDate) && !isExpired(chemical.expiryDate) && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                          Expiring Soon
                        </span>
                      )}
                      {isExpired(chemical.expiryDate) && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          Expired
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                      <span>Quantity: {chemical.quantity} {chemical.unit}</span>
                      <span>Location: {chemical.location}</span>
                      <span>Expiry: {formatDate(chemical.expiryDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-lg border ${getHazardColor(chemical.hazardLevel)}`}>
                    <div className="text-xs">Hazard Level</div>
                    <div className="text-sm">{chemical.hazardLevel}</div>
                  </div>
                  <div className="flex gap-2">
                    {/* View - Everyone can view */}
                    <button
                      onClick={() => openViewModal(chemical)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                    >
                      View
                    </button>
                    
                    {/* Edit - Only with permission */}
                    {hasPermission(userProfile, "chemical:update") && (
                      <button
                        onClick={() => openEditModal(chemical)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    
                    {/* Delete - Only with permission */}
                    {hasPermission(userProfile, "chemical:delete") && (
                      <button
                        onClick={() => openDeleteModal(chemical)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">{showAddModal ? "Add New Chemical" : "Edit Chemical"}</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Chemical Formula *</label>
                <input
                  type="text"
                  value={formData.formula}
                  onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Liters">Liters</option>
                  <option value="Milliliters">Milliliters</option>
                  <option value="Kilograms">Kilograms</option>
                  <option value="Grams">Grams</option>
                  <option value="Pounds">Pounds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Hazard Level</label>
                <select
                  value={formData.hazardLevel}
                  onChange={(e) => setFormData({ ...formData, hazardLevel: e.target.value as Chemical['hazardLevel'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate as any || ""}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showAddModal ? handleAddChemical : handleEditChemical}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {showAddModal ? "Add Chemical" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedChemical && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">Chemical Details</h3>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-gray-900">{selectedChemical.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Formula</p>
                  <p className="text-gray-900">{selectedChemical.formula}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-gray-900">{selectedChemical.quantity} {selectedChemical.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hazard Level</p>
                  <span className={`inline-flex px-3 py-1 rounded-lg border text-sm ${getHazardColor(selectedChemical.hazardLevel)}`}>
                    {selectedChemical.hazardLevel}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="text-gray-900">{formatDate(selectedChemical.expiryDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-gray-900">{selectedChemical.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Supplier</p>
                  <p className="text-gray-900">{selectedChemical.supplier || "N/A"}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="w-full mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedChemical && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedChemical.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChemical}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}