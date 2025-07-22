
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, Users, Award } from "lucide-react";

interface EvaluationCriteriaProps {
  criteria: {
    teaching: number;
    research: number;
    service: number;
    collaboration: number;
    innovation: number;
  };
}

export const EvaluationCriteria = ({ criteria }: EvaluationCriteriaProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-medium">Enseignement</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(criteria.teaching)}`}>
          {criteria.teaching}
        </div>
        <Progress value={criteria.teaching} className="h-2 mt-2" />
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <FileText className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-medium">Recherche</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(criteria.research)}`}>
          {criteria.research}
        </div>
        <Progress value={criteria.research} className="h-2 mt-2" />
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Users className="h-5 w-5 text-purple-600 mr-2" />
          <span className="font-medium">Service</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(criteria.service)}`}>
          {criteria.service}
        </div>
        <Progress value={criteria.service} className="h-2 mt-2" />
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Users className="h-5 w-5 text-orange-600 mr-2" />
          <span className="font-medium">Collaboration</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(criteria.collaboration)}`}>
          {criteria.collaboration}
        </div>
        <Progress value={criteria.collaboration} className="h-2 mt-2" />
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Award className="h-5 w-5 text-red-600 mr-2" />
          <span className="font-medium">Innovation</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(criteria.innovation)}`}>
          {criteria.innovation}
        </div>
        <Progress value={criteria.innovation} className="h-2 mt-2" />
      </div>
    </div>
  );
};
