import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CareerPath, TEACHER_GRADES } from "@/types/teacher";

interface CareerPathFormProps {
  careerPath: CareerPath[];
  onUpdate: (careerPath: CareerPath[]) => void;
}

export const CareerPathForm: React.FC<CareerPathFormProps> = ({
  careerPath,
  onUpdate
}) => {
  const [showCalendar, setShowCalendar] = useState<{ [key: string]: boolean }>({});

  const addCareerEntry = () => {
    const newEntry: CareerPath = {
      id: Date.now().toString(),
      teacherId: "",
      type: 'grade',
      gradeOrEchelon: "",
      obtentionDate: new Date(),
      durationInMonths: 0,
      isActive: true
    };
    onUpdate([...careerPath, newEntry]);
  };

  const updateCareerEntry = (index: number, updates: Partial<CareerPath>) => {
    const updatedPath = careerPath.map((entry, i) => 
      i === index ? { ...entry, ...updates } : entry
    );
    onUpdate(updatedPath);
  };

  const removeCareerEntry = (index: number) => {
    const updatedPath = careerPath.filter((_, i) => i !== index);
    onUpdate(updatedPath);
  };

  const toggleCalendar = (entryId: string) => {
    setShowCalendar(prev => ({ ...prev, [entryId]: !prev[entryId] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Parcours Professionnel</h3>
        <Button onClick={addCareerEntry} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une entrée
        </Button>
      </div>

      {careerPath.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucune entrée de parcours professionnel.</p>
          <p className="text-sm">Cliquez sur "Ajouter une entrée" pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {careerPath.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Entrée {index + 1}</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeCareerEntry(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={entry.type} 
                    onValueChange={(value: 'grade' | 'echelon') => 
                      updateCareerEntry(index, { type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade">Grade</SelectItem>
                      <SelectItem value="echelon">Échelon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    {entry.type === 'grade' ? 'Grade' : 'Échelon'}
                  </Label>
                  {entry.type === 'grade' ? (
                    <Select 
                      value={entry.gradeOrEchelon} 
                      onValueChange={(value) => 
                        updateCareerEntry(index, { gradeOrEchelon: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEACHER_GRADES.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select 
                      value={entry.gradeOrEchelon} 
                      onValueChange={(value) => 
                        updateCareerEntry(index, { gradeOrEchelon: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un échelon" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(echelon => (
                          <SelectItem key={echelon} value={echelon.toString()}>
                            Échelon {echelon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Date d'obtention</Label>
                  <Popover 
                    open={showCalendar[entry.id]} 
                    onOpenChange={() => toggleCalendar(entry.id)}
                  >
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !entry.obtentionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {entry.obtentionDate ? 
                          format(entry.obtentionDate, "dd MMMM yyyy", { locale: fr }) :
                          "Sélectionner une date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={entry.obtentionDate}
                        onSelect={(date) => {
                          if (date) {
                            updateCareerEntry(index, { obtentionDate: date });
                            toggleCalendar(entry.id);
                          }
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Durée (en mois)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={entry.durationInMonths || 0}
                    onChange={(e) => 
                      updateCareerEntry(index, { 
                        durationInMonths: parseInt(e.target.value) || 0 
                      })
                    }
                    placeholder="Durée en mois"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Décision/Référence</Label>
                  <Input
                    value={entry.decision || ""}
                    onChange={(e) => 
                      updateCareerEntry(index, { decision: e.target.value })
                    }
                    placeholder="Numéro de décision"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};