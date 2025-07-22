
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, AlertTriangle } from "lucide-react";

interface PromotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    grade: string;
    currentEchelon: number;
    employeeType: 'enseignant' | 'administratif';
  };
  onPromote: (employeeId: string, duration: 'courte' | 'moyenne' | 'longue') => void;
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  onClose,
  employee,
  onPromote
}) => {
  const [selectedDuration, setSelectedDuration] = useState<'courte' | 'moyenne' | 'longue' | ''>('');

  const handlePromote = () => {
    if (selectedDuration !== '') {
      onPromote(employee.id, selectedDuration);
      setSelectedDuration('');
      onClose();
    }
  };

  const durationOptions = [
    {
      value: 'courte' as const,
      label: 'Courte durée (30 mois)',
      description: 'Promotion rapide - Performance excellente',
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      color: 'bg-red-50 border-red-200'
    },
    {
      value: 'moyenne' as const,
      label: 'Moyenne durée (36 mois)',
      description: 'Promotion standard - Performance satisfaisante',
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      value: 'longue' as const,
      label: 'Longue durée (42 mois)',
      description: 'Promotion normale - Performance acceptable',
      icon: <Award className="h-4 w-4 text-green-500" />,
      color: 'bg-green-50 border-green-200'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Promotion d'Échelon
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-800">{employee.name}</h3>
            <p className="text-sm text-slate-600">{employee.grade}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">
                Échelon {employee.currentEchelon} → {employee.currentEchelon + 1}
              </Badge>
              <Badge variant="secondary">
                {employee.employeeType === 'enseignant' ? 'Enseignant' : 'Administratif'}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Choisir la durée d'avancement :
            </label>
            
            {durationOptions.map((option) => (
              <div
                key={option.value}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  selectedDuration === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : `${option.color} hover:border-slate-300`
                }`}
                onClick={() => setSelectedDuration(option.value)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{option.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{option.label}</span>
                      {selectedDuration === option.value && (
                        <Badge className="bg-blue-100 text-blue-800">Sélectionné</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handlePromote}
            disabled={selectedDuration === ''}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Award className="h-4 w-4 mr-2" />
            Confirmer la Promotion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
