import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useUpdateProject, useDeleteProject } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../services/project.service';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Indigo', value: '#6366F1' },
];

export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
}: ProjectSettingsModalProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  useEffect(() => {
    if (isOpen && project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setColor(project.color || '#3B82F6');
      setError('');
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  }, [isOpen, project?.id, project?.name]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await updateProject.mutateAsync({
        id: project.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          color,
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== (project?.name || '')) {
      setError('Project name must match exactly to confirm deletion');
      return;
    }

    try {
      await deleteProject.mutateAsync(project?.id || '');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    }
  };

  if (!isOpen || !project) {
    return null;
  }

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 99998,
        }}
        onClick={() => {
          if (!updateProject.isPending && !deleteProject.isPending) {
            onClose();
          }
        }}
      />
      
      {/* Modal Container */}
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          width: '100%',
          maxWidth: '42rem',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflowY: 'auto',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Project Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center"
            disabled={updateProject.isPending || deleteProject.isPending}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!showDeleteConfirm ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project name"
                  required
                  disabled={updateProject.isPending}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter project description"
                  disabled={updateProject.isPending}
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Color
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {COLOR_OPTIONS.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => setColor(colorOption.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        color === colorOption.value
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: colorOption.value }}
                      title={colorOption.name}
                      disabled={updateProject.isPending}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  disabled={updateProject.isPending || deleteProject.isPending}
                >
                  Delete Project
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={updateProject.isPending || deleteProject.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updateProject.isPending || deleteProject.isPending}
                  >
                    {updateProject.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">⚠️ Delete Project</h3>
                <p className="text-red-700 mb-4">
                  This action cannot be undone. This will permanently delete the project, all tasks, comments, attachments, and member associations.
                </p>
                <div className="mb-4">
                  <label htmlFor="deleteConfirm" className="block text-sm font-medium text-red-900 mb-2">
                    Type <strong>{project?.name || ''}</strong> to confirm:
                  </label>
                  <input
                    id="deleteConfirm"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder={project?.name || ''}
                    disabled={deleteProject.isPending}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                      setError('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={deleteProject.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleteProject.isPending || deleteConfirmText !== (project?.name || '')}
                  >
                    {deleteProject.isPending ? 'Deleting...' : 'Delete Project'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

