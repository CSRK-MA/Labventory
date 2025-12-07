import { useState, useEffect } from "react";
import { Users, Shield, Edit2, X, UserPlus, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../../contexts/UserContext";
import { PermissionGuard } from "../PermissionGuard";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import {
  getAllUsers,
  updateUserRole,
  createUserProfile,
  UserProfile,
  UserRole,
  ROLE_PERMISSIONS
} from "../../services/userService";

export function UserManagement() {
  const { userProfile } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("student");
  
  // Add user form
  const [addUserForm, setAddUserForm] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "student" as UserRole
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    setLoading(false);
  };

  const handleAddUser = async () => {
    if (!addUserForm.email || !addUserForm.password) {
      toast.error("Email and password are required");
      return;
    }

    if (addUserForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        addUserForm.email,
        addUserForm.password
      );

      // Create user profile in Firestore
      const result = await createUserProfile(
        userCredential.user.uid,
        addUserForm.email,
        addUserForm.role
      );

      if (result.success) {
        toast.success(`✅ User ${addUserForm.email} created successfully!`);
        setShowAddModal(false);
        resetAddForm();
        loadUsers();
      } else {
        toast.error("Failed to create user profile");
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email already in use");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email format");
      } else {
        toast.error("Failed to create user");
      }
    }
  };

  const resetAddForm = () => {
    setAddUserForm({
      email: "",
      password: "",
      displayName: "",
      role: "student"
    });
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    const result = await updateUserRole(selectedUser.uid, newRole);
    if (result.success) {
      toast.success(`✅ User role updated to ${newRole}`);
      setShowEditModal(false);
      loadUsers();
    } else {
      toast.error("Failed to update user role");
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "teacher":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "lab-assistant":
        return "bg-green-100 text-green-700 border-green-200";
      case "student":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "👑";
      case "teacher":
        return "👨‍🏫";
      case "lab-assistant":
        return "🔬";
      case "student":
        return "🎓";
      default:
        return "👤";
    }
  };

  return (
    <PermissionGuard userProfile={userProfile} permission="users:manage">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl text-gray-900">👥 User Management</h1>
            <p className="text-gray-600 mt-1">Manage users and their permissions</p>
          </div>
          {/* Add User Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Statistics - Real Counts */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Total Users</span>
            </div>
            <div className="text-3xl text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👑</span>
              <span className="text-sm text-gray-600">Admins</span>
            </div>
            <div className="text-3xl text-gray-900">
              {users.filter(u => u.role === "admin").length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <span className="text-sm text-gray-600">Teachers</span>
            </div>
            <div className="text-3xl text-gray-900">
              {users.filter(u => u.role === "teacher").length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔬</span>
              <span className="text-sm text-gray-600">Lab Assistants</span>
            </div>
            <div className="text-3xl text-gray-900">
              {users.filter(u => u.role === "lab-assistant").length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎓</span>
              <span className="text-sm text-gray-600">Students</span>
            </div>
            <div className="text-3xl text-gray-900">
              {users.filter(u => u.role === "student").length}
            </div>
          </div>
        </div>

        {/* Role Permissions Reference */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Permissions Overview
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">👑 Admin</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Full access to all features</li>
                <li>✅ User management</li>
                <li>✅ Settings configuration</li>
                <li>✅ Generate reports</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">👨‍🏫 Teacher</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ View/Edit equipment</li>
                <li>✅ View/Edit chemicals</li>
                <li>✅ Check-in/out items</li>
                <li>✅ View reports</li>
                <li>❌ No user management</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">🔬 Lab Assistant</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ View equipment</li>
                <li>✅ View chemicals</li>
                <li>✅ Check-in/out items</li>
                <li>✅ Create maintenance logs</li>
                <li>❌ No editing/deleting</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">🎓 Student</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ View equipment</li>
                <li>✅ View chemicals</li>
                <li>✅ View check-in/out logs</li>
                <li>✅ View reports</li>
                <li>❌ No editing</li>
                <li>❌ No check-in/out</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-900">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">User</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Role</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Permissions</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Created</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No users found. Click "Add User" to create one!</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.displayName?.[0] || user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || "No name"}
                            </div>
                            <div className="text-xs text-gray-500">ID: {user.uid.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                          <span>{getRoleIcon(user.role)}</span>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600">
                          {user.permissions.length} permissions
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {user.uid !== userProfile?.uid && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role);
                              setShowEditModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl text-gray-900">➕ Add New User</h3>
                <button onClick={() => { setShowAddModal(false); resetAddForm(); }}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={addUserForm.email}
                      onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={addUserForm.password}
                      onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={addUserForm.displayName}
                    onChange={(e) => setAddUserForm({ ...addUserForm, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={addUserForm.role}
                    onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value as UserRole })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="student">🎓 Student - View Only</option>
                    <option value="lab-assistant">🔬 Lab Assistant - View/Check-in</option>
                    <option value="teacher">👨‍🏫 Teacher - Edit Access</option>
                    <option value="admin">👑 Admin - Full Access</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900 font-medium mb-1">
                    This user will have {addUserForm.role} permissions
                  </p>
                  <p className="text-xs text-blue-700">
                    {ROLE_PERMISSIONS[addUserForm.role].length} permissions included
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowAddModal(false); resetAddForm(); }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl text-gray-900">Edit User Role</h3>
                <button onClick={() => setShowEditModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">User</p>
                  <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="student">🎓 Student - View Only</option>
                    <option value="lab-assistant">🔬 Lab Assistant - View/Check-in</option>
                    <option value="teacher">👨‍🏫 Teacher - Edit Access</option>
                    <option value="admin">👑 Admin - Full Access</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    Permissions for {newRole}:
                  </p>
                  <div className="space-y-1">
                    {ROLE_PERMISSIONS[newRole].slice(0, 5).map((perm) => (
                      <div key={perm} className="text-xs text-blue-700">
                        ✓ {perm.replace(":", " → ")}
                      </div>
                    ))}
                    {ROLE_PERMISSIONS[newRole].length > 5 && (
                      <div className="text-xs text-blue-600">
                        + {ROLE_PERMISSIONS[newRole].length - 5} more...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}