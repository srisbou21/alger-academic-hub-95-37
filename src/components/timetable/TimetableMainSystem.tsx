import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Eye, Settings, BookOpen } from "lucide-react";
import { TimetableViewer } from "./TimetableViewer";
import { GroupSectionTimetableViewer } from "./GroupSectionTimetableViewer";
import { Department, Specialty, Section, Group } from "@/types/academic";
import { academicConfigService } from "../../services/academicConfigService";

export const TimetableMainSystem = () => {
  const [activeTab, setActiveTab] = useState("viewer");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Charger les données réelles depuis les services
    const loadData = async () => {
      try {
        const loadedDepartments = await academicConfigService.getDepartments();
        const loadedSpecialties = await academicConfigService.getSpecialties();
        const sectionsAndGroups = await academicConfigService.getSectionsAndGroups();
        
        // Si aucune donnée n'est disponible, initialiser les données d'exemple
        if (loadedSpecialties.length === 0) {
          console.log('Initialisation des données d\'exemple...');
          academicConfigService.initializeExampleData();
          // Recharger après initialisation
          const updatedSpecialties = await academicConfigService.getSpecialties();
          const updatedSectionsAndGroups = await academicConfigService.getSectionsAndGroups();
          setSpecialties(updatedSpecialties);
          setSections(updatedSectionsAndGroups.sections);
          setGroups(updatedSectionsAndGroups.groups);
        }
        
        setDepartments(loadedDepartments);
        setSpecialties(loadedSpecialties);
        setSections(sectionsAndGroups.sections);
        setGroups(sectionsAndGroups.groups);
        
        // Charger également les matières disponibles depuis le service
        const allSubjects = await academicConfigService.getAllSubjects();
        console.log('Matières disponibles pour emploi du temps:', allSubjects);
        
        console.log('Données emploi du temps chargées:', {
          departments: loadedDepartments.length,
          specialties: loadedSpecialties.length,
          sections: sectionsAndGroups.sections.length,
          groups: sectionsAndGroups.groups.length,
          subjects: allSubjects.length
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, []);

  const [timetables, setTimetables] = useState([
    {
      id: "1",
      subject: "Programmation Java",
      teacher: "Dr. Ahmed Benali",
      room: "Salle 101",
      day: "Lundi",
      startTime: "08:00",
      endTime: "09:30",
      type: "cours" as const,
      sectionId: "1",
      specialtyId: "1"
    },
    {
      id: "2",
      subject: "TD Java",
      teacher: "Dr. Ahmed Benali",
      room: "Salle 201",
      day: "Mardi",
      startTime: "09:45",
      endTime: "11:15",
      type: "td" as const,
      groupId: "1",
      specialtyId: "1"
    },
    {
      id: "3",
      subject: "TP Java",
      teacher: "Dr. Ahmed Benali",
      room: "Lab 1",
      day: "Mercredi",
      startTime: "14:00",
      endTime: "15:30",
      type: "tp" as const,
      groupId: "3",
      specialtyId: "1"
    }
  ]);

  return (
    <div className="space-y-6">
      {/* En-tête unifié bleu */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Système de Gestion des Emplois du Temps
          </CardTitle>
          <p className="text-blue-100">
            Consultation et gestion des emplois du temps par spécialité, section et groupe
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-blue-200">
          <TabsTrigger value="viewer">
            <Eye className="mr-2 h-4 w-4" />
            Vue Générale
          </TabsTrigger>
          <TabsTrigger value="group-section">
            <Users className="mr-2 h-4 w-4" />
            Vue Groupe/Section
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewer" className="space-y-6">
          <TimetableViewer
            departments={departments}
            specialties={specialties}
            sections={sections}
            groups={groups}
            timetables={timetables}
          />
        </TabsContent>

        <TabsContent value="group-section" className="space-y-6">
          <GroupSectionTimetableViewer
            departments={departments}
            specialties={specialties}
            sections={sections}
            groups={groups}
            timetables={timetables}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
