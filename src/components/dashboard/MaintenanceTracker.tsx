import { useState } from "react";
import { Wrench, Calendar, AlertCircle, CheckCircle, X, Edit } from "lucide-react";
import { useAppStore, MaintenanceTask } from "../../lib/store";
import { toast } from "sonner@2.0.3";

export function MaintenanceTracker() {
  const { maintenanceTasks, equipment, addMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [formData, setFormData] = useState<Partial<MaintenanceTask>>({
    equipmentId: "",
    equipment: "",
    type: "Scheduled Maintenance",
    scheduledDate: "",
    status: "Scheduled",
    priority: "Medium",
    assignedTo: "",
    notes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Scheduled":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const totalScheduled = maintenanceTasks.length;
  const pendingCount = maintenanceTasks.filter(t => t.status === "Pending").length;
  const completedCount = maintenanceTasks.filter(t => t.status === "Completed").length;
  
  const today = new Date();
  const thisWeekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thisWeekCount = maintenanceTasks.filter(t => {
    const schedDate = new Date(t.scheduledDate);
    return schedDate >= today && schedDate <= thisWeekEnd;
  }).length;

  const handleAddTask = () => {
    if (!formData.equipmentId || !formData.scheduledDate || !formData.assignedTo) {
      toast.error("Please fill in all required fields");
      return;
    }
    const selectedEquipment = equipment.find(e => e.id === formData.equipmentId);
    if (!selectedEquipment) {
      toast.error("Equipment not found");
      return;
    }
    addMaintenanceTask({
      ...formData,
      equipment: `${selectedEquipment.name} #${selectedEquipment.id}`
    } as Omit<MaintenanceTask, 'id'>);
    toast.success("Maintenance task scheduled successfully!");
    setShowAddModal(false);
    resetForm();
  };

  const handleEditTask = () => {
    if (selectedTask) {
      updateMaintenanceTask(selectedTask.id, formData);
      toast.success("Maintenance task updated successfully!");
      setShowEditModal(false);
      resetForm();
    }
  };

  const handleCompleteTask = (taskId: string) => {
    updateMaintenanceTask(taskId, { 
      status: "Completed",
      completedDate: new Date().toISOString().split('T')[0]
    });
    toast.success("Task marked as completed!");
  };

  const handleDeleteTask = (taskId: string) => {
    deleteMaintenanceTask(taskId);
    toast.success("Task deleted successfully!");
  };

  const openEditModal = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setFormData(task);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      equipmentId: "",
      equipment: "",
      type: "Scheduled Maintenance",
      scheduledDate: "",
      status: "Scheduled",
      priority: "Medium",
      assignedTo: "",
      notes: ""
    });
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-gray-900">Maintenance Tracker</h1>
          <p className="text-gray-600 mt-1">Schedule and monitor equipment maintenance</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Schedule Maintenance
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Wrench className="w-8 h-8 text-blue-600 mb-3" />
          <div className="text-3xl text-gray-900 mb-1">{totalScheduled}</div>
          <div className="text-sm text-gray-600">Total Scheduled</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <AlertCircle className="w-8 h-8 text-orange-600 mb-3" />
          <div className="text-3xl text-gray-900 mb-1">{pendingCount}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Calendar className="w-8 h-8 text-purple-600 mb-3" />
          <div className="text-3xl text-gray-900 mb-1">{thisWeekCount}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
          <div className="text-3xl text-gray-900 mb-1">{completedCount}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Equipment</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Type</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Scheduled Date</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Priority</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Assigned To</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {maintenanceTasks.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.equipment}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.scheduledDate}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.status !== "Completed" && (
                        <button
                          onClick={() => handleCompleteTask(item.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(item.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">{showAddModal ? "Schedule Maintenance" : "Edit Maintenance Task"}</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Equipment *</label>
                <select
                  value={formData.equipmentId}
                  onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={showEditModal}
                >
                  <option value="">Select Equipment</option>
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name} (#{eq.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Scheduled Maintenance">Scheduled Maintenance</option>
                  <option value="Repair">Repair</option>
                  <option value="Calibration">Calibration</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Scheduled Date *</label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as MaintenanceTask['priority'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as MaintenanceTask['status'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Assigned To *</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Technician name"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={3}
                  placeholder="Additional maintenance notes..."
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
                onClick={showAddModal ? handleAddTask : handleEditTask}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {showAddModal ? "Schedule Task" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
