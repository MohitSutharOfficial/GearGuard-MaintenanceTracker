import { PackageSearch, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { useApp } from '../context/AppContext';
import { Equipment } from '../types';

export default function EquipmentList() {
  const { equipment, teams, addEquipment, loading, error } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: '',
    department: '',
    employee: '',
    purchaseDate: '',
    warrantyExpiry: '',
    location: '',
    maintenanceTeamId: ''
  });

  const departments = [...new Set(equipment.map(eq => eq.department))];

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || eq.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowErrorMessage(null);
    
    try {
      await addEquipment({
        ...formData,
        status: 'active',
        openRequestsCount: 0
      } as Equipment);
      
      // Show success message
      setShowSuccessMessage(true);
      setIsModalOpen(false);
      
      // Reset form
      setFormData({
        name: '',
        serialNumber: '',
        category: '',
        department: '',
        employee: '',
        purchaseDate: '',
        warrantyExpiry: '',
        location: '',
        maintenanceTeamId: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to create equipment:', err);
      setShowErrorMessage(err.message || 'Failed to create equipment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'broken': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#714B67] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading equipment...</p>
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
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Success!</p>
              <p className="text-sm text-green-600">Equipment created successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {showErrorMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-800">Error!</p>
              <p className="text-sm text-red-600">{showErrorMessage}</p>
            </div>
            <button 
              onClick={() => setShowErrorMessage(null)}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600 mt-2">Manage all company assets</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Equipment
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or serial number..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={filterDepartment}
              onChange={setFilterDepartment}
              options={departments.map(dept => ({ value: dept, label: dept }))}
            />
          </div>
        </div>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((eq) => (
          <Link key={eq.id} to={`/equipment/${eq.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#714B67] rounded-lg flex items-center justify-center">
                    <PackageSearch size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{eq.name}</h3>
                    <p className="text-sm text-gray-500">{eq.serialNumber}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(eq.status)}>
                  {eq.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{eq.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{eq.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{eq.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="font-medium">{eq.employee}</span>
                </div>
              </div>

              {eq.openRequestsCount > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Badge variant="warning">
                    {eq.openRequestsCount} Open Request{eq.openRequestsCount > 1 ? 's' : ''}
                  </Badge>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No equipment found</p>
        </Card>
      )}

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Equipment"
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
              form="equipment-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Equipment'
              )}
            </Button>
          </>
        }
      >
        <form id="equipment-form" onSubmit={handleSubmit} className="space-y-4">
          {showErrorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {showErrorMessage}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Equipment Name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              required
              disabled={isSubmitting}
            />
            <Input
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(val) => setFormData({ ...formData, serialNumber: val })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              required
              disabled={isSubmitting}
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
              required
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Assigned Employee"
            value={formData.employee}
            onChange={(val) => setFormData({ ...formData, employee: val })}
            required
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(val) => setFormData({ ...formData, purchaseDate: val })}
              required
              disabled={isSubmitting}
            />
            <Input
              label="Warranty Expiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={(val) => setFormData({ ...formData, warrantyExpiry: val })}
              required
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(val) => setFormData({ ...formData, location: val })}
            required
            disabled={isSubmitting}
          />

          <Select
            label="Maintenance Team"
            value={formData.maintenanceTeamId}
            onChange={(val) => setFormData({ ...formData, maintenanceTeamId: val })}
            options={teams.map(team => ({ value: team.id, label: team.name }))}
            required
            disabled={isSubmitting}
          />
        </form>
      </Modal>
    </div>
  );
}
