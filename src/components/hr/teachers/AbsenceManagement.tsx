import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Filter,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TeacherAbsence } from "@/types/teacher";

// Mock data pour les absences
const mockAbsences: TeacherAbsence[] = [
  {
    id: "1",
    teacherId: "1",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-16"),
    type: "maladie",
    reason: "Grippe saisonnière",
    isJustified: true,
    status: "approved",
    coursesAffected: ["Algorithmes avancés", "Structure de données"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    teacherId: "2",
    startDate: new Date("2024-03-18"),
    endDate: new Date("2024-03-22"),
    type: "formation",
    reason: "Formation pédagogique à l'étranger",
    isJustified: true,
    status: "approved",
    replacementTeacherId: "3",
    coursesAffected: ["Analyse numérique"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    teacherId: "3",
    startDate: new Date("2024-03-20"),
    endDate: new Date("2024-03-20"),
    type: "autre",
    reason: "Rendez-vous médical",
    isJustified: false,
    status: "pending",
    coursesAffected: ["Physique quantique"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock data pour les enseignants
const teachers = [
  { id: "1", name: "Ahmed Benali" },
  { id: "2", name: "Fatima Kader" },
  { id: "3", name: "Omar Messaoud" }
];

export const AbsenceManagement = () => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>(mockAbsences);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    teacherId: "",
    startDate: new Date(),
    endDate: new Date(),
    type: "",
    reason: "",
    isJustified: false,
    replacementTeacherId: "",
    coursesAffected: ""
  });

  const filteredAbsences = absences.filter(absence => {
    const teacher = teachers.find(t => t.id === absence.teacherId);
    const matchesSearch = teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || absence.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approuvée</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejetée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />En attente</Badge>;
      default:
        return <Badge variant="secondary">Inconnue</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      maladie: "Maladie",
      conge_annuel: "Congé annuel",
      formation: "Formation",
      mission: "Mission",
      autre: "Autre"
    };
    
    const colors = {
      maladie: "bg-red-100 text-red-800",
      conge_annuel: "bg-blue-100 text-blue-800",
      formation: "bg-green-100 text-green-800",
      mission: "bg-purple-100 text-purple-800",
      autre: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.autre}>
        {typeLabels[type as keyof typeof typeLabels] || type}
      </Badge>
    );
  };

  const handleSubmit = () => {
    const newAbsence: TeacherAbsence = {
      id: Date.now().toString(),
      teacherId: formData.teacherId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type as any,
      reason: formData.reason,
      isJustified: formData.isJustified,
      status: "pending",
      replacementTeacherId: formData.replacementTeacherId || undefined,
      coursesAffected: formData.coursesAffected.split(',').map(c => c.trim()).filter(c => c),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setAbsences([...absences, newAbsence]);
    setIsAddDialogOpen(false);
    setFormData({
      teacherId: "",
      startDate: new Date(),
      endDate: new Date(),
      type: "",
      reason: "",
      isJustified: false,
      replacementTeacherId: "",
      coursesAffected: ""
    });
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6" />
              Gestion des Absences ({filteredAbsences.length})
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Absence
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Enregistrer une nouvelle absence</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacher">Enseignant *</Label>
                      <Select value={formData.teacherId} onValueChange={(value) => setFormData({...formData, teacherId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un enseignant" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Type d'absence *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maladie">Maladie</SelectItem>
                          <SelectItem value="conge_annuel">Congé annuel</SelectItem>
                          <SelectItem value="formation">Formation</SelectItem>
                          <SelectItem value="mission">Mission</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(formData.startDate, "dd MMMM yyyy", { locale: fr })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => date && setFormData({...formData, startDate: date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date de fin *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(formData.endDate, "dd MMMM yyyy", { locale: fr })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => date && setFormData({...formData, endDate: date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Motif *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Décrivez le motif de l'absence..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="replacement">Enseignant remplaçant</Label>
                    <Select value={formData.replacementTeacherId} onValueChange={(value) => setFormData({...formData, replacementTeacherId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un remplaçant (optionnel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.filter(t => t.id !== formData.teacherId).map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="courses">Cours affectés</Label>
                    <Input
                      id="courses"
                      value={formData.coursesAffected}
                      onChange={(e) => setFormData({...formData, coursesAffected: e.target.value})}
                      placeholder="Liste des cours affectés (séparés par des virgules)"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit}>
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Filtres */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enseignant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAbsences.map((absence) => {
                const teacher = teachers.find(t => t.id === absence.teacherId);
                const replacement = teachers.find(t => t.id === absence.replacementTeacherId);
                const duration = calculateDuration(absence.startDate, absence.endDate);
                
                return (
                  <TableRow key={absence.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher?.name}</div>
                        {replacement && (
                          <div className="text-sm text-muted-foreground">
                            Remplacé par: {replacement.name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>{getTypeBadge(absence.type)}</TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div>Du {format(absence.startDate, "dd/MM/yyyy")}</div>
                        <div>Au {format(absence.endDate, "dd/MM/yyyy")}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{duration} jour{duration > 1 ? 's' : ''}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-xs truncate" title={absence.reason}>
                        {absence.reason}
                      </div>
                      {absence.coursesAffected.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {absence.coursesAffected.length} cours affecté{absence.coursesAffected.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>{getStatusBadge(absence.status)}</TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1">
                        {absence.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredAbsences.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune absence trouvée.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};