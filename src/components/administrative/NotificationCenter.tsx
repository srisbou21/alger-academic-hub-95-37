
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Smartphone, Mail, MessageSquare, Settings, Volume2, VolumeX, Check, X } from "lucide-react";
import { useState } from "react";

export const NotificationCenter = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  const notifications = [
    {
      id: 1,
      type: "announcement",
      title: "Nouvelle annonce publiée",
      message: "Fermeture exceptionnelle de la faculté demain",
      timestamp: "2024-06-14 15:30",
      priority: "high",
      read: false,
      channel: "push"
    },
    {
      id: 2,
      type: "message",
      title: "Nouveau message reçu",
      message: "Question sur les modalités d'examen - Amina Benali",
      timestamp: "2024-06-14 14:20",
      priority: "medium",
      read: false,
      channel: "email"
    },
    {
      id: 3,
      type: "document",
      title: "Document généré",
      message: "Attestation de scolarité prête pour téléchargement",
      timestamp: "2024-06-14 12:15",
      priority: "low",
      read: true,
      channel: "in-app"
    },
    {
      id: 4,
      type: "system",
      title: "Maintenance programmée",
      message: "Maintenance système prévue dimanche à 02:00",
      timestamp: "2024-06-14 09:00",
      priority: "medium",
      read: true,
      channel: "sms"
    }
  ];

  const getNotificationIcon = (type: string) => {
    const icons = {
      announcement: <Bell className="h-4 w-4" />,
      message: <MessageSquare className="h-4 w-4" />,
      document: <Mail className="h-4 w-4" />,
      system: <Settings className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Bell className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      push: <Smartphone className="h-3 w-3" />,
      email: <Mail className="h-3 w-3" />,
      sms: <MessageSquare className="h-3 w-3" />,
      "in-app": <Bell className="h-3 w-3" />
    };
    return icons[channel as keyof typeof icons] || <Bell className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Centre de Notifications</h3>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Paramètres Avancés
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paramètres de notification */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Préférences Utilisateur</CardTitle>
              <CardDescription>Configurez vos canaux de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Push Web/Mobile</span>
                  </div>
                  <Switch 
                    checked={pushEnabled} 
                    onCheckedChange={setPushEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">SMS Urgences</span>
                  </div>
                  <Switch 
                    checked={smsEnabled} 
                    onCheckedChange={setSmsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <Switch 
                    checked={emailEnabled} 
                    onCheckedChange={setEmailEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium">In-App</span>
                  </div>
                  <Switch 
                    checked={inAppEnabled} 
                    onCheckedChange={setInAppEnabled}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Fréquence des notifications</h4>
                <Select defaultValue="immediate">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiate</SelectItem>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Horaires de notification</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Select defaultValue="08:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">06:00</SelectItem>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="20:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="22:00">22:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mode silencieux</span>
                <Button variant="outline" size="sm">
                  <VolumeX className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des notifications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications Récentes</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Check className="h-4 w-4 mr-1" />
                    Tout marquer lu
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="h-4 w-4 mr-1" />
                    Effacer tout
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg ${
                      !notification.read ? 'border-blue-200 bg-blue-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium text-sm">{notification.title}</span>
                        {!notification.read && (
                          <Badge className="bg-blue-600 text-white text-xs">Nouveau</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          {getChannelIcon(notification.channel)}
                          <span>{notification.channel}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{notification.timestamp}</span>
                      {!notification.read && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">
                  Voir toutes les notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistiques des notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques de Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">247</div>
              <div className="text-sm text-blue-600">Notifications envoyées</div>
              <div className="text-xs text-blue-500">Cette semaine</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800">89%</div>
              <div className="text-sm text-green-600">Taux de lecture</div>
              <div className="text-xs text-green-500">Moyenne</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-2xl font-bold text-amber-800">12</div>
              <div className="text-sm text-amber-600">Non lues</div>
              <div className="text-xs text-amber-500">En attente</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-800">156ms</div>
              <div className="text-sm text-purple-600">Temps de livraison</div>
              <div className="text-xs text-purple-500">Moyenne</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
