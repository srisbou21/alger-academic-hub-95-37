import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Play, 
  Trash2,
  Calendar,
  Clock,
  Building,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Settings,
  Info
} from "lucide-react";

interface Reservation {
  id: string;
  timetableId: string;
  formationName: string;
  subject: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  frequency: 'weekly' | 'biweekly' | 'single';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  conflictReason?: string;
  createdAt: string;
}

interface ReservationBatch {
  id: string;
  timetableId: string;
  formationName: string;
  totalSlots: number;
  processedSlots: number;
  successfulSlots: number;
  failedSlots: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  estimatedTime?: number;
}

export const AutoReservationSystem = () => {
  const [selectedTimetable, setSelectedTimetable] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  
  const [reservationBatches, setReservationBatches] = useState<ReservationBatch[]>([
    {
      id: 'batch-1',
      timetableId: 'tt-1',
      formationName: 'Licence Informatique',
      totalSlots: 156,
      processedSlots: 156,
      successfulSlots: 154,
      failedSlots: 2,
      status: 'completed',
      startedAt: '2024-01-15 09:30',
      completedAt: '2024-01-15 09:35',
      estimatedTime: 5
    },
    {
      id: 'batch-2',
      timetableId: 'tt-2',
      formationName: 'Master Informatique',
      totalSlots: 98,
      processedSlots: 45,
      successfulSlots: 43,
      failedSlots: 2,
      status: 'processing',
      startedAt: '2024-01-15 10:15',
      estimatedTime: 3
    }
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'res-1',
      timetableId: 'tt-1',
      formationName: 'Licence Informatique',
      subject: 'Programmation Java',
      room: 'Salle 101',
      day: 'Lundi',
      startTime: '08:00',
      endTime: '09:30',
      startDate: '2024-09-02',
      endDate: '2025-01-26',
      frequency: 'weekly',
      status: 'confirmed',
      createdAt: '2024-01-15 09:30'
    },
    {
      id: 'res-2',
      timetableId: 'tt-1',
      formationName: 'Licence Informatique',
      subject: 'Base de Données',
      room: 'Lab Info 1',
      day: 'Mardi',
      startTime: '14:00',
      endTime: '15:30',
      startDate: '2024-09-03',
      endDate: '2025-01-27',
      frequency: 'weekly',
      status: 'failed',
      conflictReason: 'Salle déjà réservée pour maintenance',
      createdAt: '2024-01-15 09:32'
    }
  ]);

  const timetables = [
    { id: 'tt-1', name: 'Licence Informatique - S1 2024/25', validated: true },
    { id: 'tt-2', name: 'Master Informatique - S1 2024/25', validated: true },
    { id: 'tt-3', name: 'Licence Mathématiques - S1 2024/25', validated: false }
  ];

  const handleStartReservations = () => {
    if (!selectedTimetable) return;
    
    setIsProcessing(true);
    
    const timetable = timetables.find(t => t.id === selectedTimetable);
    const newBatch: ReservationBatch = {
      id: `batch-${Date.now()}`,
      timetableId: selectedTimetable,
      formationName: timetable?.name.split(' - ')[0] || 'Formation',
      totalSlots: Math.floor(Math.random() * 100) + 80,
      processedSlots: 0,
      successfulSlots: 0,
      failedSlots: 0,
      status: 'processing',
      startedAt: new Date().toLocaleString(),
      estimatedTime: Math.floor(Math.random() * 5) + 3
    };

    setReservationBatches([newBatch, ...reservationBatches]);
    
    // Simuler le traitement
    simulateProcessing(newBatch);
  };

  const simulateProcessing = async (batch: ReservationBatch) => {
    const updateInterval = setInterval(() => {
      setReservationBatches(batches => 
        batches.map(b => {
          if (b.id === batch.id) {
            const processed = Math.min(b.processedSlots + 5, b.totalSlots);
            const successful = Math.floor(processed * 0.95);
            const failed = processed - successful;
            
            if (processed >= b.totalSlots) {
              clearInterval(updateInterval);
              setIsProcessing(false);
              return {
                ...b,
                processedSlots: processed,
                successfulSlots: successful,
                failedSlots: failed,
                status: 'completed' as const,
                completedAt: new Date().toLocaleString()
              };
            }
            
            return {
              ...b,
              processedSlots: processed,
              successfulSlots: successful,
              failedSlots: failed
            };
          }
          return b;
        })
      );
    }, 500);
  };

  const handleCancelAllReservations = () => {
    // Logique d'annulation d'urgence
    const batchId = selectedBatch;
    
    setReservations(reservations.map(res => 
      res.timetableId === batchId ? { ...res, status: 'cancelled' as const } : res
    ));
    
    setReservationBatches(batches => 
      batches.map(batch => 
        batch.id === batchId ? { ...batch, status: 'cancelled' as const } : batch
      )
    );
    
    setShowCancelDialog(false);
    setSelectedBatch('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-orange-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.formationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Système de Réservations Automatiques
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Création et gestion automatique des réservations pour toute la durée du semestre
              </p>
            </div>
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Annulation d'urgence
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Annulation d'urgence des réservations</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Attention !</strong> Cette action va annuler toutes les réservations 
                      associées à l'emploi du temps sélectionné. Cette action est irréversible.
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <Label>Sélectionner l'emploi du temps</Label>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un emploi du temps" />
                      </SelectTrigger>
                      <SelectContent>
                        {reservationBatches.map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.formationName} ({batch.totalSlots} réservations)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Raison de l'annulation</Label>
                    <Textarea placeholder="Indiquez la raison de l'annulation d'urgence..." />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelAllReservations}
                      disabled={!selectedBatch}
                    >
                      Confirmer l'annulation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Nouvelle réservation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Créer les Réservations Automatiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Emploi du temps validé</Label>
              <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un emploi du temps" />
                </SelectTrigger>
                <SelectContent>
                  {timetables
                    .filter(t => t.validated)
                    .map(timetable => (
                      <SelectItem key={timetable.id} value={timetable.id}>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>{timetable.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Information :</strong> Les réservations seront créées automatiquement pour 
              toute la durée du semestre (de la date de début jusqu'à la date de fin). 
              Le système détectera et gérera automatiquement les conflits.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleStartReservations}
            disabled={!selectedTimetable || isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isProcessing ? 'Traitement en cours...' : 'Démarrer les réservations'}
          </Button>
        </CardContent>
      </Card>

      {/* Suivi des traitements en lot */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi des Traitements en Lot</CardTitle>
          <p className="text-muted-foreground">
            Progression des créations de réservations par emploi du temps
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {reservationBatches.map((batch) => (
            <div key={batch.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(batch.status)}
                  <div>
                    <h4 className="font-medium">{batch.formationName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {batch.startedAt} 
                      {batch.completedAt && ` - ${batch.completedAt}`}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(batch.status)}>
                  {batch.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{batch.processedSlots}/{batch.totalSlots} créneaux</span>
                </div>
                <Progress 
                  value={(batch.processedSlots / batch.totalSlots) * 100} 
                  className="h-2" 
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-emerald-600">
                    {batch.successfulSlots}
                  </div>
                  <p className="text-xs text-muted-foreground">Réussies</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {batch.failedSlots}
                  </div>
                  <p className="text-xs text-muted-foreground">Échouées</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {batch.estimatedTime}min
                  </div>
                  <p className="text-xs text-muted-foreground">Temps estimé</p>
                </div>
              </div>

              {batch.status === 'completed' && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Rapport
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSelectedBatch(batch.id);
                      setShowCancelDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Annuler toutes
                  </Button>
                </div>
              )}
            </div>
          ))}

          {reservationBatches.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun traitement en cours</p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez un emploi du temps validé pour démarrer les réservations
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des réservations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Réservations Créées</CardTitle>
              <p className="text-muted-foreground">
                Liste détaillée de toutes les réservations
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtres */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une réservation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="confirmed">Confirmées</SelectItem>
                  <SelectItem value="failed">Échouées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-emerald-600">
                {reservations.filter(r => r.status === 'confirmed').length}
              </div>
              <p className="text-xs text-muted-foreground">Confirmées</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {reservations.filter(r => r.status === 'failed').length}
              </div>
              <p className="text-xs text-muted-foreground">Échouées</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">
                {reservations.filter(r => r.status === 'cancelled').length}
              </div>
              <p className="text-xs text-muted-foreground">Annulées</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">En attente</p>
            </div>
          </div>

          {/* Liste des réservations */}
          <div className="space-y-3">
            {filteredReservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune réservation trouvée</p>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              filteredReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(reservation.status)}
                        <h4 className="font-medium">{reservation.subject}</h4>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <Badge variant="outline">{reservation.formationName}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.startTime} - {reservation.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.room}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {reservation.startDate} → {reservation.endDate}
                        </div>
                      </div>
                      
                      {reservation.conflictReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Conflit :</strong> {reservation.conflictReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};