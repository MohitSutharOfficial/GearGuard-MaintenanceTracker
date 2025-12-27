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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-odoo-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-odoo-secondary rounded-full flex items-center justify-center">
                <Wrench size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">GearGuard</h1>
                <p className="text-sm text-gray-200">Maintenance Tracker</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-odoo-primary text-odoo-primary font-medium'
                      : 'border-transparent text-gray-600 hover:text-odoo-primary'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>© 2024 GearGuard - Ultimate Maintenance Tracker</p>
        </div>
      </footer>
    </div>
  );
}
