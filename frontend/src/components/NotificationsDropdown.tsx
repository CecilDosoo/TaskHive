import { createPortal } from 'react-dom';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../hooks/useNotifications';
import { useSocket } from '../context/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Notification } from '../services/notification.service';

interface NotificationsDropdownProps {
  onClose: () => void;
  position: { top: number; right: number };
}

export default function NotificationsDropdown({ onClose, position }: NotificationsDropdownProps) {
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const notifications = data?.notifications || [];
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  // Listen for real-time notification events
  useEffect(() => {
    if (!socket) return;

    const handleNotificationCreated = (notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    };

    const handleNotificationRead = ({ id }: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    };

    const handleNotificationsAllRead = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    };

    const handleNotificationDeleted = ({ id }: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    };

    socket.on('notification:created', handleNotificationCreated);
    socket.on('notification:read', handleNotificationRead);
    socket.on('notifications:allRead', handleNotificationsAllRead);
    socket.on('notification:deleted', handleNotificationDeleted);

    return () => {
      socket.off('notification:created', handleNotificationCreated);
      socket.off('notification:read', handleNotificationRead);
      socket.off('notifications:allRead', handleNotificationsAllRead);
      socket.off('notification:deleted', handleNotificationDeleted);
    };
  }, [socket, queryClient]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead.mutateAsync(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification.mutateAsync(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '📋';
      case 'comment':
        return '💬';
      case 'project_invite':
        return '👥';
      case 'role_updated':
        return '🔑';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const dropdownContent = (
    <div
      data-notification-dropdown
      className="fixed w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col overflow-hidden"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header */}
      <div 
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <h3 className="text-lg font-bold text-white">Notifications</h3>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="text-sm text-white/90 hover:text-white font-medium disabled:opacity-50 transition-colors px-3 py-1 rounded-lg hover:bg-white/20"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 bg-gray-50">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-5xl mb-3">🔔</div>
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <div>
                <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Unread ({unreadNotifications.length})</span>
                </div>
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-5 py-4 bg-white border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    style={{ borderLeft: '4px solid #3b82f6' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-900">{notification.title}</p>
                          <button
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1 rounded hover:bg-red-50 transition-colors"
                            aria-label="Delete notification"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {readNotifications.length > 0 && (
              <div>
                <div className="px-5 py-2.5 bg-gray-100 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Read</span>
                </div>
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-5 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors opacity-70"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0 mt-0.5 opacity-60">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-700">{notification.title}</p>
                          <button
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1 rounded hover:bg-red-50 transition-colors"
                            aria-label="Delete notification"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(dropdownContent, document.body);
}

