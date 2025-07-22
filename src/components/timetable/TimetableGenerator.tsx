import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SemesterReservationManager } from "./SemesterReservationManager";
import { TimetableIntegration } from "./TimetableIntegration";
import { ManualTimetableCreator } from "./ManualTimetableCreator";
import { DepartmentManagement } from "./DepartmentManagement";
import { TimetableValidationManager } from "./TimetableValidationManager";
import { CompactAIGenerator } from "./ai/CompactAIGenerator";
import { TimetableViewer } from "./TimetableViewer";
import { WorkloadMainDashboard } from "../workload/WorkloadMainDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, Link, Zap, Users, CheckCircle2, Sparkles, Eye, Clock, Settings } from "lucide-react";

// Mock data pour la démonstration avec les propriétés complètes
const mockDepartments = [
  { 
    id: "1", 
    name: "Informatique", 
    code: "INFO", 
    facultyId: "1", 
    head: "Dr. Dupont", 
    isActive: true,
    isValidated: true,
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: "2", 
    name: "Mathématiques", 
    code: "MATH", 
    facultyId: "1", 
    head: "Dr. Martin", 
    isActive: true,
    isValidated: true,
    createdAt: new Date(), 
    updatedAt: new Date() 
  }
];

const mockSpecialties = [
  { 
    id: "1", 
    name: "Licence Informatique", 
    code: "L-INFO", 
    filiereId: "1", 
    level: "licence" as const, 
    duration: 3, 
    isActive: true,
    isValidated: true,
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: "2", 
    name: "Master Informatique", 
    code: "M-INFO", 
    filiereId: "1", 
    level: "master" as const, 
    duration: 2, 
    isActive: true,
    isValidated: true,
    createdAt: new Date(), 
    updatedAt: new Date() 
  }
];

const mockSections = [
  { 
    id: "1", 
    name: "Section A", 
    code: "A", 
    capacity: 40, 
    currentEnrollment: 38,
    specialtyId: "1",
    groups: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: "2", 
    name: "Section B", 
    code: "B", 
    capacity: 40, 
    currentEnrollment: 35,
    specialtyId: "1",
    groups: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockGroups = [
  { 
    id: "1", 
    name: "Groupe TD1", 
    code: "TD1", 
    sectionId: "1", 
    capacity: 20, 
    currentEnrollment: 19,
    type: "td" as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: "2", 
    name: "Groupe TP1", 
    code: "TP1", 
    sectionId: "1", 
    capacity: 15, 
    currentEnrollment: 14,
    type: "tp" as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockTimetables = [
  {
    id: "1",
    subject: "Programmation Java",
    teacher: "Dr. Bernard",
    room: "Salle 101",
    day: "Lundi",
    startTime: "08:00",
    endTime: "09:30",
    type: "cours" as const,
    specialtyId: "1",
    sectionId: "1"
  },
  {
    id: "2",
    subject: "Base de Données",
    teacher: "Mme. Durand",
    room: "Lab Info 1",
    day: "Mardi",
    startTime: "14:00",
    endTime: "15:30",
    type: "tp" as const,
    specialtyId: "1",
    sectionId: "1",
    groupId: "2"
  },
  {
    id: "3",
    subject: "Algorithmique",
    teacher: "Dr. Martin",
    room: "Salle 102",
    day: "Mercredi",
    startTime: "09:45",
    endTime: "11:15",
    type: "td" as const,
    specialtyId: "1",
    sectionId: "1",
    groupId: "1"
  }
];

export const TimetableGenerator = () => {
  const [activeTab, setActiveTab] = useState("ai-generator");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="ai-generator" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            IA Générateur
          </TabsTrigger>
          <TabsTrigger value="workload-dashboard" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Charges & Sections
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visualisation
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Création Manuelle
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Génération Avancée
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Départements
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Intégration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-generator">
          <CompactAIGenerator />
        </TabsContent>

        <TabsContent value="workload-dashboard">
          <WorkloadMainDashboard />
        </TabsContent>

        <TabsContent value="viewer">
          <TimetableViewer 
            departments={mockDepartments}
            specialties={mockSpecialties}
            sections={mockSections}
            groups={mockGroups}
            timetables={mockTimetables}
          />
        </TabsContent>

        <TabsContent value="manual">
          <ManualTimetableCreator />
        </TabsContent>

        <TabsContent value="validation">
          <TimetableValidationManager />
        </TabsContent>

        <TabsContent value="generator">
          <SemesterReservationManager />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentManagement />
        </TabsContent>

        <TabsContent value="integration">
          <TimetableIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};
