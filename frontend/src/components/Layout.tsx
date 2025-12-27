import {
    BarChart3,
    Calendar,
    ClipboardList,
    LayoutDashboard,
    PackageSearch,
    Users,
    Wrench
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppearanceDropdown from './AppearanceDropdown';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [layoutStyle, setLayoutStyle] = useState<'top' | 'sidebar'>(() => {
    return (localStorage.getItem('layoutStyle') as 'top' | 'sidebar') || 'top';
  });

  useEffect(() => {
    const handleLayoutChange = () => {
      const newLayout = (localStorage.getItem('layoutStyle') as 'top' | 'sidebar') || 'top';
      setLayoutStyle(newLayout);
    };

    window.addEventListener('layoutChange', handleLayoutChange);
    return () => window.removeEventListener('layoutChange', handleLayoutChange);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/kanban', icon: Wrench, label: 'Kanban Board' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/equipment', icon: PackageSearch, label: 'Equipment' },
    { path: '/requests', icon: ClipboardList, label: 'Requests' },
    { path: '/teams', icon: Users, label: 'Teams' },
    { path: '/reports', icon: BarChart3, label: 'Reports' }
  ];

  return (
    <div className="min-h-screen bg-odoo-light flex flex-col">
      {/* Fixed Top Header - Always visible */}
      <header className="bg-[#714B67] text-white shadow-odoo-md sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <Wrench size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-tight">GearGuard</h1>
                <p className="text-xs text-white text-opacity-80 leading-none">Maintenance Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AppearanceDropdown />
              <NotificationDropdown />
              <UserMenuDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Layout Container - Changes based on orientation */}
      {layoutStyle === 'sidebar' ? (
        <div className="flex flex-1">
          {/* Sidebar Navigation - Fixed */}
          <aside className="w-64 bg-white border-r border-odoo-border flex-shrink-0 overflow-y-auto fixed left-0 top-14 bottom-0 z-30">
            <nav className="p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded mb-1 transition-colors ${
                      isActive
                        ? 'bg-[#714B67] bg-opacity-10 text-[#714B67] font-medium'
                        : 'text-odoo-gray-600 hover:bg-odoo-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area - With left margin to account for fixed sidebar */}
          <div className="flex-1 flex flex-col ml-64">
            {/* Breadcrumb Bar - Sticky */}
            <div className="bg-white border-b border-odoo-border px-3 py-2 sticky top-14 z-40 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-odoo-gray-400">GearGuard</span>
                <span className="text-odoo-gray-300">/</span>
                <span className="text-odoo-gray-800 font-medium">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Page Content */}
            <main className="flex-1 px-3 py-3 overflow-auto">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-odoo-border mt-auto">
              <div className="px-3 py-2">
                <p className="text-xs text-odoo-gray-500 text-center">
                  Maintenance Management System v1.0 © {new Date().getFullYear()}
                </p>
              </div>
            </footer>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {/* Top Navigation - Sticky */}
          <nav className="bg-white border-b border-odoo-border shadow-sm sticky top-14 z-40">
            <div className="px-2">
              <div className="flex overflow-x-auto hide-scrollbar">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap text-sm ${
                        isActive
                          ? 'border-[#714B67] text-[#714B67] font-medium bg-[#714B67] bg-opacity-5'
                          : 'border-transparent text-odoo-gray-600 hover:text-[#714B67] hover:bg-odoo-gray-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 w-full px-3 py-3">
            {children}
          </main>

          {/* Footer - Sticky at bottom */}
          <footer className="bg-white border-t border-odoo-border mt-auto sticky bottom-0 z-30">
            <div className="px-3 py-3">
              <div className="flex items-center justify-between text-xs text-odoo-gray-500">
                <p>© {new Date().getFullYear()} GearGuard. All rights reserved.</p>
                <p>Maintenance Management System v1.0</p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
