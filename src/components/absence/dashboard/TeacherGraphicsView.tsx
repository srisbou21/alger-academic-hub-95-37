
import React from 'react';
import { TrendingUp } from "lucide-react";
import { User as UserType } from "../../../types/user";
import { TeacherAbsenceGraphics } from "../TeacherAbsenceGraphics";

interface TeacherGraphicsViewProps {
  selectedTeacherId: string;
  currentUser: UserType;
  onBack: () => void;
}

export const TeacherGraphicsView: React.FC<TeacherGraphicsViewProps> = ({ 
  selectedTeacherId, 
  currentUser, 
  onBack 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Analyse Graphique Détaillée - Enseignant {selectedTeacherId}
          </h3>
          <p className="text-sm text-slate-600">Visualisations complètes des absences avec métriques, tendances et analyses temporelles</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
        >
          ← Retour à la sélection
        </button>
      </div>
      <TeacherAbsenceGraphics 
        teacherId={selectedTeacherId}
        teacherName={`Enseignant ${selectedTeacherId}`}
        currentUser={currentUser}
      />
    </div>
  );
};
