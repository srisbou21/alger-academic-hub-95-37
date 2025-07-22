import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  CalendarDays,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

export interface Semester {
  id: string;
  name: string;
  year: string;
  type: 'automne' | 'printemps' | 'ete';
  startDate: string;
  endDate: string;
  isActive: boolean;
  totalWeeks: number;
  holidayPeriods: HolidayPeriod[];
}

export interface HolidayPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'vacances' | 'examens' | 'fermeture';
}

const mockSemesters: Semester[] = [
  {
    id: "1",
    name: "Semestre d'Automne",
    year: "2024-2025",
    type: "automne",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    isActive: true,
    totalWeeks: 17,
    holidayPeriods: [
      {
        id: "h1",
        name: "Vacances de Toussaint",
        startDate: "2024-10-28",
        endDate: "2024-11-03",
        type: "vacances"
      },
      {
        id: "h2",
        name: "Examens de fin de semestre",
        startDate: "2024-12-16",
        endDate: "2024-12-31",
        type: "examens"
      }
    ]
  },
  {
    id: "2",
    name: "Semestre de Printemps",
    year: "2024-2025",
    type: "printemps",
    startDate: "2025-01-15",
    endDate: "2025-05-31",
    isActive: false,
    totalWeeks: 19,
    holidayPeriods: [
      {
        id: "h3",
        name: "Vacances d'hiver",
        startDate: "2025-02-17",
        endDate: "2025-02-23",
        type: "vacances"
      }
    ]
  }
];

export const SemesterManager = () => {
  const [semesters, setSemesters] = useState<Semester[]>(mockSemesters);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const { toast } = useToast();

  const [newSemester, setNewSemester] = useState<Partial<Semester>>({
    name: "",
    year: "",
    type: "automne",
    startDate: "",
    endDate: "",
    isActive: false,
    totalWeeks: 0,
    holidayPeriods: []
  });

  const calculateWeeks = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const handleSaveSemester = () => {
    if (!newSemester.name || !newSemester.startDate || !newSemester.endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const totalWeeks = calculateWeeks(newSemester.startDate!, newSemester.endDate!);
    
    const semesterToSave: Semester = {
      ...newSemester as Semester,
      id: editingSemester ? editingSemester.id : Date.now().toString(),
      totalWeeks,
      holidayPeriods: newSemester.holidayPeriods || []
    };

    if (editingSemester) {
      setSemesters(prev => prev.map(s => s.id === editingSemester.id ? semesterToSave : s));
      toast({
        title: "Succès",
        description: "Semestre modifié avec succès"
      });
    } else {
      setSemesters(prev => [...prev, semesterToSave]);
      toast({
        title: "Succès",
        description: "Semestre ajouté avec succès"
      });
    }

    setShowAddDialog(false);
    setEditingSemester(null);
    setNewSemester({
      name: "",
      year: "",
      type: "automne",
      startDate: "",
      endDate: "",
      isActive: false,
      totalWeeks: 0,
      holidayPeriods: []
    });
  };

  const handleActivateSemester = (semesterId: string) => {
    setSemesters(prev => prev.map(s => ({
      ...s,
      isActive: s.id === semesterId
    })));
    
    toast({
      title: "Semestre activé",
      description: "Le semestre est maintenant actif pour les emplois du temps"
    });
  };

  const handleDeleteSemester = (semesterId: string) => {
    setSemesters(prev => prev.filter(s => s.id !== semesterId));
    toast({
      title: "Suppression",
      description: "Semestre supprimé"
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'automne': return 'bg-orange-100 text-orange-800';
      case 'printemps': return 'bg-green-100 text-green-800';
      case 'ete': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600';
  };

  const activeSemester = semesters.find(s => s.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6" />
            Gestion des Semestres
          </CardTitle>
          <p className="text-slate-600">
            Définissez les périodes académiques pour la planification des emplois du temps
          </p>
        </CardHeader>
      </Card>

      {/* Active Semester Summary */}
      {activeSemester && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Semestre Actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-green-600 font-medium">Nom</p>
                <p className="text-green-800">{activeSemester.name}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Période</p>
                <p className="text-green-800">
                  {new Date(activeSemester.startDate).toLocaleDateString()} - 
                  {new Date(activeSemester.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Durée</p>
                <p className="text-green-800">{activeSemester.totalWeeks} semaines</p>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Congés</p>
                <p className="text-green-800">{activeSemester.holidayPeriods.length} périodes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Semestres Configurés</h3>
              <Badge variant="secondary">{semesters.length} semestre(s)</Badge>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Semestre
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Semesters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {semesters.map(semester => (
          <Card key={semester.id} className={`${semester.isActive ? 'ring-2 ring-green-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{semester.name}</CardTitle>
                  <p className="text-sm text-slate-600">{semester.year}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(semester.type)}>
                    {semester.type}
                  </Badge>
                  <Badge className={getStatusColor(semester.isActive)}>
                    {semester.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700">Début</p>
                  <p className="text-slate-600">{new Date(semester.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Fin</p>
                  <p className="text-slate-600">{new Date(semester.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Durée</p>
                  <p className="text-slate-600">{semester.totalWeeks} semaines</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Congés</p>
                  <p className="text-slate-600">{semester.holidayPeriods.length} période(s)</p>
                </div>
              </div>

              {/* Holiday Periods */}
              {semester.holidayPeriods.length > 0 && (
                <div>
                  <p className="font-medium text-slate-700 mb-2">Périodes de congés</p>
                  <div className="space-y-1">
                    {semester.holidayPeriods.map(holiday => (
                      <div key={holiday.id} className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {holiday.type}
                        </Badge>
                        <span>{holiday.name}</span>
                        <span className="text-slate-500">
                          ({new Date(holiday.startDate).toLocaleDateString()} - 
                          {new Date(holiday.endDate).toLocaleDateString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setEditingSemester(semester);
                  setNewSemester(semester);
                  setShowAddDialog(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                
                {!semester.isActive && (
                  <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700"
                          onClick={() => handleActivateSemester(semester.id)}>
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteSemester(semester.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSemester ? "Modifier" : "Ajouter"} un Semestre
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du semestre *</Label>
              <Input
                id="name"
                value={newSemester.name}
                onChange={(e) => setNewSemester(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Semestre d'Automne"
              />
            </div>
            <div>
              <Label htmlFor="year">Année académique *</Label>
              <Input
                id="year"
                value={newSemester.year}
                onChange={(e) => setNewSemester(prev => ({ ...prev, year: e.target.value }))}
                placeholder="Ex: 2024-2025"
              />
            </div>
            <div>
              <Label htmlFor="type">Type de semestre</Label>
              <Select 
                value={newSemester.type} 
                onValueChange={(value: 'automne' | 'printemps' | 'ete') => 
                  setNewSemester(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automne">Automne</SelectItem>
                  <SelectItem value="printemps">Printemps</SelectItem>
                  <SelectItem value="ete">Été</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newSemester.isActive}
                onChange={(e) => setNewSemester(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isActive">Semestre actif</Label>
            </div>
            <div>
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                value={newSemester.startDate}
                onChange={(e) => {
                  const startDate = e.target.value;
                  setNewSemester(prev => ({ 
                    ...prev, 
                    startDate,
                    totalWeeks: calculateWeeks(startDate, prev.endDate || '')
                  }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={newSemester.endDate}
                onChange={(e) => {
                  const endDate = e.target.value;
                  setNewSemester(prev => ({ 
                    ...prev, 
                    endDate,
                    totalWeeks: calculateWeeks(prev.startDate || '', endDate)
                  }));
                }}
              />
            </div>
          </div>

          {newSemester.startDate && newSemester.endDate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Durée calculée: {calculateWeeks(newSemester.startDate, newSemester.endDate)} semaines
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveSemester}>
              {editingSemester ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};