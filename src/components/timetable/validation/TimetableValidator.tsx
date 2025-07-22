import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Edit, 
  Eye,
  Calendar,
  Clock,
  Users,
  Building,
  Info,
  RefreshCw,
  Download,
  Send,
  FileText
} from "lucide-react";

interface ValidationIssue {
  id: string;
  type: 'conflict' | 'constraint' | 'quality' | 'resource';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  affectedSlots: string[];
  suggestedFix?: string;
  isResolved: boolean;
}

interface TimetableSlot {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  section: string;
  group?: string;
  type: 'cours' | 'td' | 'tp';
  status: 'valid' | 'warning' | 'error';
}

export const TimetableValidator = () => {
  const [selectedTimetable, setSelectedTimetable] = useState<string>('1');
  const [validationStatus, setValidationStatus] = useState<'pending' | 'validated' | 'rejected'>('pending');
  const [isValidating, setIsValidating] = useState(false);
  
  const [issues, setIssues] = useState<ValidationIssue[]>([
    {
      id: '1',
      type: 'conflict',
      severity: 'error',
      title: 'Conflit de salle',
      description: 'La salle 101 est réservée simultanément pour deux cours',
      affectedSlots: ['slot-1', 'slot-2'],
      suggestedFix: 'Déplacer l\'un des cours vers la salle 102',
      isResolved: false
    },
    {
      id: '2',
      type: 'constraint',
      severity: 'warning',
      title: 'Dépassement horaire',
      description: 'L\'enseignant Dr. Martin dépasse 6h de cours consécutives',
      affectedSlots: ['slot-3'],
      suggestedFix: 'Ajouter une pause ou répartir sur deux jours',
      isResolved: false
    },
    {
      id: '3',
      type: 'quality',
      severity: 'info',
      title: 'Optimisation possible',
      description: 'Les étudiants ont un déplacement important entre deux cours',
      affectedSlots: ['slot-4', 'slot-5'],
      suggestedFix: 'Rapprocher les salles ou ajuster les horaires',
      isResolved: true
    }
  ]);

  const [timetableSlots] = useState<TimetableSlot[]>([
    {
      id: 'slot-1',
      subject: 'Programmation Java',
      teacher: 'Dr. Bernard',
      room: 'Salle 101',
      day: 'Lundi',
      startTime: '08:00',
      endTime: '09:30',
      section: 'L1-INFO-A',
      type: 'cours',
      status: 'error'
    },
    {
      id: 'slot-2',
      subject: 'Base de Données',
      teacher: 'Mme. Durand',
      room: 'Salle 101',
      day: 'Lundi',
      startTime: '08:30',
      endTime: '10:00',
      section: 'L1-INFO-B',
      type: 'cours',
      status: 'error'
    },
    {
      id: 'slot-3',
      subject: 'Algorithmique',
      teacher: 'Dr. Martin',
      room: 'Salle 102',
      day: 'Mardi',
      startTime: '08:00',
      endTime: '15:00',
      section: 'L1-INFO-A',
      type: 'cours',
      status: 'warning'
    }
  ]);

  const timetables = [
    { id: '1', name: 'Licence Informatique - Semestre 1', status: 'En validation' },
    { id: '2', name: 'Master Informatique - Semestre 1', status: 'Validé' },
    { id: '3', name: 'Licence Mathématiques - Semestre 1', status: 'Brouillon' }
  ];

  const handleValidation = () => {
    setIsValidating(true);
    
    // Simuler la validation
    setTimeout(() => {
      const hasErrors = issues.some(issue => issue.severity === 'error' && !issue.isResolved);
      setValidationStatus(hasErrors ? 'rejected' : 'validated');
      setIsValidating(false);
    }, 2000);
  };

  const handleResolveIssue = (issueId: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, isResolved: true } : issue
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'error': return 'border-red-400 bg-red-25';
      case 'warning': return 'border-orange-400 bg-orange-25';
      case 'info': return 'border-blue-400 bg-blue-25';
      default: return 'border-gray-400 bg-gray-25';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'error': return 'border-red-300 bg-red-50';
      case 'warning': return 'border-orange-300 bg-orange-50';
      case 'valid': return 'border-emerald-300 bg-emerald-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const criticalIssues = issues.filter(issue => issue.severity === 'critical' && !issue.isResolved);
  const errorIssues = issues.filter(issue => issue.severity === 'error' && !issue.isResolved);
  const warningIssues = issues.filter(issue => issue.severity === 'warning' && !issue.isResolved);
  const infoIssues = issues.filter(issue => issue.severity === 'info' && !issue.isResolved);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Validation et Modification des Emplois du Temps
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Validation automatique et manuelle avec détection des conflits
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Aperçu
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sélection de l'emploi du temps */}
      <Card>
        <CardHeader>
          <CardTitle>Emploi du temps à valider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timetables.map(timetable => (
                    <SelectItem key={timetable.id} value={timetable.id}>
                      <div className="flex items-center gap-2">
                        <span>{timetable.name}</span>
                        <Badge variant="secondary">{timetable.status}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleValidation}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isValidating ? 'Validation...' : 'Valider'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* État de validation */}
      {validationStatus !== 'pending' && (
        <Alert className={
          validationStatus === 'validated' 
            ? 'border-emerald-200 bg-emerald-50' 
            : 'border-red-200 bg-red-50'
        }>
          {validationStatus === 'validated' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {validationStatus === 'validated' ? (
              <div>
                <strong>Emploi du temps validé !</strong> Tous les problèmes critiques ont été résolus. 
                Vous pouvez maintenant procéder à la création des réservations automatiques.
              </div>
            ) : (
              <div>
                <strong>Validation échouée !</strong> Il reste des problèmes critiques à résoudre 
                avant de pouvoir valider l'emploi du temps.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques de validation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-red-600">{criticalIssues.length + errorIssues.length}</div>
            <p className="text-sm text-muted-foreground">Problèmes critiques</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{warningIssues.length}</div>
            <p className="text-sm text-muted-foreground">Avertissements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{infoIssues.length}</div>
            <p className="text-sm text-muted-foreground">Informations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round((issues.filter(i => i.isResolved).length / issues.length) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Problèmes résolus</p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de validation */}
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Problèmes détectés</TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
          <TabsTrigger value="approval">Processus d'approbation</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Problèmes détectés</CardTitle>
              <p className="text-muted-foreground">
                Liste des conflits, contraintes violées et optimisations possibles
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun problème détecté</p>
                  <p className="text-sm text-muted-foreground">L'emploi du temps peut être validé</p>
                </div>
              ) : (
                issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 border rounded-lg ${getSeverityColor(issue.severity)} ${
                      issue.isResolved ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{issue.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {issue.type}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                issue.severity === 'critical' || issue.severity === 'error' 
                                  ? 'border-red-500 text-red-700'
                                  : issue.severity === 'warning'
                                  ? 'border-orange-500 text-orange-700'
                                  : 'border-blue-500 text-blue-700'
                              }`}
                            >
                              {issue.severity}
                            </Badge>
                            {issue.isResolved && (
                              <Badge className="bg-emerald-100 text-emerald-800">Résolu</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                          {issue.suggestedFix && (
                            <p className="text-sm text-blue-600 mb-2">
                              <strong>Solution suggérée :</strong> {issue.suggestedFix}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>Créneaux affectés :</span>
                            {issue.affectedSlots.map((slotId, index) => (
                              <Badge key={slotId} variant="outline" className="text-xs">
                                {slotId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier le créneau</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Nouvelle salle</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner une salle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="101">Salle 101</SelectItem>
                                      <SelectItem value="102">Salle 102</SelectItem>
                                      <SelectItem value="103">Salle 103</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Nouveau créneau</Label>
                                  <Input type="time" />
                                </div>
                              </div>
                              <div>
                                <Label>Notes de modification</Label>
                                <Textarea placeholder="Raison de la modification..." />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Annuler</Button>
                                <Button onClick={() => handleResolveIssue(issue.id)}>
                                  Appliquer
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {!issue.isResolved && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResolveIssue(issue.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Créneaux de l'emploi du temps</CardTitle>
              <p className="text-muted-foreground">
                Vue détaillée des créneaux avec indicateurs de problèmes
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timetableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 border rounded-lg ${getSlotStatusColor(slot.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{slot.subject}</h4>
                          <Badge variant="outline">{slot.type.toUpperCase()}</Badge>
                          <Badge variant="outline">{slot.section}</Badge>
                          {slot.group && <Badge variant="outline">{slot.group}</Badge>}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{slot.day}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{slot.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{slot.room}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processus d'approbation</CardTitle>
              <p className="text-muted-foreground">
                Workflow de validation et d'approbation de l'emploi du temps
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Validation technique</h4>
                    <p className="text-sm text-muted-foreground">Vérification automatique des contraintes</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Terminé</Badge>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Validation pédagogique</h4>
                    <p className="text-sm text-muted-foreground">Approbation par le chef de département</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Validation administrative</h4>
                    <p className="text-sm text-muted-foreground">Approbation finale de l'administration</p>
                  </div>
                  <Badge variant="secondary">En attente</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Soumettre pour approbation
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Générer rapport
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};