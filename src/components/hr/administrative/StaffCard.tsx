
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Briefcase, Edit2, MoreHorizontal } from "lucide-react";
import { AdministrativeStaff } from "../../../types/administrative";

interface StaffCardProps {
  person: AdministrativeStaff;
  onEdit: (id: string) => void;
  onMore: (id: string) => void;
  onToggleStatus?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ person, onEdit, onMore, onToggleStatus, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      case 'retired':
        return <Badge className="bg-blue-100 text-blue-800">Retraité</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getContractBadge = (contractType: string) => {
    switch (contractType) {
      case 'titulaire':
        return <Badge className="bg-blue-100 text-blue-800">Titulaire</Badge>;
      case 'vacataire':
        return <Badge className="bg-purple-100 text-purple-800">Vacataire</Badge>;
      case 'contractuel':
        return <Badge className="bg-orange-100 text-orange-800">Contractuel</Badge>;
      case 'stagiaire':
        return <Badge className="bg-yellow-100 text-yellow-800">Stagiaire</Badge>;
      default:
        return <Badge>{contractType}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">
                  {person.personalInfo.civility} {person.personalInfo.firstName} {person.personalInfo.lastName}
                </h3>
                {getStatusBadge(person.professionalInfo.status)}
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{person.professionalInfo.position} - {person.professionalInfo.service}</span>
                  {getContractBadge(person.professionalInfo.contractType)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{person.personalInfo.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{person.personalInfo.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Embauché le {person.professionalInfo.hireDate.toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <span>Grade: {person.professionalInfo.grade}</span>
                  <span>Échelon: {person.professionalInfo.echelon}</span>
                  <span>ID: {person.professionalInfo.employeeId}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(person.id)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMore(person.id)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
