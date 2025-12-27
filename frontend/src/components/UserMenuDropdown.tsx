import { LogOut, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';

export default function UserMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';
  const userEmail = user?.email || 'user@example.com';
  const userName = user?.user_metadata?.full_name || userEmail.split('@')[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setIsOpen(false);
    await signOut();
    navigate('/');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:bg-white hover:bg-opacity-10 px-3 py-1.5 rounded transition"
      >
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-semibold text-sm">
          {userInitials}
        </div>
        <span className="text-sm hidden sm:block">{userName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-odoo-primary text-white flex items-center justify-center font-semibold text-lg">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-600 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <User size={18} className="text-gray-400" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Settings size={18} className="text-gray-400" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-1">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? Any unsaved changes will be lost."
        confirmText="Logout"
        cancelText="Cancel"
        variant="warning"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
