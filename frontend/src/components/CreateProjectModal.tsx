import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useCreateProject } from '../hooks/useProjects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
];

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0].value);
  const [error, setError] = useState('');

  const createProject = useCreateProject();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      });
      
      // Reset form
      setName('');
      setDescription('');
      setColor(PROJECT_COLORS[0].value);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    }
  };

  const handleClose = () => {
    if (!createProject.isPending) {
      setName('');
      setDescription('');
      setColor(PROJECT_COLORS[0].value);
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop with blur effect */}
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
          transition: 'opacity 0.2s ease-in-out'
        }}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 99999,
          padding: '1rem'
        }}
      >
        {/* Modal Content */}
        <div 
          style={{
            pointerEvents: 'auto',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transform: 'scale(1)',
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
              padding: '1.5rem',
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem'
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.75rem',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Create New Project</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-white transition-colors rounded-lg flex items-center justify-center"
                disabled={createProject.isPending}
                aria-label="Close modal"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '6px'
                }}
                onMouseEnter={(e) => {
                  if (!createProject.isPending) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!createProject.isPending) {
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
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div 
                  className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg"
                  style={{
                    animation: 'slideIn 0.3s ease-out'
                  }}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="My Awesome Project"
                  autoFocus
                  style={{
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="What's this project about?"
                  style={{
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose a Color Theme
                </label>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem'
                  }}
                >
                  {PROJECT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className="transition-all"
                      style={{
                        width: '100%',
                        height: '3rem',
                        borderRadius: '0.75rem',
                        backgroundColor: c.value,
                        border: color === c.value ? '3px solid #1f2937' : '2px solid #e5e7eb',
                        transform: color === c.value ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: color === c.value 
                          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      title={c.name}
                    >
                      {color === c.value && (
                        <svg 
                          className="absolute top-1/2 left-1/2 w-6 h-6 text-white"
                          style={{
                            transform: 'translate(-50%, -50%)'
                          }}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                  disabled={createProject.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProject.isPending || !name.trim()}
                  className="flex-1 px-6 py-3 font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: createProject.isPending || !name.trim() 
                      ? '#cbd5e1' 
                      : 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                    color: 'white',
                    transform: createProject.isPending ? 'scale(0.98)' : 'scale(1)'
                  }}
                >
                  {createProject.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    '✨ Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );

  const modalRoot = document.getElementById('modal-root') || document.body;
  
  return ReactDOM.createPortal(modalContent, modalRoot);
}