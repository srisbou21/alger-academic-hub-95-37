import React, { useState } from 'react';
import { CalendarView } from './CalendarView';
import { DaySchedule } from './DaySchedule';
import { useSpaces } from '../../hooks/useSpaces';
import { useReservations } from '../../hooks/useReservations';
import { Space } from '../../types/reservation';

export const ReservationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { spaces } = useSpaces();
  const reservations = useReservations();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CalendarView
          onDateSelect={setSelectedDate}
          onSpaceSelect={setSelectedSpace}
          selectedDate={selectedDate}
          selectedSpace={selectedSpace}
        />
      </div>
      <div>
        {selectedSpace && selectedDate && (
          <DaySchedule
            space={selectedSpace}
            date={selectedDate}
            onCreateReservation={(timeSlot) => {
              // Logique pour créer une réservation
              console.log('Créer réservation:', timeSlot);
            }}
            onEditReservation={(reservation) => {
              // Logique pour éditer une réservation
              console.log('Éditer réservation:', reservation);
            }}
            onDeleteReservation={(id) => {
              reservations.deleteReservation(id);
            }}
          />
        )}
      </div>
    </div>
  );
};