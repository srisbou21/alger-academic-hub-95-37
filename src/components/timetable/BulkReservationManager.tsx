import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Settings, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Package,
  Zap,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkOperation {
  id: string;
  type: 'cancel' | 'modify' | 'transfer';
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  affectedCount: number;
  duration?: number;
}

interface ReservationFilter {
  formation?: string;
  semester?: string;
  dateRange?: string;
  status?: string;
  room?: string;
}

interface Props {
  onBulkOperation: (operation: string, count: number) => void;
}

export const BulkReservationManager = ({ onBulkOperation }: Props) => {
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  
  const [filters, setFilters] = useState<ReservationFilter>({
    formation: "",
    semester: "",
    dateRange: "",
    status: "",
    room: ""
  });

  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
  const [confirmDangerous, setConfirmDangerous] = useState(false);

  const formations = [
    { id: "1", name: "Licence Informatique", reservations: 156, status: "active" },
    { id: "2", name: "Master IA", reservations: 98, status: "active" },
    { id: "3", name: "Licence Mathématiques", reservations: 124, status: "active" },
    { id: "4", name: "Master Cybersécurité", reservations: 89, status: "pending" }
  ];

  const semesters = [
    { id: "1", name: "Automne 2024", start: "2024-09-01", end: "2024-12-20" },
    { id: "2", name: "Printemps 2025", start: "2025-01-15", end: "2025-05-30" }
  ];

  const [operationHistory, setOperationHistory] = useState<BulkOperation[]>([
    {
      id: "1",
      type: "cancel",
      target: "Master IA - Automne 2024",
      status: "completed",
      progress: 100,
      affectedCount: 98,
      duration: 12000
    }
  ]);

  const executeOperation = async (type: 'cancel' | 'modify' | 'transfer', targetName: string, count: number) => {
    setIsProcessing(true);
    
    const operation: BulkOperation = {
      id: Date.now().toString(),
      type,
      target: targetName,
      status: "running",
      progress: 0,
      affectedCount: count
    };

    setCurrentOperation(operation);

    try {
      const startTime = Date.now();
      
      // Simulation du processus
      for (let i = 0; i <= 100; i += 5) {
        setCurrentOperation(prev => prev ? { ...prev, progress: i } : null);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const endTime = Date.now();
      const finalOperation: BulkOperation = {
        ...operation,
        status: "completed",
        progress: 100,
        duration: endTime - startTime
      };

      setOperationHistory(prev => [finalOperation, ...prev]);
      onBulkOperation(type, count);

      toast({
        title: "Opération terminée",
        description: `${count} réservations traitées avec succès`
      });

    } catch (error) {
      setCurrentOperation(prev => prev ? { ...prev, status: "failed" } : null);
      toast({
        title: "Erreur",
        description: "L'opération a échoué",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setCurrentOperation(null), 2000);
      setConfirmDangerous(false);
    }
  };

  const handleBulkCancel = () => {
    if (selectedFormations.length === 0) {
      toast({
        title: "Erreur",
        description: "Sélectionnez au moins une formation",
        variant: "destructive"
      });
      return;
    }

    if (!confirmDangerous) {
      toast({
        title: "Confirmation requise",
        description: "Veuillez confirmer cette opération critique",
        variant: "destructive"
      });
      return;
    }

    const totalReservations = selectedFormations.reduce((total, formationId) => {
      const formation = formations.find(f => f.id === formationId);
      return total + (formation?.reservations || 0);
    }, 0);

    const targetNames = selectedFormations.map(id => 
      formations.find(f => f.id === id)?.name
    ).join(", ");

    executeOperation('cancel', targetNames, totalReservations);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Terminé</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'cancel':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'modify':
        return <Settings className="h-4 w-4 text-blue-600" />;
      case 'transfer':
        return <RotateCcw className="h-4 w-4 text-purple-600" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return seconds > 60 ? `${Math.floor(seconds / 60)}min ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Gestion en Masse des Réservations
          </CardTitle>
          <p className="text-muted-foreground">
            Outils pour les opérations groupées sur les réservations avec annulation d'urgence
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="cancel" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cancel">Annulation Massive</TabsTrigger>
          <TabsTrigger value="filters">Filtres Avancés</TabsTrigger>
          <TabsTrigger value="monitor">Suivi Opérations</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="cancel" className="space-y-4">
          {currentOperation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Opération en Cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {getOperationIcon(currentOperation.type)}
                        <span className="font-medium">{currentOperation.target}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentOperation.affectedCount} réservations à traiter
                      </p>
                    </div>
                    {getStatusBadge(currentOperation.status)}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Progression</span>
                      <span className="text-sm">{currentOperation.progress}%</span>
                    </div>
                    <Progress value={currentOperation.progress} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Annulation d'Urgence des Réservations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Attention:</strong> Cette opération supprimera définitivement toutes les réservations 
                  sélectionnées pour la durée complète du semestre. Cette action est irréversible.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-base font-medium">Sélection des Formations</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {formations.map((formation) => (
                    <div 
                      key={formation.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFormations.includes(formation.id) ? 'border-red-500 bg-red-50' : 'hover:border-muted-foreground'
                      }`}
                      onClick={() => {
                        setSelectedFormations(prev => 
                          prev.includes(formation.id) 
                            ? prev.filter(id => id !== formation.id)
                            : [...prev, formation.id]
                        );
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{formation.name}</span>
                        <Badge variant={formation.status === 'active' ? 'default' : 'outline'}>
                          {formation.status === 'active' ? 'Actif' : 'En attente'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formation.reservations} réservations actives
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedFormations.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Récapitulatif de l'opération</h4>
                  <div className="text-sm space-y-1">
                    <div>Formations sélectionnées: {selectedFormations.length}</div>
                    <div>Total réservations à supprimer: {
                      selectedFormations.reduce((total, formationId) => {
                        const formation = formations.find(f => f.id === formationId);
                        return total + (formation?.reservations || 0);
                      }, 0)
                    }</div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="confirm-dangerous"
                  checked={confirmDangerous}
                  onCheckedChange={(checked) => setConfirmDangerous(checked as boolean)}
                />
                <Label htmlFor="confirm-dangerous" className="text-sm">
                  Je confirme vouloir supprimer définitivement ces réservations (action irréversible)
                </Label>
              </div>

              <Button 
                onClick={handleBulkCancel}
                disabled={isProcessing || selectedFormations.length === 0 || !confirmDangerous}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isProcessing ? "Suppression en cours..." : "Supprimer Toutes les Réservations Sélectionnées"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres de Sélection Avancés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="formation-filter">Formation</Label>
                  <Select value={filters.formation} onValueChange={(value) => 
                    setFilters(prev => ({...prev, formation: value}))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les formations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les formations</SelectItem>
                      {formations.map((formation) => (
                        <SelectItem key={formation.id} value={formation.id}>
                          {formation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester-filter">Semestre</Label>
                  <Select value={filters.semester} onValueChange={(value) => 
                    setFilters(prev => ({...prev, semester: value}))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les semestres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les semestres</SelectItem>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-range">Période</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => 
                    setFilters(prev => ({...prev, dateRange: value}))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Toute la période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toute la période</SelectItem>
                      <SelectItem value="current-week">Semaine actuelle</SelectItem>
                      <SelectItem value="current-month">Mois actuel</SelectItem>
                      <SelectItem value="future">Réservations futures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Statut</Label>
                  <Select value={filters.status} onValueChange={(value) => 
                    setFilters(prev => ({...prev, status: value}))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="cancelled">Annulées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Appliquer les Filtres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          {currentOperation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Monitoring en Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted rounded">
                      <div className="text-lg font-bold">{currentOperation.affectedCount}</div>
                      <div className="text-xs text-muted-foreground">Total éléments</div>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <div className="text-lg font-bold">
                        {Math.floor(currentOperation.affectedCount * currentOperation.progress / 100)}
                      </div>
                      <div className="text-xs text-muted-foreground">Traités</div>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <div className="text-lg font-bold">
                        {currentOperation.affectedCount - Math.floor(currentOperation.affectedCount * currentOperation.progress / 100)}
                      </div>
                      <div className="text-xs text-muted-foreground">Restants</div>
                    </div>
                  </div>
                  
                  <Progress value={currentOperation.progress} className="w-full" />
                  
                  <div className="text-center text-sm text-muted-foreground">
                    {currentOperation.status === 'running' ? 'Traitement en cours...' : 'Opération terminée'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucune opération en cours</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Historique des Opérations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {operationHistory.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun historique disponible</p>
                  </div>
                ) : (
                  operationHistory.map((operation) => (
                    <div key={operation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getOperationIcon(operation.type)}
                          <span className="font-medium">{operation.target}</span>
                        </div>
                        {getStatusBadge(operation.status)}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Éléments traités:</span>
                          <div className="font-medium">{operation.affectedCount}</div>
                        </div>
                        {operation.duration && (
                          <div>
                            <span className="text-muted-foreground">Durée:</span>
                            <div className="font-medium">{formatDuration(operation.duration)}</div>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <div className="font-medium capitalize">{operation.type}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};