
import React from 'react';
import { Star } from "lucide-react";

interface StudentFeedbackProps {
  feedback: {
    averageRating: number;
    totalResponses: number;
    comments: string[];
  };
}

export const StudentFeedback = ({ feedback }: StudentFeedbackProps) => {
  return (
    <div className="border-t pt-4">
      <h4 className="font-semibold mb-3">Retour des Étudiants</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="flex items-center justify-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(feedback.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-lg font-bold">
            {feedback.averageRating.toFixed(1)}/5
          </div>
          <div className="text-xs text-slate-600">
            {feedback.totalResponses} réponses
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h5 className="font-medium mb-2">Commentaires récents</h5>
          <div className="space-y-1">
            {feedback.comments.slice(0, 3).map((comment, index) => (
              <p key={index} className="text-sm text-slate-600 italic">
                "{comment}"
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
