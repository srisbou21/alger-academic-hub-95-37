
import { useState, useEffect } from 'react';
import { Specialty, FormationOffer } from '../types/academic';
import { academicConfigService } from '../services/academicConfigService';

export const useSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formations, setFormations] = useState<FormationOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const loadedSpecialties = await academicConfigService.getSpecialties();
      const loadedFormations = await academicConfigService.getFormations();
      
      console.log('Spécialités chargées:', loadedSpecialties.length);
      console.log('Formations chargées:', loadedFormations.length);
      
      setSpecialties(loadedSpecialties);
      setFormations(loadedFormations);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addSpecialty = async (specialty: Specialty) => {
    try {
      await academicConfigService.addSpecialty(specialty);
      await loadData(); // Recharger toutes les données
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la spécialité:', error);
    }
  };

  const updateSpecialty = async (id: string, updates: Partial<Specialty>) => {
    try {
      await academicConfigService.updateSpecialty(id, updates);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la spécialité:', error);
    }
  };

  const deleteSpecialty = async (id: string) => {
    try {
      await academicConfigService.deleteSpecialty(id);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression de la spécialité:', error);
    }
  };

  const addFormation = async (formation: FormationOffer) => {
    try {
      await academicConfigService.addFormation(formation);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la formation:', error);
    }
  };

  const updateFormation = async (id: string, updates: Partial<FormationOffer>) => {
    try {
      await academicConfigService.updateFormation(id, updates);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation:', error);
    }
  };

  const deleteFormation = async (id: string) => {
    try {
      await academicConfigService.deleteFormation(id);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
    }
  };

  const getFormationsForSpecialty = async (specialtyId: string) => {
    return await academicConfigService.getFormationsBySpecialty(specialtyId);
  };

  const calculateSemesters = (durationInYears: number) => {
    return academicConfigService.calculateSemesters(durationInYears);
  };

  const getFormationsForAssignment = async () => {
    return await academicConfigService.getFormationsForAssignment();
  };

  return {
    specialties,
    formations,
    loading,
    addSpecialty,
    updateSpecialty,
    deleteSpecialty,
    addFormation,
    updateFormation,
    deleteFormation,
    getFormationsForSpecialty,
    calculateSemesters,
    getFormationsForAssignment,
    refreshData: loadData
  };
};
