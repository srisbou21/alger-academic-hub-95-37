
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Paperclip, Users, Search, Archive, Reply, Forward, Trash2 } from "lucide-react";
import { useState } from "react";

export const IntegratedMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  const conversations = [
    {
      id: 1,
      subject: "Question sur les modalités d'examen",
      participants: ["Amina Benali", "Prof. Cherif"],
      lastMessage: "Merci pour les précisions, c'est plus clair maintenant.",
      timestamp: "2024-06-14 14:30",
      unread: false,
      attachments: 1,
      delegated: false
    },
    {
      id: 2,
      subject: "Demande de relevé de notes urgent",
      participants: ["Mohamed Tahar", "Administration"],
      lastMessage: "Votre demande a été transmise au service compétent.",
      timestamp: "2024-06-14 11:15",
      unread: true,
      attachments: 0,
      delegated: true
    },
    {
      id: 3,
      subject: "Problème technique avec la plateforme",
      participants: ["Sarah Kadi", "Support IT"],
      lastMessage: "Le problème a été résolu, vous pouvez vous reconnecter.",
      timestamp: "2024-06-13 16:45",
      unread: false,
      attachments: 2,
      delegated: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Amina Benali",
      content: "Bonjour, j'aimerais avoir des précisions sur les modalités de l'examen de microéconomie prévu la semaine prochaine.",
      timestamp: "2024-06-14 10:00",
      attachments: []
    },
    {
      id: 2,
      sender: "Prof. Cherif",
      content: "Bonjour Amina, l'examen aura lieu en présentiel, durée 2h, sans documents autorisés. Les calculatrices sont permises.",
      timestamp: "2024-06-14 10:30",
      attachments: ["programme_examen.pdf"]
    },
    {
      id: 3,
      sender: "Amina Benali",
      content: "Merci pour les précisions, c'est plus clair maintenant.",
      timestamp: "2024-06-14 14:30",
      attachments: []
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Messagerie Intégrée</h3>
        <Button 
          onClick={() => setShowCompose(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Nouveau Message
        </Button>
      </div>

      {showCompose && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800">Composer un Message</CardTitle>
            <CardDescription>Communication individuelle ou collective</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destinataire(s)</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les destinataires" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individuel</SelectItem>
                    <SelectItem value="group-students">Groupe d'étudiants</SelectItem>
                    <SelectItem value="group-teachers">Groupe d'enseignants</SelectItem>
                    <SelectItem value="department">Département</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priorité</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Normale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Objet</label>
              <Input placeholder="Objet du message..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Tapez votre message ici..."
                className="min-h-32"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Joindre un fichier
              </Button>
              <div className="text-sm text-slate-500">
                Fichiers sécurisés - Max 10MB
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="bg-green-600 hover:bg-green-700 flex-1">
                <Send className="h-4 w-4 mr-2" />
                Envoyer le Message
              </Button>
              <Button variant="outline">
                Brouillon
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCompose(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="flex gap-2">
                <Input placeholder="Rechercher..." className="flex-1" />
                <Button size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 cursor-pointer hover:bg-slate-50 border-b ${
                      selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">{conv.subject}</h4>
                      {conv.unread && (
                        <Badge className="bg-blue-600 text-white text-xs">Nouveau</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {conv.participants.join(', ')}
                    </p>
                    <p className="text-xs text-slate-500 truncate mb-2">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{conv.timestamp}</span>
                      <div className="flex items-center gap-1">
                        {conv.attachments > 0 && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            <span>{conv.attachments}</span>
                          </div>
                        )}
                        {conv.delegated && (
                          <Badge className="bg-amber-100 text-amber-800 text-xs">Délégué</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vue de la conversation */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {conversations.find(c => c.id === selectedConversation)?.subject}
                    </CardTitle>
                    <CardDescription>
                      Participants: {conversations.find(c => c.id === selectedConversation)?.participants.join(', ')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Forward className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {messages.map((message) => (
                    <div key={message.id} className="border-l-4 border-l-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-slate-500">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{message.content}</p>
                      {message.attachments.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-slate-400" />
                          {message.attachments.map((file, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Zone de réponse */}
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Tapez votre réponse..."
                    className="min-h-24"
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Joindre
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-2" />
                      Répondre
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Sélectionnez une conversation pour commencer</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
