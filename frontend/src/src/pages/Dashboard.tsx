import { CheckCircle, Clock, Package, Wrench } from 'lucide-react';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { equipment, requests } = useApp();

  const stats = {
    totalEquipment: equipment.length,
    activeEquipment: equipment.filter(e => e.status === 'active').length,
    totalRequests: requests.length,
    newRequests: requests.filter(r => r.stage === 'new').length,
    inProgressRequests: requests.filter(r => r.stage === 'in-progress').length,
    completedRequests: requests.filter(r => r.stage === 'repaired').length,
    overdueRequests: requests.filter(r => r.isOverdue).length
  };

  const statCards = [
    { 
      label: 'Total Equipment', 
      value: stats.totalEquipment, 
      icon: Package, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Active Equipment', 
      value: stats.activeEquipment, 
      icon: CheckCircle, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'New Requests', 
      value: stats.newRequests, 
      icon: Clock, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'In Progress', 
      value: stats.inProgressRequests, 
      icon: Wrench, 
      color: 'bg-orange-500' 
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-odoo-gray-900">Dashboard</h1>
        <p className="text-sm text-odoo-gray-600 mt-1">Overview of your maintenance operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="odoo-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-odoo-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-odoo-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Requests */}
        <div className="odoo-card p-4">
          <h2 className="text-base font-semibold mb-3 text-odoo-gray-900">Recent Requests</h2>
          <div className="space-y-2">
            {requests.slice(0, 5).map(request => (
              <div key={request.id} className="flex items-center justify-between p-2.5 bg-odoo-gray-50 rounded hover:bg-odoo-gray-100 transition">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-odoo-gray-900 truncate">{request.subject}</p>
                  <p className="text-xs text-odoo-gray-600 truncate">{request.equipmentName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ml-2 ${
                  request.stage === 'new' ? 'bg-blue-100 text-blue-700' :
                  request.stage === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                  request.stage === 'repaired' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {request.stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment by Category */}
        <div className="odoo-card p-4">
          <h2 className="text-base font-semibold mb-3 text-odoo-gray-900">Equipment by Category</h2>
          <div className="space-y-2.5">
            {Object.entries(
              equipment.reduce((acc, eq) => {
                acc[eq.category] = (acc[eq.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-odoo-gray-700">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-odoo-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-odoo-primary rounded-full"
                      style={{ width: `${(count / equipment.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-sm text-odoo-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
