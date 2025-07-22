import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, BookOpen, MessageCircle, Phone, Mail, Video, FileText } from 'lucide-react';

export const ReservationHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const faqItems = [
    {
      id: '1',
      category: 'Réservation',
      question: 'Comment créer une nouvelle réservation ?',
      answer: 'Pour créer une réservation, allez dans l\'onglet "Espaces", sélectionnez l\'espace souhaité, puis cliquez sur "Créer une réservation". Remplissez tous les champs obligatoires et validez.',
      tags: ['création', 'nouvelle', 'réservation']
    },
    {
      id: '2',
      category: 'Réservation',
      question: 'Puis-je modifier une réservation après création ?',
      answer: 'Oui, vous pouvez modifier une réservation en attente ou confirmée. Cliquez sur la réservation dans le planning et sélectionnez "Modifier". Attention : certaines modifications peuvent créer des conflits.',
      tags: ['modification', 'édition', 'changement']
    },
    {
      id: '3',
      category: 'Conflits',
      question: 'Que faire en cas de conflit de réservation ?',
      answer: 'Les conflits sont automatiquement détectés. Rendez-vous dans l\'onglet "Conflits" pour voir tous les conflits actifs. Vous pouvez les résoudre en modifiant les horaires, en changeant d\'espace ou en annulant une réservation.',
      tags: ['conflit', 'résolution', 'problème']
    },
    {
      id: '4',
      category: 'Espaces',
      question: 'Comment connaître la capacité d\'un espace ?',
      answer: 'La capacité de chaque espace est affichée dans sa fiche détaillée. Vous pouvez également filtrer les espaces par capacité minimale lors de votre recherche.',
      tags: ['capacité', 'espace', 'personnes']
    },
    {
      id: '5',
      category: 'Planning',
      question: 'Comment voir le planning d\'un espace spécifique ?',
      answer: 'Dans l\'onglet "Planning", utilisez le filtre "Espace" pour sélectionner l\'espace souhaité. Le planning affichera uniquement les réservations de cet espace.',
      tags: ['planning', 'calendrier', 'espace']
    },
    {
      id: '6',
      category: 'Équipements',
      question: 'Comment réserver un espace avec des équipements spécifiques ?',
      answer: 'Chaque espace affiche ses équipements disponibles (projecteur, ordinateurs, etc.). Consultez la fiche de l\'espace avant de réserver pour vérifier la disponibilité des équipements.',
      tags: ['équipement', 'matériel', 'projecteur']
    },
    {
      id: '7',
      category: 'Validation',
      question: 'Qui valide les réservations ?',
      answer: 'Les réservations passent par un processus de validation selon le type d\'espace et la durée. Les responsables des espaces reçoivent automatiquement les demandes.',
      tags: ['validation', 'approbation', 'responsable']
    },
    {
      id: '8',
      category: 'Annulation',
      question: 'Comment annuler une réservation ?',
      answer: 'Vous pouvez annuler une réservation depuis le planning en cliquant dessus et en sélectionnant "Annuler". Les annulations tardives peuvent être soumises à restrictions.',
      tags: ['annulation', 'suppression', 'abandon']
    }
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [...new Set(faqItems.map(item => item.category))];

  const quickActions = [
    {
      title: 'Créer une réservation',
      description: 'Guide pas à pas pour créer votre première réservation',
      icon: '📅',
      action: () => console.log('Guide création réservation')
    },
    {
      title: 'Résoudre un conflit',
      description: 'Comment gérer les conflits de réservation',
      icon: '⚠️',
      action: () => console.log('Guide résolution conflit')
    },
    {
      title: 'Trouver un espace',
      description: 'Conseils pour choisir l\'espace adapté',
      icon: '🏢',
      action: () => console.log('Guide choix espace')
    },
    {
      title: 'Comprendre les statuts',
      description: 'Signification des différents statuts de réservation',
      icon: '📊',
      action: () => console.log('Guide statuts')
    }
  ];

  const contactOptions = [
    {
      type: 'Chat',
      description: 'Chat en direct avec le support',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-800',
      available: true
    },
    {
      type: 'Téléphone',
      description: '+33 1 23 45 67 89',
      icon: Phone,
      color: 'bg-green-100 text-green-800',
      available: true
    },
    {
      type: 'Email',
      description: 'support@reservations.edu',
      icon: Mail,
      color: 'bg-purple-100 text-purple-800',
      available: true
    },
    {
      type: 'Visioconférence',
      description: 'Rendez-vous avec un expert',
      icon: Video,
      color: 'bg-orange-100 text-orange-800',
      available: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Centre d'Aide & Support
          </CardTitle>
          <p className="text-indigo-100 text-sm">
            Trouvez rapidement les réponses à vos questions sur les réservations
          </p>
        </CardHeader>
      </Card>

      {/* Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow border-2 border-gray-100 hover:border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div>
                      <h4 className="font-semibold">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Questions fréquentes
            {searchQuery && (
              <Badge variant="outline" className="ml-2">
                {filteredFaq.length} résultat(s)
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres par catégorie */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              variant={searchQuery === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              Toutes
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {filteredFaq.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="font-medium">{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  <div className="space-y-3">
                    <p>{item.answer}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaq.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun résultat trouvé pour "{searchQuery}"</p>
              <p className="text-sm">Essayez d'autres termes de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Besoin d'aide supplémentaire ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactOptions.map((option, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  option.available 
                    ? 'hover:shadow-md border-2 border-gray-100 hover:border-blue-200' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${option.color}`}>
                      <option.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{option.type}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      {!option.available && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Bientôt disponible
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ressources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ressources utiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Guide d'utilisation complet (PDF)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Video className="h-4 w-4 mr-2" />
              Tutoriels vidéo
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Règlement intérieur des réservations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};