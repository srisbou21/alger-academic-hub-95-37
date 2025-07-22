
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Users, BookOpen, Clock, MapPin, Download, FileText } from "lucide-react";
import { Department, Specialty, Section, Group } from "@/types/academic";

interface TimetableEntry {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'cours' | 'td' | 'tp';
  groupId?: string;
  sectionId?: string;
  specialtyId: string;
}

interface GroupSectionTimetableViewerProps {
  departments: Department[];
  specialties: Specialty[];
  sections: Section[];
  groups: Group[];
  timetables: TimetableEntry[];
}

export const GroupSectionTimetableViewer: React.FC<GroupSectionTimetableViewerProps> = ({
  departments,
  specialties,
  sections,
  groups,
  timetables
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2024-2025");
  const [selectedSemester, setSelectedSemester] = useState<string>("S1");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [viewType, setViewType] = useState<'section' | 'group'>('section');
  const [filteredTimetables, setFilteredTimetables] = useState<TimetableEntry[]>([]);

  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
  const timeSlots = [
    '08:00-09:30', '09:45-11:15', '11:30-13:00', '14:00-15:30', '15:45-17:15'
  ];

  const academicYears = ['2024-2025', '2023-2024', '2022-2023'];
  const semesters = ['S1', 'S2'];

  useEffect(() => {
    filterTimetables();
  }, [selectedSpecialty, selectedSection, selectedGroup, viewType, selectedYear, selectedSemester, timetables]);

  const filterTimetables = () => {
    let filtered = timetables.filter(t => t.specialtyId === selectedSpecialty);

    if (viewType === 'section' && selectedSection) {
      // Pour les sections : afficher seulement les cours magistraux
      filtered = filtered.filter(t => 
        t.sectionId === selectedSection && t.type === 'cours'
      );
    } else if (viewType === 'group' && selectedGroup) {
      // Pour les groupes : afficher TD et TP + cours magistraux de la section
      const group = groups.find(g => g.id === selectedGroup);
      filtered = filtered.filter(t => 
        (t.groupId === selectedGroup && (t.type === 'td' || t.type === 'tp')) ||
        (t.sectionId === group?.sectionId && t.type === 'cours')
      );
    }

    setFilteredTimetables(filtered);
  };

  const filteredSections = selectedSpecialty 
    ? sections.filter(s => {
        const specialty = specialties.find(sp => sp.id === selectedSpecialty);
        return specialty && s.specialtyId === specialty.id;
      })
    : [];

  const filteredGroups = selectedSection
    ? groups.filter(g => g.sectionId === selectedSection)
    : [];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-blue-100 text-blue-800';
      case 'td': return 'bg-green-100 text-green-800';
      case 'tp': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimetableForSlot = (day: string, timeSlot: string) => {
    const [startTime] = timeSlot.split('-');
    return filteredTimetables.find(t => 
      t.day === day && t.startTime === startTime
    );
  };

  const exportToPDF = () => {
    const specialty = specialties.find(s => s.id === selectedSpecialty);
    const section = sections.find(s => s.id === selectedSection);
    const group = groups.find(g => g.id === selectedGroup);
    
    let title = `Emploi du temps - ${selectedYear} ${selectedSemester}`;
    if (specialty) title += ` - ${specialty.name}`;
    if (viewType === 'section' && section) title += ` - Section ${section.name}`;
    if (viewType === 'group' && group) title += ` - Groupe ${group.name}`;

    console.log(`Export PDF: ${title}`);
    alert(`Export PDF généré pour: ${title}`);
  };

  const selectedSpecialtyData = specialties.find(s => s.id === selectedSpecialty);
  const selectedSectionData = sections.find(s => s.id === selectedSection);
  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Emploi du Temps par Groupe/Section
          </CardTitle>
          <p className="text-slate-600">
            Visualisez l'emploi du temps d'une section (cours magistraux) ou d'un groupe (TD/TP + cours)
          </p>
        </CardHeader>
      </Card>

      {/* Filtres de sélection */}
      <Card>
        <CardHeader>
          <CardTitle>Sélection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Année Académique</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Semestre</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Spécialité</label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map(specialty => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSpecialty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de vue</label>
                <Select value={viewType} onValueChange={(value: 'section' | 'group') => setViewType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="section">Section (Cours magistraux)</SelectItem>
                    <SelectItem value="group">Groupe (TD/TP + Cours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {viewType === 'section' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Section</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une section" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {viewType === 'group' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section</label>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une section" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSections.map(section => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedSection && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Groupe</label>
                      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un groupe" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredGroups.map(group => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Informations de sélection */}
          {selectedSpecialtyData && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Sélection actuelle</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Année:</span>
                  <p className="font-medium">{selectedYear}</p>
                </div>
                <div>
                  <span className="text-slate-600">Semestre:</span>
                  <p className="font-medium">{selectedSemester}</p>
                </div>
                <div>
                  <span className="text-slate-600">Spécialité:</span>
                  <p className="font-medium">{selectedSpecialtyData.name}</p>
                </div>
                <div>
                  <span className="text-slate-600">Vue:</span>
                  <p className="font-medium">
                    {viewType === 'section' 
                      ? `Section ${selectedSectionData?.name || ''}` 
                      : `Groupe ${selectedGroupData?.name || ''}`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bouton d'export */}
          {(selectedSection || selectedGroup) && (
            <div className="flex justify-end">
              <Button onClick={exportToPDF} variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Exporter PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Affichage de l'emploi du temps */}
      {((viewType === 'section' && selectedSection) || (viewType === 'group' && selectedGroup)) && (
        <Card>
          <CardHeader>
            <CardTitle>
              Emploi du Temps - {selectedYear} {selectedSemester}
              {viewType === 'section' 
                ? ` - Section ${selectedSectionData?.name} (Cours magistraux)`
                : ` - Groupe ${selectedGroupData?.name} (TD/TP + Cours)`
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Badge className={getTypeColor('cours')}>Cours Magistraux</Badge>
              {viewType === 'group' && (
                <>
                  <Badge className={getTypeColor('td')}>Travaux Dirigés</Badge>
                  <Badge className={getTypeColor('tp')}>Travaux Pratiques</Badge>
                </>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Heures</TableHead>
                    {days.map(day => (
                      <TableHead key={day} className="text-center min-w-40">
                        {day}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map(timeSlot => (
                    <TableRow key={timeSlot}>
                      <TableCell className="font-medium text-sm">
                        {timeSlot}
                      </TableCell>
                      {days.map(day => {
                        const entry = getTimetableForSlot(day, timeSlot);
                        return (
                          <TableCell key={`${day}-${timeSlot}`} className="p-1">
                            {entry ? (
                              <div className="bg-slate-50 border border-slate-200 rounded p-2 min-h-16">
                                <div className="flex items-center gap-1 mb-1">
                                  <Badge className={getTypeColor(entry.type)} variant="outline">
                                    {entry.type.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="font-medium text-xs text-slate-800 mb-1">
                                  {entry.subject}
                                </p>
                                <p className="text-xs text-slate-600">
                                  {entry.teacher}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {entry.room}
                                </p>
                              </div>
                            ) : (
                              <div className="min-h-16"></div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTimetables.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Aucun cours trouvé pour la sélection actuelle
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
