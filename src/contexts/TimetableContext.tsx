
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TimetableContextType {
  selectedTimetable: string | null;
  setSelectedTimetable: (id: string | null) => void;
  timetables: any[];
  setTimetables: (timetables: any[]) => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTimetable, setSelectedTimetable] = useState<string | null>(null);
  const [timetables, setTimetables] = useState<any[]>([]);

  return (
    <TimetableContext.Provider value={{
      selectedTimetable,
      setSelectedTimetable,
      timetables,
      setTimetables
    }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
