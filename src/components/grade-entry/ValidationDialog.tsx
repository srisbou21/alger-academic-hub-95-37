
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ValidationStats } from "@/types/grade";

interface ValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: ValidationStats;
  onValidate: () => void;
}

export const ValidationDialog = ({ open, onOpenChange, stats, onValidate }: ValidationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validation des Notes</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir valider toutes les notes ? Cette action vérifiera la cohérence de toutes les données.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {stats.withErrors > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {stats.withErrors} note(s) contiennent des erreurs qui doivent être corrigées avant la validation.
              </AlertDescription>
            </Alert>
          )}
          
          {stats.missing > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {stats.missing} note(s) sont manquantes et doivent être saisies.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              onClick={() => {
                onValidate();
                onOpenChange(false);
              }}
            >
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
