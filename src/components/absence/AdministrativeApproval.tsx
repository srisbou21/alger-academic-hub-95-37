
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, Eye, MessageSquare, Filter } from "lucide-react";
import { useState } from "react";

interface PendingRequest {
  id: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  reason: string;
  urgency: "low" | "normal" | "high" | "urgent";
  coursesAffected: number;
  submissionDate: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  department: string;
}

export const AdministrativeApproval = () => {
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const [requests] = useState<PendingRequest[]>([
    {
      id: "ABS001",
      teacherName: "Dr. Sarah Benali",
      startDate: "2024-06-20",
      endDate: "2024-06-21",
      reason: "Maladie",
      urgency: "high",
      coursesAffected: 3,
      submissionDate: "2024-06-15",
      status: "pending",
      department: "Économie"
    },
    {
      id: "ABS002",
      teacherName: "Prof. Ahmed Mansouri",
      startDate: "2024-06-25",
      endDate: "2024-06-25",
      reason: "Formation",
      urgency: "normal",
      coursesAffected: 2,
      submissionDate: "2024-06-14",
      status: "reviewing",
      department: "Gestion"
    },
    {
      id: "ABS003",
      teacherName: "Dr. Fatima Ouali",
      startDate: "2024-07-02",
      endDate: "2024-07-05",
      reason: "Congé personnel",
      urgency: "low",
      coursesAffected: 8,
      submissionDate: "2024-06-10",
      status: "pending",
      department: "Économie"
    }
  ]);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Élevé</Badge>;
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Faible</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case "reviewing":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    console.log(`Approuver demande ${id} avec commentaire:`, comment);
    setComment("");
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    console.log(`Rejeter demande ${id} avec commentaire:`, comment);
    setComment("");
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true;
    if (filter === "urgent") return request.urgency === "urgent" || request.urgency === "high";
    return request.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Approbation Administrative</h2>
          <p className="text-slate-600">Gestion des demandes d'absence en attente</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les demandes</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="reviewing">En cours</SelectItem>
              <SelectItem value="urgent">Urgentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">En Attente</p>
                <p className="text-2xl font-bold text-amber-800">{requests.filter(r => r.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">En Cours</p>
                <p className="text-2xl font-bold text-blue-800">{requests.filter(r => r.status === "reviewing").length}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Urgentes</p>
                <p className="text-2xl font-bold text-red-800">
                  {requests.filter(r => r.urgency === "urgent" || r.urgency === "high").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Traitées Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-800">7</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'Absence</CardTitle>
          <CardDescription>
            {filteredRequests.length} demande(s) {filter !== "all" && `(${filter})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enseignant</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Urgence</TableHead>
                <TableHead className="text-center">Cours</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className={selectedRequest === request.id ? "bg-blue-50" : ""}>
                  <TableCell className="font-medium">{request.teacherName}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>
                    {request.startDate === request.endDate 
                      ? new Date(request.startDate).toLocaleDateString('fr-FR')
                      : `${new Date(request.startDate).toLocaleDateString('fr-FR')} - ${new Date(request.endDate).toLocaleDateString('fr-FR')}`
                    }
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                  <TableCell className="text-center">{request.coursesAffected}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Panneau de détails et commentaires */}
      {selectedRequest && (
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageSquare className="h-5 w-5" />
              Détails et Commentaires - {selectedRequest}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Commentaire administratif</h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajoutez un commentaire pour cette demande..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(selectedRequest)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approuver
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReject(selectedRequest)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedRequest(null)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
