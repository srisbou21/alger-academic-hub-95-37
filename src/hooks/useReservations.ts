import { useState, useCallback, useMemo } from 'react';
import { Reservation, Conflict } from '../types/reservation';

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'res_001',
      spaceId: 'space_001',
      spaceName: 'Amphithéâtre A',
      requester: {
        name: 'Dr. Martin Dubois',
        contact: 'martin.dubois@université.fr',
        phone: '+33 1 23 45 67 89'
      },
      type: 'course',
      purpose: 'Cours de Programmation Avancée',
      description: 'Cours magistral sur les algorithmes avancés et structures de données',
      participants: 85,
      dateTime: {
        start: new Date(2024, 11, 20, 9, 0),
        end: new Date(2024, 11, 20, 11, 0)
      },
      equipment: ['projecteur', 'micro'],
      priority: 2,
      status: 'confirmed',
      validationHistory: [],
      createdAt: new Date(2024, 11, 15),
      updatedAt: new Date(2024, 11, 15)
    },
    {
      id: 'res_002',
      spaceId: 'space_002',
      spaceName: 'Salle 101',
      requester: {
        name: 'Prof. Sophie Bernard',
        contact: 'sophie.bernard@université.fr',
        phone: '+33 1 23 45 67 90'
      },
      type: 'exam',
      purpose: 'Examen Final Calcul Différentiel',
      description: 'Examen de fin de semestre',
      participants: 35,
      dateTime: {
        start: new Date(2024, 11, 22, 14, 0),
        end: new Date(2024, 11, 22, 17, 0)
      },
      equipment: [],
      priority: 1,
      status: 'pending',
      validationHistory: [],
      createdAt: new Date(2024, 11, 18),
      updatedAt: new Date(2024, 11, 18)
    },
    {
      id: 'res_003',
      spaceId: 'space_004',
      spaceName: 'Salle de Réunion Executive',
      requester: {
        name: 'Dr. Jean Leclerc',
        contact: 'jean.leclerc@université.fr',
        phone: '+33 1 23 45 67 91'
      },
      type: 'meeting',
      purpose: 'Réunion Conseil Pédagogique',
      description: 'Réunion mensuelle du conseil pédagogique',
      participants: 10,
      dateTime: {
        start: new Date(2024, 11, 21, 10, 0),
        end: new Date(2024, 11, 21, 12, 0)
      },
      equipment: ['visioconférence', 'écran tactile'],
      priority: 1,
      status: 'confirmed',
      validationHistory: [],
      createdAt: new Date(2024, 11, 16),
      updatedAt: new Date(2024, 11, 16)
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = useCallback(async (data: Partial<Reservation>) => {
    setIsLoading(true);
    setError(null);
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
      return newReservation;
    } catch (err) {
      setError('Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReservation = useCallback(async (id: string, updates: Partial<Reservation>) => {
    setIsLoading(true);
    try {
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, ...updates, updatedAt: new Date() } : res
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteReservation = useCallback(async (id: string) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  }, []);

  const detectConflicts = useCallback((reservation: Reservation): Conflict[] => {
    return reservations
      .filter(existing => 
        existing.spaceId === reservation.spaceId &&
        existing.status !== 'cancelled' &&
        existing.id !== reservation.id &&
        timeOverlap(existing.dateTime, reservation.dateTime)
      )
      .map(conflicting => ({
        id: `conflict_${Date.now()}_${Math.random()}`,
        type: 'time_overlap',
        severity: 'high',
        space: reservation.spaceName || 'Espace inconnu',
        reservations: [
          {
            id: conflicting.id,
            purpose: conflicting.purpose,
            requester: conflicting.requester.name,
            time: `${conflicting.dateTime.start.toLocaleTimeString()} - ${conflicting.dateTime.end.toLocaleTimeString()}`,
            participants: conflicting.participants
          },
          {
            id: reservation.id,
            purpose: reservation.purpose,
            requester: reservation.requester.name,
            time: `${reservation.dateTime.start.toLocaleTimeString()} - ${reservation.dateTime.end.toLocaleTimeString()}`,
            participants: reservation.participants
          }
        ],
        date: reservation.dateTime.start.toISOString().split('T')[0],
        resolved: false,
        suggestions: ['Changer l\'heure', 'Choisir un autre espace', 'Réduire la durée']
      }));
  }, [reservations]);

  const timeOverlap = (time1: { start: Date; end: Date }, time2: { start: Date; end: Date }): boolean => {
    return (
      (time1.start >= time2.start && time1.start < time2.end) ||
      (time1.end > time2.start && time1.end <= time2.end) ||
      (time1.start <= time2.start && time1.end >= time2.end)
    );
  };

  const stats = useMemo(() => ({
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }), [reservations]);

  return {
    reservations,
    isLoading,
    error,
    stats,
    createReservation,
    updateReservation,
    deleteReservation,
    detectConflicts,
  };
};