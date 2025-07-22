
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, AlertTriangle, CheckCircle2, Clock, Send, Users, Calendar, Settings } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "conflict" | "change" | "reminder" | "info";
  title: string;
  message: string;
  recipients: string[];
  timestamp: string;
  status: "sent" | "pending" | "failed";
  priority: "low" | "medium" | "high";
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  variables: string[];
}

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "N001",
      type: "conflict",
      title: "Conflit horaire détecté",
      message: "Conflit entre cours de Microéconomie L3 et salle 201 (14h-16h)",
      recipients: ["Prof. Martin", "Administration"],
      timestamp: "2024-06-15 10:30",
      status: "sent",
      priority: "high"
    },
    {
      id: "N002",
      type: "change",
      title: "Modification emploi du temps",
      message: "Le cours de Statistiques L2 a été déplacé de Salle 104 vers Amphi A",
      recipients: ["Étudiants L2", "Mme. Dubois"],
      timestamp: "2024-06-15 09:15",
      status: "sent",
      priority: "medium"
    },
    {
      id: "N003",
      type: "reminder",
      title: "Rappel planning",
      message: "N'oubliez pas votre cours de demain à 8h30 en Salle 205",
      recipients: ["Prof. Martin"],
      timestamp: "2024-06-14 18:00",
      status: "pending",
      priority: "low"
    }
  ]);

  const [templates] = useState<NotificationTemplate[]>([
    {
      id: "T001",
      name: "Conflit horaire",
      subject: "⚠️ Conflit détecté - {{course}} - {{date}}",
      content: "Un conflit horaire a été détecté pour le cours {{course}} prévu le {{date}} à {{time}}. Veuillez contacter l'administration pour résoudre ce problème.",
      type: "conflict",
      variables: ["course", "date", "time", "room"]
    },
    {
      id: "T002",
      name: "Changement de salle",
      subject: "📍 Changement de salle - {{course}}",
      content: "Le cours {{course}} du {{date}} a été déplacé de {{old_room}} vers {{new_room}}. Merci de bien noter ce changement.",
      type: "change",
      variables: ["course", "date", "old_room", "new_room"]
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    type: "info",
    title: "",
    message: "",
    recipients: "",
    priority: "medium"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    autoConflictAlerts: true,
    changeNotifications: true,
    reminderNotifications: true,
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "conflict": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "change": return <Calendar className="h-4 w-4 text-blue-600" />;
      case "reminder": return <Clock className="h-4 w-4 text-amber-600" />;
      default: return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "conflict": return "bg-red-50 border-red-200";
      case "change": return "bg-blue-50 border-blue-200";
      case "reminder": return "bg-amber-50 border-amber-200";
      default: return "bg-slate-50 border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent": return <Badge className="bg-green-100 text-green-800">Envoyé</Badge>;
      case "pending": return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge className="bg-red-100 text-red-800">Haute</Badge>;
      case "medium": return <Badge className="bg-amber-100 text-amber-800">Moyenne</Badge>;
      case "low": return <Badge className="bg-blue-100 text-blue-800">Faible</Badge>;
      default: return <Badge variant="outline">Normale</Badge>;
    }
  };

  const sendNotification = () => {
    if (!newNotification.title || !newNotification.message) return;

    const notification: Notification = {
      id: `N${(notifications.length + 1).toString().padStart(3, '0')}`,
      type: newNotification.type as any,
      title: newNotification.title,
      message: newNotification.message,
      recipients: newNotification.recipients.split(',').map(r => r.trim()),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: "pending",
      priority: newNotification.priority as any
    };

    setNotifications(prev => [notification, ...prev]);
    setNewNotification({ type: "info", title: "", message: "", recipients: "", priority: "medium" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Système de Notifications</h2>
          <p className="text-slate-600">Alertes automatiques et communication</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Envoyées</p>
                <p className="text-2xl font-bold text-green-800">
                  {notifications.filter(n => n.status === "sent").length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold text-amber-800">
                  {notifications.filter(n => n.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Conflits</p>
                <p className="text-2xl font-bold text-red-800">
                  {notifications.filter(n => n.type === "conflict").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Destinataires</p>
                <p className="text-2xl font-bold text-blue-800">
                  {new Set(notifications.flatMap(n => n.recipients)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nouvelle notification */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Send className="h-5 w-5" />
              Nouvelle Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select
                value={newNotification.type}
                onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="conflict">Conflit</SelectItem>
                  <SelectItem value="change">Changement</SelectItem>
                  <SelectItem value="reminder">Rappel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <Input
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la notification"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Contenu du message..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Destinataires</label>
              <Input
                value={newNotification.recipients}
                onChange={(e) => setNewNotification(prev => ({ ...prev, recipients: e.target.value }))}
                placeholder="Séparer par des virgules"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priorité</label>
              <Select
                value={newNotification.priority}
                onValueChange={(value) => setNewNotification(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={sendNotification} className="w-full bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </CardContent>
        </Card>

        {/* Paramètres */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres de Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertes de conflit automatiques</span>
                <Switch
                  checked={notificationSettings.autoConflictAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, autoConflictAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications de changement</span>
                <Switch
                  checked={notificationSettings.changeNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, changeNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rappels automatiques</span>
                <Switch
                  checked={notificationSettings.reminderNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, reminderNotifications: checked }))
                  }
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Canaux de communication</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">E-mail</span>
                  <Switch
                    checked={notificationSettings.emailEnabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS</span>
                  <Switch
                    checked={notificationSettings.smsEnabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, smsEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Push</span>
                  <Switch
                    checked={notificationSettings.pushEnabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, pushEnabled: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Historique des Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getNotificationColor(notification.type)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getNotificationIcon(notification.type)}
                  <h4 className="font-medium text-slate-800">{notification.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(notification.priority)}
                  {getStatusBadge(notification.status)}
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-2">{notification.message}</p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span>Destinataires: {notification.recipients.join(", ")}</span>
                </div>
                <span>{notification.timestamp}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
