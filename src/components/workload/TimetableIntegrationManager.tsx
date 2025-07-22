
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { workloadService } from "../../services/workloadService";
import { useToast } from "@/hooks/use-toast";

interface TimetableIntegrationManagerProps {
  academicYear?: string;
}

export const TimetableIntegrationManager = ({ academicYear = "2024-2025" }: TimetableIntegrationManagerProps) => {
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState<any[]>([]);
  const [workloads, setWorkloads] = useState<any[]>([]);
  const [formationOffers, setFormationOffers] = useState<any[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    loadData();
  }, [academicYear]);

  const loadData = async () => {
    try {
      const [configs, workloadData] = await Promise.all([
        workloadService.getSectionConfigurations(),
        workloadService.getTeacherWorkloads(academicYear)
      ]);
      
      // Filter configurations by academic year
      const filteredConfigs = configs.filter((c: any) => c.academicYear === academicYear);
      setConfigurations(filteredConfigs);
      setWorkloads(workloadData);
      
      // Mock formation offers for demo
      setFormationOffers([
        { id: "1", name: "Master Informatique" },
        { id: "2", name: "Licence Mathématiques" }
      ]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    }
  };

  const selectedConfig = configurations.find((c: any) => c.id === selectedConfigId);
  const selectedOffer = selectedConfig ? formationOffers.find((o: any) => o.id === selectedConfig.formationId) : null;

  const generateTimetableForConfiguration = async () => {
    if (!selectedConfig || !selectedOffer) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulation de génération d'emploi du temps
      const steps = [
        "Analyse de la configuration des sections...",
        "Vérification des charges d'enseignement...",
        "Attribution des créneaux horaires...",
        "Optimisation des conflits...",
        "Génération finale de l'emploi du temps..."
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGenerationProgress(((i + 1) / steps.length) * 100);
        
        toast({
          title: "Génération en cours",
          description: steps[i]
        });
      }

      toast({
        title: "Succès",
        description: `Emploi du temps généré pour ${selectedOffer.name}`,
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération de l'emploi du temps",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const getConfigurationStats = (config: any) => {
    const totalSections = config.sections?.length || 0;
    const totalGroups = config.sections?.reduce((sum: number, section: any) => sum + (section.groups?.length || 0), 0) || 0;
    const totalCapacity = config.totalStudentCount || 0;
    
    return { totalSections, totalGroups, totalCapacity };
  };

  const getWorkloadStats = () => {
    const totalTeachers = workloads.length;
    const overloadedTeachers = workloads.filter((w: any) => w.totalVH > w.yearlyNormVH).length;
    const underloadedTeachers = workloads.filter((w: any) => w.totalVH < w.yearlyNormVH).length;
    const totalAssignments = workloads.reduce((sum: number, w: any) => sum + (w.modules?.length || 0), 0);
    
    return { totalTeachers, overloadedTeachers, underloadedTeachers, totalAssignments };
  };

  const workloadStats = getWorkloadStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Intégration Emplois du Temps et Charges d'Enseignement
          </CardTitle>
          <p className="text-slate-600">
            Générez automatiquement les emplois du temps basés sur vos configurations de sections et charges d'enseignement
          </p>
          <p className="text-sm text-slate-500">Année académique: {academicYear}</p>
        </CardHeader>
      </Card>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Configurations</p>
                <p className="text-2xl font-bold text-blue-900">{configurations.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Enseignants</p>
                <p className="text-2xl font-bold text-green-900">{workloadStats.totalTeachers}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Attributions</p>
                <p className="text-2xl font-bold text-purple-900">{workloadStats.totalAssignments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Surcharges</p>
                <p className="text-2xl font-bold text-red-900">{workloadStats.overloadedTeachers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sélection de configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Génération d'Emploi du Temps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sélectionner une Configuration de Sections
            </label>
            <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une configuration" />
              </SelectTrigger>
              <SelectContent>
                {configurations.map((config: any) => (
                  <SelectItem key={config.id} value={config.id}>
                    {config.sectionName} - {config.academicYear} ({config.groupCount} groupes)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedConfig && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Configuration Sélectionnée</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Formation:</span>
                    <p className="font-medium">{selectedConfig.formation}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Section:</span>
                    <p className="font-medium">{selectedConfig.sectionName}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Groupes:</span>
                    <p className="font-medium">{selectedConfig.groupCount}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Capacité:</span>
                    <p className="font-medium">{selectedConfig.totalStudentCount} étudiants</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={generateTimetableForConfiguration}
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isGenerating ? "Génération en cours..." : "Générer l'Emploi du Temps"}
                </Button>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Progression</span>
                    <span className="text-sm font-medium">{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des configurations disponibles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configurations Disponibles</h3>
        {configurations.map((config: any) => {
          const stats = getConfigurationStats(config);
          
          return (
            <Card key={config.id} className={selectedConfigId === config.id ? "border-blue-300 bg-blue-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{config.formation}</h4>
                    <p className="text-sm text-slate-600">{config.academicYear}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>{config.sectionName}</span>
                      <span>{config.groupCount} groupes</span>
                      <span>{config.totalStudentCount} places</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <Badge variant="outline">Configuration</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedConfigId(config.id)}
                    >
                      Sélectionner
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {configurations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Aucune configuration pour l'année {academicYear}</p>
              <p className="text-sm text-slate-500">
                Créez d'abord des configurations de sections dans l'onglet correspondant
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
