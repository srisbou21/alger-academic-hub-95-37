
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Calendar, AlertTriangle, CheckCircle2, FileText, TrendingUp, Filter } from "lucide-react";
import { User as UserType } from "../../types/user";
import { TeacherAbsence } from "../../types/teacher";
import { absenceService } from "../../services/absenceService";
import { useToast } from "@/hooks/use-toast";

interface DepartmentAbsenceTrackingProps {
  currentUser: UserType;
}

export const DepartmentAbsenceTracking: React.FC<DepartmentAbsenceTrackingProps> = ({ currentUser }) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('month');
  const { toast } = useToast();

  useEffect(() => {
    loadDepartmentAbsences();
  }, [currentUser, filterStatus, filterPeriod]);

  const loadDepartmentAbsences = async () => {
    setLoading(true);
    try {
      const filters = {
        department: currentUser.department,
        status: filterStatus !== 'all' ? filterStatus as any : undefined
      };
      const data = await absenceService.getAbsences(currentUser, filters);
      setAbsences(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les absences du département",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAbsence = async (absenceId: string) => {
    try {
      await absenceService.approveAbsence(currentUser, absenceId);
      await loadDepartmentAbsences();
      toast({
        title: "Succès",
        description: "Absence approuvée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'absence",
        variant: "destructive"
      });
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

  const pendingCount = absences.filter(abs => abs.status === 'pending').length;
  const approvedCount = absences.filter(abs => abs.status === 'approved').length;
  const totalTeachers = new Set(absences.map(abs => abs.teacherId)).size;

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Users className="h-5 w-5" />
            Suivi des Absences - Département {currentUser.department}
          </CardTitle>
          <p className="text-blue-600">Gestion et suivi des absences enseignants</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-800">{pendingCount}</p>
              <p className="text-sm text-amber-700">En attente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{approvedCount}</p>
              <p className="text-sm text-green-700">Approuvées</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{totalTeachers}</p>
              <p className="text-sm text-blue-700">Enseignants concernés</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-800">{absences.length}</p>
              <p className="text-sm text-purple-700">Total absences</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="approved">Approuvées</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Demandes en Attente d'Approbation
                </CardTitle>
                <div className="flex gap-2">
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="quarter">Ce trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">Chargement...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Enseignant</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Cours affectés</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absences.filter(abs => abs.status === 'pending').map((absence) => (
                      <TableRow key={absence.id}>
                        <TableCell className="font-medium">Enseignant {absence.teacherId}</TableCell>
                        <TableCell>
                          {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{absence.type}</Badge>
                        </TableCell>
                        <TableCell>{absence.reason}</TableCell>
                        <TableCell>{absence.coursesAffected.length} cours</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveAbsence(absence.id)}
                            >
                              Approuver
                            </Button>
                            <Button size="sm" variant="outline">
                              Détails
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Absences Approuvées</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Remplacement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.filter(abs => abs.status === 'approved').map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>Enseignant {absence.teacherId}</TableCell>
                      <TableCell>
                        {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{absence.type}</TableCell>
                      <TableCell>{getStatusBadge(absence.status)}</TableCell>
                      <TableCell>
                        {absence.replacementTeacherId ? (
                          <Badge className="bg-blue-100 text-blue-800">Remplacé</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800">À assigner</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analyse des Absences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Répartition par type</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Maladie:</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Formation:</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Congé annuel:</span>
                      <span className="font-medium">35%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Tendances mensuelles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ce mois:</span>
                      <span className="font-medium text-green-600">-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mois dernier:</span>
                      <span className="font-medium">12 absences</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moyenne:</span>
                      <span className="font-medium">8 absences/mois</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Génération de Rapports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  Rapport Mensuel
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Analyse Annuelle
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  Rapport par Enseignant
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-2" />
                  Planning Remplacements
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
