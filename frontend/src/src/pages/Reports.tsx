import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

const COLORS = ['#714B67', '#875A7B', '#8F7BA1', '#00A09D', '#F0AD4E'];

export default function Reports() {
  const { requests, equipment, teams } = useApp();

  // Requests by Team
  const teamData = teams.map(team => ({
    name: team.name,
    total: requests.filter(r => r.maintenanceTeamId === team.id).length,
    completed: requests.filter(r => r.maintenanceTeamId === team.id && r.stage === 'repaired').length,
    inProgress: requests.filter(r => r.maintenanceTeamId === team.id && r.stage === 'in-progress').length
  }));

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
    { name: 'Corrective', value: requests.filter(r => r.type === 'corrective').length },
    { name: 'Preventive', value: requests.filter(r => r.type === 'preventive').length }
  ];

  // Stage Distribution
  const stageData = [
    { name: 'New', value: requests.filter(r => r.stage === 'new').length },
    { name: 'In Progress', value: requests.filter(r => r.stage === 'in-progress').length },
    { name: 'Repaired', value: requests.filter(r => r.stage === 'repaired').length },
    { name: 'Scrap', value: requests.filter(r => r.stage === 'scrap').length }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Visual insights into maintenance operations</p>
      </div>

      <div className="space-y-6">
        {/* Team Performance */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Requests by Team</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#714B67" name="Total" />
              <Bar dataKey="completed" fill="#00A09D" name="Completed" />
              <Bar dataKey="inProgress" fill="#F0AD4E" name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equipment Category Distribution */}
          <Card>
            <h2 className="text-xl font-bold mb-6">Requests by Equipment Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
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

          {/* Request Type Distribution */}
          <Card>
            <h2 className="text-xl font-bold mb-6">Request Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Request Stage Distribution */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Request Stage Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#714B67" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Key Metrics */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Key Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-odoo-primary">{equipment.length}</p>
              <p className="text-gray-600 mt-2">Total Equipment</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {((requests.filter(r => r.stage === 'repaired').length / requests.length) * 100).toFixed(0)}%
              </p>
              <p className="text-gray-600 mt-2">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {(requests.reduce((sum, r) => sum + r.hoursSpent, 0)).toFixed(0)}h
              </p>
              <p className="text-gray-600 mt-2">Total Hours Spent</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{teams.length}</p>
              <p className="text-gray-600 mt-2">Active Teams</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
