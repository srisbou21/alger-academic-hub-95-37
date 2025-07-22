
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Bell, Users, Mail, Plus } from "lucide-react";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  status: string;
  type: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}

const mockMessages: Message[] = [
  {
    id: "MSG001",
    from: "admin@universite.fr",
    to: "amina.benali@etudiant.fr",
    subject: "Statut de votre candidature de bourse",
    content: "Votre candidature est actuellement en cours d'évaluation...",
    timestamp: "2024-01-15T10:30:00",
    status: "envoye",
    type: "status_update"
  },
  {
    id: "MSG002",
    from: "prof.martin@universite.fr",
    to: "admin@universite.fr",
    subject: "Évaluation complétée - APP001",
    content: "L'évaluation de la candidature APP001 a été finalisée...",
    timestamp: "2024-01-14T16:45:00",
    status: "lu",
    type: "evaluation"
  }
];

const mockNotifications: Notification[] = [
  {
    id: "NOT001",
    title: "Nouvelle candidature",
    message: "Une nouvelle candidature pour la bourse Excellence Académique a été soumise",
    type: "new_application",
    timestamp: "2024-01-15T14:20:00",
    read: false
  },
  {
    id: "NOT002",
    title: "Échéance approche",
    message: "La campagne Aide Sociale se termine dans 3 jours",
    type: "deadline",
    timestamp: "2024-01-15T09:00:00",
    read: true
  }
];

export const ScholarshipMessaging = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("messages");
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    content: "",
    type: "general"
  });

  const handleSendMessage = () => {
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès"
    });
    setNewMessage({ to: "", subject: "", content: "", type: "general" });
  };

  const handleMarkAsRead = (notificationId: string) => {
    toast({
      title: "Notification marquée comme lue",
      description: `Notification ${notificationId} mise à jour`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Centre de Communication
          </CardTitle>
          <CardDescription>
            Messagerie et notifications du système de bourses
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={activeTab === "messages" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("messages")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button
              variant={activeTab === "compose" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("compose")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Message
            </Button>
            <Button
              variant={activeTab === "announcements" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("announcements")}
            >
              <Users className="h-4 w-4 mr-2" />
              Annonces
            </Button>
          </CardContent>
        </Card>

        {/* Contenu principal */}
        <div className="lg:col-span-2">
          {activeTab === "messages" && (
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Historique des communications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{message.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          De: {message.from} → À: {message.to}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={message.status === "lu" ? "default" : "secondary"}>
                          {message.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Alertes et rappels automatiques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{notification.title}</div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Marquer comme lu
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <Badge variant="outline" className="mt-2">
                      {notification.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "compose" && (
            <Card>
              <CardHeader>
                <CardTitle>Nouveau Message</CardTitle>
                <CardDescription>Envoyer un message ou une notification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destinataire</label>
                  <Select 
                    value={newMessage.to} 
                    onValueChange={(value) => setNewMessage({...newMessage, to: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_students">Tous les étudiants</SelectItem>
                      <SelectItem value="all_evaluators">Tous les évaluateurs</SelectItem>
                      <SelectItem value="specific">Destinataire spécifique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de message</label>
                  <Select 
                    value={newMessage.type} 
                    onValueChange={(value) => setNewMessage({...newMessage, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="status_update">Mise à jour statut</SelectItem>
                      <SelectItem value="deadline_reminder">Rappel échéance</SelectItem>
                      <SelectItem value="evaluation_request">Demande d'évaluation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sujet</label>
                  <Input
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    placeholder="Objet du message"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="Contenu du message..."
                    rows={6}
                  />
                </div>

                <Button onClick={handleSendMessage} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le Message
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "announcements" && (
            <Card>
              <CardHeader>
                <CardTitle>Annonces Publiques</CardTitle>
                <CardDescription>Communication générale sur les bourses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-2">Ouverture Campagne Printemps 2024</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Nous avons le plaisir d'annoncer l'ouverture de la campagne de bourses pour le semestre de printemps 2024...
                  </p>
                  <Badge variant="outline">Publié le 15/01/2024</Badge>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-2">Nouveau Programme de Recherche</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Un nouveau programme de bourses pour les projets de recherche innovants est maintenant disponible...
                  </p>
                  <Badge variant="outline">Publié le 10/01/2024</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Statistiques de communication */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockMessages.length}</div>
            <div className="text-sm text-muted-foreground">Messages Envoyés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {mockNotifications.filter(n => !n.read).length}
            </div>
            <div className="text-sm text-muted-foreground">Notifications Non Lues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Taux de Lecture</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">24h</div>
            <div className="text-sm text-muted-foreground">Temps de Réponse Moyen</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
