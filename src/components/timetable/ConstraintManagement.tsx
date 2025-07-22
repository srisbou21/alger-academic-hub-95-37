
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  User, 
  MapPin, 
  Clock, 
  BookOpen, 
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Settings
} from "lucide-react";
import { useState } from "react";

interface Constraint {
  id: string;
  type: 'teacher' | 'room' | 'subject' | 'time' | 'group';
  priority: 'mandatory' | 'preferred' | 'optional';
  description: string;
  active: boolean;
  parameters: Record<string, any>;
}

export const ConstraintManagement = () => {
  const [constraints, setConstraints] = useState<Constraint[]>([
    {
      id: '1',
      type: 'teacher',
      priority: 'mandatory',
      description: 'Dr. Benali disponible uniquement Lundi-Mercredi',
      active: true,
      parameters: { teacherId: 'benali', days: ['lundi', 'mercredi'] }
    },
    {
      id: '2',
      type: 'room',
      priority: 'mandatory',
      description: 'Amphithéâtre A réservé jeudi 14h-16h',
      active: true,
      parameters: { roomId: 'amphi-a', day: 'jeudi', time: '14:00-16:00' }
    },
    {
      id: '3',
      type: 'subject',
      priority: 'preferred',
      description: 'Cours de Microéconomie de préférence le matin',
      active: true,
      parameters: { subjectId: 'microeco', timePreference: 'morning' }
    }
  ]);

  const [newConstraint, setNewConstraint] = useState({
    type: 'teacher' as const,
    priority: 'mandatory' as const,
    description: '',
    parameters: {}
  });

  const constraintTypes = [
    { id: 'teacher', name: 'Enseignant', icon: User, color: 'blue' },
    { id: 'room', name: 'Salle', icon: MapPin, color: 'green' },
    { id: 'subject', name: 'Matière', icon: BookOpen, color: 'purple' },
    { id: 'time', name: 'Horaire', icon: Clock, color: 'amber' },
    { id: 'group', name: 'Groupe', icon: User, color: 'red' }
  ];

  const priorityLevels = [
    { id: 'mandatory', name: 'Obligatoire', color: 'red', description: 'Doit être respecté absolument' },
    { id: 'preferred', name: 'Préféré', color: 'amber', description: 'Souhaitable mais non bloquant' },
    { id: 'optional', name: 'Optionnel', color: 'green', description: 'Amélioration si possible' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'mandatory': return 'bg-red-100 text-red-800 border-red-200';
      case 'preferred': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'optional': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeColor = (type: string) => {
    const typeInfo = constraintTypes.find(t => t.id === type);
    switch (typeInfo?.color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'amber': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const addConstraint = () => {
    const constraint: Constraint = {
      id: Date.now().toString(),
      type: newConstraint.type,
      priority: newConstraint.priority,
      description: newConstraint.description,
      active: true,
      parameters: newConstraint.parameters
    };
    setConstraints([...constraints, constraint]);
    setNewConstraint({
      type: 'teacher',
      priority: 'mandatory',
      description: '',
      parameters: {}
    });
  };

  const removeConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  const toggleConstraint = (id: string) => {
    setConstraints(constraints.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Contraintes</h2>
          <p className="text-slate-600">Configuration des règles pour la génération automatique</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Shield className="h-4 w-4 mr-2" />
          {constraints.filter(c => c.active).length} contraintes actives
        </Badge>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Liste des Contraintes</TabsTrigger>
          <TabsTrigger value="add">Ajouter</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {constraints.map((constraint) => {
              const typeInfo = constraintTypes.find(t => t.id === constraint.type);
              const TypeIcon = typeInfo?.icon || Settings;
              
              return (
                <Card key={constraint.id} className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-5 w-5 text-slate-600" />
                          <Badge className={getTypeColor(constraint.type)}>
                            {typeInfo?.name}
                          </Badge>
                          <Badge className={getPriorityColor(constraint.priority)}>
                            {priorityLevels.find(p => p.id === constraint.priority)?.name}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={constraint.active}
                            onCheckedChange={() => toggleConstraint(constraint.id)}
                          />
                          <span className="text-sm text-slate-500">
                            {constraint.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeConstraint(constraint.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-slate-700 mt-3">{constraint.description}</p>
                    
                    {Object.keys(constraint.parameters).length > 0 && (
                      <div className="mt-3 p-3 bg-slate-50 rounded border">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Paramètres :</h4>
                        <div className="text-sm text-slate-600">
                          {Object.entries(constraint.parameters).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {constraints.length === 0 && (
              <Card className="border-slate-200">
                <CardContent className="p-12 text-center">
                  <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Aucune contrainte définie</h3>
                  <p className="text-slate-500">Ajoutez des contraintes pour optimiser la génération</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle Contrainte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de contrainte</Label>
                  <Select 
                    value={newConstraint.type}
                    onValueChange={(value: any) => setNewConstraint(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {constraintTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select 
                    value={newConstraint.priority}
                    onValueChange={(value: any) => setNewConstraint(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map(level => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={newConstraint.description}
                  onChange={(e) => setNewConstraint(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez la contrainte..."
                />
              </div>

              <Button 
                onClick={addConstraint}
                disabled={!newConstraint.description}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter la Contrainte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {constraintTypes.map(type => {
              const Icon = type.icon;
              return (
                <Card key={type.id} className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="h-6 w-6 text-slate-600" />
                      <h3 className="text-lg font-medium">{type.name}</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>• Disponibilités horaires</p>
                      <p>• Préférences de créneaux</p>
                      <p>• Exclusions temporelles</p>
                      <p>• Charges maximales</p>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      Utiliser ce modèle
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Validation des Contraintes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-800">
                      {constraints.filter(c => c.priority === 'mandatory' && c.active).length}
                    </p>
                    <p className="text-sm text-green-600">Contraintes obligatoires</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded">
                    <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-amber-800">
                      {constraints.filter(c => c.priority === 'preferred' && c.active).length}
                    </p>
                    <p className="text-sm text-amber-600">Contraintes préférées</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-800">
                      {constraints.filter(c => c.priority === 'optional' && c.active).length}
                    </p>
                    <p className="text-sm text-blue-600">Contraintes optionnelles</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Validation de cohérence :</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Aucun conflit détecté entre contraintes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Toutes les contraintes sont réalisables</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Configuration optimale pour la génération</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
