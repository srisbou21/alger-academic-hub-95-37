
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock } from "lucide-react";

interface RoomsGridProps {
  availableRooms: Array<{
    id: string;
    name: string;
    capacity: number;
    equipment: string[];
  }>;
}

export const RoomsGrid = ({ availableRooms }: RoomsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {availableRooms.map((room) => (
        <Card key={room.id} className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {room.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Capacité:</strong> {room.capacity} personnes
              </p>
              <div>
                <p className="text-sm font-medium mb-1">Équipements:</p>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((eq, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Réserver
                </Button>
                <Button variant="outline">
                  <Clock className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
