import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, X } from "lucide-react";

export const HRNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Absence non justifiée',
      message: 'Dr. Ahmed Benali a été absent sans justification le 15/01/2024',
      priority: 'high' as const,
      read: false,
      actionRequired: true
    },
    {
      id: '2',
      title: 'Surcharge de travail détectée', 
      message: 'Dr. Fatima Kader dépasse de 8h la charge horaire recommandée',
      priority: 'medium' as const,
      read: false,
      actionRequired: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleAction = (id: string) => {
    toast({
      title: "Action en cours",
      description: "Traitement de l'action en cours.",
    });
    markAsRead(id);
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications RH
            <Badge variant="destructive">
              {notifications.filter(n => !n.read).length} non lues
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <Card key={notification.id} className={!notification.read ? 'border-l-4 border-l-blue-500' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={priorityColors[notification.priority]}>
                    {notification.priority === 'high' ? 'Urgent' : 
                     notification.priority === 'medium' ? 'Moyen' : 'Faible'}
                  </Badge>
                  {notification.actionRequired && (
                    <Button size="sm" onClick={() => handleAction(notification.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Action
                    </Button>
                  )}
                  {!notification.read && (
                    <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                      Marquer lu
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};