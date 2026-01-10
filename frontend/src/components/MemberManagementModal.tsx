import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjectMembers, useInviteMember, useUpdateMemberRole, useRemoveMember, useLeaveProject } from '../hooks/useMembers';
import { useProjectPermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';

interface MemberManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const ROLE_OPTIONS: { label: string; value: 'ADMIN' | 'MEMBER' | 'VIEWER' }[] = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Member', value: 'MEMBER' },
  { label: 'Viewer', value: 'VIEWER' },
];

export default function MemberManagementModal({ isOpen, onClose, projectId }: MemberManagementModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const permissions = useProjectPermissions(projectId);
  const { data: membersData, isLoading, error: membersError } = useProjectMembers(projectId);
  const inviteMember = useInviteMember();
  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();
  const leaveProject = useLeaveProject();

  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);

  const members = membersData?.members || [];

  // Search users by email
  const { data: searchResults, isLoading: searchingUsers } = useQuery({
    queryKey: ['user-search', inviteEmail],
    queryFn: () => userService.searchUsers(inviteEmail),
    enabled: inviteEmail.length >= 3 && showUserSearch,
  });

  const searchUsers = searchResults?.users || [];
  const existingMemberIds = new Set(members.map((m) => m.id));

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedUserId) {
      setError('Please select a user from the search results');
      return;
    }

    try {
      await inviteMember.mutateAsync({
        projectId,
        data: {
          userId: selectedUserId,
          role: inviteRole,
        },
      });
      setInviteEmail('');
      setSelectedUserId(null);
      setShowUserSearch(false);
    } catch (err: any) {
      setError(err.message || 'Failed to invite member');
    }
  };

  const handleEmailChange = (email: string) => {
    setInviteEmail(email);
    setSelectedUserId(null);
    setShowUserSearch(email.length >= 3);
  };

  const handleSelectUser = (userId: string, userEmail: string) => {
    setSelectedUserId(userId);
    setInviteEmail(userEmail);
    setShowUserSearch(false);
  };

  const handleUpdateRole = async (memberId: string, newRole: 'ADMIN' | 'MEMBER' | 'VIEWER') => {
    setError('');
    try {
      await updateMemberRole.mutateAsync({
        projectId,
        userId: memberId,
        data: { role: newRole },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this project?`)) {
      return;
    }

    setError('');
    try {
      await removeMember.mutateAsync({
        projectId,
        userId: memberId,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this project? You will lose access to all tasks and data.')) {
      return;
    }

    setError('');
    try {
      await leaveProject.mutateAsync(projectId);
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to leave project');
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUserMember = members.find((m) => m.id === user?.id);
  const isCurrentUserOwner = currentUserMember?.role === 'OWNER';

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 1000000,
          backgroundColor: '#ffffff',
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
            <h2 className="text-2xl font-bold text-white">👥 Project Members</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-white transition-colors rounded-lg flex items-center justify-center"
              aria-label="Close modal"
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 3 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6" style={{ maxHeight: 'calc(90vh - 10rem)', overflowY: 'auto' }}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Invite Member (Admin/Owner only) */}
          {permissions.canManageMembers && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Invite Member</h3>
              <form onSubmit={handleInvite} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Search by email address..."
                    value={inviteEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onFocus={() => setShowUserSearch(inviteEmail.length >= 3)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {showUserSearch && inviteEmail.length >= 3 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchingUsers ? (
                        <div className="p-3 text-center text-gray-500">Searching...</div>
                      ) : searchUsers.length === 0 ? (
                        <div className="p-3 text-center text-gray-500">No users found</div>
                      ) : (
                        <div className="py-1">
                          {searchUsers
                            .filter((user) => !existingMemberIds.has(user.id))
                            .map((user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => handleSelectUser(user.id, user.email)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </button>
                            ))}
                          {searchUsers.filter((user) => !existingMemberIds.has(user.id)).length === 0 && (
                            <div className="p-3 text-center text-gray-500 text-sm">
                              All found users are already members
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedUserId && (
                    <p className="text-xs text-green-600 mt-1">✓ User selected</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={inviteMember.isPending || !selectedUserId}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {inviteMember.isPending ? 'Inviting...' : 'Invite'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Members List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Members ({filteredMembers.length})
            </h3>
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">Loading members...</div>
            ) : membersError ? (
              <div className="text-center text-red-500 py-8">
                Error loading members. Please try again.
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No members found</div>
            ) : (
              <div>
                {filteredMembers.map((member, index) => {
                  const isCurrentUser = member.id === user?.id;
                  const canEdit = permissions.canManageMembers && !isCurrentUserOwner && member.role !== 'OWNER';
                  const canRemove = permissions.canManageMembers && !isCurrentUser && member.role !== 'OWNER';
                  const uniqueKey = `${member.id}-${index}`;

                  return (
                    <div
                      key={uniqueKey}
                      className="flex items-center justify-between bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-100"
                      style={{ 
                        padding: '1rem',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {member.name.trim()}
                          {isCurrentUser && ' (You)'}
                          <span className="text-gray-600 font-normal">: {member.role === 'OWNER' ? 'Owner' : member.role === 'ADMIN' ? 'Admin' : member.role === 'MEMBER' ? 'Member' : member.role === 'VIEWER' ? 'Viewer' : member.role}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleUpdateRole(member.id, e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER')
                            }
                            disabled={updateMemberRole.isPending}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          >
                            {ROLE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                        {canRemove && (
                          <button
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            disabled={removeMember.isPending}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
                            title="Remove member"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Leave Project Button (for non-owners) */}
          {!isCurrentUserOwner && currentUserMember && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLeave}
                disabled={leaveProject.isPending}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {leaveProject.isPending ? 'Leaving...' : 'Leave Project'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}