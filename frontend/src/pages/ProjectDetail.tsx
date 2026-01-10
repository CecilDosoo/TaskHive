import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useUpdateTask } from '../hooks/useTasks';
import { useTaskEvents } from '../hooks/useSocketEvents';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import MemberManagementModal from '../components/MemberManagementModal';
import NotificationBell from '../components/NotificationBell';
import SearchAndFilter from '../components/SearchAndFilter';
import ActivityLog from '../components/ActivityLog';
import ProjectSettingsModal from '../components/ProjectSettingsModal';
import type { Task, TaskPriority, TaskStatus } from '../services/task.service';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProject(id);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const updateTask = useUpdateTask();

  // Debug: Log settings modal state changes
  useEffect(() => {
    console.log('Settings modal state changed:', isSettingsModalOpen);
  }, [isSettingsModalOpen]);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'today' | 'this-week' | 'this-month' | 'no-date'>('all');
  const [showActivityLog, setShowActivityLog] = useState(false);
  
  // Listen for real-time task events
  useTaskEvents(id);

  // Flatten all tasks from all taskLists AND direct tasks (safe for useMemo)
  const allTasks = useMemo(() => {
    if (!data?.project) return [];
    
    const project = data.project;
    let tasks: Task[] = [];
    
    try {
      // Get tasks from taskLists
      if (project.taskLists && Array.isArray(project.taskLists) && project.taskLists.length > 0) {
        const tasksFromLists = project.taskLists.flatMap((list) => {
          if (list && list.tasks && Array.isArray(list.tasks)) {
            return list.tasks;
          }
          return [];
        });
        tasks = [...tasks, ...tasksFromLists];
      }
      
      // Get tasks directly from project (tasks without taskListId)
      if (project.tasks && Array.isArray(project.tasks) && project.tasks.length > 0) {
        tasks = [...tasks, ...project.tasks];
      }
    } catch (error) {
      console.error('Error processing tasks:', error);
      return [];
    }
    
    return tasks;
  }, [data?.project]);

  // Get all unique assignees from tasks
  const assignees = useMemo(() => {
    const assigneeMap = new Map<string, { id: string; name: string }>();
    allTasks.forEach((task) => {
      task.assignments?.forEach((assignment) => {
        if (!assigneeMap.has(assignment.user.id)) {
          assigneeMap.set(assignment.user.id, {
            id: assignment.user.id,
            name: assignment.user.name,
          });
        }
      });
    });
    return Array.from(assigneeMap.values());
  }, [allTasks]);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    let filtered = [...allTasks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((task) => selectedPriorities.includes(task.priority));
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((task) => selectedStatuses.includes(task.status));
    }

    // Assignee filter
    if (selectedAssignees.length > 0) {
      filtered = filtered.filter((task) =>
        task.assignments?.some((assignment) => selectedAssignees.includes(assignment.user.id))
      );
    }

    // Due date filter
    if (dueDateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const monthEnd = new Date(today);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      filtered = filtered.filter((task) => {
        if (!task.dueDate) {
          return dueDateFilter === 'no-date';
        }

        const dueDate = new Date(task.dueDate);
        const isOverdue = dueDate < today && task.status !== 'DONE';

        switch (dueDateFilter) {
          case 'overdue':
            return isOverdue;
          case 'today':
            return dueDate >= today && dueDate < tomorrow;
          case 'this-week':
            return dueDate >= today && dueDate < weekEnd;
          case 'this-month':
            return dueDate >= today && dueDate < monthEnd;
          case 'no-date':
            return false;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allTasks, searchQuery, selectedPriorities, selectedStatuses, selectedAssignees, dueDateFilter]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPriorities.length > 0) count += selectedPriorities.length;
    if (selectedStatuses.length > 0) count += selectedStatuses.length;
    if (selectedAssignees.length > 0) count += selectedAssignees.length;
    if (dueDateFilter !== 'all') count += 1;
    return count;
  }, [selectedPriorities, selectedStatuses, selectedAssignees, dueDateFilter]);

  // Early returns AFTER all hooks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data?.project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            aria-label="Back to Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const project = data.project;
  
  // Debug: Log to see what we're getting
  console.log('=== PROJECT DETAIL DEBUG ===');
  console.log('Project data:', project);
  console.log('TaskLists:', project.taskLists);
  console.log('Direct tasks:', project.tasks);
  console.log('All tasks (combined):', allTasks);
  console.log('All tasks count:', allTasks.length);
  if (allTasks.length > 0) {
    console.log('First task sample:', allTasks[0]);
    console.log('Task statuses:', allTasks.map(t => ({ id: t.id, title: t.title, status: t.status })));
  }
  console.log('===========================');

  // Filter handlers
  const handlePriorityToggle = (priority: TaskPriority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const handleStatusToggle = (status: TaskStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleAssigneeToggle = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedAssignees([]);
    setDueDateFilter('all');
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleTaskMove = async (
    taskId: string,
    newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE',
    newOrder: number
  ) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        data: {
          status: newStatus,
          order: newOrder,
        },
      });
    } catch (error) {
      console.error('Failed to move task:', error);
      // Optionally show error toast
    }
  };

  return (
    <div className="min-h-screen">
      <header className="header-gradient shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left side: Back button and Project info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => navigate('/dashboard')}
                aria-label="Back to Dashboard"
                title="Back to Dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white drop-shadow-lg truncate">{project.name}</h1>
                {project.description && (
                  <p className="text-white/80 text-sm mt-1 truncate">{project.description}</p>
                )}
              </div>
            </div>
            
            {/* Right side: Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                title="Add new task"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '120px',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Task</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsSettingsModalOpen(true);
                }}
                title="Project settings"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={() => setIsMemberModalOpen(true)}
                title="Manage members"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              <div style={{ marginLeft: '4px', display: 'flex', alignItems: 'center' }}>
                <NotificationBell />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPriorities={selectedPriorities}
          onPriorityToggle={handlePriorityToggle}
          selectedStatuses={selectedStatuses}
          onStatusToggle={handleStatusToggle}
          selectedAssignees={selectedAssignees}
          onAssigneeToggle={handleAssigneeToggle}
          dueDateFilter={dueDateFilter}
          onDueDateFilterChange={setDueDateFilter}
          assignees={assignees}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />
        
        {filteredTasks.length === 0 && allTasks.length > 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks match your filters</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onTaskEdit={handleTaskClick}
            onTaskMove={handleTaskMove}
          />
        )}

        {/* Activity Log Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowActivityLog(!showActivityLog)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Activity Log
            <svg
              className={`w-4 h-4 transition-transform ${showActivityLog ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showActivityLog && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              {id && <ActivityLog projectId={id} limit={30} />}
            </div>
          )}
        </div>
      </main>

      {id && (
        <>
          <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            onClose={() => setIsCreateTaskModalOpen(false)}
            projectId={id}
          />
          <EditTaskModal
            isOpen={!!editingTask}
            onClose={() => setEditingTask(null)}
            task={editingTask}
          />
          <MemberManagementModal
            isOpen={isMemberModalOpen}
            onClose={() => setIsMemberModalOpen(false)}
            projectId={id}
          />
          {data?.project && (
            <ProjectSettingsModal
              isOpen={isSettingsModalOpen}
              onClose={() => setIsSettingsModalOpen(false)}
              project={data.project}
            />
          )}
        </>
      )}
    </div>
  );
}