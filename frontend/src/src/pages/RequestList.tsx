import { format } from 'date-fns';
import { AlertCircle, Clock, Plus, User } from 'lucide-react';
import { useState } from 'react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import TextArea from '../components/ui/TextArea';
import { useApp } from '../context/AppContext';
import { MaintenanceRequest } from '../types';

export default function RequestList() {
  const { requests, equipment, teams, addRequest } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStage, setFilterStage] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    type: 'corrective' as 'corrective' | 'preventive',
    equipmentId: '',
    scheduledDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    description: ''
  });

  const filteredRequests = filterStage
    ? requests.filter(r => r.stage === filterStage)
    : requests;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
    const selectedTeam = teams.find(t => t.id === selectedEquipment?.maintenanceTeamId);

    if (!selectedEquipment || !selectedTeam) return;

    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      ...formData,
      equipmentName: selectedEquipment.name,
      equipmentCategory: selectedEquipment.category,
      maintenanceTeamId: selectedTeam.id,
      maintenanceTeamName: selectedTeam.name,
      stage: 'new',
      duration: formData.type === 'preventive' ? 2 : 4,
      hoursSpent: 0,
      createdAt: new Date().toISOString(),
      isOverdue: false
    };

    addRequest(newRequest);
    setIsModalOpen(false);
    setFormData({
      subject: '',
      type: 'corrective',
      equipmentId: '',
      scheduledDate: '',
      priority: 'medium',
      description: ''
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'info';
      case 'in-progress': return 'warning';
      case 'repaired': return 'success';
      case 'scrap': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600 mt-2">Manage all maintenance work</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={filterStage === '' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStage('')}
          >
            All ({requests.length})
          </Button>
          <Button
            variant={filterStage === 'new' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStage('new')}
          >
            New ({requests.filter(r => r.stage === 'new').length})
          </Button>
          <Button
            variant={filterStage === 'in-progress' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStage('in-progress')}
          >
            In Progress ({requests.filter(r => r.stage === 'in-progress').length})
          </Button>
          <Button
            variant={filterStage === 'repaired' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStage('repaired')}
          >
            Repaired ({requests.filter(r => r.stage === 'repaired').length})
          </Button>
        </div>
      </Card>

      {/* Request List */}
      <div className="space-y-4">
        {filteredRequests.map(request => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{request.subject}</h3>
                <p className="text-gray-600">{request.equipmentName}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityColor(request.priority)}>
                  {request.priority}
                </Badge>
                <Badge variant={getStageColor(request.stage)}>
                  {request.stage}
                </Badge>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{request.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle size={16} />
                <span>{request.type === 'corrective' ? 'Corrective' : 'Preventive'}</span>
              </div>
              
              {request.assignedToName && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{request.assignedToName}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{request.hoursSpent}h / {request.duration}h</span>
              </div>

              <div className="text-sm text-gray-600">
                Created: {format(new Date(request.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Maintenance Request"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="request-form">
              Create Request
            </Button>
          </>
        }
      >
        <form id="request-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject"
            value={formData.subject}
            onChange={(val) => setFormData({ ...formData, subject: val })}
            placeholder="What is wrong?"
            required
          />

          <Select
            label="Request Type"
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val as any })}
            options={[
              { value: 'corrective', label: 'Corrective (Breakdown)' },
              { value: 'preventive', label: 'Preventive (Routine)' }
            ]}
            required
          />

          <Select
            label="Equipment"
            value={formData.equipmentId}
            onChange={(val) => setFormData({ ...formData, equipmentId: val })}
            options={equipment.map(eq => ({ value: eq.id, label: `${eq.name} (${eq.serialNumber})` }))}
            required
          />

          {formData.type === 'preventive' && (
            <Input
              label="Scheduled Date"
              type="date"
              value={formData.scheduledDate}
              onChange={(val) => setFormData({ ...formData, scheduledDate: val })}
            />
          )}

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(val) => setFormData({ ...formData, priority: val as any })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ]}
            required
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val })}
            placeholder="Describe the issue or maintenance work..."
            rows={4}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
