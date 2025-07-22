
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Calendar, User, FileText, MessageSquare } from "lucide-react";

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

interface EvaluationCardProps {
  evaluation: Evaluation;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-gray-100 text-gray-800",
      completed: "bg-blue-100 text-blue-800",
      reviewed: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800"
    };
    const labels = {
      draft: "Brouillon",
      completed: "Terminé",
      reviewed: "Révisé",
      approved: "Approuvé"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {evaluation.teacherName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(evaluation.status)}
            <div className={`text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
              {evaluation.overallScore.toFixed(1)}/100
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Période: {evaluation.period.start.toLocaleDateString('fr-FR')} - {evaluation.period.end.toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Évaluateur: {evaluation.evaluatorName}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Critères d'évaluation */}
        <div>
          <h4 className="font-medium mb-3">Critères d'Évaluation</h4>
          <div className="space-y-3">
            {Object.entries(evaluation.criteria).map(([key, value]) => {
              const labels = {
                teaching: "Enseignement",
                research: "Recherche",
                service: "Service",
                collaboration: "Collaboration",
                innovation: "Innovation"
              };
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-24">
                    {labels[key as keyof typeof labels]}
                  </span>
                  <div className="flex-1 mx-4">
                    <Progress value={value} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 w-12">
                    {value}/100
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commentaires */}
        {evaluation.comments && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Commentaires
            </h4>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
              {evaluation.comments}
            </p>
          </div>
        )}

        {/* Recommandations */}
        {evaluation.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recommandations</h4>
            <ul className="space-y-1">
              {evaluation.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Feedback étudiant */}
        {evaluation.studentFeedback && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Feedback Étudiant
            </h4>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{evaluation.studentFeedback.averageRating.toFixed(1)}/5</span>
              </div>
              <span className="text-sm text-slate-600">
                ({evaluation.studentFeedback.totalResponses} réponses)
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-1" />
            Voir Détails
          </Button>
          <Button size="sm" variant="outline">
            Modifier
          </Button>
          {evaluation.status === 'completed' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Approuver
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
