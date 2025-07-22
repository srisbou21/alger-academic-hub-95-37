
import { useState, useCallback } from 'react';

interface StatisticsData {
  id: string;
  type: 'students' | 'academic' | 'personnel' | 'financial';
  data: any;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'saved' | 'validated' | 'exported';
  metadata?: {
    department?: string;
    period?: string;
    author?: string;
    tags?: string[];
  };
}

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<StatisticsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveStatistics = useCallback(async (type: StatisticsData['type'], data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newStat: StatisticsData = {
        id: Date.now().toString(),
        type,
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'saved',
        metadata: {
          department: data.department || 'general',
          period: data.date || new Date().toISOString().split('T')[0],
          author: 'current_user',
          tags: [type, data.department || 'general']
        }
      };
      
      setStatistics(prev => [...prev, newStat]);
      
      // Simulation d'une sauvegarde en base
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Statistiques ${type} sauvegardées:`, newStat);
      return newStat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatistics = useCallback(async (id: string, data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setStatistics(prev => 
        prev.map(stat => 
          stat.id === id 
            ? { 
                ...stat, 
                data, 
                updatedAt: new Date(),
                status: 'saved' as const,
                metadata: {
                  ...stat.metadata,
                  department: data.department || stat.metadata?.department,
                  period: data.date || stat.metadata?.period
                }
              }
            : stat
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Statistiques ${id} mises à jour`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteStatistics = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setStatistics(prev => prev.filter(stat => stat.id !== id));
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`Statistiques ${id} supprimées`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportStatistics = useCallback(async (format: 'excel' | 'csv' | 'pdf' = 'excel', filters?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let filteredStats = statistics;
      
      if (filters) {
        filteredStats = statistics.filter(stat => {
          if (filters.type && stat.type !== filters.type) return false;
          if (filters.department && stat.metadata?.department !== filters.department) return false;
          if (filters.dateFrom && new Date(stat.createdAt) < new Date(filters.dateFrom)) return false;
          if (filters.dateTo && new Date(stat.createdAt) > new Date(filters.dateTo)) return false;
          return true;
        });
      }
      
      const exportData = {
        statistics: filteredStats,
        exportDate: new Date(),
        format,
        totalRecords: filteredStats.length,
        summary: {
          byType: {
            students: filteredStats.filter(s => s.type === 'students').length,
            academic: filteredStats.filter(s => s.type === 'academic').length,
            personnel: filteredStats.filter(s => s.type === 'personnel').length,
            financial: filteredStats.filter(s => s.type === 'financial').length,
          }
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Export des statistiques:', exportData);
      return exportData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'export');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [statistics]);

  const getStatisticsByType = useCallback((type: StatisticsData['type']) => {
    return statistics.filter(stat => stat.type === type);
  }, [statistics]);

  const getStatisticsByDepartment = useCallback((department: string) => {
    return statistics.filter(stat => stat.metadata?.department === department);
  }, [statistics]);

  const validateStatistics = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      setStatistics(prev => 
        prev.map(stat => 
          stat.id === id 
            ? { ...stat, status: 'validated' as const, updatedAt: new Date() }
            : stat
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Statistiques ${id} validées`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la validation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    statistics,
    isLoading,
    error,
    saveStatistics,
    updateStatistics,
    deleteStatistics,
    exportStatistics,
    getStatisticsByType,
    getStatisticsByDepartment,
    validateStatistics
  };
};
