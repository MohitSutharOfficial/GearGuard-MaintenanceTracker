import { format } from 'date-fns';
import { ArrowLeft, FileText, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { getEquipmentById, getRequestsByEquipment } = useApp();

  const equipment = getEquipmentById(id!);
  const requests = getRequestsByEquipment(id!);

  if (!equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Equipment not found</p>
        <Link to="/equipment">
          <Button className="mt-4" variant="secondary">
            Back to Equipment List
          </Button>
        </Link>
      </div>
    );
  }

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
      {/* Header */}
      <div className="mb-6">
        <Link to="/equipment">
          <Button variant="secondary" size="sm" className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Equipment
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
            <p className="text-gray-600 mt-2">{equipment.serialNumber}</p>
          </div>
          <Badge variant={getStatusColor(equipment.status)} className="text-lg px-4 py-2">
            {equipment.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Details */}
          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Equipment Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{equipment.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{equipment.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{equipment.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned Employee</p>
                <p className="font-medium">{equipment.employee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Purchase Date</p>
                <p className="font-medium">{format(new Date(equipment.purchaseDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Warranty Expiry</p>
                <p className="font-medium">{format(new Date(equipment.warrantyExpiry), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </Card>

          {/* Maintenance History */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Wrench size={20} />
                Maintenance History
              </h2>
              <Button size="sm">New Request</Button>
            </div>

            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map(request => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{request.subject}</h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant={
                        request.stage === 'repaired' ? 'success' :
                        request.stage === 'in-progress' ? 'warning' :
                        request.stage === 'scrap' ? 'danger' : 'info'
                      }>
                        {request.stage}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Type: <span className="font-medium">{request.type}</span>
                      </span>
                      <span className="text-gray-600">
                        Duration: <span className="font-medium">{request.hoursSpent}h / {request.duration}h</span>
                      </span>
                      {request.assignedToName && (
                        <span className="text-gray-600">
                          Assigned: <span className="font-medium">{request.assignedToName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No maintenance requests yet</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Smart Button - Maintenance Requests */}
          <Card>
            <button className="w-full text-left group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-odoo-primary rounded-lg flex items-center justify-center group-hover:bg-odoo-secondary transition-colors">
                    <Wrench size={20} className="text-white" />
                  </div>
                  <span className="font-semibold">Maintenance</span>
                </div>
                <Badge variant="warning">{equipment.openRequestsCount}</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">Open maintenance requests</p>
            </button>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Requests</span>
                <span className="font-bold">{requests.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-bold text-green-600">
                  {requests.filter(r => r.stage === 'repaired').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Progress</span>
                <span className="font-bold text-yellow-600">
                  {requests.filter(r => r.stage === 'in-progress').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-blue-600">
                  {requests.filter(r => r.stage === 'new').length}
                </span>
              </div>
            </div>
          </Card>

          {/* Warranty Info */}
          <Card>
            <h3 className="font-bold mb-4">Warranty Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Purchase Date</p>
                <p className="font-medium">{format(new Date(equipment.purchaseDate), 'MMMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Warranty Expires</p>
                <p className="font-medium">{format(new Date(equipment.warrantyExpiry), 'MMMM dd, yyyy')}</p>
              </div>
              {new Date(equipment.warrantyExpiry) < new Date() ? (
                <Badge variant="danger">Warranty Expired</Badge>
              ) : (
                <Badge variant="success">Under Warranty</Badge>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
