
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Users, BookOpen, Bell, Mail } from "lucide-react";
import { useState } from "react";

export const TeacherMessaging = () => {
  const [selectedRecipients, setSelectedRecipients] = useState("all");
  const [messageContent, setMessageContent] = useState("");

  const recentMessages = [
    {
      id: 1,
      from: "Amina Benali",
      subject: "Question sur le cours de microéconomie",
      preview: "Bonjour professeur, j'ai une question concernant...",
      date: "2024-06-14",
      read: false,
      type: "student"
    },
    {
      id: 2,
      from: "Administration",
      subject: "Rappel: Saisie des notes CC2",
      preview: "Merci de procéder à la saisie des notes...",
      date: "2024-06-13",
      read: true,
      type: "admin"
    },
    {
      id: 3,
      from: "Mohamed Cherif",
      subject: "Demande de rendez-vous",
      preview: "Pourriez-vous me recevoir cette semaine...",
      date: "2024-06-12",
      read: false,
      type: "student"
    }
  ];

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "student": return <Users className="h-4 w-4 text-blue-600" />;
      case "admin": return <Bell className="h-4 w-4 text-amber-600" />;
      default: return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Messages reçus */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <MessageCircle className="h-5 w-5" />
            Messages Reçus
          </CardTitle>
          <CardDescription>Communications avec étudiants et administration</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div 
                key={message.id} 
                className={`p-3 border rounded-lg cursor-pointer hover:bg-slate-50 ${
                  !message.read ? "border-blue-300 bg-blue-50" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMessageIcon(message.type)}
                    <span className="font-medium text-sm">{message.from}</span>
                    {!message.read && (
                      <Badge className="bg-blue-600 text-white text-xs">Nouveau</Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(message.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
                <p className="text-xs text-slate-600 truncate">{message.preview}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            Voir tous les messages
          </Button>
        </CardContent>
      </Card>

      {/* Nouveau message */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Send className="h-5 w-5" />
            Nouveau Message
          </CardTitle>
          <CardDescription>Envoyer une annonce ou message ciblé</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Destinataires</label>
              <select 
                className="w-full p-2 border border-emerald-200 rounded-lg"
                value={selectedRecipients}
                onChange={(e) => setSelectedRecipients(e.target.value)}
              >
                <option value="all">Tous mes étudiants</option>
                <option value="micro-l3">Microéconomie L3</option>
                <option value="stats-l2">Statistiques L2</option>
                <option value="eco-l1">Économie générale L1</option>
                <option value="absent">Étudiants avec absences</option>
                <option value="risk">Étudiants en difficulté</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Objet</label>
              <Input 
                placeholder="Objet du message..."
                className="border-emerald-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea 
                placeholder="Tapez votre message ici..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="border-emerald-200 min-h-32"
              />
            </div>

            <div className="flex gap-2">
              <Button className="bg-emerald-600 hover:bg-emerald-700 flex-1">
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
              <Button variant="outline" className="border-emerald-200">
                Brouillon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
