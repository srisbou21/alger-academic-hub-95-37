
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, MapPin, Star } from "lucide-react";

interface DefenseStatsProps {
  upcomingCount: number;
  completedCount: number;
  availableRoomsCount: number;
  averageGrade: number;
}

export const DefenseStats = ({ 
  upcomingCount, 
  completedCount, 
  availableRoomsCount, 
  averageGrade 
}: DefenseStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Soutenances programmées</p>
              <p className="text-2xl font-bold text-blue-800">{upcomingCount}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Soutenances terminées</p>
              <p className="text-2xl font-bold text-green-800">{completedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Salles disponibles</p>
              <p className="text-2xl font-bold text-purple-800">{availableRoomsCount}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Note moyenne</p>
              <p className="text-2xl font-bold text-amber-800">{averageGrade}/20</p>
            </div>
            <Star className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
