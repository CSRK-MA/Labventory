import { useState } from "react";
import { User, Bell, Shield } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function Settings() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@institution.edu",
    role: "Admin",
    department: "Chemistry"
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiry: true,
    maintenance: true,
    checkout: true
  });

  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully!");
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification preferences updated!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl text-gray-900">Profile Settings</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Role</label>
              <select 
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Admin</option>
                <option>Teacher</option>
                <option>Lab Assistant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveProfile}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl text-gray-900">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "lowStock" as const, label: "Low stock alerts", desc: "Get notified when items are running low" },
              { key: "expiry" as const, label: "Expiry warnings", desc: "Alerts for chemicals nearing expiration" },
              { key: "maintenance" as const, label: "Maintenance reminders", desc: "Scheduled maintenance notifications" },
              { key: "checkout" as const, label: "Checkout notifications", desc: "When equipment is checked out/in" }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifications[item.key]}
                    onChange={() => toggleNotification(item.key)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-xl text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => toast.info("Password change feature coming soon")}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <div className="text-gray-900 mb-1">Change Password</div>
              <div className="text-sm text-gray-600">Update your password regularly for security</div>
            </button>
            <button 
              onClick={() => toast.info("Two-factor authentication setup coming soon")}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <div className="text-gray-900 mb-1">Two-Factor Authentication</div>
              <div className="text-sm text-gray-600">Add an extra layer of security</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
