import { Calendar, Mail, Shield, User as UserIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const userInfo = {
    email: user?.email || 'user@example.com',
    name: user?.user_metadata?.full_name || 'User',
    role: user?.user_metadata?.role || 'Maintenance Technician',
    joinedDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-odoo-gray-900 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center p-6">
              <div className="w-24 h-24 rounded-full bg-odoo-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {userInfo.name.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{userInfo.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{userInfo.role}</p>
              <Button variant="secondary" className="w-full">
                Change Avatar
              </Button>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{userInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-900">{userInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium text-gray-900">{userInfo.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">{userInfo.joinedDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button variant="primary">
                  Edit Profile
                </Button>
                <Button variant="secondary" className="ml-3">
                  Change Password
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-odoo-primary">24</p>
                  <p className="text-sm text-gray-600">Requests Handled</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">4</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">2</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
