
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react';

export const NotificationCenter = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Centre de Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Centre de notifications en cours de développement...</p>
      </CardContent>
    </Card>
  );
};
