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
      color: 'bg-green-500' 
    },
    { 
      label: 'New Requests', 
      value: stats.newRequests, 
      icon: Clock, 
      color: 'bg-yellow-500' 
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your maintenance operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding={false} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Requests</h2>
          <div className="space-y-3">
            {requests.slice(0, 5).map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{request.subject}</p>
                  <p className="text-sm text-gray-600">{request.equipmentName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.stage === 'new' ? 'bg-blue-100 text-blue-800' :
                  request.stage === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  request.stage === 'repaired' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.stage}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Equipment by Category */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Equipment by Category</h2>
          <div className="space-y-3">
            {Object.entries(
              equipment.reduce((acc, eq) => {
                acc[eq.category] = (acc[eq.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-odoo-primary rounded-full"
                      style={{ width: `${(count / equipment.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
