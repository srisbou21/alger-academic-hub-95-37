
import { useState, useEffect } from 'react';

interface UseOfflineStorageProps<T> {
  key: string;
  defaultValue: T;
  syncInterval?: number;
}

export const useOfflineStorage = <T>({
  key,
  defaultValue,
  syncInterval = 30000 // 30 seconds
}: UseOfflineStorageProps<T>) => {
  const [data, setData] = useState<T>(defaultValue);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    // Load initial data from localStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [key]);

  const updateData = (newData: T) => {
    setData(newData);
    try {
      localStorage.setItem(key, JSON.stringify(newData));
      setLastSync(new Date());
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const syncData = async (syncFunction: () => Promise<T>) => {
    if (!isOnline) {
      console.log('Cannot sync while offline');
      return;
    }

    try {
      const syncedData = await syncFunction();
      updateData(syncedData);
      setLastSync(new Date());
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  return {
    data,
    updateData,
    syncData,
    isOnline,
    lastSync
  };
};
