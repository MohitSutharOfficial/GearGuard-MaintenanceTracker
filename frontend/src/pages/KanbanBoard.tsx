import { format } from 'date-fns';
import { AlertCircle, Calendar, Clock, GripVertical, Package, Wrench } from 'lucide-react';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { useApp } from '../context/AppContext';
import { RequestStage } from '../types';

const columns: { id: RequestStage; title: string; bgColor: string; textColor: string; borderColor: string }[] = [
  { 
    id: 'new', 
    title: 'New', 
    bgColor: 'bg-blue-50', 
    textColor: 'text-blue-900',
    borderColor: 'border-blue-400'
  },
  { 
    id: 'in_progress', 
    title: 'In Progress', 
    bgColor: 'bg-yellow-50', 
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-400'
  },
  { 
    id: 'repaired', 
    title: 'Repaired', 
    bgColor: 'bg-green-50', 
    textColor: 'text-green-900',
    borderColor: 'border-green-400'
  },
  { 
    id: 'scrap', 
    title: 'Scrap', 
    bgColor: 'bg-red-50', 
    textColor: 'text-red-900',
    borderColor: 'border-red-400'
  }
];

const cardBorderColors: Record<string, string> = {
  'high': 'border-red-400',
  'medium': 'border-yellow-400',
  'low': 'border-blue-400'
};

const cardBgColors: Record<string, string> = {
  'high': 'bg-red-50/30',
  'medium': 'bg-yellow-50/30',
  'low': 'bg-blue-50/30'
};

export default function KanbanBoard() {
  const { requests, updateRequestStage, loading, error } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Dropped outside a valid droppable
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStage = destination.droppableId as RequestStage;
    const stageName = columns.find(col => col.id === newStage)?.title || newStage;

    console.log('Drag ended:', { draggableId, newStage, source: source.droppableId });

    setIsUpdating(true);
    try {
      await updateRequestStage(draggableId, newStage);
      setToastMessage(`Request moved to ${stageName} successfully`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err: any) {
      console.error('Failed to update request stage:', err);
      setToastMessage(err.message || 'Failed to update request stage. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#714B67] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading kanban board...</p>
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

  const getRequestsByStage = (stage: RequestStage) => 
    requests.filter(req => req.stage === stage);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="pb-8">
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
      
      {/* Loading Overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]"></div>
            <span className="text-odoo-gray-700 font-medium">Updating request...</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-odoo-gray-900">Maintenance Kanban Board</h1>
        <p className="text-odoo-gray-600 text-sm mt-1">Drag and drop requests to update their status</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnRequests = getRequestsByStage(column.id).filter(req => req && req.id);
            return (
              <div key={column.id} className="flex flex-col">
                <div className={`kanban-column-header ${column.bgColor} ${column.textColor}`}>
                  <span className="font-semibold">{column.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${column.bgColor} border ${column.borderColor}`}>
                    {columnRequests.length}
                  </span>
                </div>
                
                <Droppable droppableId={column.id} type="REQUEST">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column ${
                        snapshot.isDraggingOver ? 'bg-[#714B67]/5 border-2 border-dashed border-[#714B67]' : 'border-2 border-transparent'
                      }`}
                    >
                      {columnRequests.length === 0 ? (
                        <div className="text-center py-8 text-odoo-gray-400 text-sm">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No requests</p>
                        </div>
                      ) : (
                        columnRequests.map((request, index) => {
                          const borderColor = cardBorderColors[request.priority] || 'border-gray-300';
                          const bgColor = cardBgColors[request.priority] || 'bg-white';
                          const draggableId = String(request.id); // Ensure it's a string
                          
                          return (
                            <Draggable
                              key={draggableId}
                              draggableId={draggableId}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`kanban-card ${borderColor} ${bgColor} ${
                                    snapshot.isDragging ? 'shadow-xl rotate-2 scale-105 is-dragging' : ''
                                  }`}
                                >
                                  {/* Card Header with Drag Handle */}
                                  <div className="flex items-start gap-2 mb-3">
                                    <div 
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded p-1 -m-1 transition-colors"
                                      title="Drag to move"
                                    >
                                      <GripVertical className="w-4 h-4 text-odoo-gray-400 flex-shrink-0" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-odoo-gray-900 text-sm leading-tight mb-1">
                                        {request.subject}
                                      </h4>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant={getPriorityColor(request.priority)}>
                                          {request.priority}
                                        </Badge>
                                        {request.isOverdue && (
                                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                                            <AlertCircle className="w-3 h-3" />
                                            Overdue
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Equipment Info */}
                                  <div className="flex items-center gap-2 mb-3 text-sm text-odoo-gray-600 bg-white/50 rounded px-2 py-1.5">
                                    <Wrench className="w-4 h-4 text-[#714B67]" />
                                    <span className="font-medium truncate">{request.equipmentName}</span>
                                  </div>

                                  {/* Request Details */}
                                  <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2 text-xs text-odoo-gray-600">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      <span>{request.type === 'corrective' ? '🔧 Corrective' : '📅 Preventive'}</span>
                                    </div>

                                    {request.scheduledDate && (
                                      <div className="flex items-center gap-2 text-xs text-odoo-gray-600">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{format(new Date(request.scheduledDate), 'MMM dd, yyyy')}</span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2 text-xs text-odoo-gray-600">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{request.hoursSpent || 0}h / {request.duration}h</span>
                                      <div className="flex-1 bg-odoo-gray-200 rounded-full h-1.5 ml-1">
                                        <div 
                                          className="bg-[#714B67] h-1.5 rounded-full transition-all" 
                                          style={{ width: `${Math.min(100, ((request.hoursSpent || 0) / request.duration) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Assigned Technician */}
                                  {request.assignedToName && (
                                    <div className="flex items-center gap-2 pt-3 border-t border-odoo-border">
                                      <div className="w-6 h-6 rounded-full bg-[#714B67] text-white flex items-center justify-center text-xs font-semibold">
                                        {request.assignedToName.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="text-xs text-odoo-gray-700 font-medium">
                                        {request.assignedToName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
