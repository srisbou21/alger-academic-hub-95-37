
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Clock, Users, AlertTriangle, Plus, BarChart3, Download } from "lucide-react";
import { TeacherWorkload, WorkloadAssignment } from "../../types/workload";
import { workloadService } from "../../services/workloadService";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { permissionService } from "../../services/permissionService";
import { useToast } from "@/hooks/use-toast";

export const WorkloadManagement = () => {
  const [workloads, setWorkloads] = useState<TeacherWorkload[]>([]);
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedSemester, setSelectedSemester] = useState<'S1' | 'S2' | 'Année'>('Année');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const { toast } = useToast();

  const canViewAllWorkloads = currentUser && ['super_admin', 'admin_faculty', 'dept_head', 'pedagogy_head'].includes(currentUser.role);
  const canManageWorkloads = currentUser && ['super_admin', 'admin_faculty', 'dept_head'].includes(currentUser.role);

  useEffect(() => {
    loadWorkloads();
  }, [selectedYear, selectedSemester, currentUser]);

  const loadWorkloads = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await workloadService.getTeacherWorkloads(selectedYear);
      
      // Filtrer selon les permissions
      let filteredData = data;
      if (currentUser.role === 'teacher') {
        filteredData = data.filter(w => w.teacherId === currentUser.id);
      } else if (currentUser.role === 'dept_head') {
        // Filtrer par département (simulation)
        filteredData = data.filter(w => w.teacherName.includes('Ahmed') || w.teacherName.includes('Fatima'));
      }
      
      if (selectedSemester !== 'Année') {
        filteredData = filteredData.filter(w => w.semester === selectedSemester);
      }
      
      setWorkloads(filteredData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les charges d'enseignement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
      case 'overload':
        return <Badge className="bg-red-100 text-red-800">Surcharge</Badge>;
      case 'underload':
        return <Badge className="bg-yellow-100 text-yellow-800">Sous-charge</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalHours = workloads.reduce((sum, w) => sum + w.totalHours, 0);
  const averageHours = workloads.length > 0 ? totalHours / workloads.length : 0;
  const overloadedCount = workloads.filter(w => w.status === 'overload').length;
  const underloadedCount = workloads.filter(w => w.status === 'underload').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Gestion des Charges Pédagogiques
              </CardTitle>
              <p className="text-slate-600">
                {canViewAllWorkloads ? 
                  `Suivi et gestion des charges d'enseignement - ${currentUser?.role === 'dept_head' ? 'Département' : 'Faculté'}` :
                  "Consultation de vos charges d'enseignement"
                }
              </p>
            </div>
            {canManageWorkloads && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Attribution
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{Math.round(totalHours)}</p>
              <p className="text-sm text-blue-700">Heures Totales</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{Math.round(averageHours)}</p>
              <p className="text-sm text-green-700">Moyenne/Enseignant</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-800">{overloadedCount}</p>
              <p className="text-sm text-red-700">Surcharges</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Users className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-800">{underloadedCount}</p>
              <p className="text-sm text-yellow-700">Sous-charges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Année universitaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSemester} onValueChange={(value) => setSelectedSemester(value as 'S1' | 'S2' | 'Année')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Année">Année complète</SelectItem>
                <SelectItem value="S1">Semestre 1</SelectItem>
                <SelectItem value="S2">Semestre 2</SelectItem>
              </SelectContent>
            </Select>

            {canViewAllWorkloads && (
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Liste des Charges</TabsTrigger>
          {canViewAllWorkloads && <TabsTrigger value="statistics">Statistiques</TabsTrigger>}
          {canViewAllWorkloads && <TabsTrigger value="alerts">Alertes</TabsTrigger>}
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>
                Charges d'Enseignement ({workloads.length})
              </CardTitle>
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
                      <TableHead>Année/Semestre</TableHead>
                      <TableHead>Heures Totales</TableHead>
                      <TableHead>Heures Max</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière MAJ</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workloads.map((workload) => (
                      <TableRow key={workload.id}>
                        <TableCell className="font-medium">{workload.teacherName}</TableCell>
                        <TableCell>{workload.academicYear} - {workload.semester}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{workload.totalHours}h</span>
                            {workload.overloadHours && workload.overloadHours > 0 && (
                              <Badge variant="outline" className="text-red-600">
                                +{workload.overloadHours}h
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{workload.maxHours}h</TableCell>
                        <TableCell>{getStatusBadge(workload.status)}</TableCell>
                        <TableCell>
                          {workload.lastUpdated ? workload.lastUpdated.toLocaleDateString('fr-FR') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Détails
                            </Button>
                            {canManageWorkloads && (
                              <Button size="sm" variant="outline">
                                Modifier
                              </Button>
                            )}
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

        {canViewAllWorkloads && (
          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Détaillées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Répartition par Statut</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Normal</span>
                        <Badge className="bg-green-100 text-green-800">
                          {workloads.filter(w => w.status === 'normal').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Surcharge</span>
                        <Badge className="bg-red-100 text-red-800">
                          {overloadedCount}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Sous-charge</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {underloadedCount}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Moyennes</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Heures moyennes</span>
                        <span className="font-medium">{Math.round(averageHours)}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Taux d'occupation</span>
                        <span className="font-medium">{((averageHours / 180) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canViewAllWorkloads && (
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alertes et Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overloadedCount > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold text-red-800">Surcharges Détectées</h4>
                      </div>
                      <p className="text-red-700">
                        {overloadedCount} enseignant(s) en surcharge. Redistribution recommandée.
                      </p>
                    </div>
                  )}
                  
                  {underloadedCount > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-semibold text-yellow-800">Sous-charges Disponibles</h4>
                      </div>
                      <p className="text-yellow-700">
                        {underloadedCount} enseignant(s) peuvent prendre des heures supplémentaires.
                      </p>
                    </div>
                  )}
                  
                  {overloadedCount === 0 && underloadedCount === 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Répartition Équilibrée</h4>
                      </div>
                      <p className="text-green-700">
                        Toutes les charges sont dans les limites normales.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
