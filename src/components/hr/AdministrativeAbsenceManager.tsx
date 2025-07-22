
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, CheckCircle2, Clock, AlertTriangle, Plus } from "lucide-react";
import { AdministrativeAbsence } from "../../types/administrative";
import { administrativeService } from "../../services/administrativeService";
import { useToast } from "@/hooks/use-toast";

export const AdministrativeAbsenceManager = () => {
  const [absences, setAbsences] = useState<AdministrativeAbsence[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadAbsences();
  }, []);

  const loadAbsences = async () => {
    setLoading(true);
    try {
      const data = await administrativeService.getAbsences();
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      'maladie': 'Maladie',
      'conge_annuel': 'Congé annuel',
      'conge_maternite': 'Congé maternité',
      'conge_paternite': 'Congé paternité',
      'conge_sans_solde': 'Congé sans solde',
      'mission_officielle': 'Mission officielle',
      'formation': 'Formation',
      'autre': 'Autre'
    };
    return <Badge variant="outline">{typeLabels[type as keyof typeof typeLabels] || type}</Badge>;
  };

  const filteredAbsences = absences.filter(absence => {
    if (filterStatus !== 'all' && absence.status !== filterStatus) return false;
    if (filterType !== 'all' && absence.type !== filterType) return false;
    return true;
  });

  const pendingCount = absences.filter(abs => abs.status === 'pending').length;
  const approvedCount = absences.filter(abs => abs.status === 'approved').length;
  const completedCount = absences.filter(abs => abs.status === 'completed').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gestion des Absences - Personnel Administratif
              </CardTitle>
              <p className="text-slate-600">Suivi et gestion des absences du personnel administratif</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Absence
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
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
              <p className="text-2xl font-bold text-blue-800">{completedCount}</p>
              <p className="text-sm text-blue-700">Terminées</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <AlertTriangle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-800">{absences.length}</p>
              <p className="text-sm text-purple-700">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvée</SelectItem>
                <SelectItem value="rejected">Rejetée</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="maladie">Maladie</SelectItem>
                <SelectItem value="conge_annuel">Congé annuel</SelectItem>
                <SelectItem value="conge_maternite">Congé maternité</SelectItem>
                <SelectItem value="mission_officielle">Mission officielle</SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Liste des Absences</TabsTrigger>
          <TabsTrigger value="pending">En Attente</TabsTrigger>
          <TabsTrigger value="approved">Approuvées</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les Absences ({filteredAbsences.length})</CardTitle>
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
                      <TableHead>Personnel</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Remplacement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAbsences.map((absence) => (
                      <TableRow key={absence.id}>
                        <TableCell className="font-medium">{absence.staffName}</TableCell>
                        <TableCell>{getTypeBadge(absence.type)}</TableCell>
                        <TableCell>
                          {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>{absence.duration} jour(s)</TableCell>
                        <TableCell>{getStatusBadge(absence.status)}</TableCell>
                        <TableCell>
                          {absence.replacement?.replacementStaffName ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              {absence.replacement.replacementStaffName}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Non assigné</Badge>
                          )}
                        </TableCell>
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

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Demandes en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.filter(abs => abs.status === 'pending').map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">{absence.staffName}</TableCell>
                      <TableCell>{getTypeBadge(absence.type)}</TableCell>
                      <TableCell>
                        {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="max-w-48 truncate">{absence.reason}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approuver
                          </Button>
                          <Button size="sm" variant="outline">
                            Rejeter
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Absences Approuvées</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Remplacement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.filter(abs => abs.status === 'approved').map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">{absence.staffName}</TableCell>
                      <TableCell>{getTypeBadge(absence.type)}</TableCell>
                      <TableCell>
                        {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {absence.replacement?.replacementStaffName ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            {absence.replacement.replacementStaffName}
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            Assigner
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Gérer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
