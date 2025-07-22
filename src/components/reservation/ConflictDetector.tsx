
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, Users, CheckCircle, XCircle, Lightbulb, Calendar } from 'lucide-react';
import { Conflict } from "../../types/reservation";

interface ConflictDetectorProps {
  conflicts: Conflict[];
  onResolve: (conflictId: string, resolution: string) => void;
}

export const ConflictDetector: React.FC<ConflictDetectorProps> = ({
  conflicts,
  onResolve
}) => {
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null);
  const [resolutionInProgress, setResolutionInProgress] = useState<Set<string>>(new Set());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'overlap': return 'Chevauchement';
      case 'capacity': return 'Capacité insuffisante';
      case 'equipment': return 'Équipement indisponible';
      case 'maintenance': return 'Maintenance programmée';
      case 'time_overlap': return 'Conflit horaire';
      case 'capacity_exceeded': return 'Capacité dépassée';
      default: return type;
    }
  };

  const handleAutoResolve = async (conflictId: string) => {
    setResolutionInProgress(prev => new Set(prev).add(conflictId));
    
    // Simulation de résolution automatique
    setTimeout(() => {
      onResolve(conflictId, 'auto');
      setResolutionInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(conflictId);
        return newSet;
      });
    }, 2000);
  };

  const handleManualResolve = (conflictId: string) => {
    onResolve(conflictId, 'manual');
  };

  const conflictsByType = conflicts.reduce((acc, conflict) => {
    if (!acc[conflict.type]) acc[conflict.type] = [];
    acc[conflict.type].push(conflict);
    return acc;
  }, {} as Record<string, Conflict[]>);

  const conflictsBySeverity = conflicts.reduce((acc, conflict) => {
    if (!acc[conflict.severity]) acc[conflict.severity] = [];
    acc[conflict.severity].push(conflict);
    return acc;
  }, {} as Record<string, Conflict[]>);

  if (conflicts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">Aucun conflit détecté</h3>
          <p>Toutes vos réservations sont compatibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques des conflits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total conflits</p>
                <p className="text-2xl font-bold">{conflicts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Haute priorité</p>
                <p className="text-2xl font-bold text-red-600">
                  {conflictsBySeverity.high?.length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moyenne priorité</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {conflictsBySeverity.medium?.length || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Basse priorité</p>
                <p className="text-2xl font-bold text-blue-600">
                  {conflictsBySeverity.low?.length || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de gestion des conflits */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous les conflits</TabsTrigger>
          <TabsTrigger value="by-type">Par type</TabsTrigger>
          <TabsTrigger value="by-severity">Par priorité</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {conflicts.map((conflict) => (
            <Card key={conflict.id} className={`border-l-4 ${
              conflict.severity === 'high' ? 'border-l-red-500' :
              conflict.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getSeverityIcon(conflict.severity)}
                    {getTypeLabel(conflict.type)} - {conflict.space}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getSeverityColor(conflict.severity)}>
                      {conflict.severity}
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {conflict.date}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Réservations en conflit:
                  </h4>
                  <div className="space-y-2">
                    {conflict.reservations.map((reservation, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{reservation.purpose}</p>
                            <p className="text-sm text-muted-foreground">
                              {reservation.requester} • {reservation.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-3 w-3" />
                            {reservation.participants}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {conflict.suggestions && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Suggestions de résolution:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 bg-blue-50 p-3 rounded-lg">
                      {conflict.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAutoResolve(conflict.id)}
                    disabled={resolutionInProgress.has(conflict.id)}
                    className="flex-1"
                  >
                    {resolutionInProgress.has(conflict.id) ? (
                      <>
                        <Clock className="h-3 w-3 mr-2 animate-spin" />
                        Résolution en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-2" />
                        Résolution automatique
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleManualResolve(conflict.id)}
                    className="flex-1"
                  >
                    <Lightbulb className="h-3 w-3 mr-2" />
                    Résolution manuelle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="by-type" className="space-y-4">
          {Object.entries(conflictsByType).map(([type, typeConflicts]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle>{getTypeLabel(type)} ({typeConflicts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {typeConflicts.map(conflict => (
                    <div key={conflict.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{conflict.space} - {conflict.date}</span>
                      <Badge className={getSeverityColor(conflict.severity)}>
                        {conflict.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="by-severity" className="space-y-4">
          {Object.entries(conflictsBySeverity).map(([severity, severityConflicts]) => (
            <Card key={severity}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSeverityIcon(severity)}
                  Priorité {severity} ({severityConflicts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {severityConflicts.map(conflict => (
                    <div key={conflict.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{getTypeLabel(conflict.type)} - {conflict.space}</span>
                      <span className="text-sm text-muted-foreground">{conflict.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recommandations intelligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Actions recommandées:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Déplacer 3 réservations vers des créneaux adjacents
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Utiliser des espaces alternatifs avec capacité similaire
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Regrouper 2 réservations courtes en une session
                  </li>
                </ul>
              </div>
              
              <Button className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Appliquer toutes les recommandations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
