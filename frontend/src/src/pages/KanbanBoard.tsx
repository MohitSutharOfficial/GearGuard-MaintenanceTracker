import { AlertCircle, Clock, User } from 'lucide-react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { RequestStage } from '../types';

const columns: { id: RequestStage; title: string; color: string }[] = [
  { id: 'new', title: 'New', color: 'bg-blue-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'repaired', title: 'Repaired', color: 'bg-green-100' },
  { id: 'scrap', title: 'Scrap', color: 'bg-red-100' }
];

export default function KanbanBoard() {
  const { requests, updateRequestStage } = useApp();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const requestId = result.draggableId;
    const newStage = result.destination.droppableId as RequestStage;

    updateRequestStage(requestId, newStage);
  };

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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Kanban Board</h1>
        <p className="text-gray-600 mt-2">Drag and drop requests to update their status</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} rounded-t-lg p-4`}>
                <h3 className="font-semibold text-gray-900">
                  {column.title}
                  <span className="ml-2 text-sm text-gray-600">
                    ({getRequestsByStage(column.id).length})
                  </span>
                </h3>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column flex-1 ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {getRequestsByStage(column.id).map((request, index) => (
                      <Draggable
                        key={request.id}
                        draggableId={request.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`kanban-card ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 flex-1">
                                {request.subject}
                              </h4>
                              <Badge variant={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {request.equipmentName}
                            </p>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <AlertCircle size={16} />
                                <span>{request.type === 'corrective' ? 'Corrective' : 'Preventive'}</span>
                              </div>

                              {request.assignedToName && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <User size={16} />
                                  <span>{request.assignedToName}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock size={16} />
                                <span>{request.hoursSpent}h / {request.duration}h</span>
                              </div>
                            </div>

                            {request.isOverdue && (
                              <div className="mt-3 pt-3 border-t border-red-200">
                                <Badge variant="danger">OVERDUE</Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
