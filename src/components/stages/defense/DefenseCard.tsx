
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, MapPin, Clock, FileText, Users
} from "lucide-react";

interface DefenseCardProps {
  defense: {
    id: string;
    student: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    room: string;
    supervisor: string;
    jury: Array<{
      name: string;
      role: string;
      status: string;
    }>;
    status: string;
    documents: string[];
  };
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getJuryStatusColor: (status: string) => string;
}

export const DefenseCard = ({ 
  defense, 
  getStatusColor, 
  getStatusText, 
  getJuryStatusColor 
}: DefenseCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold text-lg">{defense.student}</h4>
            <p className="text-slate-600 text-sm mb-2">{defense.title}</p>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(defense.date).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {defense.time} ({defense.duration})
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {defense.room}
              </span>
            </div>
          </div>
          <Badge className={getStatusColor(defense.status)}>
            {getStatusText(defense.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-slate-700 mb-2">Composition du jury</h5>
            <div className="space-y-1">
              {defense.jury.map((member, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{member.name} ({member.role})</span>
                  <Badge className={getJuryStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-slate-700 mb-2">Documents</h5>
            <div className="space-y-1">
              {defense.documents.map((doc, index) => (
                <div key={index} className="flex items-center text-sm text-slate-600">
                  <FileText className="h-3 w-3 mr-1" />
                  {doc}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">
            <FileText className="h-3 w-3 mr-1" />
            Grille d'évaluation
          </Button>
          <Button size="sm" variant="outline">
            <Users className="h-3 w-3 mr-1" />
            Gérer jury
          </Button>
          <Button size="sm" variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            Modifier planning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
