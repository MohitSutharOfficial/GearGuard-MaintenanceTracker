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
import Toast from '../components/ui/Toast';
import { useApp } from '../context/AppContext';
import { MaintenanceRequest } from '../types';

export default function RequestList() {
  const { requests, equipment, teams, addRequest, loading, error } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStage, setFilterStage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
      const selectedTeam = teams.find(t => t.id === selectedEquipment?.maintenanceTeamId);

      if (!selectedEquipment || !selectedTeam) {
        setToastMessage('Please select valid equipment');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
        return;
      }

      await addRequest({
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
      } as MaintenanceRequest);
      
      // Show success message
      setToastMessage('Maintenance request created successfully');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      setIsModalOpen(false);
      setFormData({
        subject: '',
        type: 'corrective',
        equipmentId: '',
        scheduledDate: '',
        priority: 'medium',
        description: ''
      });
    } catch (err: any) {
      console.error('Failed to create request:', err);
      setToastMessage(err.message || 'Failed to create request. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
      case 'in_progress': return 'warning';
      case 'repaired': return 'success';
      case 'scrap': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-odoo-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
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
      {/* Toast Notifications */}
      {showSuccessToast && (
        <Toast 
          type="success"
          title="Success!"
          message={toastMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <Toast 
          type="error"
          title="Error!"
          message={toastMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}

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
            variant={filterStage === 'in_progress' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStage('in_progress')}
          >
            In Progress ({requests.filter(r => r.stage === 'in_progress').length})
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
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="request-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Request'
              )}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          <Select
            label="Equipment"
            value={formData.equipmentId}
            onChange={(val) => setFormData({ ...formData, equipmentId: val })}
            options={equipment.map(eq => ({ value: eq.id, label: `${eq.name} (${eq.serialNumber})` }))}
            required
            disabled={isSubmitting}
          />

          {formData.type === 'preventive' && (
            <Input
              label="Scheduled Date"
              type="date"
              value={formData.scheduledDate}
              onChange={(val) => setFormData({ ...formData, scheduledDate: val })}
              disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val })}
            placeholder="Describe the issue or maintenance work..."
            rows={4}
            required
            disabled={isSubmitting}
          />
        </form>
      </Modal>
    </div>
  );
}
