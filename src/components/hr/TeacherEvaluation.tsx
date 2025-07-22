
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EvaluationStats } from "./evaluation/EvaluationStats";
import { EvaluationCard } from "./evaluation/EvaluationCard";

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

export const TeacherEvaluation = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: '1',
      teacherId: 'teacher1',
      teacherName: 'Dr. Ahmed Benali',
      evaluatorId: 'eval1',
      evaluatorName: 'Prof. Fatima Zohra',
      evaluationDate: new Date('2024-01-15'),
      period: { start: new Date('2023-09-01'), end: new Date('2024-01-31') },
      criteria: {
        teaching: 85,
        research: 78,
        service: 92,
        collaboration: 88,
        innovation: 75
      },
      overallScore: 83.6,
      comments: 'Excellent engagement pédagogique avec des méthodes innovantes.',
      recommendations: [
        'Augmenter les publications de recherche',
        'Participer à plus de conférences internationales'
      ],
      status: 'completed',
      studentFeedback: {
        averageRating: 4.2,
        totalResponses: 156,
        comments: ['Très bon professeur', 'Cours clairs et bien structurés']
      }
    }
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const { toast } = useToast();

  const startNewEvaluation = () => {
    toast({
      title: "Nouvelle évaluation",
      description: "Une nouvelle évaluation a été initiée"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8" />
            Système d'Évaluation des Enseignants
          </CardTitle>
          <p className="text-blue-100">
            Gestion des évaluations périodiques et suivi des performances pédagogiques
          </p>
        </CardHeader>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <EvaluationStats evaluations={evaluations} />

          <div className="flex gap-4 mb-6">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les enseignants</SelectItem>
                <SelectItem value="teacher1">Dr. Ahmed Benali</SelectItem>
                <SelectItem value="teacher2">Prof. Fatima Zohra</SelectItem>
                <SelectItem value="teacher3">Dr. Mohammed Alami</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester">Semestre actuel</SelectItem>
                <SelectItem value="year">Année académique</SelectItem>
                <SelectItem value="all">Toutes les périodes</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={startNewEvaluation} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Évaluation
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {evaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </div>
  );
};
