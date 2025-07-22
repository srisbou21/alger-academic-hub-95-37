
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, Users, BarChart3 } from "lucide-react";
import { User as UserType } from "../../../types/user";
import { TeacherAbsence } from "../../../types/teacher";
import { AbsencePermissions } from "../../../services/permissionService";

interface AbsenceOverviewProps {
  currentUser: UserType;
  permissions: AbsencePermissions;
  absences: TeacherAbsence[];
  pendingAbsences: TeacherAbsence[];
  approvedAbsences: TeacherAbsence[];
  onApprove: (absenceId: string) => void;
  onReject: (absenceId: string, reason: string) => void;
}

export const AbsenceOverview: React.FC<AbsenceOverviewProps> = ({
  currentUser,
  permissions,
  absences,
  pendingAbsences,
  approvedAbsences,
  onApprove,
  onReject
}) => {
  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Shield className="h-5 w-5" />
            Gestion des Absences
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <Badge className="bg-purple-600 text-white">
              {currentUser.role}
            </Badge>
            {permissions.department && (
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                Département: {permissions.department}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Calendar className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-800">{pendingAbsences.length}</p>
              <p className="text-sm text-amber-700">En attente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{approvedAbsences.length}</p>
              <p className="text-sm text-green-700">Approuvées</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{absences.length}</p>
              <p className="text-sm text-blue-700">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble des absences</CardTitle>
          <p className="text-slate-600">
            {permissions.canViewAllAbsences 
              ? "Toutes les absences de la faculté" 
              : `Absences du département ${permissions.department}`
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {absences.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Aucune absence trouvée</p>
            ) : (
              absences.map((absence) => (
                <div key={absence.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Enseignant ID: {absence.teacherId}</h4>
                    <Badge className={
                      absence.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      absence.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {absence.status === 'pending' ? 'En attente' :
                       absence.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Période:</strong> {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}</p>
                    <p><strong>Type:</strong> {absence.type}</p>
                    <p><strong>Motif:</strong> {absence.reason}</p>
                    <p><strong>Cours affectés:</strong> {absence.coursesAffected.join(', ')}</p>
                  </div>
                  {permissions.canApproveAbsences && absence.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onApprove(absence.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => onReject(absence.id, "Rejeté depuis la vue d'ensemble")}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
