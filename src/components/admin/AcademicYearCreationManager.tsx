
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus, 
  Copy, 
  Archive, 
  AlertTriangle,
  Info,
  CheckCircle
} from "lucide-react";
import { academicYearService, DataMigrationOptions } from "../../services/academicYearService";
import { useToast } from "@/hooks/use-toast";

interface AcademicYearCreationManagerProps {
  onYearCreated?: () => void;
}

export const AcademicYearCreationManager: React.FC<AcademicYearCreationManagerProps> = ({ 
  onYearCreated 
}) => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newYearString, setNewYearString] = useState("");
  const [migrationOptions, setMigrationOptions] = useState<DataMigrationOptions>({
    copyFormationOffers: true,
    copySectionConfigurations: true,
    createTeacherWorkloads: true,
    archivePreviousYear: false
  });

  const handleCreateYear = async () => {
    if (!newYearString.match(/^\d{4}-\d{4}$/)) {
      toast({
        title: "Format invalide",
        description: "Utilisez le format YYYY-YYYY (ex: 2025-2026)",
        variant: "destructive"
      });
      return;
    }

    const [startYear, endYear] = newYearString.split('-').map(Number);
    if (endYear !== startYear + 1) {
      toast({
        title: "Années incorrectes",
        description: "L'année de fin doit être l'année suivante (ex: 2025-2026)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await academicYearService.createAcademicYear(newYearString, migrationOptions);
      
      toast({
        title: "Année créée avec succès",
        description: `L'année universitaire ${newYearString} a été créée avec toutes les options sélectionnées`,
      });
      
      setIsCreateDialogOpen(false);
      setNewYearString("");
      
      // Réinitialiser les options par défaut
      setMigrationOptions({
        copyFormationOffers: true,
        copySectionConfigurations: true,
        createTeacherWorkloads: true,
        archivePreviousYear: false
      });
      
      if (onYearCreated) {
        onYearCreated();
      }
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Impossible de créer l'année universitaire",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNextYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setNewYearString(`${currentYear}-${nextYear}`);
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Création d'Année Universitaire
        </CardTitle>
        <p className="text-slate-600">
          Créez une nouvelle année universitaire avec migration intelligente des données
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Le système copiera automatiquement les données nécessaires de l'année précédente 
              selon les options sélectionnées.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Année Universitaire
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Créer une Nouvelle Année Universitaire
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="year">Année Universitaire</Label>
                    <div className="flex gap-2">
                      <Input
                        id="year"
                        value={newYearString}
                        onChange={(e) => setNewYearString(e.target.value)}
                        placeholder="2025-2026"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateNextYear}
                        disabled={loading}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Suivante
                      </Button>
                    </div>
                    <p className="text-sm text-slate-500">
                      Format: YYYY-YYYY (exemple: 2025-2026)
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Copy className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Options de Migration des Données</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Checkbox
                          id="formations"
                          checked={migrationOptions.copyFormationOffers}
                          onCheckedChange={(checked) => 
                            setMigrationOptions(prev => ({...prev, copyFormationOffers: !!checked}))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="formations" className="font-medium text-green-800">
                            Copier les offres de formation
                          </Label>
                          <p className="text-sm text-green-600">
                            Reproduit la structure des formations de l'année précédente
                          </p>
                        </div>
                        <Badge className="bg-green-600 text-white">Recommandé</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Checkbox
                          id="sections"
                          checked={migrationOptions.copySectionConfigurations}
                          onCheckedChange={(checked) => 
                            setMigrationOptions(prev => ({...prev, copySectionConfigurations: !!checked}))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="sections" className="font-medium text-blue-800">
                            Copier les configurations de sections
                          </Label>
                          <p className="text-sm text-blue-600">
                            Reproduit l'organisation des sections et groupes
                          </p>
                        </div>
                        <Badge className="bg-blue-600 text-white">Recommandé</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <Checkbox
                          id="workloads"
                          checked={migrationOptions.createTeacherWorkloads}
                          onCheckedChange={(checked) => 
                            setMigrationOptions(prev => ({...prev, createTeacherWorkloads: !!checked}))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="workloads" className="font-medium text-purple-800">
                            Créer les charges d'enseignement
                          </Label>
                          <p className="text-sm text-purple-600">
                            Initialise les charges pour tous les enseignants
                          </p>
                        </div>
                        <Badge className="bg-purple-600 text-white">Recommandé</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <Checkbox
                          id="archive"
                          checked={migrationOptions.archivePreviousYear}
                          onCheckedChange={(checked) => 
                            setMigrationOptions(prev => ({...prev, archivePreviousYear: !!checked}))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="archive" className="font-medium text-amber-800">
                            Archiver l'année précédente
                          </Label>
                          <p className="text-sm text-amber-600">
                            Marque l'année précédente comme archivée
                          </p>
                        </div>
                        <Badge variant="outline" className="text-amber-700">Optionnel</Badge>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> Les données permanentes (enseignants, départements, échelons) 
                      sont automatiquement partagées entre toutes les années et ne nécessitent pas de duplication.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleCreateYear}
                      disabled={loading || !newYearString}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Créer l'Année
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline"
              onClick={generateNextYear}
              disabled={loading}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Générer Année Suivante
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
