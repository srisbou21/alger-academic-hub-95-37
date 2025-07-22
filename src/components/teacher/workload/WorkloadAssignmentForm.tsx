import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { academicConfigService } from "../../../services/academicConfigService";
import { TeacherForAssignment } from "../../../services/teacherDataService";

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
  capacity: number;
  type: 'td' | 'tp';
  sectionId: string;
}

interface WorkloadAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: any) => void;
  teachers: TeacherForAssignment[];
}

export const WorkloadAssignmentForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  teachers
}: WorkloadAssignmentFormProps) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedAtomType, setSelectedAtomType] = useState<'cours' | 'td' | 'tp'>('cours');
  const [selectedTarget, setSelectedTarget] = useState<string>('');

  // États pour les données (utiliser les mêmes sources que TimetableViewer)
  const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>([]);
  const [availableModules, setAvailableModules] = useState<CourseModule[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  // Fonction pour générer les atomes pédagogiques depuis un subject (même logique que TimetableViewer)
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
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  const loadFormData = async () => {
    setLoading(true);
    try {
      console.log('Chargement des données pour le formulaire d\'attribution...');

      // Charger les spécialités (même source que TimetableViewer)
      const specialtiesFromService = await academicConfigService.getSpecialties();
      console.log('Spécialités chargées:', specialtiesFromService);
      setAvailableSpecialties(specialtiesFromService);

      // Charger tous les modules (matières) sauvegardés depuis le canevas (même logique que TimetableViewer)
      const allSubjects = await academicConfigService.getAllSubjects();
      console.log('Modules chargés depuis le canevas:', allSubjects);
      
      if (allSubjects.length > 0) {
        // Utiliser directement toutes les matières disponibles (même logique que TimetableViewer)
        const modules: CourseModule[] = allSubjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          code: subject.code || '',
          credits: subject.credits || 0,
          semester: 1, // Les subjects n'ont pas de semestre défini
          pedagogicalAtoms: generatePedagogicalAtomsFromSubject(subject)
        }));
        setAvailableModules(modules);
        console.log(`${modules.length} modules chargés depuis le canevas:`, modules);
      } else {
        console.warn('Aucun module trouvé dans le canevas');
        setAvailableModules([]);
      }

      // Charger les sections (même source que TimetableViewer)
      const sectionsFromService = await academicConfigService.getSections();
      console.log('Sections chargées:', sectionsFromService);
      setAvailableSections(sectionsFromService);

      // Charger les groupes (même source que TimetableViewer)
      const groupsFromService = await academicConfigService.getGroups();
      console.log('Groupes chargés:', groupsFromService);
      setAvailableGroups(groupsFromService);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser directement tous les modules disponibles (même logique que TimetableViewer)
  // Pas de filtrage par spécialité ou semestre pour avoir accès à tous les modules
  const filteredModules = availableModules;

  // Obtenir les types de cours disponibles pour le module sélectionné (même logique que TimetableViewer)
  const getAvailableCourseTypes = () => {
    if (!selectedModule) return [];
    
    const module = availableModules.find(m => m.id === selectedModule);
    if (!module) return [];

    return module.pedagogicalAtoms.map(atom => ({
      label: atom.type === 'cours' ? 'Cours' : 
             atom.type === 'td' ? 'TD' : 
             atom.type === 'tp' ? 'TP' : 'Stage',
      type: atom.type,
      hours: atom.hours
    }));
  };

  // Filtrer les sections selon la spécialité (même logique que TimetableViewer)
  const filteredSections = availableSections.filter(section => {
    if (!selectedSpecialty) return true;
    return true; // À adapter selon votre logique métier
  });

  // Filtrer les groupes selon la section et le type d'atome (même logique que TimetableViewer)
  const filteredGroups = availableGroups.filter(group => {
    if (selectedAtomType === 'cours') return false; // Cours = sections uniquement
    return group.type === selectedAtomType;
  });

  // Obtenir les cibles disponibles selon le type d'atome
  const getAvailableTargets = () => {
    if (selectedAtomType === 'cours') {
      return filteredSections.map(section => ({
        id: section.id,
        name: `${section.name} (${section.code})`,
        capacity: section.capacity,
        type: 'section'
      }));
    } else {
      return filteredGroups.map(group => ({
        id: group.id,
        name: `${group.name} (${group.code})`,
        capacity: group.capacity,
        type: 'group'
      }));
    }
  };

  // Reset des sélections dépendantes
  useEffect(() => {
    setSelectedModule('');
  }, [selectedSpecialty, selectedSemester]);

  useEffect(() => {
    setSelectedTarget('');
  }, [selectedAtomType]);

  const handleSubmit = () => {
    if (!selectedTeacher || !selectedSpecialty || !selectedModule || !selectedTarget) {
      return;
    }

    const teacher = teachers.find(t => t.id === selectedTeacher);
    const specialty = availableSpecialties.find(s => s.id === selectedSpecialty);
    const module = availableModules.find(m => m.id === selectedModule);
    const target = getAvailableTargets().find(t => t.id === selectedTarget);
    
    if (!teacher || !specialty || !module || !target) return;

    const hoursPerWeek = selectedAtomType === 'cours' ? 1.5 : 1.5;
    const totalWeeks = 15;
    const totalHours = hoursPerWeek * totalWeeks;

    const assignment = {
      id: Date.now().toString(),
      moduleId: module.id,
      moduleName: module.name,
      specialtyId: selectedSpecialty,
      specialtyName: specialty.name,
      atomType: selectedAtomType,
      targetAudience: {
        type: target.type,
        id: target.id,
        name: target.name,
        capacity: target.capacity
      },
      hoursPerWeek,
      totalWeeks,
      totalHours,
      coefficient: 1,
      isConfirmed: false,
      teacherId: selectedTeacher
    };

    onSubmit(assignment);
    
    // Reset form
    setSelectedTeacher('');
    setSelectedSpecialty('');
    setSelectedModule('');
    setSelectedSemester('');
    setSelectedTarget('');
    onClose();
  };

  // Obtenir les semestres disponibles selon la spécialité
  const getAvailableSemesters = () => {
    if (!selectedSpecialty) return [];
    
    const specialty = availableSpecialties.find(s => s.id === selectedSpecialty);
    if (!specialty) return [];

    const semesterCount = specialty.duration * 2; // 2 semestres par année
    const semesters = [];
    for (let i = 1; i <= semesterCount; i++) {
      semesters.push(`S${i}`);
    }
    return semesters;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Attribution</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Sélectionner un enseignant * (depuis module GRH)</Label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un enseignant"} />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    <div>
                      <div className="flex items-center gap-2">
                        {teacher.name}
                        {!teacher.isActive && (
                          <span className="text-xs bg-red-100 text-red-600 px-1 rounded">Inactif</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {teacher.grade} - {teacher.department}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loading && teachers.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Aucun enseignant trouvé dans le module GRH
              </p>
            )}
            <p className="text-xs text-green-600 mt-1">
              {teachers.length} enseignant(s) synchronisé(s) depuis le module GRH
            </p>
          </div>

          <div>
            <Label>Spécialité *</Label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner une spécialité"} />
              </SelectTrigger>
              <SelectContent>
                {availableSpecialties.map(specialty => (
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

          <div>
            <Label>Semestre *</Label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={loading || !selectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder={!selectedSpecialty ? "Sélectionner d'abord une spécialité" : "Sélectionner un semestre"} />
              </SelectTrigger>
              <SelectContent>
                {getAvailableSemesters().map(semester => (
                  <SelectItem key={semester} value={semester}>
                    Semestre {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sélectionner module * (depuis canevas)</Label>
            <Select value={selectedModule} onValueChange={setSelectedModule} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un module"} />
              </SelectTrigger>
              <SelectContent>
                {filteredModules.map(module => (
                  <SelectItem key={module.id} value={module.id}>
                    <div>
                      <div>{module.code} - {module.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {module.credits} ECTS - S{module.semester}
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

          <div>
            <Label>Type atome * (depuis canevas)</Label>
            <Select value={selectedAtomType} onValueChange={(value: 'cours' | 'td' | 'tp') => setSelectedAtomType(value)} disabled={!selectedModule}>
              <SelectTrigger>
                <SelectValue placeholder={!selectedModule ? "Sélectionner d'abord un module" : "Sélectionner le type"} />
              </SelectTrigger>
              <SelectContent>
                {getAvailableCourseTypes().map(courseType => (
                  <SelectItem key={courseType.type} value={courseType.type}>
                    {courseType.label} ({courseType.hours}h)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Cible (Section/Groupe) * (depuis canevas)</Label>
            <Select value={selectedTarget} onValueChange={setSelectedTarget} disabled={!selectedAtomType}>
              <SelectTrigger>
                <SelectValue placeholder={!selectedAtomType ? "Sélectionner d'abord un type d'atome" : "Sélectionner une cible"} />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTargets().map(target => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name} (Cap: {target.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {selectedAtomType === 'cours' ? 'Cours = Sections uniquement' : `${selectedAtomType.toUpperCase()} = Groupes uniquement`}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Chargement...' : 'Attribuer'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};