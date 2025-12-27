import { AlertCircle, Clock, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { FilterState } from '../types';

export default function Dashboard() {
  const { equipment, requests, teams, loading, error } = useApp();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({});

  // Critical Equipment: scrapped status (health < 30%)
  const criticalEquipment = equipment.filter(e => e.status === 'scrapped');
  
  // Technician Load: Calculate based on active requests per team member
  const activeRequests = requests.filter(r => r.stage === 'in_progress' || r.stage === 'new');
  const totalTechnicians = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);
  const technicianUtilization = totalTechnicians > 0 ? Math.round((activeRequests.length / totalTechnicians) * 100) : 0;
  
  // Open Requests: new and overdue
  const openRequests = requests.filter(r => r.stage === 'new' || r.stage === 'in_progress');
  const overdueRequests = requests.filter(r => r.isOverdue);
  const pendingRequests = openRequests.filter(r => !r.isOverdue);

  // Apply filters to requests
  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    // Stage filter
    if (filters.stage) {
      filtered = filtered.filter(r => r.stage === filters.stage);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.subject.toLowerCase().includes(searchLower) ||
        r.equipmentName.toLowerCase().includes(searchLower) ||
        (r.assignedToName && r.assignedToName.toLowerCase().includes(searchLower))
      );
    }

    // Assigned only filter
    if (filters.assignedOnly) {
      filtered = filtered.filter(r => r.assignedToName);
    }

    // Overdue only filter
    if (filters.overdueOnly) {
      filtered = filtered.filter(r => r.isOverdue);
    }

    return filtered;
  }, [requests, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#714B67] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Alert Cards Grid - Matching Wireframe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Critical Equipment Card - Red */}
        <div 
          className="bg-red-50 border-2 border-red-200 rounded p-4 cursor-pointer hover:shadow-md transition"
          onClick={() => navigate('/equipment')}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-red-900">Critical Equipment</h3>
              <p className="text-xs text-red-700 mt-0.5">Health &lt; 30%</p>
            </div>
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-red-900">{criticalEquipment.length}</p>
            <p className="text-xs text-red-700 mt-0.5">Units need attention</p>
          </div>
        </div>

        {/* Technician Load Card - Blue */}
        <div 
          className="bg-blue-50 border-2 border-blue-200 rounded p-4 cursor-pointer hover:shadow-md transition"
          onClick={() => navigate('/teams')}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Technician Load</h3>
              <p className="text-xs text-blue-700 mt-0.5">{technicianUtilization >= 80 ? 'Assign Carefully!' : 'Optimal'}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-blue-900">{technicianUtilization}%</p>
            <p className="text-xs text-blue-700 mt-0.5">Utilized</p>
          </div>
        </div>

        {/* Open Requests Card - Green */}
        <div 
          className="bg-green-50 border-2 border-green-200 rounded p-4 cursor-pointer hover:shadow-md transition"
          onClick={() => navigate('/requests')}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-green-900">Open Requests</h3>
              <p className="text-xs text-green-700 mt-0.5">Active maintenance</p>
            </div>
            <Clock className="text-green-600" size={24} />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-green-900">{pendingRequests.length}</p>
              <span className="text-sm text-green-700">Pending</span>
            </div>
            {overdueRequests.length > 0 && (
              <p className="text-xs text-red-600 font-semibold mt-1">{overdueRequests.length} Overdue</p>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance Requests Table - Matching Wireframe */}
      <div className="bg-white border border-odoo-border rounded shadow-odoo">
        <div className="px-3 py-2 border-b border-odoo-border bg-odoo-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-odoo-gray-900">Maintenance Requests</h2>
            <Button size="sm" onClick={() => navigate('/requests')}>
              View All
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar onFilterChange={setFilters} activeFilters={filters} />
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-odoo-gray-50 border-b border-odoo-border">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-odoo-gray-700">Subject</th>
                <th className="px-3 py-2 text-left font-semibold text-odoo-gray-700">Assigned To</th>
                <th className="px-3 py-2 text-left font-semibold text-odoo-gray-700">Equipment</th>
                <th className="px-3 py-2 text-left font-semibold text-odoo-gray-700">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-odoo-border">
              {filteredRequests.slice(0, 10).map(request => (
                <tr 
                  key={request.id} 
                  className="hover:bg-odoo-gray-50 cursor-pointer transition"
                  onClick={() => navigate('/requests')}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-odoo-gray-900">{request.subject}</span>
                      {request.isOverdue && (
                        <span className="text-red-600 text-xs font-medium">⚠ Overdue</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-odoo-gray-700">
                    {request.assignedToName || (
                      <span className="text-odoo-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-odoo-gray-700">
                    {request.equipmentName || (
                      <span className="text-odoo-gray-400 italic">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      request.stage === 'new' ? 'bg-blue-100 text-blue-700' :
                      request.stage === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      request.stage === 'repaired' ? 'bg-emerald-100 text-emerald-700' :
                      request.stage === 'scheduled' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {request.stage.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-odoo-gray-500">
                    No maintenance requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
