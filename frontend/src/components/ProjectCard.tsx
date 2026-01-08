import { useNavigate } from 'react-router-dom';
import type { Project } from '../services/project.service';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const taskCount = project._count?.tasks || 0;
  const memberCount = project.members.length;

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="project-card card-hover"
      style={{ 
        borderLeftColor: project.color || '#3B82F6', 
        borderLeftWidth: '6px',
        borderLeftStyle: 'solid'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.name}</h3>
          {project.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
          )}
        </div>
        <div
          className="w-6 h-6 rounded-full flex-shrink-0 ml-2 shadow-md"
          style={{ 
            backgroundColor: project.color || '#3B82F6',
            border: `2px solid ${project.color || '#3B82F6'}`,
            boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {memberCount} {memberCount === 1 ? 'member' : 'members'}
          </span>
        </div>
        <span className="text-xs">
          {new Date(project.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

