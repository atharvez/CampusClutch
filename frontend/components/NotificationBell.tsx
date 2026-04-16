'use client';
import { useState, useEffect, useRef } from 'react';
import { fetcher } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getNotifications = async () => {
    try {
      const data = await fetcher('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      getNotifications();
      // Poll for notifications every 30 seconds
      const interval = setInterval(getNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetcher(`/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleReadAll = async () => {
    try {
      await fetcher('/notifications/read-all', { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant"
      >
        <span className="material-symbols-outlined text-2xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[8px] font-bold flex items-center justify-center rounded-full ring-2 ring-surface">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-primary/10 ring-1 ring-on-surface-variant/10 overflow-hidden z-50 overflow-y-auto max-h-[400px]"
          >
            <div className="px-6 py-4 border-b border-surface-container-low flex justify-between items-center bg-white/50">
              <h3 className="font-bold text-sm text-on-surface">Notifications</h3>
              <button 
                onClick={handleReadAll}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
              >
                Mark all read
              </button>
            </div>

            <div className="divide-y divide-surface-container-low">
              {notifications.length === 0 ? (
                <div className="p-10 text-center opacity-30">
                  <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                  <p className="text-xs font-bold">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => handleMarkAsRead(n._id)}
                    className={`px-6 py-4 flex gap-4 cursor-pointer transition-colors ${n.isRead ? 'opacity-60 grayscale-[0.5]' : 'bg-primary/5 hover:bg-primary/10'}`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high">
                      <img 
                        src={n.sender.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(n.sender.name)}&background=random`} 
                        alt={n.sender.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-on-surface leading-snug font-medium">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-on-surface-variant opacity-60">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
