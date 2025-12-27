import {
    BarChart3,
    Calendar,
    ClipboardList,
    LayoutDashboard,
    PackageSearch,
    Users,
    Wrench
} from 'lucide-react';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/kanban', icon: Wrench, label: 'Kanban Board' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/equipment', icon: PackageSearch, label: 'Equipment' },
    { path: '/requests', icon: ClipboardList, label: 'Requests' },
    { path: '/teams', icon: Users, label: 'Teams' },
    { path: '/reports', icon: BarChart3, label: 'Reports' }
  ];

  return (
    <div className="min-h-screen bg-odoo-light flex flex-col">
      {/* Header */}
      <header className="bg-odoo-primary text-white shadow-odoo-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center gap-3">
              <button className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9\" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-odoo-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar\">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap text-sm ${
                    isActive
                      ? 'border-odoo-primary text-odoo-primary font-medium bg-odoo-primary bg-opacity-5'
                      : 'border-transparent text-odoo-gray-600 hover:text-odoo-primary hover:bg-odoo-gray-50'
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-odoo-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-xs text-odoo-gray-500">
            <p>© {new Date().getFullYear()} GearGuard. All rights reserved.</p>
            <p>Maintenance Management System v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
