
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  MessageSquare, 
  Mail, 
  Bell, 
  Users, 
  Search, 
  Filter,
  Paperclip,
  Eye,
  Reply
} from "lucide-react";

interface Message {
  id: string;
  from: string;
  to: string[];
  subject: string;
  content: string;
  type: 'email' | 'internal' | 'announcement';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'replied';
  timestamp: Date;
  attachments?: string[];
  replies?: Message[];
}

interface CommunicationStats {
  totalMessages: number;
  unreadMessages: number;
  sentToday: number;
  responseRate: number;
}

export const IntegratedCommunication = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    type: 'internal' as const,
    priority: 'normal' as const,
    recipients: [] as string[]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState<CommunicationStats>({
    totalMessages: 0,
    unreadMessages: 0,
    sentToday: 0,
    responseRate: 85
  });
  const { toast } = useToast();

  const recipientGroups = [
    { value: 'all_students', label: 'Tous les étudiants' },
    { value: 'micro_l3', label: 'Microéconomie L3' },
    { value: 'stats_l2', label: 'Statistiques L2' },
    { value: 'eco_l1', label: 'Économie générale L1' },
    { value: 'administration', label: 'Administration' },
    { value: 'colleagues', label: 'Collègues enseignants' }
  ];

  useEffect(() => {
    // Simulation de messages existants
    const mockMessages: Message[] = [
      {
        id: '1',
        from: 'Amina Benali',
        to: ['enseignant@univ.dz'],
        subject: 'Question sur le cours de microéconomie',
        content: 'Bonjour professeur, j\'ai une question concernant le chapitre 3 sur l\'élasticité de la demande. Pourriez-vous me clarifier la différence entre élasticité-prix et élasticité-revenu ?',
        type: 'internal',
        priority: 'normal',
        status: 'unread',
        timestamp: new Date('2024-07-01T10:30:00'),
        replies: []
      },
      {
        id: '2',
        from: 'Administration',
        to: ['enseignant@univ.dz'],
        subject: 'Rappel: Saisie des notes CC2',
        content: 'Merci de procéder à la saisie des notes du contrôle continu 2 avant le 15 juillet. La plateforme sera fermée après cette date.',
        type: 'email',
        priority: 'high',
        status: 'read',
        timestamp: new Date('2024-06-30T14:15:00')
      },
      {
        id: '3',
        from: 'Mohamed Cherif',
        to: ['enseignant@univ.dz'],
        subject: 'Demande de rendez-vous',
        content: 'Bonjour professeur, pourriez-vous me recevoir cette semaine pour discuter de mon projet de recherche ? Je suis disponible mardi et jeudi après-midi.',
        type: 'internal',
        priority: 'normal',
        status: 'unread',
        timestamp: new Date('2024-06-29T16:45:00')
      }
    ];
    
    setMessages(mockMessages);
    
    // Mise à jour des statistiques
    setStats({
      totalMessages: mockMessages.length,
      unreadMessages: mockMessages.filter(m => m.status === 'unread').length,
      sentToday: 3,
      responseRate: 85
    });
  }, []);

  const sendMessage = () => {
    if (!newMessage.subject || !newMessage.content || !newMessage.to) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      from: 'Enseignant',
      to: [newMessage.to],
      subject: newMessage.subject,
      content: newMessage.content,
      type: newMessage.type,
      priority: newMessage.priority,
      status: 'read',
      timestamp: new Date()
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage({
      to: '',
      subject: '',
      content: '',
      type: 'internal',
      priority: 'normal',
      recipients: []
    });

    toast({
      title: "Message envoyé",
      description: `Message envoyé avec succès via ${message.type === 'email' ? 'email' : 'messagerie interne'}`
    });
  };

  const replyToMessage = () => {
    if (!replyContent || !selectedMessage) return;

    const reply: Message = {
      id: Date.now().toString(),
      from: 'Enseignant',
      to: [selectedMessage.from],
      subject: `Re: ${selectedMessage.subject}`,
      content: replyContent,
      type: selectedMessage.type,
      priority: 'normal',
      status: 'read',
      timestamp: new Date()
    };

    setMessages(prev => [reply, ...prev]);
    
    // Marquer le message original comme lu et répondu
    setMessages(prev => 
      prev.map(msg => 
        msg.id === selectedMessage.id 
          ? { ...msg, status: 'replied' as const }
          : msg
      )
    );

    setReplyContent('');
    setSelectedMessage(null);

    toast({
      title: "Réponse envoyée",
      description: "Votre réponse a été envoyée avec succès"
    });
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'read' as const }
          : msg
      )
    );
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'unread' && message.status === 'unread') ||
      (filterType === 'email' && message.type === 'email') ||
      (filterType === 'internal' && message.type === 'internal');
    
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Badge className="bg-red-500 text-white">Non lu</Badge>;
      case 'read': return <Badge className="bg-blue-100 text-blue-800">Lu</Badge>;
      case 'replied': return <Badge className="bg-green-100 text-green-800">Répondu</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques de communication */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Messages Total</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalMessages}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Non lus</p>
                <p className="text-2xl font-bold text-red-800">{stats.unreadMessages}</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Envoyés aujourd'hui</p>
                <p className="text-2xl font-bold text-green-800">{stats.sentToday}</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Taux de réponse</p>
                <p className="text-2xl font-bold text-purple-800">{stats.responseRate}%</p>
              </div>
              <Reply className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nouveau message */}
        <Card className="border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Send className="h-5 w-5" />
              Nouveau Message
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Destinataire *</label>
                <Select value={newMessage.to} onValueChange={(value) => setNewMessage(prev => ({ ...prev, to: value }))}>
                  <SelectTrigger className="border-green-200">
                    <SelectValue placeholder="Sélectionner un destinataire" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipientGroups.map(group => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select value={newMessage.type} onValueChange={(value: any) => setNewMessage(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="border-green-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Messagerie interne</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="announcement">Annonce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Objet *</label>
              <Input
                value={newMessage.subject}
                onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Objet du message..."
                className="border-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priorité</label>
              <Select value={newMessage.priority} onValueChange={(value: any) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="border-green-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="normal">Normale</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <Textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Tapez votre message ici..."
                className="border-green-200 min-h-32"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={sendMessage} className="bg-green-600 hover:bg-green-700 flex-1">
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
              <Button variant="outline" className="border-green-200">
                <Paperclip className="h-4 w-4 mr-2" />
                Joindre
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Boîte de réception */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageSquare className="h-5 w-5" />
              Boîte de Réception ({stats.unreadMessages} non lus)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filtres et recherche */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="unread">Non lus</SelectItem>
                  <SelectItem value="email">Emails</SelectItem>
                  <SelectItem value="internal">Internes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-blue-50 ${
                    message.status === 'unread' ? "border-blue-300 bg-blue-25" : "border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'unread') {
                      markAsRead(message.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{message.from}</span>
                      <Badge className={getPriorityColor(message.priority)} variant="outline">
                        {message.priority}
                      </Badge>
                      {message.type === 'email' && <Mail className="h-3 w-3 text-gray-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(message.status)}
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
                  <p className="text-xs text-gray-600 truncate">{message.content}</p>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun message trouvé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de message sélectionné */}
      {selectedMessage && (
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-800">{selectedMessage.subject}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Fermer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">De: {selectedMessage.from}</span>
                  <Badge className={getPriorityColor(selectedMessage.priority)}>
                    {selectedMessage.priority}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {selectedMessage.timestamp.toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Répondre:</h4>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Tapez votre réponse..."
                className="mb-4"
              />
              <Button onClick={replyToMessage} className="bg-purple-600 hover:bg-purple-700">
                <Reply className="h-4 w-4 mr-2" />
                Envoyer la réponse
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
