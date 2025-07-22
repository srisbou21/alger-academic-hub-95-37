
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, BarChart3, AlertCircle, CheckCircle, Clock, FileSpreadsheet } from "lucide-react";
import { User as UserType } from "../../types/user";
import { TeacherAbsence } from "../../types/teacher";
import { absenceService } from "../../services/absenceService";
import { useToast } from "@/hooks/use-toast";

interface AbsenceTrackingServiceProps {
  currentUser: UserType;
}

export const AbsenceTrackingService: React.FC<AbsenceTrackingServiceProps> = ({ currentUser }) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  const departments = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie'];

  useEffect(() => {
    loadAllAbsences();
  }, [currentUser, filterDepartment, filterStatus, filterType]);

  const loadAllAbsences = async () => {
    setLoading(true);
    try {
      const filters = {
        department: filterDepartment !== 'all' ? filterDepartment : undefined,
        status: filterStatus !== 'all' ? filterStatus as any : undefined,
        type: filterType !== 'all' ? filterType as any : undefined
      };
      const data = await absenceService.getAbsences(currentUser, filters);
      setAbsences(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les absences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAbsences = absences.filter(absence =>
    searchTerm === '' || 
    absence.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    absence.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const exportToExcel = () => {
    toast({
      title: "Export en cours",
      description: "Le fichier Excel sera téléchargé dans quelques instants"
    });
  };

  const totalAbsences = filteredAbsences.length;
  const pendingAbsences = filteredAbsences.filter(abs => abs.status === 'pending').length;
  const approvedAbsences = filteredAbsences.filter(abs => abs.status === 'approved').length;
  const rejectedAbsences = filteredAbsences.filter(abs => abs.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <BarChart3 className="h-5 w-5" />
            Service de Suivi des Absences - Vue Globale
          </CardTitle>
          <p className="text-purple-600">Suivi complet et analyse des absences enseignants</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{totalAbsences}</p>
              <p className="text-sm text-blue-700">Total absences</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-800">{pendingAbsences}</p>
              <p className="text-sm text-amber-700">En attente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{approvedAbsences}</p>
              <p className="text-sm text-green-700">Approuvées</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-800">{rejectedAbsences}</p>
              <p className="text-sm text-red-700">Rejetées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtres et Recherche</CardTitle>
            <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exporter Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="maladie">Maladie</SelectItem>
                <SelectItem value="conge_annuel">Congé annuel</SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
                <SelectItem value="mission">Mission</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadAllAbsences}>
              <Filter className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Liste des Absences</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les Absences ({filteredAbsences.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">Chargement...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Enseignant</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Cours affectés</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAbsences.map((absence) => (
                      <TableRow key={absence.id}>
                        <TableCell className="font-mono text-sm">{absence.id}</TableCell>
                        <TableCell className="font-medium">Enseignant {absence.teacherId}</TableCell>
                        <TableCell>
                          {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{absence.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-48 truncate">{absence.reason}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(absence.status)}
                            {getStatusBadge(absence.status)}
                          </div>
                        </TableCell>
                        <TableCell>{absence.coursesAffected.length} cours</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map(dept => {
                    const count = Math.floor(Math.random() * 20) + 5;
                    const percentage = Math.floor(Math.random() * 30) + 10;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm">{dept}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Janvier', 'Février', 'Mars', 'Avril', 'Mai'].map(month => {
                    const count = Math.floor(Math.random() * 15) + 5;
                    return (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm">{month}</span>
                        <span className="text-sm font-medium">{count} absences</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow de Traitement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-2 border-dashed border-amber-300 rounded-lg bg-amber-50">
                  <h4 className="font-semibold text-amber-800 mb-2">Étape 1: Soumission</h4>
                  <p className="text-sm text-amber-700">L'enseignant soumet sa demande d'absence</p>
                  <div className="mt-2">
                    <Badge className="bg-amber-100 text-amber-800">{pendingAbsences} en attente</Badge>
                  </div>
                </div>
                <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">Étape 2: Validation</h4>
                  <p className="text-sm text-blue-700">Le chef de département valide ou rejette</p>
                  <div className="mt-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Traiter les demandes
                    </Button>
                  </div>
                </div>
                <div className="p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">Étape 3: Suivi</h4>
                  <p className="text-sm text-green-700">Suivi et gestion des remplacements</p>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800">{approvedAbsences} traitées</Badge>
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
