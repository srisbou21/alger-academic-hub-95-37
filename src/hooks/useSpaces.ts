import { useState, useEffect, useCallback, useMemo } from 'react';
import { Space } from '../types/reservation';
import { reservationService } from '../services/reservationService';

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: 0,
    equipment: [] as string[],
    building: '',
  });

  const loadSpaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reservationService.getSpaces();
      setSpaces(data);
    } catch (err) {
      setError('Erreur lors du chargement des espaces');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpaces();
  }, [loadSpaces]);

  const filteredSpaces = useMemo(() => {
    return spaces.filter(space => {
      if (filters.type && space.type !== filters.type) return false;
      if (filters.minCapacity && space.capacity < filters.minCapacity) return false;
      if (filters.building && space.location.building !== filters.building) return false;
      if (filters.equipment.length > 0) {
        const spaceEquipment = [
          ...space.equipment.multimedia,
          ...space.equipment.computer,
          ...space.equipment.specialized
        ];
        return filters.equipment.every(eq => spaceEquipment.includes(eq));
      }
      return true;
    });
  }, [spaces, filters]);

  const buildings = useMemo(() => {
    return [...new Set(spaces.map(space => space.location.building))];
  }, [spaces]);

  const equipment = useMemo(() => {
    const allEquipment = spaces.flatMap(space => [
      ...space.equipment.multimedia,
      ...space.equipment.computer,
      ...space.equipment.specialized
    ]);
    return [...new Set(allEquipment)];
  }, [spaces]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      type: '',
      minCapacity: 0,
      equipment: [],
      building: '',
    });
  }, []);

  return {
    spaces: filteredSpaces,
    allSpaces: spaces,
    selectedSpace,
    isLoading,
    error,
    filters,
    buildings,
    equipment,
    setSelectedSpace,
    updateFilters,
    clearFilters,
    loadSpaces,
  };
};