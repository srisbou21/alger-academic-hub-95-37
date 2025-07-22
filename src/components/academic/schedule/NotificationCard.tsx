
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Notification } from "./types";

interface NotificationCardProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationCard = ({ notifications, onMarkAsRead }: NotificationCardProps) => {
  if (notifications.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Bell className="h-5 w-5" />
          Changements récents dans votre emploi du temps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start justify-between p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex-1">
                <p className="text-sm text-amber-800">{notification.message}</p>
                <p className="text-xs text-amber-600 mt-1">
                  {notification.timestamp.toLocaleString('fr-FR')}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onMarkAsRead(notification.id)}
                className="ml-3"
              >
                Marquer comme lu
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
