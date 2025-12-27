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
  const { equipment, teams, addEquipment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      openRequestsCount: 0
    };
    addEquipment(newEquipment);
    setIsModalOpen(false);
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'scrapped': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div>
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
                  <div className="w-12 h-12 bg-odoo-primary rounded-lg flex items-center justify-center">
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="equipment-form">
              Create Equipment
            </Button>
          </>
        }
      >
        <form id="equipment-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Equipment Name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              required
            />
            <Input
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(val) => setFormData({ ...formData, serialNumber: val })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              required
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
              required
            />
          </div>

          <Input
            label="Assigned Employee"
            value={formData.employee}
            onChange={(val) => setFormData({ ...formData, employee: val })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(val) => setFormData({ ...formData, purchaseDate: val })}
              required
            />
            <Input
              label="Warranty Expiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={(val) => setFormData({ ...formData, warrantyExpiry: val })}
              required
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(val) => setFormData({ ...formData, location: val })}
            required
          />

          <Select
            label="Maintenance Team"
            value={formData.maintenanceTeamId}
            onChange={(val) => setFormData({ ...formData, maintenanceTeamId: val })}
            options={teams.map(team => ({ value: team.id, label: team.name }))}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
