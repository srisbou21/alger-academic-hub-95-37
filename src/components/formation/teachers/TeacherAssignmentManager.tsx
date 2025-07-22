
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save,
  UserPlus,
  BookOpen,
  Clock
} from "lucide-react";
import { FormationOffer } from "../../../types/academic";
import { academicConfigService } from "../../../services/academicConfigService";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: 'permanent' | 'contractual' | 'visiting';
}

interface Assignment {
  id: string;
  teacherId: string;
  formationId: string;
  moduleId: string;
  moduleName: string;
  semester: string;
  hours: number;
  type: 'cours' | 'td' | 'tp' | 'projet';
  academicYear: string;
  createdAt: Date;
}

interface TeacherAssignmentManagerProps {
  formations: FormationOffer[];
  onUpdateFormation: (formation: FormationOffer) => void;
}

export const TeacherAssignmentManager = ({ formations, onUpdateFormation }: TeacherAssignmentManagerProps) => {
  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Dr. Ahmed Benali',
      email: 'ahmed.benali@fsecsg.edu',
      specialization: 'Intelligence Artificielle',
      status: 'permanent'
    },
    {
      id: '2',
      name: 'Prof. Fatima Zahra',
      email: 'fatima.zahra@fsecsg.edu',
      specialization: 'Bases de Données',
      status: 'permanent'
    },
    {
      id: '3',
      name: 'Dr. Mohamed Alami',
      email: 'mohamed.alami@fsecsg.edu',
      specialization: 'Réseaux et Sécurité',
      status: 'contractual'
    }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      teacherId: '1',
      formationId: 'form1',
      moduleId: 'mod1',
      moduleName: 'Intelligence Artificielle Avancée',
      semester: 'S1',
      hours: 40,
      type: 'cours',
      academicYear: '2024-2025',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      teacherId: '2',
      formationId: 'form2',
      moduleId: 'mod2',
      moduleName: 'Conception de Bases de Données',
      semester: 'S2',
      hours: 30,
      type: 'td',
      academicYear: '2024-2025',
      createdAt: new Date('2024-01-20')
    }
  ]);

  const [availableFormations, setAvailableFormations] = useState<FormationOffer[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [filterFormation, setFilterFormation] = useState('all');

  const [formData, setFormData] = useState({
    teacherId: '',
    formationId: '',
    moduleId: '',
    moduleName: '',
    semester: '',
    hours: 0,
    type: 'cours' as 'cours' | 'td' | 'tp' | 'projet',
    academicYear: '2024-2025'
  });

  const { toast } = useToast();

  useEffect(() => {
    loadAvailableFormations();
  }, []);

  const loadAvailableFormations = async () => {
    try {
      const formationsData = await academicConfigService.getFormationOffers();
      setAvailableFormations(formationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    }
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    setFormData({
      teacherId: '',
      formationId: '',
      moduleId: '',
      moduleName: '',
      semester: '',
      hours: 0,
      type: 'cours',
      academicYear: '2024-2025'
    });
    setIsEditing(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      teacherId: assignment.teacherId,
      formationId: assignment.formationId,
      moduleId: assignment.moduleId,
      moduleName: assignment.moduleName,
      semester: assignment.semester,
      hours: assignment.hours,
      type: assignment.type,
      academicYear: assignment.academicYear
    });
    setIsEditing(true);
  };

  const handleSaveAssignment = () => {
    if (selectedAssignment) {
      // Modifier une affectation existante
      setAssignments(prev => prev.map(a => 
        a.id === selectedAssignment.id 
          ? { ...a, ...formData }
          : a
      ));
      toast({
        title: "Succès",
        description: "Affectation modifiée avec succès"
      });
    } else {
      // Créer une nouvelle affectation
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      };
      setAssignments(prev => [...prev, newAssignment]);
      toast({
        title: "Succès",
        description: "Nouvelle affectation créée avec succès"
      });
    }
    setIsEditing(false);
    setSelectedAssignment(null);
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette affectation ?")) {
      setAssignments(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Succès",
        description: "Affectation supprimée avec succès"
      });
    }
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Enseignant inconnu';
  };

  const getFormationName = (formationId: string) => {
    const formation = availableFormations.find(f => f.id === formationId);
    return formation ? formation.name : 'Formation inconnue';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const teacherName = getTeacherName(assignment.teacherId);
    const formationName = getFormationName(assignment.formationId);
    
    const matchesSearch = 
      teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.moduleName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTeacher = filterTeacher === 'all' || assignment.teacherId === filterTeacher;
    const matchesFormation = filterFormation === 'all' || assignment.formationId === filterFormation;
    
    return matchesSearch && matchesTeacher && matchesFormation;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      permanent: "bg-green-100 text-green-800",
      contractual: "bg-blue-100 text-blue-800",
      visiting: "bg-orange-100 text-orange-800"
    };
    return styles[status as keyof typeof styles] || styles.permanent;
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      cours: "bg-purple-100 text-purple-800",
      td: "bg-blue-100 text-blue-800",
      tp: "bg-green-100 text-green-800",
      projet: "bg-orange-100 text-orange-800"
    };
    return styles[type as keyof typeof styles] || styles.cours;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestion des Affectations d'Enseignants
          </CardTitle>
          <p className="text-slate-600">
            Gérez les affectations d'enseignants pour chaque formation et module
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Affectations</TabsTrigger>
          <TabsTrigger value="teachers">Enseignants</TabsTrigger>
          <TabsTrigger value="create">Nouvelle Affectation</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Rechercher par enseignant, formation ou module..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par enseignant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les enseignants</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateAssignment} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Affectation
            </Button>
          </div>

          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{assignment.moduleName}</h3>
                        <Badge className={getTypeBadge(assignment.type)}>
                          {assignment.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {assignment.semester}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-slate-700">Enseignant</p>
                          <p className="text-slate-600">{getTeacherName(assignment.teacherId)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Formation</p>
                          <p className="text-slate-600">{getFormationName(assignment.formationId)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Volume horaire</p>
                          <p className="text-slate-600 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {assignment.hours}h
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-slate-500">
                        Année académique: {assignment.academicYear} • 
                        Créé le {assignment.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAssignment(assignment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAssignments.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Aucune affectation trouvée</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Enseignants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((teacher) => (
                  <Card key={teacher.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{teacher.name}</h4>
                        <Badge className={getStatusBadge(teacher.status)}>
                          {teacher.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{teacher.email}</p>
                      <p className="text-sm text-slate-700">
                        <BookOpen className="h-4 w-4 inline mr-1" />
                        {teacher.specialization}
                      </p>
                      <div className="text-xs text-slate-500">
                        {assignments.filter(a => a.teacherId === teacher.id).length} affectation(s)
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  {selectedAssignment ? 'Modifier l\'Affectation' : 'Nouvelle Affectation'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Enseignant</Label>
                    <Select 
                      value={formData.teacherId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un enseignant" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="formation">Formation</Label>
                    <Select 
                      value={formData.formationId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, formationId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une formation" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFormations.map(formation => (
                          <SelectItem key={formation.id} value={formation.id}>
                            {formation.name} ({formation.level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moduleName">Nom du Module</Label>
                  <Input
                    id="moduleName"
                    value={formData.moduleName}
                    onChange={(e) => setFormData(prev => ({ ...prev, moduleName: e.target.value }))}
                    placeholder="Ex: Intelligence Artificielle Avancée"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semestre</Label>
                    <Select 
                      value={formData.semester} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Semestre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S1">Semestre 1</SelectItem>
                        <SelectItem value="S2">Semestre 2</SelectItem>
                        <SelectItem value="S3">Semestre 3</SelectItem>
                        <SelectItem value="S4">Semestre 4</SelectItem>
                        <SelectItem value="S5">Semestre 5</SelectItem>
                        <SelectItem value="S6">Semestre 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: 'cours' | 'td' | 'tp' | 'projet') => 
                        setFormData(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cours">Cours</SelectItem>
                        <SelectItem value="td">TD</SelectItem>
                        <SelectItem value="tp">TP</SelectItem>
                        <SelectItem value="projet">Projet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hours">Volume horaire</Label>
                    <Input
                      id="hours"
                      type="number"
                      value={formData.hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) }))}
                      min="1"
                      max="200"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveAssignment} className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Cliquez sur "Nouvelle Affectation" pour commencer</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
