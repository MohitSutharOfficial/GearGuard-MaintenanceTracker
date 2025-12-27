import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { FilterState, RequestStage, RequestType } from '../types';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export default function FilterBar({ onFilterChange, activeFilters }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleTypeChange = (type: RequestType | '') => {
    onFilterChange({
      ...activeFilters,
      type: type || undefined,
    });
  };

  const handleStageChange = (stage: RequestStage | '') => {
    onFilterChange({
      ...activeFilters,
      stage: stage || undefined,
    });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...activeFilters,
      search: search || undefined,
    });
  };

  const handleToggleAssigned = () => {
    onFilterChange({
      ...activeFilters,
      assignedOnly: !activeFilters.assignedOnly,
    });
  };

  const handleToggleOverdue = () => {
    onFilterChange({
      ...activeFilters,
      overdueOnly: !activeFilters.overdueOnly,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="bg-white border-b border-odoo-border">
      {/* Filter Toggle Button */}
      <div className="px-3 py-2 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-odoo-gray-700 hover:text-odoo-primary transition"
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-odoo-primary text-white text-xs px-1.5 py-0.5 rounded-full">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-odoo-gray-600 hover:text-red-600 transition"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="px-3 py-3 bg-odoo-gray-50 border-t border-odoo-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-odoo-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Subject, equipment..."
                value={activeFilters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-odoo-border rounded focus:outline-none focus:ring-1 focus:ring-odoo-primary"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-odoo-gray-700 mb-1">
                Type
              </label>
              <select
                value={activeFilters.type || ''}
                onChange={(e) => handleTypeChange(e.target.value as any)}
                className="w-full px-2 py-1.5 text-sm border border-odoo-border rounded focus:outline-none focus:ring-1 focus:ring-odoo-primary"
              >
                <option value="">All Types</option>
                <option value="corrective">Corrective</option>
                <option value="preventive">Preventive</option>
              </select>
            </div>

            {/* Stage Filter */}
            <div>
              <label className="block text-xs font-medium text-odoo-gray-700 mb-1">
                Stage
              </label>
              <select
                value={activeFilters.stage || ''}
                onChange={(e) => handleStageChange(e.target.value as any)}
                className="w-full px-2 py-1.5 text-sm border border-odoo-border rounded focus:outline-none focus:ring-1 focus:ring-odoo-primary"
              >
                <option value="">All Stages</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="repaired">Repaired</option>
                <option value="scheduled">Scheduled</option>
                <option value="scrap">Scrap</option>
              </select>
            </div>

            {/* Assigned Only Toggle */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.assignedOnly || false}
                  onChange={handleToggleAssigned}
                  className="w-4 h-4 text-odoo-primary border-odoo-border rounded focus:ring-odoo-primary"
                />
                <span className="text-sm text-odoo-gray-700">Assigned Only</span>
              </label>
            </div>

            {/* Overdue Only Toggle */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.overdueOnly || false}
                  onChange={handleToggleOverdue}
                  className="w-4 h-4 text-odoo-primary border-odoo-border rounded focus:ring-odoo-primary"
                />
                <span className="text-sm text-red-600 font-medium">Overdue Only</span>
              </label>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-odoo-border">
              {activeFilters.type && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Type: {activeFilters.type}
                  <button
                    onClick={() => handleTypeChange('')}
                    className="hover:text-blue-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeFilters.stage && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                  Stage: {activeFilters.stage.replace('_', ' ')}
                  <button
                    onClick={() => handleStageChange('')}
                    className="hover:text-purple-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeFilters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  Search: "{activeFilters.search}"
                  <button
                    onClick={() => handleSearchChange('')}
                    className="hover:text-gray-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeFilters.assignedOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  Assigned Only
                  <button
                    onClick={handleToggleAssigned}
                    className="hover:text-green-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeFilters.overdueOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                  Overdue Only
                  <button
                    onClick={handleToggleOverdue}
                    className="hover:text-red-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
