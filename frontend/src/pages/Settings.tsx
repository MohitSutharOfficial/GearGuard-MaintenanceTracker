import { Bell, Globe, Lock, Palette, Shield, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-odoo-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={24} className="text-odoo-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive email updates about maintenance requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-odoo-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="secondary" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={24} className="text-odoo-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get push notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-odoo-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Due Alerts</p>
                  <p className="text-sm text-gray-600">Notify when equipment requires maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-odoo-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette size={24} className="text-odoo-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Use the appearance icon in the top navigation bar to customize theme and layout
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Available Options:</strong> Light Mode, Dark Mode, Odoo Mode, System Preference
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Layout:</strong> Top Navigation or Sidebar Navigation
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} className="text-odoo-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
            </div>
            
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Lock size={18} className="mr-2" />
                Change Password
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Globe size={18} className="mr-2" />
                Privacy Policy
              </Button>
              <Button variant="danger" className="w-full justify-start">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary">
            Cancel
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
