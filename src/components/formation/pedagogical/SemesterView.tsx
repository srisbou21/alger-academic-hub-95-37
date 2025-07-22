
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, AlertTriangle } from "lucide-react";
import { FormationOffer } from "../../../types/academic";

interface SemesterViewProps {
  formation: FormationOffer;
  semester: number;
}

export const SemesterView = ({ formation, semester }: SemesterViewProps) => {
  // Mock data for demonstration
  const semesterData = {
    totalECTS: 30,
    targetECTS: 30,
    totalHours: 450,
    ueCount: 5,
    obligatoryUE: 4,
    optionalUE: 1,
    subjects: 12,
    teachersAssigned: 8,
    totalTeachers: 10
  };

  const ectsProgress = (semesterData.totalECTS / semesterData.targetECTS) * 100;
  const teacherProgress = (semesterData.teachersAssigned / semesterData.totalTeachers) * 100;

  const getECTSColor = () => {
    if (ectsProgress < 90) return "text-red-600";
    if (ectsProgress > 110) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Vue d'ensemble - Semestre {semester}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Statistiques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className={`text-2xl font-bold ${getECTSColor()}`}>
              {semesterData.totalECTS}
            </p>
            <p className="text-sm text-blue-800">ECTS</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{semesterData.totalHours}</p>
            <p className="text-sm text-green-800">Heures</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{semesterData.ueCount}</p>
            <p className="text-sm text-purple-800">UE</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{semesterData.subjects}</p>
            <p className="text-sm text-orange-800">Matières</p>
          </div>
        </div>

        {/* Indicateurs de progression */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Crédits ECTS</span>
              <span className={`text-sm font-bold ${getECTSColor()}`}>
                {semesterData.totalECTS}/{semesterData.targetECTS}
              </span>
            </div>
            <Progress value={ectsProgress} className="h-2" />
            {ectsProgress < 90 && (
              <p className="text-xs text-red-600 mt-1">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Insuffisant (min 27 ECTS)
              </p>
            )}
            {ectsProgress > 110 && (
              <p className="text-xs text-orange-600 mt-1">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Dépassement (max 33 ECTS)
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Enseignants affectés</span>
              <span className="text-sm font-bold">
                {semesterData.teachersAssigned}/{semesterData.totalTeachers}
              </span>
            </div>
            <Progress value={teacherProgress} className="h-2" />
          </div>
        </div>

        {/* Répartition des UE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <Badge className="bg-red-100 text-red-800 mb-2">Obligatoires</Badge>
            <p className="text-2xl font-bold">{semesterData.obligatoryUE}</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Badge className="bg-yellow-100 text-yellow-800 mb-2">Optionnelles</Badge>
            <p className="text-2xl font-bold">{semesterData.optionalUE}</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Badge className="bg-green-100 text-green-800 mb-2">Libres</Badge>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        {/* Alertes et recommandations */}
        <div className="mt-6 space-y-2">
          {ectsProgress < 90 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Le nombre de crédits ECTS est insuffisant pour ce semestre
              </p>
            </div>
          )}
          
          {teacherProgress < 100 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Certaines matières n'ont pas encore d'enseignant affecté
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
