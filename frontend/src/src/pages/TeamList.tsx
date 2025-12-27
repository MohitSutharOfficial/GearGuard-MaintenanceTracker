import { User, Users } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

export default function TeamList() {
  const { teams } = useApp();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Teams</h1>
        <p className="text-gray-600 mt-2">Specialized teams for different equipment types</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <Card key={team.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-odoo-primary rounded-lg flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                <Badge variant="info">{team.category}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Team Members</p>
              {team.members.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-odoo-secondary rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <Badge variant={member.role === 'manager' ? 'success' : 'default'}>
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
