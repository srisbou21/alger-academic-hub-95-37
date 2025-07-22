
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus } from "lucide-react";
import { FormationOffer, UniteEnseignement } from "../../../types/academic";
import { UEManager } from "./UEManager";
import { SemesterView } from "./SemesterView";

interface PedagogicalStructureManagerProps {
  formations: FormationOffer[];
  onUpdateFormation: (formation: FormationOffer) => void;
}

export const PedagogicalStructureManager = ({ formations, onUpdateFormation }: PedagogicalStructureManagerProps) => {
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");

  const selectedFormation = formations.find(f => f.id === selectedFormationId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Gestion de la Structure Pédagogique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Formation</label>
              <Select value={selectedFormationId} onValueChange={setSelectedFormationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map(formation => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name} ({formation.academicYear})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedFormation && (
              <div>
                <label className="block text-sm font-medium mb-2">Semestre</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: selectedFormation.duration }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Semestre {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFormation && (
        <>
          <UEManager 
            formation={selectedFormation}
            semester={parseInt(selectedSemester)}
            onUpdateFormation={onUpdateFormation}
          />
          
          <SemesterView 
            formation={selectedFormation}
            semester={parseInt(selectedSemester)}
          />
        </>
      )}
    </div>
  );
};
