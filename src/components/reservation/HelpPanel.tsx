
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, HelpCircle, BookOpen, Video, MessageCircle, Search } from 'lucide-react';

interface HelpPanelProps {
  onClose: () => void;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: "Comment créer une nouvelle réservation ?",
      answer: "Cliquez sur 'Nouvelle' dans l'en-tête, sélectionnez un espace, puis remplissez le formulaire avec les détails de votre réservation.",
      category: "reservation"
    },
    {
      question: "Que faire en cas de conflit de réservation ?",
      answer: "Les conflits sont automatiquement détectés. Allez dans l'onglet 'Conflits' pour voir les suggestions de résolution.",
      category: "conflicts"
    },
    {
      question: "Comment annuler une réservation ?",
      answer: "Dans l'onglet 'Réservations', trouvez votre réservation et cliquez sur 'Supprimer'.",
      category: "reservation"
    },
    {
      question: "Comment voir les statistiques d'utilisation ?",
      answer: "L'onglet 'Statistiques' vous donne un aperçu complet de l'utilisation des espaces.",
      category: "dashboard"
    }
  ];

  const tutorials = [
    {
      title: "Première réservation",
      description: "Guide pas à pas pour créer votre première réservation",
      duration: "3 min",
      difficulty: "Débutant"
    },
    {
      title: "Gérer les conflits",
      description: "Comment résoudre efficacement les conflits de réservation",
      duration: "5 min",
      difficulty: "Intermédiaire"
    },
    {
      title: "Utilisation avancée",
      description: "Fonctionnalités avancées et astuces",
      duration: "8 min",
      difficulty: "Avancé"
    }
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Centre d'aide
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          <Tabs defaultValue="faq" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="tutorials">Tutoriels</TabsTrigger>
              <TabsTrigger value="shortcuts">Raccourcis</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher dans la FAQ..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                {filteredFaq.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.question}</h3>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-4">
              <div className="grid gap-4">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Video className="h-4 w-4 text-blue-600" />
                            <h3 className="font-medium">{tutorial.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {tutorial.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{tutorial.duration}</Badge>
                            <Badge variant="outline">{tutorial.difficulty}</Badge>
                          </div>
                        </div>
                        <Button size="sm">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shortcuts" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Navigation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Nouvelle réservation</span>
                      <Badge variant="outline">Ctrl + N</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Rechercher</span>
                      <Badge variant="outline">Ctrl + F</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Aide</span>
                      <Badge variant="outline">F1</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sauvegarder</span>
                      <Badge variant="outline">Ctrl + S</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Annuler</span>
                      <Badge variant="outline">Esc</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Actualiser</span>
                      <Badge variant="outline">F5</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Support technique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>Email: support@université.fr</p>
                    <p>Téléphone: 01 23 45 67 89</p>
                    <p>Horaires: 8h-18h, Lun-Ven</p>
                    <Button size="sm" className="mt-2">
                      Contacter
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Ressources utiles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BookOpen className="h-3 w-3 mr-2" />
                      Guide utilisateur
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Video className="h-3 w-3 mr-2" />
                      Vidéos tutoriels
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageCircle className="h-3 w-3 mr-2" />
                      Forum communauté
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
