import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CareerPathEntry {
  id: string;
  position: string;
  grade: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  responsibilities: string[];
  achievements: string[];
}

interface CareerPathManagerProps {
  careerPath: CareerPathEntry[];
  onUpdate: (careerPath: CareerPathEntry[]) => void;
}

const ADMINISTRATIVE_GRADES = [
  'Secrétaire',
  'Attaché d\'Administration',
  'Attaché Principal d\'Administration',
  'Administrateur',
  'Administrateur Principal',
  'Chef de Service',
  'Sous-Directeur',
  'Directeur'
];

const ADMINISTRATIVE_DEPARTMENTS = [
  'Direction Générale',
  'Ressources Humaines',
  'Finances et Comptabilité',
  'Affaires Académiques',
  'Scolarité',
  'Recherche et Post-Graduation',
  'Relations Extérieures',
  'Maintenance et Sécurité',
  'Informatique',
  'Bibliothèque'
];

export const CareerPathManager: React.FC<CareerPathManagerProps> = ({
  careerPath,
  onUpdate
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CareerPathEntry | null>(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CareerPathEntry>>({
    position: "",
    grade: "",
    department: "",
    startDate: new Date(),
    endDate: undefined,
    isCurrent: false,
    responsibilities: [],
    achievements: []
  });

  const [newResponsibility, setNewResponsibility] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  const resetForm = () => {
    setFormData({
      position: "",
      grade: "",
      department: "",
      startDate: new Date(),
      endDate: undefined,
      isCurrent: false,
      responsibilities: [],
      achievements: []
    });
    setEditingEntry(null);
    setNewResponsibility("");
    setNewAchievement("");
  };

  const handleAddEntry = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditEntry = (entry: CareerPathEntry) => {
    setFormData(entry);
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleSaveEntry = () => {
    if (!formData.position || !formData.grade || !formData.department || !formData.startDate) {
      return;
    }

    const entryData: CareerPathEntry = {
      id: editingEntry?.id || Date.now().toString(),
      position: formData.position!,
      grade: formData.grade!,
      department: formData.department!,
      startDate: formData.startDate!,
      endDate: formData.endDate,
      isCurrent: formData.isCurrent || false,
      responsibilities: formData.responsibilities || [],
      achievements: formData.achievements || []
    };

    let updatedPath: CareerPathEntry[];
    if (editingEntry) {
      updatedPath = careerPath.map(entry => 
        entry.id === editingEntry.id ? entryData : entry
      );
    } else {
      updatedPath = [...careerPath, entryData];
    }

    // Si cette entrée est marquée comme actuelle, désactiver les autres
    if (entryData.isCurrent) {
      updatedPath = updatedPath.map(entry => ({
        ...entry,
        isCurrent: entry.id === entryData.id
      }));
    }

    onUpdate(updatedPath);
    setShowForm(false);
    resetForm();
  };

  const handleDeleteEntry = (id: string) => {
    const updatedPath = careerPath.filter(entry => entry.id !== id);
    onUpdate(updatedPath);
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...(prev.responsibilities || []), newResponsibility.trim()]
      }));
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities?.filter((_, i) => i !== index) || []
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), newAchievement.trim()]
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Parcours Professionnel</h3>
        <Button onClick={handleAddEntry} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une expérience
        </Button>
      </div>

      {/* Liste des expériences */}
      <div className="space-y-4">
        {careerPath.map((entry, index) => (
          <Card key={entry.id} className={`border-l-4 ${entry.isCurrent ? 'border-l-green-500' : 'border-l-blue-500'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{entry.position}</h4>
                    {entry.isCurrent && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Poste actuel
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                    <p><strong>Grade:</strong> {entry.grade}</p>
                    <p><strong>Département:</strong> {entry.department}</p>
                    <p><strong>Début:</strong> {format(entry.startDate, "dd MMMM yyyy", { locale: fr })}</p>
                    {entry.endDate && (
                      <p><strong>Fin:</strong> {format(entry.endDate, "dd MMMM yyyy", { locale: fr })}</p>
                    )}
                  </div>

                  {entry.responsibilities.length > 0 && (
                    <div className="mb-3">
                      <p className="font-medium text-sm mb-1">Responsabilités:</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.responsibilities.map((resp, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {resp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.achievements.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-1">Réalisations:</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.achievements.map((achievement, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditEntry(entry)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingEntry ? "Modifier l'expérience" : "Nouvelle expérience"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Poste *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Intitulé du poste"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMINISTRATIVE_GRADES.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Département *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMINISTRATIVE_DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date de début *</Label>
                <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? 
                        format(formData.startDate, "dd MMMM yyyy", { locale: fr }) :
                        "Sélectionner une date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, startDate: date }));
                        setShowStartCalendar(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? 
                        format(formData.endDate, "dd MMMM yyyy", { locale: fr }) :
                        "Poste actuel"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, endDate: date, isCurrent: !date }));
                        setShowEndCalendar(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? undefined : prev.endDate
                    }))}
                  />
                  <Label htmlFor="isCurrent">Poste actuel</Label>
                </div>
              </div>
            </div>

            {/* Responsabilités */}
            <div className="space-y-2">
              <Label>Responsabilités</Label>
              <div className="flex gap-2">
                <Input
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="Ajouter une responsabilité"
                  onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                />
                <Button type="button" onClick={addResponsibility}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.responsibilities?.map((resp, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-2">
                    {resp}
                    <Trash2 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeResponsibility(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Réalisations */}
            <div className="space-y-2">
              <Label>Réalisations</Label>
              <div className="flex gap-2">
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Ajouter une réalisation"
                  onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                />
                <Button type="button" onClick={addAchievement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.achievements?.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    {achievement}
                    <Trash2 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeAchievement(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveEntry} className="bg-green-600 hover:bg-green-700">
                {editingEntry ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};