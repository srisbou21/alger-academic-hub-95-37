
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Plus } from "lucide-react";
import { EchelonExport } from './EchelonExport';

interface Echelon {
  id: string;
  teacherId: string;
  teacherName: string;
  currentGrade: string;
  currentEchelon: number;
  nextEchelon: number;
  datePromotion: Date;
  nextPromotionDate: Date;
  yearsInEchelon: number;
  requiredYears: number;
  isEligible: boolean;
  salary: number;
  status: 'active' | 'pending' | 'promoted';
}

interface EchelonListProps {
  filteredEchelons: Echelon[];
  eligibleEchelons: Echelon[];
  onPromoteEchelon: (id: string) => void;
  getStatusBadge: (echelon: Echelon) => React.ReactNode;
  getEmployeeTypeLabel: (grade: string) => string;
}

export const EchelonList: React.FC<EchelonListProps> = ({
  filteredEchelons,
  eligibleEchelons,
  onPromoteEchelon,
  getStatusBadge,
  getEmployeeTypeLabel
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des Échelons ({filteredEchelons.length})</CardTitle>
          <div className="flex gap-2">
            <EchelonExport 
              eligibleEchelons={eligibleEchelons} 
              allEchelons={filteredEchelons}
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Dossier
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEchelons.map((echelon) => (
            <div key={echelon.id} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{echelon.teacherName}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>{echelon.currentGrade}</span>
                    <span>•</span>
                    <span>{getEmployeeTypeLabel(echelon.currentGrade)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(echelon)}
                  <Badge variant="outline">
                    Échelon {echelon.currentEchelon}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Progression</p>
                  <p className="text-sm text-slate-600">
                    Échelon {echelon.currentEchelon} → {echelon.nextEchelon}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ancienneté</p>
                  <p className="text-sm text-slate-600">
                    {echelon.yearsInEchelon} / {echelon.requiredYears} ans
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Salaire Actuel</p>
                  <p className="text-sm font-semibold text-green-600">
                    {echelon.salary.toLocaleString()} DA
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Prochaine Promotion</p>
                  <p className="text-sm text-slate-600">
                    {echelon.nextPromotionDate.toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Dernière promotion: {echelon.datePromotion.toLocaleDateString('fr-FR')}
                </div>
                <div className="flex gap-2">
                  {echelon.isEligible && (
                    <Button 
                      size="sm"
                      onClick={() => onPromoteEchelon(echelon.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Award className="h-4 w-4 mr-1" />
                      Promouvoir
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Détails
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredEchelons.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucun employé trouvé avec les filtres sélectionnés</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
