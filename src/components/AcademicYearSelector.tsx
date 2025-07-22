
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Settings, Database, Info } from "lucide-react";
import { academicYearService, AcademicYear } from "../services/academicYearService";
import { useToast } from "@/hooks/use-toast";

interface AcademicYearSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  className?: string;
}

export const AcademicYearSelector: React.FC<AcademicYearSelectorProps> = ({
  selectedYear,
  onYearChange,
  className = ""
}) => {
  const { toast } = useToast();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [activeYear, setActiveYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  useEffect(() => {
    loadAcademicYears();
  }, []);

  const loadAcademicYears = async () => {
    setLoading(true);
    try {
      const [years, active] = await Promise.all([
        academicYearService.getAcademicYears(),
        academicYearService.getActiveAcademicYear()
      ]);
      
      setAcademicYears(years);
      setActiveYear(active);
      
      // Si aucune année n'est sélectionnée, utiliser l'année active
      if (!selectedYear && active) {
        onYearChange(active.year);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des années:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les années universitaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getYearStatus = (year: AcademicYear) => {
    if (year.isActive) return { label: "Active", color: "bg-green-600" };
    if (year.status === 'draft') return { label: "Brouillon", color: "bg-gray-500" };
    if (year.status === 'archived') return { label: "Archivée", color: "bg-blue-500" };
    return { label: year.status, color: "bg-gray-500" };
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-slate-700">Année:</span>
      </div>
      
      <Select value={selectedYear} onValueChange={onYearChange} disabled={loading}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sélectionner..." />
        </SelectTrigger>
        <SelectContent>
          {academicYears.map(year => {
            const status = getYearStatus(year);
            return (
              <SelectItem key={year.id} value={year.year}>
                <div className="flex items-center gap-2">
                  <span>{year.year}</span>
                  <Badge 
                    className={`${status.color} text-white text-xs px-1 py-0`}
                    variant="secondary"
                  >
                    {status.label}
                  </Badge>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="p-2">
            <Info className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Architecture des Années Universitaires
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-2">Données Permanentes (Partagées)</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• <strong>Enseignants:</strong> Profils, qualifications, contact</div>
                  <div>• <strong>Personnel Administratif:</strong> Informations personnelles</div>
                  <div>• <strong>Échelons:</strong> Grilles de classification</div>
                  <div>• <strong>Départements:</strong> Structure organisationnelle</div>
                  <div>• <strong>Spécialisations:</strong> Domaines d'études</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-800 mb-2">Données Annuelles (Par Année)</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• <strong>Inscriptions Étudiants:</strong> Nouvelles chaque année</div>
                  <div>• <strong>Offres de Formation:</strong> Programmes proposés</div>
                  <div>• <strong>Sections & Groupes:</strong> Organisation pédagogique</div>
                  <div>• <strong>Charges d'Enseignement:</strong> Attribution des cours</div>
                  <div>• <strong>Emplois du Temps:</strong> Planification annuelle</div>
                  <div>• <strong>Notes & Évaluations:</strong> Résultats académiques</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-amber-800 mb-2">Avantages du Système</h4>
                <div className="text-sm text-amber-700 space-y-1">
                  <div>• <strong>Efficacité:</strong> Pas de duplication des données permanentes</div>
                  <div>• <strong>Historique:</strong> Conservation de toutes les années</div>
                  <div>• <strong>Migration:</strong> Copie intelligente entre années</div>
                  <div>• <strong>Maintenance:</strong> Mises à jour centralisées</div>
                </div>
              </CardContent>
            </Card>

            {selectedYear && (
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-slate-800 mb-2">Année Sélectionnée: {selectedYear}</h4>
                  <div className="text-sm text-slate-600">
                    Vous travaillez actuellement sur l'année universitaire {selectedYear}. 
                    Toutes les données annuelles (inscriptions, charges, emplois du temps) 
                    seront associées à cette année.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {activeYear && selectedYear === activeYear.year && (
        <Badge className="bg-green-100 text-green-800 text-xs">
          Année Active
        </Badge>
      )}
    </div>
  );
};
