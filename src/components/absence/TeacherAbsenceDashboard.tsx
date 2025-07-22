
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, FileText, Plus, Eye } from "lucide-react";
import { useState } from "react";

interface AbsenceRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  coursesAffected: number;
  submissionDate: string;
}

export const TeacherAbsenceDashboard = () => {
  const [absenceRequests] = useState<AbsenceRequest[]>([
    {
      id: "ABS001",
      startDate: "2024-06-20",
      endDate: "2024-06-21",
      reason: "Maladie",
      status: "pending",
      coursesAffected: 3,
      submissionDate: "2024-06-15"
    },
    {
      id: "ABS002",
      startDate: "2024-06-10",
      endDate: "2024-06-10",
      reason: "Formation",
      status: "approved",
      coursesAffected: 2,
      submissionDate: "2024-06-05"
    },
    {
      id: "ABS003",
      startDate: "2024-05-28",
      endDate: "2024-05-30",
      reason: "Congé personnel",
      status: "approved",
      coursesAffected: 5,
      submissionDate: "2024-05-20"
    }
  ]);

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

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble personnelle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Mes Prochaines Absences
            </CardTitle>
            <CardDescription>Absences programmées et approuvées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-800">Formation Pédagogique</h4>
                  <p className="text-sm text-blue-600">25-26 Juin 2024</p>
                  <p className="text-xs text-blue-500">3 cours concernés</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Approuvée</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-amber-800">Congé Médical</h4>
                  <p className="text-sm text-amber-600">2-3 Juillet 2024</p>
                  <p className="text-xs text-amber-500">2 cours concernés</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">En attente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Demande
            </Button>
            
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Mon Calendrier
            </Button>
            
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Historique
            </Button>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-slate-800 mb-2">Statistiques</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Demandes ce mois:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Taux d'approbation:</span>
                  <span className="font-medium text-green-600">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Jours d'absence:</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des demandes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique des Demandes
          </CardTitle>
          <CardDescription>Toutes vos demandes d'absence</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead className="text-center">Cours Affectés</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date Demande</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absenceRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    {request.startDate === request.endDate 
                      ? new Date(request.startDate).toLocaleDateString('fr-FR')
                      : `${new Date(request.startDate).toLocaleDateString('fr-FR')} - ${new Date(request.endDate).toLocaleDateString('fr-FR')}`
                    }
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell className="text-center">{request.coursesAffected}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.submissionDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Détails
                    </Button>
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
