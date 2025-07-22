
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Trash2, 
  AlertTriangle,
  Archive,
  Users,
  BookOpen,
  Calendar
} from "lucide-react";
import { academicYearService, AcademicYear } from "../../services/academicYearService";
import { useToast } from "@/hooks/use-toast";

interface AcademicYearDeletionDialogProps {
  year: AcademicYear;
  yearStats: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onYearDeleted: () => void;
}

export const AcademicYearDeletionDialog: React.FC<AcademicYearDeletionDialogProps> = ({
  year,
  yearStats,
  isOpen,
  onOpenChange,
  onYearDeleted
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'archive' | 'delete'>('archive');

  const handleAction = async () => {
    setLoading(true);
    try {
      if (deleteMode === 'archive') {
        await academicYearService.archiveAcademicYear(year.id);
        toast({
          title: "Année archivée",
          description: `L'année ${year.year} a été archivée avec succès`
        });
      } else {
        await academicYearService.deleteAcademicYear(year.id);
        toast({
          title: "Année supprimée",
          description: `L'année ${year.year} a été définitivement supprimée`
        });
      }
      
      onOpenChange(false);
      onYearDeleted();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'effectuer l'opération",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const canDelete = year.status !== 'active' && !year.isActive;
  const hasData = yearStats && (yearStats.students > 0 || yearStats.workloads > 0);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {deleteMode === 'archive' ? (
              <Archive className="h-5 w-5 text-amber-600" />
            ) : (
              <Trash2 className="h-5 w-5 text-red-600" />
            )}
            {deleteMode === 'archive' ? 'Archiver' : 'Supprimer'} l'année {year.year}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action affectera l'année universitaire {year.year} et toutes ses données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Informations sur l'année */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Informations sur l'année</h4>
              <Badge variant={year.isActive ? "default" : "secondary"}>
                {year.status}
              </Badge>
            </div>
            
            {yearStats && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>{yearStats.students} étudiants</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span>{yearStats.workloads} charges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{yearStats.formations} formations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span>{yearStats.teachers} enseignants</span>
                </div>
              </div>
            )}
          </div>

          {/* Mode de suppression */}
          <div className="space-y-3">
            <h4 className="font-medium">Mode d'action</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteMode('archive')}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  deleteMode === 'archive' 
                    ? 'border-amber-400 bg-amber-50' 
                    : 'border-gray-200 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Archive className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">Archiver</span>
                </div>
                <p className="text-sm text-gray-600">
                  Masque l'année mais conserve toutes les données
                </p>
              </button>

              <button
                onClick={() => setDeleteMode('delete')}
                disabled={!canDelete || hasData}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  deleteMode === 'delete' && canDelete && !hasData
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Supprimer</span>
                </div>
                <p className="text-sm text-gray-600">
                  Supprime définitivement l'année et ses données
                </p>
              </button>
            </div>
          </div>

          {/* Alertes */}
          {year.isActive && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Année active:</strong> Vous ne pouvez pas supprimer ou archiver l'année universitaire active.
              </AlertDescription>
            </Alert>
          )}

          {hasData && deleteMode === 'delete' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Données présentes:</strong> Cette année contient des données importantes. 
                Seul l'archivage est recommandé pour préserver l'historique.
              </AlertDescription>
            </Alert>
          )}

          {deleteMode === 'delete' && !hasData && canDelete && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Suppression définitive:</strong> Cette action est irréversible. 
                Toutes les données de l'année {year.year} seront définitivement perdues.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={loading || (deleteMode === 'delete' && (!canDelete || hasData))}
            className={deleteMode === 'archive' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {deleteMode === 'archive' ? 'Archivage...' : 'Suppression...'}
              </>
            ) : (
              <>
                {deleteMode === 'archive' ? (
                  <Archive className="h-4 w-4 mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {deleteMode === 'archive' ? 'Archiver' : 'Supprimer'}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
