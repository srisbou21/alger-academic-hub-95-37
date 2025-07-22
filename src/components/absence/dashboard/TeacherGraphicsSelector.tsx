
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, TrendingUp } from "lucide-react";

interface TeacherGraphicsSelectorProps {
  onSelectTeacher: (teacherId: string) => void;
}

export const TeacherGraphicsSelector: React.FC<TeacherGraphicsSelectorProps> = ({ onSelectTeacher }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-600" />
          Analyses Graphiques par Enseignant
        </CardTitle>
        <p className="text-slate-600">
          Sélectionnez un enseignant pour voir ses statistiques d'absence détaillées avec graphiques, métriques et analyses temporelles
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['teacher_1', 'teacher_2', 'teacher_3', 'teacher_4', 'teacher_5'].map((teacherId) => (
            <button
              key={teacherId}
              onClick={() => onSelectTeacher(teacherId)}
              className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-purple-300 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Enseignant {teacherId}</p>
                  <p className="text-sm text-slate-500">
                    {teacherId === 'teacher_1' ? 'Dr. Ahmed Benali' :
                     teacherId === 'teacher_2' ? 'Dr. Fatima Zohra' :
                     teacherId === 'teacher_3' ? 'Dr. Karim Messaoudi' :
                     teacherId === 'teacher_4' ? 'Dr. Amina Khelifi' :
                     'Dr. Omar Benaissa'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Graphiques & Analyses Disponibles
                    </Badge>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
