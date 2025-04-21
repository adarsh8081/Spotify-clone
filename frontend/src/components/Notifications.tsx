import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon } from '@heroicons/react/solid';

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'share';
  message: string;
  userId: string;
  username: string;
  profileImage: string;
  timestamp: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-400 hover:text-white"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-green-500 hover:text-green-400"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${
                      !notification.read ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={notification.profileImage}
                        alt={notification.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">{notification.username}</span>{' '}
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications; 