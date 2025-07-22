import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Settings, Shield, AlertTriangle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Constraint {
  id: string;
  name: string;
  type: "mandatory" | "preferred" | "soft";
  priority: number;
  active: boolean;
  description: string;
  parameters?: Record<string, any>;
}

export const ConstraintManager = () => {
  const [constraints, setConstraints] = useState<Constraint[]>([
    {
      id: "C001",
      name: "Disponibilité Enseignants",
      type: "mandatory",
      priority: 10,
      active: true,
      description: "Les cours doivent respecter les créneaux de disponibilité des enseignants",
      parameters: { strict: true }
    },
    {
      id: "C002", 
      name: "Capacité des Salles",
      type: "mandatory",
      priority: 10,
      active: true,
      description: "Le nombre d'étudiants ne doit pas dépasser la capacité de la salle",
      parameters: { margin: 0 }
    },
    {
      id: "C003",
      name: "Équipements Spécialisés",
      type: "mandatory",
      priority: 9,
      active: true,
      description: "Les cours nécessitant des équipements spéciaux doivent être dans des salles adaptées",
      parameters: { checkEquipment: true }
    },
    {
      id: "C004",
      name: "Pause Déjeuner",
      type: "preferred",
      priority: 7,
      active: true,
      description: "Préserver une pause déjeuner d'au moins 1h entre 11h30 et 14h30",
      parameters: { minDuration: 60, timeSlot: "11:30-14:30" }
    },
    {
      id: "C005",
      name: "Équilibrage Charge Quotidienne",
      type: "soft",
      priority: 5,
      active: true,
      description: "Répartir équitablement les cours sur la semaine",
      parameters: { maxHoursPerDay: 8, preferredDays: 4 }
    }
  ]);

  const [newConstraint, setNewConstraint] = useState<{
    name: string;
    type: "mandatory" | "preferred" | "soft";
    priority: number;
    description: string;
  }>({
    name: "",
    type: "preferred",
    priority: 5,
    description: ""
  });

  const getConstraintColor = (type: string) => {
    switch (type) {
      case "mandatory": return "bg-red-100 text-red-800 border-red-200";
      case "preferred": return "bg-amber-100 text-amber-800 border-amber-200";
      case "soft": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getConstraintIcon = (type: string) => {
    switch (type) {
      case "mandatory": return <Shield className="h-4 w-4" />;
      case "preferred": return <AlertTriangle className="h-4 w-4" />;
      case "soft": return <CheckCircle2 className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const toggleConstraint = (id: string) => {
    setConstraints(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  const updatePriority = (id: string, priority: number) => {
    setConstraints(prev => prev.map(c => 
      c.id === id ? { ...c, priority } : c
    ));
  };

  const addConstraint = () => {
    if (!newConstraint.name) return;
    
    const constraint: Constraint = {
      id: `C${(constraints.length + 1).toString().padStart(3, '0')}`,
      name: newConstraint.name,
      type: newConstraint.type,
      priority: newConstraint.priority,
      active: true,
      description: newConstraint.description,
      parameters: {}
    };

    setConstraints(prev => [...prev, constraint]);
    setNewConstraint({ name: "", type: "preferred", priority: 5, description: "" });
  };

  const removeConstraint = (id: string) => {
    setConstraints(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestionnaire de Contraintes</h2>
          <p className="text-slate-600">Configuration flexible des règles métier et priorités</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Profil
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Obligatoires</p>
                <p className="text-2xl font-bold text-red-800">
                  {constraints.filter(c => c.type === "mandatory" && c.active).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Préférées</p>
                <p className="text-2xl font-bold text-amber-800">
                  {constraints.filter(c => c.type === "preferred" && c.active).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Souples</p>
                <p className="text-2xl font-bold text-blue-800">
                  {constraints.filter(c => c.type === "soft" && c.active).length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Actives</p>
                <p className="text-2xl font-bold text-green-800">
                  {constraints.filter(c => c.active).length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nouvelle contrainte */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-blue-800">Ajouter une Contrainte</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de la contrainte</label>
              <Input
                value={newConstraint.name}
                onChange={(e) => setNewConstraint(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Pause déjeuner obligatoire"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select 
                value={newConstraint.type} 
                onValueChange={(value: "mandatory" | "preferred" | "soft") => 
                  setNewConstraint(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mandatory">Obligatoire</SelectItem>
                  <SelectItem value="preferred">Préférée</SelectItem>
                  <SelectItem value="soft">Souple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              value={newConstraint.description}
              onChange={(e) => setNewConstraint(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la contrainte..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Priorité: {newConstraint.priority}
            </label>
            <Slider
              value={[newConstraint.priority]}
              onValueChange={([value]) => setNewConstraint(prev => ({ ...prev, priority: value }))}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <Button onClick={addConstraint} disabled={!newConstraint.name}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardContent>
      </Card>

      {/* Liste des contraintes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Contraintes Configurées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {constraints.map((constraint) => (
            <div key={constraint.id} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={constraint.active}
                    onCheckedChange={() => toggleConstraint(constraint.id)}
                  />
                  <div className="flex items-center gap-2">
                    {getConstraintIcon(constraint.type)}
                    <h4 className="font-medium text-slate-800">{constraint.name}</h4>
                  </div>
                  <Badge className={getConstraintColor(constraint.type)}>
                    {constraint.type === "mandatory" && "Obligatoire"}
                    {constraint.type === "preferred" && "Préférée"}
                    {constraint.type === "soft" && "Souple"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Priorité: {constraint.priority}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => removeConstraint(constraint.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-3">{constraint.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">ID: {constraint.id}</span>
                  {constraint.active && (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Priorité:</label>
                  <Slider
                    value={[constraint.priority]}
                    onValueChange={([value]) => updatePriority(constraint.id, value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-20"
                  />
                  <span className="text-sm w-6">{constraint.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
