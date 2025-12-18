import { useState, useEffect } from "react";
import { Search, Plus, QrCode, Edit, Trash2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { useUser } from "../../contexts/UserContext";
import { PermissionGuard } from "../PermissionGuard";
import { hasPermission } from "../../services/userService";
import { 
  subscribeToEquipment, 
  addEquipment as addEquipmentToDb,
  updateEquipment as updateEquipmentInDb,
  deleteEquipment as deleteEquipmentFromDb,
  Equipment 
} from "../../services/firebaseService";
import { 
  checkEquipmentDuplicate, 
  updateExistingEquipment 
} from "../../services/duplicateDetection";

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [duplicateError, setDuplicateError] = useState<any>(null);
  const [showUpdateOption, setShowUpdateOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: "",
    category: "",
    status: "Available",
    condition: "Good",
    location: "",
    quantity: 1
  });
  const { userProfile } = useUser();
  const itemsPerPage = 5;

  // Subscribe to real-time equipment updates
  useEffect(() => {
    const unsubscribe = subscribeToEquipment((equipmentData) => {
      setEquipment(equipmentData);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "In Use":
        return "bg-blue-100 text-blue-700";
      case "Maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddEquipment = async () => {
    if (!formData.name || !formData.category || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    setDuplicateError(null);
    setShowUpdateOption(false);

    try {
      // Check for duplicates
      const duplicateCheck = await checkEquipmentDuplicate(formData.name || "");
      
      if (duplicateCheck.isDuplicate) {
        // Show duplicate error with update option
        setDuplicateError(duplicateCheck);
        setShowUpdateOption(true);
        setIsLoading(false);
        return;
      }

      // No duplicate - proceed with adding
      const result = await addEquipmentToDb(formData as Equipment);
      if (result.success) {
        toast.success("Equipment added successfully!");
        setShowAddModal(false);
        resetForm();
      } else {
        toast.error("Failed to add equipment");
      }
    } catch (error) {
      toast.error("Error checking for duplicate equipment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExistingEquipment = async () => {
    if (!duplicateError?.existingId) {
      toast.error("Unable to update: Could not identify existing record");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateExistingEquipment(duplicateError.existingId, formData);
      if (result.success) {
        toast.success(result.message);
        setShowAddModal(false);
        setDuplicateError(null);
        setShowUpdateOption(false);
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error updating equipment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEquipment = async () => {
    if (selectedEquipment && selectedEquipment.id) {
      const result = await updateEquipmentInDb(selectedEquipment.id, formData);
      if (result.success) {
        toast.success("Equipment updated successfully!");
        setShowEditModal(false);
        resetForm();
      } else {
        toast.error("Failed to update equipment");
      }
    }
  };

  const handleDeleteEquipment = async () => {
    if (selectedEquipment && selectedEquipment.id) {
      const result = await deleteEquipmentFromDb(selectedEquipment.id);
      if (result.success) {
        toast.success("Equipment deleted successfully!");
        setShowDeleteModal(false);
        setSelectedEquipment(null);
      } else {
        toast.error("Failed to delete equipment");
      }
    }
  };

  const openEditModal = (item: Equipment) => {
    setSelectedEquipment(item);
    setFormData(item);
    setShowEditModal(true);
  };

  const openViewModal = (item: Equipment) => {
    setSelectedEquipment(item);
    setShowViewModal(true);
  };

  const handleToggleHideFromReports = async () => {
    if (selectedEquipment && selectedEquipment.id) {
      const newValue = !selectedEquipment.hideFromReports;
      const result = await updateEquipmentInDb(selectedEquipment.id, {
        hideFromReports: newValue
      });
      if (result.success) {
        toast.success(newValue ? "Equipment hidden from reports" : "Equipment visible in reports");
        setSelectedEquipment({ ...selectedEquipment, hideFromReports: newValue });
      } else {
        toast.error("Failed to update equipment visibility");
      }
    }
  };

  const openQRModal = (item: Equipment) => {
    setSelectedEquipment(item);
    setShowQRModal(true);
  };

  const openDeleteModal = (item: Equipment) => {
    setSelectedEquipment(item);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      status: "Available",
      condition: "Good",
      location: "",
      quantity: 1
    });
    setSelectedEquipment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl text-gray-900">Equipment Manager</h1>
          <p className="text-gray-600 mt-1">Manage and track all laboratory equipment</p>
        </div>
        <PermissionGuard userProfile={userProfile} permission="equipment:create">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </PermissionGuard>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("Available")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === "Available" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilterStatus("In Use")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === "In Use" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              In Use
            </button>
            <button
              onClick={() => setFilterStatus("Maintenance")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === "Maintenance" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Equipment Name</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Quantity</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Location</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEquipment.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No equipment found. Click "Add Equipment" to get started!
                  </td>
                </tr>
              ) : (
                paginatedEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* View - Everyone can view */}
                        <button
                          onClick={() => openViewModal(item)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        {/* QR Code - Everyone can generate */}
                        <button
                          onClick={() => openQRModal(item)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Generate QR"
                        >
                          <QrCode className="w-4 h-4 text-blue-600" />
                        </button>
                        
                        {/* Edit - Only if has permission */}
                        {hasPermission(userProfile, "equipment:update") && (
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        
                        {/* Delete - Only if has permission */}
                        {hasPermission(userProfile, "equipment:delete") && (
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredEquipment.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {paginatedEquipment.length} of {filteredEquipment.length} items
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page ? "bg-blue-600 text-white" : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">{showAddModal ? "Add New Equipment" : "Edit Equipment"}</h3>
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
                <label className="block text-sm text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Category</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
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
                <label className="block text-sm text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Condition</label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Good, Excellent, Fair, etc."
                />
              </div>
            </div>

            {/* Duplicate Error Alert */}
            {duplicateError && showUpdateOption && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-red-800 font-semibold">⚠️ Duplicate Equipment Found</p>
                    <p className="text-red-700 text-sm mt-1">{duplicateError.message}</p>
                    {duplicateError.existingData && (
                      <div className="mt-3 text-sm text-red-600 bg-red-100 p-3 rounded">
                        <p><strong>Existing Equipment:</strong></p>
                        <p>Location: {duplicateError.existingData.location}</p>
                        <p>Quantity: {duplicateError.existingData.quantity}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { 
                  setShowAddModal(false); 
                  setShowEditModal(false); 
                  setDuplicateError(null);
                  setShowUpdateOption(false);
                  resetForm(); 
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              {showUpdateOption && duplicateError ? (
                <>
                  <button
                    onClick={() => {
                      setDuplicateError(null);
                      setShowUpdateOption(false);
                    }}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Create Anyway
                  </button>
                  <button
                    onClick={handleUpdateExistingEquipment}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update Existing"}
                  </button>
                </>
              ) : (
                <button
                  onClick={showAddModal ? handleAddEquipment : handleEditEquipment}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Checking..." : (showAddModal ? "Add Equipment" : "Save Changes")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">Equipment Details</h3>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-gray-900">{selectedEquipment.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-gray-900">{selectedEquipment.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-gray-900">{selectedEquipment.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs ${getStatusColor(selectedEquipment.status)}`}>
                    {selectedEquipment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-gray-900">{selectedEquipment.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <p className="text-gray-900">{selectedEquipment.condition || "N/A"}</p>
                </div>
              </div>

              {/* Hide from Reports Toggle */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedEquipment.hideFromReports ? (
                      <EyeOff className="w-5 h-5 text-red-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">Report Visibility</p>
                      <p className="text-sm text-gray-600">
                        {selectedEquipment.hideFromReports 
                          ? "Hidden from reports (but can still update quantity)" 
                          : "Visible in reports"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleHideFromReports}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedEquipment.hideFromReports
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {selectedEquipment.hideFromReports ? "Show in Reports" : "Hide from Reports"}
                  </button>
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

      {/* QR Code Modal */}
      {showQRModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">QR Code</h3>
              <button onClick={() => setShowQRModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-4">
                <QRCode value={JSON.stringify({ id: selectedEquipment.id, name: selectedEquipment.name })} size={200} />
              </div>
              <p className="text-center text-gray-900 mb-1">{selectedEquipment.name}</p>
              <p className="text-center text-sm text-gray-600 mb-4">ID: {selectedEquipment.id}</p>
              <button
                onClick={() => toast.success("QR Code downloaded!")}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedEquipment.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEquipment}
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