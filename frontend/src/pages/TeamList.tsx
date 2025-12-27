import { Plus, User, Users } from 'lucide-react';
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

export default function TeamList() {
  const { teams, loading, error, addTeam } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setToastMessage('Team name is required');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    
    if (!formData.category.trim()) {
      setToastMessage('Category is required');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      await addTeam({
        name: formData.name,
        category: formData.category,
        description: formData.description,
      });

      setToastMessage(`Team "${formData.name}" created successfully`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Reset form and close modal
      setFormData({
        name: '',
        category: '',
        description: '',
      });
      setShowModal(false);
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to create team');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-odoo-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teams...</p>
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
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Teams</h1>
          <p className="text-gray-600 mt-2">Specialized teams for different equipment types</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Team
        </Button>
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
              {team.members && team.members.length > 0 ? (
                team.members.map(member => (
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
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No members yet</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* New Team Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !isSubmitting && setShowModal(false)}
        title="Create New Team"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Team Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="e.g., Electrical Maintenance Team"
            required
            disabled={isSubmitting}
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={[
              { value: 'Electrical', label: 'Electrical' },
              { value: 'Mechanical', label: 'Mechanical' },
              { value: 'HVAC', label: 'HVAC & Climate Control' },
              { value: 'IT', label: 'IT & Computer Systems' },
              { value: 'Facilities', label: 'Facilities & General' },
              { value: 'Plumbing', label: 'Plumbing' },
              { value: 'Safety', label: 'Safety & Security' },
            ]}
            required
            disabled={isSubmitting}
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Brief description of team responsibilities..."
            rows={3}
            disabled={isSubmitting}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notifications */}
      {showSuccessToast && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <Toast
          type="error"
          message={toastMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </div>
  );
}
