import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  Users,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import { Department, Specialty, Section, Group, TimetableEntry } from "../../types/academic";
import { getAvailableSemestersForSpecialty } from "../../utils/semesterUtils";
import { academicConfigService } from "../../services/academicConfigService";
import { teacherService } from "../../services/teacherService";
import { teacherDataService } from "../../services/teacherDataService";
import { reservationService } from "../../services/reservationService";

interface TimetableViewerProps {
  departments: Department[];
  specialties: Specialty[];
  sections: Section[];
  groups: Group[];
  timetables: any[];
}


interface CourseModule {
  id: string;
  name: string;
  courseTypes: Array<{
    type: 'cours' | 'td' | 'tp';
    sessionNumber?: number;
    label: string;
  }>;
}

export const TimetableViewer = ({ 
  departments, 
  specialties, 
  sections, 
  groups, 
  timetables: initialTimetables 
}: TimetableViewerProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  
  // Nouvelles données pour les dates de semestre
  const [semesterStartDate, setSemesterStartDate] = useState<Date | null>(null);
  const [semesterEndDate, setSemesterEndDate] = useState<Date | null>(null);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [newEntry, setNewEntry] = useState({
    moduleId: '',
    subject: '',
    teacher: '',
    room: '',
    day: '',
    startTime: '',
    endTime: '',
    type: 'cours' as 'cours' | 'td' | 'tp',
    courseTypeLabel: '',
    sectionId: '',
    groupId: ''
  });
  
  // Données dynamiques
  const [availableModules, setAvailableModules] = useState<CourseModule[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
  const [availableSpaces, setAvailableSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const days = ['Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
  ];

  useEffect(() => {
    if (selectedSpecialty && selectedSemester) {
      loadTimetableData();
      loadDynamicData();
      loadSemesterDates();
    }
  }, [selectedSpecialty, selectedSemester]);

  const loadTimetableData = async () => {
    if (selectedSpecialty && selectedSemester) {
      const storageKey = `timetable_${selectedSpecialty}_${selectedSemester}`;
      const stored = localStorage.getItem(storageKey);
      let filtered: TimetableEntry[] = [];
      
      if (stored) {
        try {
          filtered = JSON.parse(stored);
        } catch (error) {
          console.error('Erreur lors du chargement des données sauvegardées:', error);
        }
      }
      
      // Combiner avec les données initiales si nécessaire
      const initial = initialTimetables.filter(entry => 
        entry.specialtyId === selectedSpecialty && entry.semester === selectedSemester
      );
      
      // Fusionner en évitant les doublons
      const combined = [...filtered];
      initial.forEach(entry => {
        if (!combined.find(e => e.id === entry.id)) {
          combined.push(entry);
        }
      });
      
      setTimetables(combined);
    } else {
      setTimetables([]);
    }
  };

  const loadSemesterDates = () => {
    if (selectedSpecialty && selectedSemester) {
      const storageKey = `semester_dates_${selectedSpecialty}_${selectedSemester}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const dates = JSON.parse(stored);
          setSemesterStartDate(dates.startDate ? new Date(dates.startDate) : null);
          setSemesterEndDate(dates.endDate ? new Date(dates.endDate) : null);
        } catch (error) {
          console.error('Erreur lors du chargement des dates:', error);
          setSemesterStartDate(null);
          setSemesterEndDate(null);
        }
      } else {
        setSemesterStartDate(null);
        setSemesterEndDate(null);
      }
    }
  };

  const saveSemesterDates = () => {
    if (selectedSpecialty && selectedSemester && semesterStartDate && semesterEndDate) {
      const storageKey = `semester_dates_${selectedSpecialty}_${selectedSemester}`;
      const dates = {
        startDate: semesterStartDate.toISOString(),
        endDate: semesterEndDate.toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(dates));
      setIsEditingDates(false);
      
      toast({
        title: "Succès",
        description: "Dates du semestre sauvegardées"
      });
    }
  };

  // Nouvelle fonction pour générer les types de cours depuis un subject
  const generateCourseTypesFromSubject = (subject: any) => {
    const types: Array<{
      type: 'cours' | 'td' | 'tp';
      sessionNumber?: number;
      label: string;
    }> = [];

    if (subject.hours.cm && subject.hours.cm > 0) {
      const sessions = Math.ceil(subject.hours.cm / 1.5);
      for (let i = 1; i <= sessions; i++) {
        types.push({
          type: 'cours',
          sessionNumber: i,
          label: sessions > 1 ? `Cours Magistral Séance ${i}` : 'Cours Magistral'
        });
      }
    }

    if (subject.hours.td && subject.hours.td > 0) {
      types.push({
        type: 'td',
        label: 'Travaux Dirigés'
      });
    }

    if (subject.hours.tp && subject.hours.tp > 0) {
      types.push({
        type: 'tp',
        label: 'Travaux Pratiques'
      });
    }

    return types;
  };

  const loadDynamicData = async () => {
    setLoading(true);
    try {
      // Charger tous les modules (matières) sauvegardés depuis le canevas
      const allSubjects = await academicConfigService.getAllSubjects();
      
      if (allSubjects.length > 0) {
        // Utiliser directement toutes les matières disponibles
        // Le filtrage par spécialité peut être fait plus tard si nécessaire
        const modules: CourseModule[] = allSubjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          courseTypes: generateCourseTypesFromSubject(subject)
        }));
        setAvailableModules(modules);
        console.log(`${modules.length} modules chargés depuis le canevas:`, modules);
      } else {
        console.warn('Aucun module trouvé dans le canevas');
        setAvailableModules([]);
      }

      // Charger les enseignants depuis le service GRH (même source et format que WorkloadAssignmentForm)
      const teachersFromGRH = await teacherDataService.getTeachersFromHR();
      const activeTeachers = teachersFromGRH.filter(t => t.isActive);
      // Utiliser directement le format TeacherForAssignment (même format que WorkloadAssignmentForm)
      setAvailableTeachers(activeTeachers);
      console.log(`${activeTeachers.length} enseignants actifs chargés depuis GRH`);

      // Charger les espaces depuis le module réservation
      const spaces = await reservationService.getSpaces();
      const availableSpaces = spaces.filter(s => s.status === 'available');
      setAvailableSpaces(availableSpaces);
      console.log(`${availableSpaces.length} espaces disponibles chargés`);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données dynamiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCourseTypes = (module: any) => {
    const types: Array<{
      type: 'cours' | 'td' | 'tp';
      sessionNumber?: number;
      label: string;
    }> = [];

    // Générer les types basés sur les atomes pédagogiques du module
    if (module.pedagogicalAtoms) {
      module.pedagogicalAtoms.forEach((atom: any) => {
        if (atom.type === 'cours') {
          // Calculer le nombre de séances de cours (1.5h par séance)
          const sessions = Math.ceil(atom.hours / 1.5);
          for (let i = 1; i <= sessions; i++) {
            types.push({
              type: 'cours',
              sessionNumber: i,
              label: sessions > 1 ? `Cours Magistral Séance ${i}` : 'Cours Magistral'
            });
          }
        } else if (atom.type === 'td') {
          types.push({
            type: 'td',
            label: 'Travaux Dirigés'
          });
        } else if (atom.type === 'tp') {
          types.push({
            type: 'tp',
            label: 'Travaux Pratiques'
          });
        }
      });
    }

    // Fallback si pas d'atomes pédagogiques (ancienne structure)
    if (types.length === 0 && module.hours) {
      if (module.hours.cours && module.hours.cours > 0) {
        const sessions = Math.ceil(module.hours.cours / 1.5);
        for (let i = 1; i <= sessions; i++) {
          types.push({
            type: 'cours',
            sessionNumber: i,
            label: sessions > 1 ? `Cours Magistral Séance ${i}` : 'Cours Magistral'
          });
        }
      }

      if (module.hours.td && module.hours.td > 0) {
        types.push({
          type: 'td',
          label: 'Travaux Dirigés'
        });
      }

      if (module.hours.tp && module.hours.tp > 0) {
        types.push({
          type: 'tp',
          label: 'Travaux Pratiques'
        });
      }
    }

    return types;
  };

  const selectedSpecialtyData = specialties.find(s => s.id === selectedSpecialty);
  const availableSemesters = selectedSpecialtyData ? getAvailableSemestersForSpecialty(selectedSpecialtyData.duration) : [];

  const filteredSections = sections.filter(s => 
    s.specialtyId === selectedSpecialty && s.semester === selectedSemester
  );
  const filteredGroups = groups.filter(g => {
    const section = sections.find(s => s.id === g.sectionId);
    return section && section.specialtyId === selectedSpecialty && section.semester === selectedSemester;
  });

  const selectedModule = availableModules.find(m => m.id === newEntry.moduleId);
  const availableCourseTypes = selectedModule?.courseTypes || [];

  const checkDuplicateSession = (moduleId: string, courseTypeLabel: string, targetId: string, targetType: 'section' | 'group') => {
    return timetables.some(entry => 
      entry.moduleId === moduleId && 
      entry.courseTypeLabel === courseTypeLabel &&
      ((targetType === 'section' && entry.sectionId === targetId) ||
       (targetType === 'group' && entry.groupId === targetId))
    );
  };

  const handleAddEntry = () => {
    if (!selectedSpecialty || !selectedSemester) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une spécialité et un semestre",
        variant: "destructive"
      });
      return;
    }

    if (!newEntry.moduleId || !newEntry.courseTypeLabel || !newEntry.teacher || !newEntry.room || !newEntry.day || !newEntry.startTime || !newEntry.endTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Validation selon le type de cours
    if (newEntry.type === 'cours' && !newEntry.sectionId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une section pour les cours magistraux",
        variant: "destructive"
      });
      return;
    }

    if ((newEntry.type === 'td' || newEntry.type === 'tp') && !newEntry.groupId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un groupe pour les TD/TP",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la duplication de séance
    const targetId = newEntry.type === 'cours' ? newEntry.sectionId : newEntry.groupId;
    const targetType = newEntry.type === 'cours' ? 'section' : 'group';
    
    if (checkDuplicateSession(newEntry.moduleId, newEntry.courseTypeLabel, targetId, targetType)) {
      toast({
        title: "Erreur",
        description: "Cette séance est déjà programmée pour ce groupe/section",
        variant: "destructive"
      });
      return;
    }

    const entry: TimetableEntry = {
      id: `entry_${Date.now()}`,
      moduleId: newEntry.moduleId,
      subject: newEntry.subject,
      teacher: newEntry.teacher,
      room: newEntry.room,
      day: newEntry.day,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      type: newEntry.type,
      courseTypeLabel: newEntry.courseTypeLabel,
      specialtyId: selectedSpecialty,
      semester: selectedSemester,
      sectionId: newEntry.type === 'cours' ? newEntry.sectionId : undefined,
      groupId: newEntry.type !== 'cours' ? newEntry.groupId : undefined
    };

    const updatedTimetables = [...timetables, entry];
    setTimetables(updatedTimetables);
    
    // Sauvegarder dans localStorage
    const storageKey = `timetable_${selectedSpecialty}_${selectedSemester}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedTimetables));
    
    setIsAddingEntry(false);
    setNewEntry({
      moduleId: '',
      subject: '',
      teacher: '',
      room: '',
      day: '',
      startTime: '',
      endTime: '',
      type: 'cours',
      courseTypeLabel: '',
      sectionId: '',
      groupId: ''
    });

    toast({
      title: "Succès",
      description: "Créneau ajouté et sauvegardé avec succès"
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedTimetables = timetables.filter(entry => entry.id !== entryId);
    setTimetables(updatedTimetables);
    
    // Sauvegarder dans localStorage
    if (selectedSpecialty && selectedSemester) {
      const storageKey = `timetable_${selectedSpecialty}_${selectedSemester}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedTimetables));
    }
    
    toast({
      title: "Succès",
      description: "Créneau supprimé et sauvegardé avec succès"
    });
  };

  const getSectionName = (sectionId?: string) => {
    if (!sectionId) return '';
    const section = sections.find(s => s.id === sectionId);
    return section ? section.name : 'Section inconnue';
  };

  const getGroupName = (groupId?: string) => {
    if (!groupId) return '';
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Groupe inconnu';
  };

  const renderTimetableGrid = () => {
    const grid: { [key: string]: TimetableEntry[] } = {};
    
    days.forEach(day => {
      grid[day] = timetables.filter(entry => entry.day === day);
    });

    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[800px]">
          <div className="font-semibold p-2 bg-slate-100 rounded">Heure</div>
          {days.map(day => (
            <div key={day} className="font-semibold p-2 bg-slate-100 rounded text-center">
              {day}
            </div>
          ))}
          
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="p-2 text-sm text-slate-600 border-r">
                {time}
              </div>
              {days.map(day => {
                const dayEntries = grid[day].filter(entry => {
                  const entryStart = entry.startTime;
                  const entryEnd = entry.endTime;
                  return time >= entryStart && time < entryEnd;
                });
                
                return (
                  <div key={`${day}-${time}`} className="p-1 min-h-[60px] border border-slate-200">
                    {dayEntries.map(entry => (
                      <div 
                        key={entry.id}
                        className={`p-2 rounded text-xs mb-1 cursor-pointer ${
                          entry.type === 'cours' ? 'bg-blue-100 text-blue-800' :
                          entry.type === 'td' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}
                        onClick={() => setEditingEntry(entry)}
                      >
                        <div className="font-semibold">{entry.subject}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <User className="h-3 w-3" />
                          <span>{entry.teacher}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{entry.room}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{entry.startTime}-{entry.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {entry.type === 'cours' ? (
                            <>
                              <BookOpen className="h-3 w-3" />
                              <span>{getSectionName(entry.sectionId)}</span>
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3" />
                              <span>{getGroupName(entry.groupId)}</span>
                            </>
                          )}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {entry.type.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Visualisation des Emplois du Temps par Semestre
          </CardTitle>
          <p className="text-slate-600">
            Consultez et gérez les emplois du temps par spécialité et semestre avec distinction cours/TD/TP
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Spécialité</Label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.length === 0 ? (
                    <SelectItem value="no-data" disabled>
                      Aucune spécialité disponible
                    </SelectItem>
                  ) : (
                    specialties.map(specialty => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name} ({specialty.code}) - {specialty.level}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre</Label>
              <Select 
                value={selectedSemester} 
                onValueChange={setSelectedSemester}
                disabled={!selectedSpecialty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map(semester => (
                    <SelectItem key={semester.value} value={semester.value}>
                      {semester.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          {selectedSpecialtyData && selectedSemester && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Emploi du temps:</strong> {selectedSpecialtyData.name} - {availableSemesters.find(s => s.value === selectedSemester)?.label}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-blue-600">
                  <span>Sections disponibles: {filteredSections.length}</span>
                  <span>Groupes disponibles: {filteredGroups.length}</span>
                  <span>Créneaux programmés: {timetables.length}</span>
                  <span>Modules disponibles: {availableModules.length}</span>
                </div>
              </div>

              {/* Section des dates de semestre */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Dates du Semestre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isEditingDates ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Début du semestre</Label>
                          <p className="text-sm text-slate-600 mt-1">
                            {semesterStartDate ? format(semesterStartDate, "dd/MM/yyyy") : "Non définie"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Fin du semestre</Label>
                          <p className="text-sm text-slate-600 mt-1">
                            {semesterEndDate ? format(semesterEndDate, "dd/MM/yyyy") : "Non définie"}
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setIsEditingDates(true)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier les dates
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Début du semestre</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !semesterStartDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {semesterStartDate ? format(semesterStartDate, "dd/MM/yyyy") : "Sélectionner une date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={semesterStartDate || undefined}
                                onSelect={(date) => setSemesterStartDate(date || null)}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>Fin du semestre</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !semesterEndDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {semesterEndDate ? format(semesterEndDate, "dd/MM/yyyy") : "Sélectionner une date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={semesterEndDate || undefined}
                                onSelect={(date) => setSemesterEndDate(date || null)}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveSemesterDates} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button 
                          onClick={() => setIsEditingDates(false)} 
                          variant="outline" 
                          size="sm"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {selectedSpecialty && selectedSemester && (
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Emploi du temps</h3>
              <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un créneau
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau créneau</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      <Label>Module (Matière) *</Label>
                      <Select 
                        value={newEntry.moduleId} 
                        onValueChange={(value) => {
                          const module = availableModules.find(m => m.id === value);
                          setNewEntry(prev => ({ 
                            ...prev, 
                            moduleId: value,
                            subject: module?.name || '',
                            courseTypeLabel: '',
                            type: 'cours'
                          }));
                        }}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Sélectionner un module" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {availableModules.length === 0 ? (
                            <SelectItem value="no-modules" disabled>
                              Aucun module disponible dans le canevas
                            </SelectItem>
                          ) : (
                            availableModules.map(module => (
                              <SelectItem key={module.id} value={module.id}>
                                {module.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Modules issus du canevas de formation
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Type de cours *</Label>
                      <Select 
                        value={newEntry.courseTypeLabel} 
                        onValueChange={(value) => {
                          const courseType = availableCourseTypes.find(ct => ct.label === value);
                          setNewEntry(prev => ({ 
                            ...prev, 
                            courseTypeLabel: value,
                            type: courseType?.type || 'cours'
                          }));
                        }}
                        disabled={!newEntry.moduleId}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {availableCourseTypes.length === 0 ? (
                            <SelectItem value="no-types" disabled>
                              Sélectionnez d'abord un module
                            </SelectItem>
                          ) : (
                            availableCourseTypes.map(courseType => (
                              <SelectItem key={courseType.label} value={courseType.label}>
                                {courseType.label}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Types basés sur le canevas du module sélectionné
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Enseignant *</Label>
                      <Select value={newEntry.teacher} onValueChange={(value) => setNewEntry(prev => ({ ...prev, teacher: value }))}>
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Sélectionner un enseignant" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {availableTeachers.length === 0 ? (
                            <SelectItem value="no-teachers" disabled>
                              Aucun enseignant disponible
                            </SelectItem>
                          ) : (
                            availableTeachers.map(teacher => (
                              <SelectItem key={teacher.id} value={teacher.name}>
                                {teacher.name} - {teacher.grade}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Enseignants issus du module GRH
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {newEntry.type === 'cours' ? 'Section' : 'Groupe'}
                      </Label>
                      {newEntry.type === 'cours' ? (
                        <Select value={newEntry.sectionId} onValueChange={(value) => setNewEntry(prev => ({ ...prev, sectionId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une section" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredSections.map(section => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.name} ({section.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select value={newEntry.groupId} onValueChange={(value) => setNewEntry(prev => ({ ...prev, groupId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un groupe" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredGroups.map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name} ({group.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Jour *</Label>
                      <Select value={newEntry.day} onValueChange={(value) => setNewEntry(prev => ({ ...prev, day: value }))}>
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Sélectionner un jour" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {days.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Semaine du samedi au vendredi
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Salle *</Label>
                      <Select value={newEntry.room} onValueChange={(value) => setNewEntry(prev => ({ ...prev, room: value }))}>
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Sélectionner une salle" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {availableSpaces.length === 0 ? (
                            <SelectItem value="no-spaces" disabled>
                              Aucun espace disponible
                            </SelectItem>
                          ) : (
                            availableSpaces.map(space => (
                              <SelectItem key={space.id} value={space.name}>
                                {space.name} - {space.type} (Cap: {space.capacity})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Espaces issus du module réservation
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Heure de début *</Label>
                      <Select value={newEntry.startTime} onValueChange={(value) => setNewEntry(prev => ({ ...prev, startTime: value }))}>
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Heure de début" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Plage horaire : 08:00 - 23:00
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Heure de fin *</Label>
                      <Select value={newEntry.endTime} onValueChange={(value) => setNewEntry(prev => ({ ...prev, endTime: value }))}>
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Heure de fin" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {timeSlots.filter(time => !newEntry.startTime || time > newEntry.startTime).map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Doit être après l'heure de début
                      </p>
                    </div>
                  </div>
                  
                  {/* Avertissement de duplication */}
                  {newEntry.moduleId && newEntry.courseTypeLabel && (newEntry.sectionId || newEntry.groupId) && (
                    checkDuplicateSession(
                      newEntry.moduleId, 
                      newEntry.courseTypeLabel, 
                      newEntry.type === 'cours' ? newEntry.sectionId : newEntry.groupId,
                      newEntry.type === 'cours' ? 'section' : 'group'
                    ) && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-700">
                          Cette séance est déjà programmée pour ce groupe/section
                        </span>
                      </div>
                    )
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddEntry}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSpecialty && selectedSemester && (
        <Card>
          <CardHeader>
            <CardTitle>Grille horaire</CardTitle>
          </CardHeader>
          <CardContent>
            {timetables.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Aucun créneau programmé pour cette spécialité et ce semestre.
                Cliquez sur "Ajouter un créneau" pour commencer.
              </div>
            ) : (
              renderTimetableGrid()
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
