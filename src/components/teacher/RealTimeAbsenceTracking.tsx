
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, Send, FileText } from "lucide-react";

interface AbsenceRequest {
  id: string;
  startDate: Date;
  endDate: Date;
  type: 'maladie' | 'conge_annuel' | 'formation' | 'mission' | 'autre';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  replacementNeeded: boolean;
  coursesAffected: string[];
  documents?: string[];
  createdAt: Date;
}

export const RealTimeAbsenceTracking = () => {
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([]);
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    type: 'maladie' as const,
    reason: '',
    replacementNeeded: false,
    coursesAffected: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const absenceTypes = [
    { value: 'maladie', label: 'Maladie' },
    { value: 'conge_annuel', label: 'Congé annuel' },
    { value: 'formation', label: 'Formation' },
    { value: 'mission', label: 'Mission' },
    { value: 'autre', label: 'Autre' }
  ];

  const mockCourses = [
    'Microéconomie L3 - Lundi 8h',
    'Statistiques L2 - Mardi 10h',
    'Économie générale L1 - Mercredi 14h',
    'Mathématiques financières M1 - Jeudi 9h'
  ];

  useEffect(() => {
    // Simulation de données existantes
    const mockRequests: AbsenceRequest[] = [
      {
        id: '1',
        startDate: new Date('2024-07-05'),
        endDate: new Date('2024-07-07'),
        type: 'formation',
        reason: 'Participation au colloque international de recherche',
        status: 'approved',
        replacementNeeded: true,
        coursesAffected: ['Microéconomie L3 - Lundi 8h'],
        createdAt: new Date('2024-07-01')
      },
      {
        id: '2',
        startDate: new Date('2024-07-10'),
        endDate: new Date('2024-07-12'),
        type: 'maladie',
        reason: 'Grippe saisonnière',
        status: 'pending',
        replacementNeeded: true,
        coursesAffected: ['Statistiques L2 - Mardi 10h', 'Économie générale L1 - Mercredi 14h'],
        createdAt: new Date('2024-07-02')
      }
    ];
    setAbsenceRequests(mockRequests);
  }, []);

  const handleSubmitRequest = async () => {
    if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const request: AbsenceRequest = {
        id: Date.now().toString(),
        startDate: new Date(newRequest.startDate),
        endDate: new Date(newRequest.endDate),
        type: newRequest.type,
        reason: newRequest.reason,
        status: 'pending',
        replacementNeeded: newRequest.replacementNeeded,
        coursesAffected: newRequest.coursesAffected,
        createdAt: new Date()
      };

      setAbsenceRequests(prev => [request, ...prev]);
      
      // Reset form
      setNewRequest({
        startDate: '',
        endDate: '',
        type: 'maladie',
        reason: '',
        replacementNeeded: false,
        coursesAffected: []
      });

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'absence a été transmise à l'administration"
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Rejetée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const toggleCourseSelection = (course: string) => {
    setNewRequest(prev => ({
      ...prev,
      coursesAffected: prev.coursesAffected.includes(course)
        ? prev.coursesAffected.filter(c => c !== course)
        : [...prev.coursesAffected, course]
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="h-5 w-5" />
            Nouvelle Demande d'Absence
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début *</label>
              <Input
                type="date"
                value={newRequest.startDate}
                onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                className="border-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de fin *</label>
              <Input
                type="date"
                value={newRequest.endDate}
                onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                className="border-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type d'absence *</label>
            <Select value={newRequest.type} onValueChange={(value: any) => setNewRequest(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="border-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {absenceTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Motif *</label>
            <Textarea
              value={newRequest.reason}
              onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Décrivez le motif de votre absence..."
              className="border-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cours affectés</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockCourses.map(course => (
                <div key={course} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRequest.coursesAffected.includes(course)}
                    onChange={() => toggleCourseSelection(course)}
                    className="rounded border-blue-200"
                  />
                  <label className="text-sm">{course}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newRequest.replacementNeeded}
              onChange={(e) => setNewRequest(prev => ({ ...prev, replacementNeeded: e.target.checked }))}
              className="rounded border-blue-200"
            />
            <label className="text-sm">Remplacement nécessaire</label>
          </div>

          <Button 
            onClick={handleSubmitRequest}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des Demandes ({absenceRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {absenceRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">
                      {request.startDate.toLocaleDateString('fr-FR')} - {request.endDate.toLocaleDateString('fr-FR')}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">{request.type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500 mt-1">{request.reason}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {request.coursesAffected.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium mb-1">Cours affectés:</p>
                    <div className="flex flex-wrap gap-1">
                      {request.coursesAffected.map((course, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {request.replacementNeeded && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <Users className="h-3 w-3" />
                    Remplacement nécessaire
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
