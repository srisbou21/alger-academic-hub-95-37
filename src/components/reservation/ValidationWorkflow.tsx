
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Calendar,
  MapPin,
  Users,
  FileText,
  AlertTriangle
} from "lucide-react";

interface ValidationWorkflowProps {
  reservation: {
    id: string;
    spaceId: string;
    requester: {
      name: string;
      contact: string;
      phone: string;
    };
    type: string;
    dateTime: {
      start: Date;
      end: Date;
    };
    participants: number;
    purpose: string;
    equipment: string[];
    status: string;
    priority: number;
    validationHistory: any[];
  };
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    permissions: any[];
  };
  onValidate: (id: string, action: string, comment?: string) => void;
}

export const ValidationWorkflow = ({ reservation, currentUser, onValidate }: ValidationWorkflowProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidation = async (action: "approve" | "reject") => {
    setIsSubmitting(true);
    try {
      await onValidate(reservation.id, action, comment);
      setComment("");
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "bg-red-100 text-red-800 border-red-200";
      case 2: return "bg-amber-100 text-amber-800 border-amber-200";
      case 3: return "bg-blue-100 text-blue-800 border-blue-200";
      case 4: return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return "Très haute";
      case 2: return "Haute";
      case 3: return "Normale";
      case 4: return "Basse";
      default: return "Non définie";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "course": return "Cours";
      case "exam": return "Examen";
      case "meeting": return "Réunion";
      case "event": return "Événement";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Demande de Réservation #{reservation.id}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(reservation.priority)}>
              Priorité {getPriorityText(reservation.priority)}
            </Badge>
            <Badge variant="outline">
              {getTypeText(reservation.type)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations sur le demandeur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Demandeur
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Nom :</span> {reservation.requester.name}</p>
                <p><span className="font-medium">Contact :</span> {reservation.requester.contact}</p>
                <p><span className="font-medium">Téléphone :</span> {reservation.requester.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Détails de la réservation
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Date :</span> {reservation.dateTime.start.toLocaleDateString('fr-FR')}</p>
                <p><span className="font-medium">Horaire :</span> {reservation.dateTime.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {reservation.dateTime.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="font-medium">Participants :</span> {reservation.participants}
                </p>
              </div>
            </div>
          </div>

          {/* Objet de la réservation */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Objet de la réservation</h3>
            <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{reservation.purpose}</p>
          </div>

          {/* Équipements demandés */}
          {reservation.equipment && reservation.equipment.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Équipements demandés</h3>
              <div className="flex flex-wrap gap-2">
                {reservation.equipment.map((item, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Historique de validation */}
          {reservation.validationHistory && reservation.validationHistory.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Historique de validation</h3>
              <div className="space-y-3">
                {reservation.validationHistory.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{step.validator.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{step.validator}</p>
                        <Badge variant="outline" className={step.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {step.action === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </Badge>
                        <span className="text-xs text-slate-500">{step.date.toLocaleDateString('fr-FR')}</span>
                      </div>
                      {step.comment && <p className="text-sm text-slate-600">{step.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions de validation */}
          {reservation.status === "pending" && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-slate-800 mb-3">Actions de validation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Commentaire (optionnel)
                  </label>
                  <Textarea
                    placeholder="Ajoutez un commentaire sur votre décision..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleValidation("approve")}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approuver
                  </Button>
                  <Button 
                    onClick={() => handleValidation("reject")}
                    disabled={isSubmitting}
                    variant="destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button variant="outline" disabled={isSubmitting}>
                    <Clock className="mr-2 h-4 w-4" />
                    Reporter
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Statut final */}
          {reservation.status !== "pending" && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2">
                {reservation.status === "approved" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : reservation.status === "rejected" ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                )}
                <span className="font-medium">
                  {reservation.status === "approved" ? "Réservation approuvée" :
                   reservation.status === "rejected" ? "Réservation rejetée" :
                   "Réservation en attente"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
