
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Eye } from "lucide-react";
import { AdministrativeAbsence } from "../../../types/administrative";

interface AbsenceCardProps {
  absence: AdministrativeAbsence;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDetails: (id: string) => void;
}

export const AbsenceCard: React.FC<AbsenceCardProps> = ({
  absence,
  onApprove,
  onReject,
  onDetails
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    const labels = {
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté",
      completed: "Terminé"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels = {
      maladie: "Maladie",
      conge_annuel: "Congé annuel",
      conge_maternite: "Congé maternité",
      conge_paternite: "Congé paternité",
      conge_sans_solde: "Congé sans solde",
      mission_officielle: "Mission officielle",
      formation: "Formation",
      autre: "Autre"
    };
    
    return (
      <Badge variant="outline">
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-slate-500" />
            <h3 className="font-semibold">{absence.staffName}</h3>
            {getStatusBadge(absence.status)}
            {getTypeBadge(absence.type)}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Du {absence.startDate.toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Au {absence.endDate.toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{absence.duration} jours</span>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            <strong>Motif:</strong> {absence.reason}
          </p>

          {absence.replacement && (
            <div className="text-sm text-slate-600">
              <strong>Remplaçant:</strong> {absence.replacement.replacementStaffName}
            </div>
          )}

          {absence.justification && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-3 w-3 text-slate-500" />
              <span className={absence.justification.verified ? "text-green-600" : "text-orange-600"}>
                {absence.justification.hasDocument ? "Document fourni" : "Pas de document"}
                {absence.justification.verified && " (vérifié)"}
              </span>
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500 mb-2">
            Demandé le {absence.createdAt.toLocaleDateString('fr-FR')}
          </div>
          {absence.approvedAt && (
            <div className="text-xs text-slate-500">
              Traité le {absence.approvedAt.toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onDetails(absence.id)}>
            <Eye className="h-3 w-3 mr-1" />
            Détails
          </Button>
        </div>
        
        {absence.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onApprove(absence.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Approuver
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onReject(absence.id)}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Rejeter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
