
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, Users, Award } from "lucide-react";

interface Evaluation {
  id: string;
  teacherId: string;
  teacherName: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluationDate: Date;
  period: {
    start: Date;
    end: Date;
  };
  criteria: {
    teaching: number;
    research: number;
    service: number;
    collaboration: number;
    innovation: number;
  };
  overallScore: number;
  comments: string;
  recommendations: string[];
  status: 'draft' | 'completed' | 'reviewed' | 'approved';
  studentFeedback?: {
    averageRating: number;
    totalResponses: number;
    comments: string[];
  };
}

interface EvaluationStatsProps {
  evaluations: Evaluation[];
}

export const EvaluationStats: React.FC<EvaluationStatsProps> = ({ evaluations }) => {
  const totalEvaluations = evaluations.length;
  const completedEvaluations = evaluations.filter(e => e.status === 'completed' || e.status === 'approved').length;
  const averageScore = evaluations.length > 0 
    ? evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length 
    : 0;
  const excellentPerformers = evaluations.filter(e => e.overallScore >= 85).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Évaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{totalEvaluations}</div>
          <p className="text-xs text-blue-600 mt-1">{completedEvaluations} terminées</p>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Score Moyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{averageScore.toFixed(1)}/100</div>
          <p className="text-xs text-green-600 mt-1">Performance globale</p>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Excellents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{excellentPerformers}</div>
          <p className="text-xs text-purple-600 mt-1">Score ≥ 85</p>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Taux Complétion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            {totalEvaluations > 0 ? Math.round((completedEvaluations / totalEvaluations) * 100) : 0}%
          </div>
          <p className="text-xs text-orange-600 mt-1">Évaluations finalisées</p>
        </CardContent>
      </Card>
    </div>
  );
};
