import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password change if any password field is filled
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword) {
        toast.error('Please enter your current password');
        return;
      }
      if (!newPassword) {
        toast.error('Please enter a new password');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
    }
    
    setLoading(true);
    try {
      const data = { name };
      
      // Only include password fields if user wants to change password
      if (oldPassword && newPassword) {
        data.oldPassword = oldPassword;
        data.newPassword = newPassword;
      }
      
      await updateProfile(data);
      toast.success('Profile updated successfully');
      
      // Clear password fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mr-6 shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <Mail className="w-4 h-4 mr-1.5" />
                {user?.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <Shield className="w-4 h-4 mr-1.5" />
                Role: <span className="capitalize ml-1 font-medium">{user?.role}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" /> Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  value={user?.email}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="group relative">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                      Email cannot be changed for security reasons
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Email cannot be changed
              </p>
            </div>
            
            {/* Password Change Section */}
            <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Leave all password fields blank if you don't want to change your password.
              </p>
              
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                {/* New Password with strength meter */}
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  showStrengthMeter={true}
                  showRequirements={true}
                  label="New Password"
                  name="newPassword"
                />

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Passwords do not match
                    </p>
                  )}
                  {newPassword && confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                      ✓ Passwords match
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
