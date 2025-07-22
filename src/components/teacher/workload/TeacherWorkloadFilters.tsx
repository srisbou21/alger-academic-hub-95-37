import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { academicConfigService } from "../../../services/academicConfigService";

interface Specialty {
  id: string;
  name: string;
  code: string;
  level: 'licence' | 'master' | 'doctorat';
  filiereId: string;
  duration: number;
}

interface CourseModule {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  pedagogicalAtoms: Array<{
    id: string;
    type: 'cours' | 'td' | 'tp' | 'stage';
    hours: number;
  }>;
}

interface Section {
  id: string;
  name: string;
  code: string;
  capacity: number;
}

interface Group {
  id: string;
  name: string;
  code: string;
  type: 'td' | 'tp';
  capacity: number;
  sectionId: string;
}

interface TeacherWorkloadFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  selectedSemester: string;
  setSelectedSemester: (semester: string) => void;
  selectedModule: string;
  setSelectedModule: (module: string) => void;
  selectedTarget: string;
  setSelectedTarget: (target: string) => void;
  specialties: Specialty[];
  modules: CourseModule[];
  sections: Section[];
  onClearFilters: () => void;
}

export const TeacherWorkloadFilters: React.FC<TeacherWorkloadFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedSemester,
  setSelectedSemester,
  selectedModule,
  setSelectedModule,
  selectedTarget,
  setSelectedTarget,
  specialties,
  modules,
  sections,
  onClearFilters
}) => {
  // États pour les données synchronisées avec le formulaire d'attribution
  const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>(specialties);
  const [availableModules, setAvailableModules] = useState<CourseModule[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  // Fonction pour générer les atomes pédagogiques depuis un subject (même logique que WorkloadAssignmentForm)
  const generatePedagogicalAtomsFromSubject = (subject: any) => {
    const atoms: Array<{
      id: string;
      type: 'cours' | 'td' | 'tp' | 'stage';
      hours: number;
    }> = [];

    if (subject.hours.cm && subject.hours.cm > 0) {
      atoms.push({
        id: `${subject.id}-cours`,
        type: 'cours',
        hours: subject.hours.cm
      });
    }

    if (subject.hours.td && subject.hours.td > 0) {
      atoms.push({
        id: `${subject.id}-td`,
        type: 'td',
        hours: subject.hours.td
      });
    }

    if (subject.hours.tp && subject.hours.tp > 0) {
      atoms.push({
        id: `${subject.id}-tp`,
        type: 'tp',
        hours: subject.hours.tp
      });
    }

    return atoms;
  };

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    setLoading(true);
    try {
      console.log('Chargement des données pour les filtres...');

      // Charger les spécialités (même source que WorkloadAssignmentForm)
      const specialtiesFromService = await academicConfigService.getSpecialties();
      setAvailableSpecialties(specialtiesFromService);

      // Charger tous les modules (matières) sauvegardés depuis le canevas (même logique que WorkloadAssignmentForm)
      const allSubjects = await academicConfigService.getAllSubjects();
      
      if (allSubjects.length > 0) {
        const modules: CourseModule[] = allSubjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          code: subject.code || '',
          credits: subject.credits || 0,
          semester: 1,
          pedagogicalAtoms: generatePedagogicalAtomsFromSubject(subject)
        }));
        setAvailableModules(modules);
      } else {
        setAvailableModules([]);
      }

      // Charger les sections (même source que WorkloadAssignmentForm)
      const sectionsFromService = await academicConfigService.getSections();
      setAvailableSections(sectionsFromService);

      // Charger les groupes (même source que WorkloadAssignmentForm)
      const groupsFromService = await academicConfigService.getGroups();
      setAvailableGroups(groupsFromService);

    } catch (error) {
      console.error('Erreur lors du chargement des données des filtres:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser directement tous les modules disponibles (même logique que WorkloadAssignmentForm)
  const filteredModules = availableModules;

  // Créer une liste combinée de sections et groupes pour le filtre cible (même logique que WorkloadAssignmentForm)
  const targetOptions = [
    ...availableSections.map(section => ({
      id: section.id,
      name: `${section.name} (${section.code})`,
      type: 'section' as const
    })),
    ...availableGroups.map(group => ({
      id: group.id,
      name: `${group.name} (${group.code})`,
      type: 'group' as const
    }))
  ];

  const hasActiveFilters = searchTerm || (selectedSpecialty && selectedSpecialty !== 'all') || (selectedSemester && selectedSemester !== 'all') || (selectedModule && selectedModule !== 'all') || (selectedTarget && selectedTarget !== 'all');

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Filtres de Recherche</h3>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-slate-600 hover:text-slate-900"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer les filtres
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Recherche par nom */}
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher par nom/prénom</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                type="text"
                placeholder="Nom ou prénom de l'enseignant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtre par spécialité */}
          <div className="space-y-2">
            <Label>Spécialité de charge (depuis canevas)</Label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Chargement..." : "Toutes les spécialités"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les spécialités</SelectItem>
                {availableSpecialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    <div>
                      <div>{specialty.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {specialty.code} - {specialty.level}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par semestre */}
          <div className="space-y-2">
            <Label>Semestre (selon spécialité)</Label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={!selectedSpecialty || selectedSpecialty === 'all'}>
              <SelectTrigger>
                <SelectValue placeholder={!selectedSpecialty || selectedSpecialty === 'all' ? "Sélectionner d'abord une spécialité" : "Tous les semestres"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les semestres</SelectItem>
                {selectedSpecialty && selectedSpecialty !== 'all' && (() => {
                  const specialty = availableSpecialties.find(s => s.id === selectedSpecialty);
                  if (!specialty) return null;
                  const semesterCount = specialty.duration * 2;
                  const semesters = [];
                  for (let i = 1; i <= semesterCount; i++) {
                    semesters.push(
                      <SelectItem key={`S${i}`} value={`S${i}`}>
                        Semestre {i}
                      </SelectItem>
                    );
                  }
                  return semesters;
                })()}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par module */}
          <div className="space-y-2">
            <Label>Module (depuis canevas)</Label>
            <Select value={selectedModule} onValueChange={setSelectedModule} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Chargement..." : "Tous les modules"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les modules</SelectItem>
                {filteredModules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    <div>
                      <div>{module.code} - {module.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {module.credits} ECTS
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loading && availableModules.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Aucun module trouvé dans les canevas
              </p>
            )}
          </div>

          {/* Filtre par groupe/section */}
          <div className="space-y-2">
            <Label>Section/Groupe (depuis spécialités)</Label>
            <Select value={selectedTarget} onValueChange={setSelectedTarget} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Chargement..." : "Toutes les cibles"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les cibles</SelectItem>
                {targetOptions.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name} ({target.type === 'section' ? 'Section' : 'Groupe'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Sections et groupes configurés dans Administration → Faculté → Sections & Groupes
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Recherche: "{searchTerm}"
                </span>
              )}
              {selectedSpecialty && selectedSpecialty !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Spécialité: {availableSpecialties.find(s => s.id === selectedSpecialty)?.name}
                </span>
              )}
              {selectedSemester && selectedSemester !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Semestre: {selectedSemester}
                </span>
              )}
              {selectedModule && selectedModule !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Module: {filteredModules.find(m => m.id === selectedModule)?.name}
                </span>
              )}
              {selectedTarget && selectedTarget !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Cible: {targetOptions.find(t => t.id === selectedTarget)?.name}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};