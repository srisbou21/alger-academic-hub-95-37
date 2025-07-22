import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Teacher } from "@/types/teacher";
import { TeacherDashboard } from './teachers/TeacherDashboard';
import { TeacherListView } from './teachers/TeacherListView';
import { TeacherForm } from './teachers/TeacherForm';
import { useToast } from "@/hooks/use-toast";
import { teacherService } from "@/services/teacherService";

export const TeacherManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const teachersData = await teacherService.getAllTeachers();
      setTeachers(teachersData);
      console.log(`${teachersData.length} enseignants chargés`);
    } catch (error) {
      console.error("Erreur lors du chargement des enseignants:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des enseignants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (teacherId: string, newStatus: boolean) => {
    try {
      console.log(`Changement de statut pour l'enseignant ${teacherId}: ${newStatus ? 'actif' : 'inactif'}`);
      await teacherService.updateTeacher(teacherId, { isActive: newStatus });
      
      // Mettre à jour localement la liste des enseignants
      setTeachers(prevTeachers =>
        prevTeachers.map(teacher =>
          teacher.id === teacherId ? { ...teacher, isActive: newStatus } : teacher
        )
      );
      
      console.log(`Statut de l'enseignant ${teacherId} modifié avec succès`);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      throw error; // Re-lancer l'erreur pour que le composant puisse l'afficher
    }
  };

  const handleAddTeacher = () => {
    setSelectedTeacher(undefined);
    setIsEditing(true);
    setActiveTab("form");
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditing(true);
    setActiveTab("form");
  };

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditing(false);
    setActiveTab("form");
  };

  const handleSaveTeacher = async (teacherData: Partial<Teacher>) => {
    setLoading(true);
    try {
      console.log("Sauvegarde de l'enseignant:", teacherData);
      
      if (selectedTeacher) {
        // Modification d'un enseignant existant
        await teacherService.updateTeacher(selectedTeacher.id, teacherData);
        console.log("Enseignant modifié avec succès");
        toast({
          title: "Enseignant modifié",
          description: "Les informations de l'enseignant ont été mises à jour avec succès.",
        });
      } else {
        // Création d'un nouvel enseignant
        await teacherService.createTeacher(teacherData as Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>);
        console.log("Nouvel enseignant créé avec succès");
        toast({
          title: "Enseignant ajouté",
          description: "Le nouvel enseignant a été ajouté avec succès.",
        });
      }
      
      // Recharger la liste des enseignants
      await loadTeachers();
      
      // Retourner à la liste
      setActiveTab("list");
      setSelectedTeacher(undefined);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'enseignant. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setActiveTab("list");
    setSelectedTeacher(undefined);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Liste des enseignants
          </TabsTrigger>
          <TabsTrigger 
            value="form"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            disabled={!isEditing && !selectedTeacher}
          >
            {selectedTeacher ? (isEditing ? "Modifier" : "Profil") : "Nouveau"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <TeacherDashboard />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <TeacherListView 
            teachers={teachers}
            loading={loading}
            onAddTeacher={handleAddTeacher}
            onEditTeacher={handleEditTeacher}
            onViewTeacher={handleViewTeacher}
            onRefresh={loadTeachers}
            onToggleStatus={handleToggleStatus}
          />
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          {(isEditing || selectedTeacher) && (
            <TeacherForm
              teacher={selectedTeacher}
              onSave={handleSaveTeacher}
              onCancel={handleCancelForm}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
