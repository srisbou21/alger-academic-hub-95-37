
import { useState, useEffect } from 'react';
import { Notification } from '../types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const sendNotification = (notification: Omit<Notification, 'id' | 'status' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Simulate sending notification
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(n => 
          n.id === newNotification.id 
            ? { ...n, status: 'sent' }
            : n
        )
      );
    }, 1000);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return {
    notifications,
    sendNotification,
    markAsRead
  };
};
