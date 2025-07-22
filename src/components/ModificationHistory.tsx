
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, User, Calendar, FileEdit, Database } from "lucide-react";
import { useState } from "react";

export const ModificationHistory = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("week");

  const modifications = [
    {
      id: "MOD-001",
      type: "grade",
      action: "Modification note",
      details: "Note de Karim Meziani: 12.5 → 13.0 (Microéconomie)",
      user: "Prof. Martin",
      timestamp: "2024-06-15 14:30:25",
      oldValue: "12.5",
      newValue: "13.0",
      reason: "Erreur de saisie corrigée"
    },
    {
      id: "MOD-002",
      type: "attendance",
      action: "Ajout absence",
      details: "Absence ajoutée pour Amina Benali (15/06/2024)",
      user: "Prof. Martin",
      timestamp: "2024-06-15 09:15:10",
      oldValue: "Présente",
      newValue: "Absente",
      reason: "Absence justifiée"
    },
    {
      id: "MOD-003",
      type: "grade",
      action: "Création note",
      details: "Note CC2 Fatima Ouali: 16.0 (Statistiques)",
      user: "Prof. Dubois",
      timestamp: "2024-06-14 16:45:33",
      oldValue: null,
      newValue: "16.0",
      reason: "Saisie initiale"
    },
    {
      id: "MOD-004",
      type: "schedule",
      action: "Modification planning",
      details: "Cours Microéconomie L3: Salle 201 → Amphi A",
      user: "Admin. Pédagogique",
      timestamp: "2024-06-14 11:20:15",
      oldValue: "Salle 201",
      newValue: "Amphi A",
      reason: "Changement de salle"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "grade": return <FileEdit className="h-4 w-4 text-blue-600" />;
      case "attendance": return <User className="h-4 w-4 text-amber-600" />;
      case "schedule": return <Calendar className="h-4 w-4 text-green-600" />;
      default: return <Database className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      grade: "bg-blue-100 text-blue-800",
      attendance: "bg-amber-100 text-amber-800", 
      schedule: "bg-green-100 text-green-800"
    };
    const labels = {
      grade: "Note",
      attendance: "Présence",
      schedule: "Planning"
    };
    
    return (
      <Badge className={styles[type as keyof typeof styles] || "bg-slate-100 text-slate-800"}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const filteredModifications = modifications.filter(mod => {
    if (filterType !== "all" && mod.type !== filterType) return false;
    
    const modDate = new Date(mod.timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - modDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (filterPeriod) {
      case "day": return diffDays === 0;
      case "week": return diffDays <= 7;
      case "month": return diffDays <= 30;
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Historique des Modifications</h2>
          <p className="text-slate-600">Traçabilité complète des modifications avec horodatage</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Modifications notes</p>
                <p className="text-2xl font-bold text-blue-800">23</p>
              </div>
              <FileEdit className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Gestion présences</p>
                <p className="text-2xl font-bold text-amber-800">15</p>
              </div>
              <User className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Planning</p>
                <p className="text-2xl font-bold text-green-800">8</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total cette semaine</p>
                <p className="text-2xl font-bold text-purple-800">46</p>
              </div>
              <History className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Journal des Modifications
          </CardTitle>
          <CardDescription>
            <div className="flex gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="grade">Notes</SelectItem>
                    <SelectItem value="attendance">Présences</SelectItem>
                    <SelectItem value="schedule">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Période</label>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="all">Toute période</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Horodatage</TableHead>
                <TableHead>Changement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModifications.map((mod) => (
                <TableRow key={mod.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(mod.type)}
                      {getTypeBadge(mod.type)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{mod.action}</TableCell>
                  <TableCell>{mod.details}</TableCell>
                  <TableCell>{mod.user}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(mod.timestamp).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {mod.oldValue && (
                        <div className="text-red-600">
                          <span className="line-through">{mod.oldValue}</span>
                        </div>
                      )}
                      <div className="text-green-600 font-medium">
                        {mod.newValue}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
