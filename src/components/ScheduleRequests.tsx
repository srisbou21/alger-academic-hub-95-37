
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, XCircle, Plus } from "lucide-react";
import { useState } from "react";

export const ScheduleRequests = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestType, setRequestType] = useState("");

  const requests = [
    {
      id: "REQ-001",
      type: "modification",
      course: "Microéconomie L3",
      currentSlot: "Lundi 14h-16h, Salle 201",
      requestedSlot: "Mardi 10h-12h, Salle 205", 
      reason: "Conflit avec conseil pédagogique",
      status: "pending",
      requestDate: "2024-06-14",
      urgency: "medium"
    },
    {
      id: "REQ-002",
      type: "replacement",
      course: "Statistiques L2",
      currentSlot: "Mercredi 09h-11h, Salle 104",
      requestedSlot: "Report au vendredi 14h-16h",
      reason: "Absence pour conférence",
      status: "approved",
      requestDate: "2024-06-13",
      urgency: "high"
    },
    {
      id: "REQ-003",
      type: "room",
      course: "Économie générale L1",
      currentSlot: "Jeudi 16h-18h, Salle 102",
      requestedSlot: "Jeudi 16h-18h, Amphi A",
      reason: "Effectif plus important que prévu",
      status: "rejected",
      requestDate: "2024-06-12",
      urgency: "low"
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800",
      approved: "bg-green-100 text-green-800", 
      rejected: "bg-red-100 text-red-800"
    };
    
    const labels = {
      pending: "En attente",
      approved: "Approuvée",
      rejected: "Refusée"
    };

    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-blue-100 text-blue-800"
    };
    
    const labels = {
      high: "Urgente",
      medium: "Normale", 
      low: "Faible"
    };

    return (
      <Badge variant="outline" className={styles[urgency as keyof typeof styles]}>
        {labels[urgency as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      modification: "Modification créneau",
      replacement: "Cours de remplacement",
      room: "Changement de salle"
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Demandes de Modification</h2>
          <p className="text-slate-600">Gestion des demandes de changement de planning</p>
        </div>
        <Button 
          onClick={() => setShowNewRequest(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Demande
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold text-amber-800">3</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Approuvées</p>
                <p className="text-2xl font-bold text-green-800">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Refusées</p>
                <p className="text-2xl font-bold text-red-800">2</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Ce mois</p>
                <p className="text-2xl font-bold text-blue-800">17</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire nouvelle demande */}
      {showNewRequest && (
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="text-blue-800">Nouvelle Demande de Modification</CardTitle>
            <CardDescription>Remplissez le formulaire pour soumettre votre demande</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de demande</label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modification">Modification créneau</SelectItem>
                    <SelectItem value="replacement">Cours de remplacement</SelectItem>
                    <SelectItem value="room">Changement de salle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cours concerné</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le cours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro-l3">Microéconomie L3</SelectItem>
                    <SelectItem value="stats-l2">Statistiques L2</SelectItem>
                    <SelectItem value="eco-l1">Économie générale L1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Créneau actuel</label>
              <Input placeholder="Ex: Lundi 14h-16h, Salle 201" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Créneau souhaité</label>
              <Input placeholder="Ex: Mardi 10h-12h, Salle 205" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Motif de la demande</label>
              <Textarea placeholder="Expliquez la raison de votre demande..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Urgence</label>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Normale</SelectItem>
                  <SelectItem value="high">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Soumettre la demande
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewRequest(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des demandes */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mes Demandes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <h4 className="font-medium text-slate-800">{getTypeLabel(request.type)}</h4>
                  {getUrgencyBadge(request.urgency)}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(request.status)}
                  <span className="text-sm text-slate-500">
                    {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Cours</p>
                  <p className="text-slate-800">{request.course}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Motif</p>
                  <p className="text-slate-800">{request.reason}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-1">Créneau actuel</p>
                  <div className="flex items-center gap-1 text-red-700">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{request.currentSlot}</span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">Créneau souhaité</p>
                  <div className="flex items-center gap-1 text-green-700">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{request.requestedSlot}</span>
                  </div>
                </div>
              </div>

              {request.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">Modifier</Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
