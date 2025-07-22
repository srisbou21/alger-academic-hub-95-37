import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  CheckSquare, 
  Edit, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpDown,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleItem {
  id: string;
  type: 'lecture' | 'td' | 'tp';
  subject: string;
  teacher: string;
  room: string;
  day: string;
  time: string;
  duration: number;
  section?: string;
  group?: string;
  students: number;
}

export const TimetableValidation = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: '1',
      type: 'lecture',
      subject: 'Algorithmes et Structures de Données',
      teacher: 'Dr. Martin',
      room: 'Amphithéâtre A',
      day: 'Lundi',
      time: '08:30-10:00',
      duration: 90,
      section: 'Section 1',
      students: 180
    },
    {
      id: '2',
      type: 'td',
      subject: 'Algorithmes - TD',
      teacher: 'Mme. Dubois',
      room: 'Salle 201',
      day: 'Mardi',
      time: '10:15-11:45',
      duration: 90,
      section: 'Section 1',
      group: 'Groupe 1',
      students: 30
    }
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidation = () => {
    setIsValidated(true);
    toast({
      title: "Validation réussie",
      description: "Les emplois du temps ont été validés et sont prêts pour la réservation"
    });
  };

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
    setIsEditing(true);
  };

  const handleSwap = () => {
    if (selectedItems.length !== 2) {
      toast({
        title: "Sélection invalide", 
        description: "Veuillez sélectionner exactement 2 cours pour la permutation",
        variant: "destructive"
      });
      return;
    }

    const [item1Id, item2Id] = selectedItems;
    const item1 = schedules.find(s => s.id === item1Id);
    const item2 = schedules.find(s => s.id === item2Id);

    if (item1 && item2) {
      setSchedules(schedules.map(schedule => {
        if (schedule.id === item1Id) {
          return { ...schedule, day: item2.day, time: item2.time, room: item2.room };
        }
        if (schedule.id === item2Id) {
          return { ...schedule, day: item1.day, time: item1.time, room: item1.room };
        }
        return schedule;
      }));

      setSelectedItems([]);
      setIsValidated(false); // Nécessite une re-validation après modification
      
      toast({
        title: "Permutation effectuée",
        description: "Les cours ont été échangés. Veuillez re-valider l'emploi du temps"
      });
    }
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'td': return 'bg-green-100 text-green-800 border-green-200';
      case 'tp': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture': return 'Cours Magistral';
      case 'td': return 'TD';
      case 'tp': return 'TP';
      default: return type;
    }
  };

  const conflicts = [
    {
      id: '1',
      type: 'time_overlap',
      message: 'Chevauchement horaire détecté',
      severity: 'high' as const,
      items: ['1', '2']
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            Validation et Modification des Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Validez les emplois du temps générés ou effectuez des modifications manuelles
          </p>
        </CardHeader>
      </Card>

      {/* Statut de validation */}
      <Card className={isValidated ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {isValidated ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Emplois du temps validés</p>
                  <p className="text-sm text-green-600">Prêts pour la phase de réservation</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Validation requise</p>
                  <p className="text-sm text-amber-600">Vérifiez et validez les emplois du temps</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Outils de modification */}
      <Card>
        <CardHeader>
          <CardTitle>Outils de Modification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleSwap}
              disabled={selectedItems.length !== 2}
              variant="outline"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Permuter ({selectedItems.length}/2)
            </Button>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier Manuellement
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Régénérer Sélection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conflits détectés */}
      {conflicts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Conflits Détectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                  <div>
                    <p className="font-medium text-red-800">{conflict.message}</p>
                    <p className="text-sm text-red-600">Cours concernés: {conflict.items.join(', ')}</p>
                  </div>
                  <Badge variant="destructive">
                    {conflict.severity === 'high' ? 'Critique' : 'Mineur'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des emplois du temps */}
      <Card>
        <CardHeader>
          <CardTitle>Emplois du Temps à Valider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedItems.includes(schedule.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggleSelection(schedule.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox"
                      checked={selectedItems.includes(schedule.id)}
                      onChange={() => toggleSelection(schedule.id)}
                      className="h-4 w-4"
                    />
                    <Badge className={getTypeColor(schedule.type)}>
                      {getTypeLabel(schedule.type)}
                    </Badge>
                    <div className="text-sm font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded">
                      {schedule.day} • {schedule.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">{schedule.subject}</p>
                    <p className="text-sm text-slate-500">
                      {schedule.teacher} • {schedule.room}
                    </p>
                    <p className="text-xs text-slate-400">
                      {schedule.section}
                      {schedule.group && ` - ${schedule.group}`} • {schedule.students} étudiants
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(schedule.id);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex gap-4">
            <Button 
              onClick={handleValidation}
              className="bg-green-600 hover:bg-green-700"
              disabled={isValidated}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isValidated ? "Déjà Validé" : "Valider les Emplois du Temps"}
            </Button>
            
            {isValidated && (
              <Button 
                onClick={() => setIsValidated(false)}
                variant="outline"
              >
                <X className="mr-2 h-4 w-4" />
                Annuler la Validation
              </Button>
            )}
            
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder Brouillon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};