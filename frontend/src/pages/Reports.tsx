import {
    Activity,
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    Cpu,
    Download,
    PieChart as PieChartIcon,
    TrendingDown,
    TrendingUp,
    Users,
    Wrench
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

const COLORS = ['#714B67', '#875A7B', '#00A09D', '#F0AD4E', '#8F7BA1'];

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function Reports() {
  const { requests, equipment, teams } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Calculate key metrics
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.stage === 'repaired').length;
  const overdueRequests = requests.filter(r => r.isOverdue).length;
  const avgCompletionTime = requests.filter(r => r.stage === 'repaired').length > 0
    ? (requests.filter(r => r.stage === 'repaired').reduce((sum, r) => sum + (r.hoursSpent || 0), 0) / completedRequests).toFixed(1)
    : '0';
  const completionRate = totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(1) : '0';
  
  // MTTR (Mean Time To Repair)
  const mttr = completedRequests > 0
    ? (requests.filter(r => r.stage === 'repaired').reduce((sum, r) => sum + (r.hoursSpent || 0), 0) / completedRequests).toFixed(1)
    : '0';

  // Equipment availability
  const activeEquipment = equipment.filter(e => e.status === 'active').length;
  const equipmentAvailability = equipment.length > 0 ? ((activeEquipment / equipment.length) * 100).toFixed(1) : '0';

  // Requests by Team with enhanced metrics
  const teamData = teams.map(team => {
    const teamRequests = requests.filter(r => r.maintenanceTeamId === team.id);
    const teamCompleted = teamRequests.filter(r => r.stage === 'repaired').length;
    return {
      name: team.name,
      total: teamRequests.length,
      completed: teamCompleted,
      inProgress: teamRequests.filter(r => r.stage === 'in_progress').length,
      pending: teamRequests.filter(r => r.stage === 'new').length,
      efficiency: teamRequests.length > 0 ? ((teamCompleted / teamRequests.length) * 100).toFixed(0) : '0'
    };
  });

  // Requests by Equipment Category
  const categoryData = Object.entries(
    equipment.reduce((acc, eq) => {
      const categoryRequests = requests.filter(r => r.equipmentId === eq.id);
      acc[eq.category] = (acc[eq.category] || 0) + categoryRequests.length;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Request Type Distribution
  const typeData = [
    { name: 'Corrective', value: requests.filter(r => r.type === 'corrective').length, color: '#F0AD4E' },
    { name: 'Preventive', value: requests.filter(r => r.type === 'preventive').length, color: '#00A09D' }
  ];

  // Stage Distribution
  const stageData = [
    { name: 'New', value: requests.filter(r => r.stage === 'new').length, color: '#3B82F6' },
    { name: 'In Progress', value: requests.filter(r => r.stage === 'in_progress').length, color: '#F0AD4E' },
    { name: 'Repaired', value: requests.filter(r => r.stage === 'repaired').length, color: '#10B981' },
    { name: 'Scrap', value: requests.filter(r => r.stage === 'scrap').length, color: '#EF4444' }
  ];

  // Priority Distribution
  const priorityData = [
    { name: 'High', value: requests.filter(r => r.priority === 'high').length, color: '#EF4444' },
    { name: 'Medium', value: requests.filter(r => r.priority === 'medium').length, color: '#F0AD4E' },
    { name: 'Low', value: requests.filter(r => r.priority === 'low').length, color: '#3B82F6' }
  ];

  // Monthly trend data (simulated for last 6 months)
  const trendData = [
    { month: 'Jul', requests: 45, completed: 38, preventive: 12 },
    { month: 'Aug', requests: 52, completed: 44, preventive: 15 },
    { month: 'Sep', requests: 48, completed: 41, preventive: 14 },
    { month: 'Oct', requests: 58, completed: 49, preventive: 18 },
    { month: 'Nov', requests: 55, completed: 47, preventive: 16 },
    { month: 'Dec', requests: totalRequests, completed: completedRequests, preventive: requests.filter(r => r.type === 'preventive').length }
  ];

  return (
    <div className="pb-8">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-odoo-gray-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-[#714B67]" />
              Reports & Analytics
            </h1>
            <p className="text-odoo-gray-600 text-sm mt-1">Comprehensive maintenance performance insights</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Filter */}
            <div className="flex items-center gap-2 bg-white border border-odoo-border rounded-lg p-1">
              {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                    timeRange === range
                      ? 'bg-[#714B67] text-white shadow-sm'
                      : 'text-odoo-gray-600 hover:bg-odoo-gray-50'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-odoo-border rounded-lg text-sm font-medium text-odoo-gray-700 hover:bg-odoo-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Requests */}
        <Card className="border-l-4 border-[#714B67]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-odoo-gray-600 mb-1">Total Requests</p>
              <p className="text-3xl font-bold text-odoo-gray-900">{totalRequests}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">+12% vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#714B67]/10 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-[#714B67]" />
            </div>
          </div>
        </Card>

        {/* Completion Rate */}
        <Card className="border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-odoo-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-odoo-gray-900">{completionRate}%</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">+5% vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* MTTR */}
        <Card className="border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-odoo-gray-600 mb-1">Avg. Repair Time</p>
              <p className="text-3xl font-bold text-odoo-gray-900">{mttr}h</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">-8% improvement</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        {/* Equipment Availability */}
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-odoo-gray-600 mb-1">Equipment Uptime</p>
              <p className="text-3xl font-bold text-odoo-gray-900">{equipmentAvailability}%</p>
              <div className="flex items-center gap-1 mt-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">{activeEquipment}/{equipment.length} active</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-odoo-gray-600">Overdue Requests</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{overdueRequests}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-odoo-gray-600">Active Teams</p>
              <p className="text-2xl font-bold text-[#714B67] mt-1">{teams.length}</p>
            </div>
            <Users className="w-8 h-8 text-[#714B67]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-odoo-gray-600">Preventive Maintenance</p>
              <p className="text-2xl font-bold text-teal-600 mt-1">
                {((requests.filter(r => r.type === 'preventive').length / totalRequests) * 100).toFixed(0)}%
              </p>
            </div>
            <Calendar className="w-8 h-8 text-teal-600" />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Maintenance Trend */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-odoo-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#714B67]" />
              Maintenance Trend Analysis
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#714B67" strokeWidth={2} name="Total Requests" />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="preventive" stroke="#00A09D" strokeWidth={2} name="Preventive" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Performance */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-odoo-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#714B67]" />
              Team Performance Overview
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inProgress" fill="#F0AD4E" name="In Progress" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#3B82F6" name="Pending" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Team Efficiency Table */}
          <div className="mt-6 border-t border-odoo-border pt-4">
            <h3 className="text-sm font-semibold text-odoo-gray-700 mb-3">Team Efficiency Ratings</h3>
            <div className="space-y-2">
              {teamData.map((team) => (
                <div key={team.name} className="flex items-center justify-between py-2 px-3 bg-odoo-gray-50 rounded">
                  <span className="text-sm font-medium text-odoo-gray-700">{team.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-odoo-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-[#714B67] h-2 rounded-full transition-all" 
                        style={{ width: `${team.efficiency}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#714B67] w-12 text-right">{team.efficiency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Type Distribution */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-odoo-gray-900 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#714B67]" />
                Request Type Analysis
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {typeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 p-2 bg-odoo-gray-50 rounded">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-odoo-gray-700">{item.name}: <strong>{item.value}</strong></span>
                </div>
              ))}
            </div>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-odoo-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#714B67]" />
                Priority Distribution
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 bg-odoo-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-odoo-gray-700">{item.name} Priority</span>
                  </div>
                  <span className="text-sm font-bold text-odoo-gray-900">{item.value} requests</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Equipment Category & Stage Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equipment Category Distribution */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-odoo-gray-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#714B67]" />
                Requests by Equipment Category
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Request Stage Distribution */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-odoo-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#714B67]" />
                Stage Distribution
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
