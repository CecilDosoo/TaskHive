import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateTask, useDeleteTask, useAssignTask, useUnassignTask } from '../hooks/useTasks';
import { useComments, useCreateComment, useDeleteComment } from '../hooks/useComments';
import { useAttachments, useUploadAttachment, useDeleteAttachment } from '../hooks/useAttachments';
import { useProjectMembers } from '../hooks/useMembers';
import { useAuth } from '../context/AuthContext';
import { useProjectPermissions } from '../hooks/usePermissions';
import { attachmentService } from '../services/attachment.service';
import type { Task, TaskPriority } from '../services/task.service';
import type { Comment } from '../services/comment.service';
import type { Attachment } from '../services/attachment.service';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const PRIORITIES: { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' },
];

export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [error, setError] = useState('');

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const assignTask = useAssignTask();
  const unassignTask = useUnassignTask();
  const { user } = useAuth();
  const permissions = useProjectPermissions(task?.projectId);
  const { data: membersData } = useProjectMembers(task?.projectId);
  
  // Safely fetch comments and attachments with error handling
  const { 
    data: commentsData, 
    isLoading: commentsLoading,
    error: commentsError 
  } = useComments(task?.id);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const [newComment, setNewComment] = useState('');
  
  const { 
    data: attachmentsData, 
    isLoading: attachmentsLoading,
    error: attachmentsError 
  } = useAttachments(task?.id);
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();
  const [uploading, setUploading] = useState(false);

  const comments = commentsData?.comments || [];
  const attachments = attachmentsData?.attachments || [];
  const projectMembers = membersData?.members || [];
  const assignedUserIds = new Set(task?.assignments?.map(a => a.userId) || []);

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setStatus(task.status);
      setError('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!task) return;

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          dueDate: dueDate || undefined,
          status,
        },
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteTask.mutateAsync(task.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleClose = () => {
    if (!updateTask.isPending && !deleteTask.isPending) {
      setError('');
      setNewComment('');
      onClose();
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newComment.trim()) return;

    try {
      await createComment.mutateAsync({
        taskId: task.id,
        data: { content: newComment.trim() },
      });
      setNewComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment.mutateAsync(commentId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!task || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      await uploadAttachment.mutateAsync({
        taskId: task.id,
        file,
      });
      // Reset file input
      e.target.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return;

    try {
      await deleteAttachment.mutateAsync(attachmentId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete attachment');
    }
  };

  if (!isOpen || !task) {
    return null;
  }

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={handleClose}
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark semi-transparent backdrop
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 1000000,
          backgroundColor: '#ffffff', /* Force white */
        }}
      >
        {/* Header with gradient */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem'
          }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Edit Task</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-white transition-colors rounded-lg flex items-center justify-center"
              disabled={updateTask.isPending || deleteTask.isPending}
              aria-label="Close modal"
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '6px'
              }}
              onMouseEnter={(e) => {
                if (!updateTask.isPending && !deleteTask.isPending) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!updateTask.isPending && !deleteTask.isPending) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 3 }}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6" style={{ maxHeight: 'calc(90vh - 10rem)', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {!permissions.canEditTask && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
                You have view-only access. You cannot edit this task.
              </div>
            )}

            <div>
              <label htmlFor="edit-title" className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={!permissions.canEditTask}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter task title"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={!permissions.canEditTask}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Add task description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-priority" className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="edit-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  disabled={!permissions.canEditTask}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="edit-dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  id="edit-dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={!permissions.canEditTask}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')
                }
                disabled={!permissions.canEditTask}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="TODO">📋 To Do</option>
                <option value="IN_PROGRESS">🚀 In Progress</option>
                <option value="DONE">✅ Done</option>
              </select>
            </div>

            {/* Task Assignments Section */}
            {permissions.canAssignTask && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Assignees
                </label>
                <div className="max-h-48 overflow-y-auto">
                  {projectMembers.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">No members available</div>
                  ) : (
                    projectMembers.map((member) => {
                      const isAssigned = assignedUserIds.has(member.id);
                      const isCurrentUser = member.id === user?.id;

                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 rounded-lg hover:bg-gray-50 transition border border-gray-100"
                          style={{ 
                            padding: '1rem',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={async (e) => {
                              e.stopPropagation();
                              if (!task) return;
                              setError('');
                              const newChecked = e.target.checked;
                              try {
                                if (newChecked) {
                                  await assignTask.mutateAsync({
                                    taskId: task.id,
                                    userId: member.id,
                                  });
                                } else {
                                  await unassignTask.mutateAsync({
                                    taskId: task.id,
                                    userId: member.id,
                                  });
                                }
                                // Force refresh of task data
                                queryClient.invalidateQueries({ queryKey: ['project', task.projectId] });
                              } catch (err: any) {
                                setError(err.message || 'Failed to update assignment');
                                // Revert checkbox state on error
                                e.target.checked = !newChecked;
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            disabled={assignTask.isPending || unassignTask.isPending}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                              {isCurrentUser && ' (You)'}
                              <span className="text-gray-600 font-normal">: {member.role === 'OWNER' ? 'Owner' : member.role === 'ADMIN' ? 'Admin' : member.role === 'MEMBER' ? 'Member' : member.role === 'VIEWER' ? 'Viewer' : member.role}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {task?.assignments && task.assignments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {task.assignments.length} {task.assignments.length === 1 ? 'person' : 'people'} assigned
                    </p>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Comments Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">💬</span>
              Comments
            </h3>

            {/* Comments List */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {commentsError ? (
                <div className="text-center text-red-600 py-4 bg-red-50 rounded-xl font-medium">
                  Failed to load comments
                </div>
              ) : commentsLoading ? (
                <div className="text-center text-gray-600 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment: Comment) => (
                  <div key={comment.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {comment.user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 ml-10">{comment.content}</p>
                      </div>
                      {((comment.userId === user?.id && permissions.canDeleteOwnComment) || permissions.canDeleteAnyComment) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-2 text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded transition-all"
                          title="Delete comment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            {permissions.canAddComment && (
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || createComment.isPending}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
                >
                  {createComment.isPending ? 'Posting...' : '📝 Post Comment'}
                </button>
              </form>
            )}
          </div>

          {/* Attachments Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📎</span>
              Attachments
            </h3>

            {/* Attachments List */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {attachmentsError ? (
                <div className="text-center text-red-500 py-4 text-sm">Failed to load attachments</div>
              ) : attachmentsLoading ? (
                <div className="text-center text-gray-500 py-4">Loading attachments...</div>
              ) : attachments.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No attachments yet.</div>
              ) : (
                attachments.map((attachment: Attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={attachmentService.getFileUrl(attachment.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
                        >
                          {attachment.filename}
                        </a>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(attachment.fileSize)} • {formatDate(attachment.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    {permissions.canDeleteAttachment && (
                      <button
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                        title="Delete attachment"
                        disabled={deleteAttachment.isPending}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Upload Attachment */}
            {permissions.canUploadAttachment && (
              <div>
                <label className="block">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading || !task}
                    className="hidden"
                    accept="*/*"
                    id="file-upload-input"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('file-upload-input') as HTMLInputElement;
                        input?.click();
                      }}
                      disabled={uploading || !task}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {uploading ? 'Uploading...' : '📤 Upload File (Max 10MB)'}
                    </button>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons - At Bottom */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 pb-8 mb-4 bg-white">
            {permissions.canDeleteTask && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={updateTask.isPending || deleteTask.isPending}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all disabled:bg-red-300 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
              >
                {deleteTask.isPending ? 'Deleting...' : '🗑️ Delete'}
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
              disabled={updateTask.isPending || deleteTask.isPending}
            >
              Cancel
            </button>
            {permissions.canEditTask && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={updateTask.isPending || deleteTask.isPending || !title.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
              >
                {updateTask.isPending ? 'Saving...' : '💾 Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}