
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Search, Edit, Eye, RefreshCw } from "lucide-react";
import { Teacher } from "@/types/teacher";

interface TeacherListViewProps {
  teachers: Teacher[];
  loading: boolean;
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onViewTeacher: (teacher: Teacher) => void;
  onRefresh: () => void;
  onToggleStatus?: (teacherId: string, newStatus: boolean) => void;
}

export const TeacherListView: React.FC<TeacherListViewProps> = ({
  teachers,
  loading,
  onAddTeacher,
  onEditTeacher,
  onViewTeacher,
  onRefresh,
  onToggleStatus
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = async (teacher: Teacher) => {
    const newStatus = !teacher.isActive;
    
    if (onToggleStatus) {
      try {
        await onToggleStatus(teacher.id, newStatus);
        toast({
          title: "Statut modifié",
          description: `${teacher.firstName} ${teacher.lastName} est maintenant ${newStatus ? 'actif' : 'inactif'}`,
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le statut de l'enseignant",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Liste des Enseignants ({teachers.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button onClick={onAddTeacher} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel enseignant
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Chargement des enseignants...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">
            {teachers.length === 0 ? "Aucun enseignant trouvé" : "Aucun enseignant correspond à votre recherche"}
          </p>
          {teachers.length === 0 && (
            <Button onClick={onAddTeacher} className="mt-4 bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le premier enseignant
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {teacher.firstName[0]}{teacher.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{teacher.firstName} {teacher.lastName}</h3>
                      <p className="text-muted-foreground">{teacher.specialty}</p>
                      <p className="text-sm text-muted-foreground">{teacher.grade} - Échelon {teacher.echelon}</p>
                      <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant={teacher.isActive ? "default" : "secondary"}>
                        {teacher.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      {onToggleStatus && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {teacher.isActive ? 'Actif' : 'Inactif'}
                          </span>
                          <Switch
                            checked={teacher.isActive}
                            onCheckedChange={() => handleStatusToggle(teacher)}
                            aria-label={`Basculer le statut de ${teacher.firstName} ${teacher.lastName}`}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onViewTeacher(teacher)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => onEditTeacher(teacher)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
