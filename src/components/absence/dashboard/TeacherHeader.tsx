
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { User as UserType } from "../../../types/user";

interface TeacherHeaderProps {
  currentUser: UserType;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({ currentUser }) => {
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <User className="h-5 w-5" />
          Mes Absences - {currentUser.name}
        </CardTitle>
        <p className="text-blue-600">Gestion de vos demandes d'absence</p>
      </CardHeader>
    </Card>
  );
};
