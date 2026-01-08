import { useState, useRef, useEffect } from 'react';
import type { TaskPriority, TaskStatus } from '../services/task.service';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriorities: TaskPriority[];
  onPriorityToggle: (priority: TaskPriority) => void;
  selectedStatuses: TaskStatus[];
  onStatusToggle: (status: TaskStatus) => void;
  selectedAssignees: string[];
  onAssigneeToggle: (userId: string) => void;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'this-week' | 'this-month' | 'no-date';
  onDueDateFilterChange: (filter: 'all' | 'overdue' | 'today' | 'this-week' | 'this-month' | 'no-date') => void;
  assignees: Array<{ id: string; name: string }>;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const PRIORITIES: { label: string; value: TaskPriority; color: string }[] = [
  { label: 'Low', value: 'LOW', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { label: 'Medium', value: 'MEDIUM', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { label: 'High', value: 'HIGH', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { label: 'Urgent', value: 'URGENT', color: 'bg-red-100 text-red-700 border-red-300' },
];

const STATUSES: { label: string; value: TaskStatus; color: string }[] = [
  { label: 'To Do', value: 'TODO', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { label: 'In Progress', value: 'IN_PROGRESS', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { label: 'Done', value: 'DONE', color: 'bg-green-100 text-green-700 border-green-300' },
];

const DUE_DATE_FILTERS = [
  { label: 'All', value: 'all' as const },
  { label: 'Overdue', value: 'overdue' as const },
  { label: 'Today', value: 'today' as const },
  { label: 'This Week', value: 'this-week' as const },
  { label: 'This Month', value: 'this-month' as const },
  { label: 'No Due Date', value: 'no-date' as const },
];

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPriorityToggle,
  selectedStatuses,
  onStatusToggle,
  selectedAssignees,
  onAssigneeToggle,
  dueDateFilter,
  onDueDateFilterChange,
  assignees,
  onClearFilters,
  activeFilterCount,
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap relative" ref={filterRef}>
        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear all
          </button>
        )}

        {/* Filter Panel */}
        {isFilterOpen && (
          <div 
            className="absolute top-full left-0 z-50 mt-2 w-[calc(100vw-2rem)] sm:w-[600px] lg:w-[800px] max-w-4xl border-2 border-gray-300 rounded-lg shadow-xl p-4 md:p-6"
            style={{ 
              backgroundColor: '#ffffff',
              opacity: 1,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Priority Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Priority</h3>
                <div className="space-y-2">
                  {PRIORITIES.map((priority) => (
                    <label
                      key={priority.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriorities.includes(priority.value)}
                        onChange={() => onPriorityToggle(priority.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{priority.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
                <div className="space-y-2">
                  {STATUSES.map((status) => (
                    <label
                      key={status.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status.value)}
                        onChange={() => onStatusToggle(status.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assignee Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Assigned To</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {assignees.length === 0 ? (
                    <p className="text-sm text-gray-500">No assignees available</p>
                  ) : (
                    assignees.map((assignee) => (
                      <label
                        key={assignee.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAssignees.includes(assignee.id)}
                          onChange={() => onAssigneeToggle(assignee.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{assignee.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Due Date Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Due Date</h3>
                <div className="space-y-2">
                  {DUE_DATE_FILTERS.map((filter) => (
                    <label
                      key={filter.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="dueDateFilter"
                        checked={dueDateFilter === filter.value}
                        onChange={() => onDueDateFilterChange(filter.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Badges */}
      {(selectedPriorities.length > 0 ||
        selectedStatuses.length > 0 ||
        selectedAssignees.length > 0 ||
        dueDateFilter !== 'all') && (
        <div className="flex flex-wrap gap-2">
          {selectedPriorities.map((priority) => {
            const priorityInfo = PRIORITIES.find((p) => p.value === priority);
            return (
              <span
                key={priority}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-300"
              >
                Priority: {priorityInfo?.label}
                <button
                  onClick={() => onPriorityToggle(priority)}
                  className="hover:text-blue-900 p-0.5 rounded hover:bg-blue-200 transition-colors flex items-center justify-center"
                  aria-label="Remove filter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
          {selectedStatuses.map((status) => {
            const statusInfo = STATUSES.find((s) => s.value === status);
            return (
              <span
                key={status}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-300"
              >
                Status: {statusInfo?.label}
                <button
                  onClick={() => onStatusToggle(status)}
                  className="hover:text-green-900 p-0.5 rounded hover:bg-green-200 transition-colors flex items-center justify-center"
                  aria-label="Remove filter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
          {selectedAssignees.map((assigneeId) => {
            const assignee = assignees.find((a) => a.id === assigneeId);
            return (
              <span
                key={assigneeId}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-300"
              >
                Assigned: {assignee?.name}
                <button
                  onClick={() => onAssigneeToggle(assigneeId)}
                  className="hover:text-purple-900 p-0.5 rounded hover:bg-purple-200 transition-colors flex items-center justify-center"
                  aria-label="Remove filter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
          {dueDateFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full border border-orange-300">
              Due: {DUE_DATE_FILTERS.find((f) => f.value === dueDateFilter)?.label}
              <button
                onClick={() => onDueDateFilterChange('all')}
                className="hover:text-orange-900 p-0.5 rounded hover:bg-orange-200 transition-colors flex items-center justify-center"
                aria-label="Remove filter"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

