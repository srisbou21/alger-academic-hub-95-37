import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Plus, Send, Pin, Clock, Users, BookOpen } from "lucide-react";
import { useState } from "react";

export const CourseForums = () => {
  const [selectedForum, setSelectedForum] = useState("micro-l3");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newReply, setNewReply] = useState("");

  const forums = [
    { id: "micro-l3", name: "Microéconomie L3", topics: 15, messages: 47, color: "blue" },
    { id: "stats-l2", name: "Statistiques L2", topics: 12, messages: 34, color: "green" },
    { id: "eco-l1", name: "Économie générale L1", topics: 8, messages: 23, color: "purple" }
  ];

  const topics = [
    {
      id: "TOP-001",
      title: "Question sur l'équilibre de Nash",
      author: "Amina Benali",
      authorType: "student",
      replies: 5,
      lastActivity: "2024-06-15 10:30",
      isPinned: true,
      preview: "Bonjour, j'ai une question concernant l'équilibre de Nash dans le cas..."
    },
    {
      id: "TOP-002", 
      title: "Exercices supplémentaires chapitre 3",
      author: "Prof. Martin",
      authorType: "teacher",
      replies: 12,
      lastActivity: "2024-06-14 16:45",
      isPinned: false,
      preview: "Voici quelques exercices supplémentaires pour approfondir..."
    },
    {
      id: "TOP-003",
      title: "Clarification sur les courbes d'indifférence",
      author: "Mohamed Cherif",
      authorType: "student",
      replies: 3,
      lastActivity: "2024-06-14 09:15",
      isPinned: false,
      preview: "Je ne comprends pas bien comment tracer les courbes..."
    }
  ];

  const messages = [
    {
      id: "MSG-001",
      author: "Prof. Martin",
      authorType: "teacher",
      content: "L'équilibre de Nash représente une situation où aucun joueur n'a intérêt à modifier sa stratégie de manière unilatérale...",
      timestamp: "2024-06-15 10:35",
      isAnswer: true
    },
    {
      id: "MSG-002",
      author: "Fatima Ouali",
      authorType: "student", 
      content: "Merci pour cette explication ! Cela clarifie beaucoup de choses.",
      timestamp: "2024-06-15 11:20",
      isAnswer: false
    }
  ];

  const getForumColor = (color: string) => {
    const colors = {
      blue: "border-blue-200 bg-blue-50",
      green: "border-green-200 bg-green-50",
      purple: "border-purple-200 bg-purple-50"
    };
    return colors[color as keyof typeof colors] || "border-slate-200 bg-slate-50";
  };

  const getAuthorBadge = (type: string) => {
    return type === "teacher" 
      ? <Badge className="bg-emerald-100 text-emerald-800">Enseignant</Badge>
      : <Badge variant="outline">Étudiant</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Système de Forums de Discussion
          </CardTitle>
          <p className="text-blue-100">
            Espaces d'échange et de collaboration pédagogique par matière
          </p>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Forums de Discussion</h2>
          <p className="text-slate-600">Espaces d'échange par matière</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Sujet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des forums */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Mes Matières
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {forums.map((forum) => (
              <div
                key={forum.id}
                onClick={() => setSelectedForum(forum.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedForum === forum.id 
                    ? getForumColor(forum.color) + " border-2" 
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <h4 className="font-medium text-slate-800">{forum.name}</h4>
                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {forum.topics} sujets
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {forum.messages} messages
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sujets du forum sélectionné */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Sujets de Discussion
            </CardTitle>
            <CardDescription>
              {forums.find(f => f.id === selectedForum)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {topic.isPinned && <Pin className="h-3 w-3 text-amber-600" />}
                    <h4 className="font-medium text-slate-800 text-sm">{topic.title}</h4>
                  </div>
                  {getAuthorBadge(topic.authorType)}
                </div>
                
                <p className="text-xs text-slate-600 mb-2 truncate">{topic.preview}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Par {topic.author}</span>
                  <div className="flex items-center gap-2">
                    <span>{topic.replies} réponses</span>
                    <Clock className="h-3 w-3" />
                    <span>{new Date(topic.lastActivity).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contenu du sujet sélectionné */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Question sur l'équilibre de Nash</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">AB</AvatarFallback>
              </Avatar>
              Amina Benali • 15/06/2024 à 10:30
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages du sujet */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.isAnswer 
                      ? "bg-emerald-50 border border-emerald-200" 
                      : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {message.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{message.author}</span>
                    {getAuthorBadge(message.authorType)}
                    {message.isAnswer && (
                      <Badge className="bg-emerald-600 text-white text-xs">Réponse validée</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-700">{message.content}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(message.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>

            {/* Nouvelle réponse */}
            <div className="border-t pt-4">
              <Textarea
                placeholder="Écrire une réponse..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="mb-2"
              />
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                <Send className="h-3 w-3 mr-2" />
                Publier
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
