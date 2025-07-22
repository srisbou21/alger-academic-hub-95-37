
import { useState, useEffect, createContext, useContext } from 'react';
import { academicYearService, AcademicYear } from '../services/academicYearService';

interface AcademicYearContextType {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  activeYear: AcademicYear | null;
  availableYears: AcademicYear[];
  loading: boolean;
  refreshYears: () => Promise<void>;
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined);

export const useAcademicYear = () => {
  const context = useContext(AcademicYearContext);
  if (!context) {
    throw new Error('useAcademicYear must be used within an AcademicYearProvider');
  }
  return context;
};

export const useAcademicYearState = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [activeYear, setActiveYear] = useState<AcademicYear | null>(null);
  const [availableYears, setAvailableYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshYears = async () => {
    setLoading(true);
    try {
      const [years, active] = await Promise.all([
        academicYearService.getAcademicYears(),
        academicYearService.getActiveAcademicYear()
      ]);
      
      setAvailableYears(years);
      setActiveYear(active);
      
      // Si aucune année n'est sélectionnée, utiliser l'année active
      if (!selectedYear && active) {
        setSelectedYear(active.year);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des années:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshYears();
  }, []);

  return {
    selectedYear,
    setSelectedYear,
    activeYear,
    availableYears,
    loading,
    refreshYears
  };
};

export { AcademicYearContext };
