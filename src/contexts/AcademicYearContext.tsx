
import React, { createContext, useContext } from 'react';
import { useAcademicYearState, AcademicYearContext } from '../hooks/useAcademicYear';

interface AcademicYearProviderProps {
  children: React.ReactNode;
}

export const AcademicYearProvider: React.FC<AcademicYearProviderProps> = ({ children }) => {
  const academicYearState = useAcademicYearState();

  return (
    <AcademicYearContext.Provider value={academicYearState}>
      {children}
    </AcademicYearContext.Provider>
  );
};

export const useAcademicYear = () => {
  const context = useContext(AcademicYearContext);
  if (!context) {
    throw new Error('useAcademicYear must be used within an AcademicYearProvider');
  }
  return context;
};
