
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Mail, MessageSquare, Users, Send, Settings, FileText, Plus } from "lucide-react";
import { useState } from "react";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  studentNotifications: boolean;
  autoReminders: boolean;
}

interface SentNotification {
  id: string;
  type: "email" | "sms" | "push" | "announcement";
  recipient: string;
  subject: string;
  sentAt: string;
  status: "sent" | "delivered" | "failed";
}

export const AbsenceNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    studentNotifications: true,
    autoReminders: false
  });

  const [notifications] = useState<SentNotification[]>([
    {
      id: "NOT001",
      type: "email",
      recipient: "Étudiants L3 Économie",
      subject: "Annulation cours Microéconomie - 20/06",
      sentAt: "2024-06-15 09:30",
      status: "delivered"
    },
    {
      id: "NOT002",
      type: "sms",
      recipient: "Sarah Benali",
      subject: "Demande d'absence approuvée",
      sentAt: "2024-06-15 14:20",
      status: "delivered"
    },
    {
      id: "NOT003",
      type: "announcement",
      recipient: "Département Économie",
      subject: "Remplacement urgent nécessaire",
      sentAt: "2024-06-15 16:45",
      status: "sent"
    }
  ]);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      case "announcement":
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Envoyé</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Livré</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Système de Notifications</h2>
          <p className="text-slate-600">Gestion automatique des communications d'absence</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Emails Envoyés</p>
                <p className="text-2xl font-bold text-blue-800">127</p>
                <p className="text-xs text-blue-500">Aujourd'hui</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">SMS Livrés</p>
                <p className="text-2xl font-bold text-green-800">89</p>
                <p className="text-xs text-green-500">Aujourd'hui</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Notifications Push</p>
                <p className="text-2xl font-bold text-purple-800">245</p>
                <p className="text-xs text-purple-500">Aujourd'hui</p>
              </div>
              <Bell className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Taux de Lecture</p>
                <p className="text-2xl font-bold text-amber-800">92%</p>
                <p className="text-xs text-amber-500">Moyenne</p>
              </div>
              <Users className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres de notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres de Notification
            </CardTitle>
            <CardDescription>Configuration des alertes automatiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications Email</h4>
                  <p className="text-sm text-slate-600">Envoi automatique d'emails</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications SMS</h4>
                  <p className="text-sm text-slate-600">Messages texte urgents</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications Push</h4>
                  <p className="text-sm text-slate-600">Alertes temps réel</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications Étudiants</h4>
                  <p className="text-sm text-slate-600">Alertes aux étudiants concernés</p>
                </div>
                <Switch
                  checked={settings.studentNotifications}
                  onCheckedChange={(checked) => updateSetting("studentNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Rappels Automatiques</h4>
                  <p className="text-sm text-slate-600">Rappels 24h avant l'absence</p>
                </div>
                <Switch
                  checked={settings.autoReminders}
                  onCheckedChange={(checked) => updateSetting("autoReminders", checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Envoyer Notification Test
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configuration Avancée
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modèles de notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Modèles de Messages
            </CardTitle>
            <CardDescription>Templates prédéfinis pour les notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <h4 className="font-medium text-slate-800">Annulation de Cours</h4>
                <p className="text-sm text-slate-600 mb-2">
                  "Le cours de [MATIERE] du [DATE] à [HEURE] est annulé. Remplacement prévu le [DATE_RATTRAPAGE]."
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Modifier</Button>
                  <Button size="sm" variant="outline">Utiliser</Button>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg">
                <h4 className="font-medium text-slate-800">Changement d'Enseignant</h4>
                <p className="text-sm text-slate-600 mb-2">
                  "Le cours de [MATIERE] sera assuré par [ENSEIGNANT_REMPLACANT] en remplacement de [ENSEIGNANT_ABSENT]."
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Modifier</Button>
                  <Button size="sm" variant="outline">Utiliser</Button>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg">
                <h4 className="font-medium text-slate-800">Changement de Salle</h4>
                <p className="text-sm text-slate-600 mb-2">
                  "Le cours de [MATIERE] du [DATE] aura lieu en salle [NOUVELLE_SALLE] au lieu de [ANCIENNE_SALLE]."
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Modifier</Button>
                  <Button size="sm" variant="outline">Utiliser</Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Créer Nouveau Modèle
            </Button>
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
          <CardDescription>Suivi des messages envoyés récemment</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Date d'Envoi</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{notification.recipient}</TableCell>
                  <TableCell className="font-medium">{notification.subject}</TableCell>
                  <TableCell>{notification.sentAt}</TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
