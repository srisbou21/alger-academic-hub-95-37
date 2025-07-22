
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Paramètres de notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications de changement de salle</h4>
              <p className="text-sm text-slate-600">Être averti quand une salle change</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Activé</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications d'annulation</h4>
              <p className="text-sm text-slate-600">Être averti des cours annulés</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Activé</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rappels de cours</h4>
              <p className="text-sm text-slate-600">Rappel 30 minutes avant chaque cours</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Activé</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
