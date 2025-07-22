
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Space, Reservation, Conflict } from '../types/reservation';
import { reservationService } from '../services/reservationService';

interface ReservationContextType {
  spaces: Space[];
  reservations: Reservation[];
  conflicts: Conflict[];
  isLoading: boolean;
  error: string | null;
  createReservation: (data: Partial<Reservation>) => Promise<void>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  loadSpaces: () => Promise<void>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const createReservation = useCallback(async (data: Partial<Reservation>) => {
    setIsLoading(true);
    try {
      const newReservation: Reservation = {
        ...data,
        id: `res_${Date.now()}`,
        status: 'pending',
        validationHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Reservation;
      setReservations(prev => [...prev, newReservation]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReservation = useCallback(async (id: string, updates: Partial<Reservation>) => {
    setReservations(prev =>
      prev.map(res =>
        res.id === id ? { ...res, ...updates, updatedAt: new Date() } : res
      )
    );
  }, []);

  const deleteReservation = useCallback(async (id: string) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  }, []);

  const value: ReservationContextType = {
    spaces,
    reservations,
    conflicts,
    isLoading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    loadSpaces,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};
