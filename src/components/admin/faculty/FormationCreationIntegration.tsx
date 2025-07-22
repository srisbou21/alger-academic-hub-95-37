
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  Plus, 
  ArrowRight,
  BookOpen,
  Building2,
  Users
} from "lucide-react";
import { FormationOffer, Faculty, Department, Specialty } from "../../../types/academic";
import { FormationCreationForm } from "../../formation/forms/FormationCreationForm";
import { formationOfferService } from "../../../services/formationOfferService";

interface FormationCreationIntegrationProps {
  faculties: Faculty[];
  departments: Department[];
  specialties: Specialty[];
  onFormationCreated?: (formation: FormationOffer) => void;
}

export const FormationCreationIntegration = ({ 
  faculties, 
  departments, 
  specialties,
  onFormationCreated 
}: FormationCreationIntegrationProps) => {
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const { toast } = useToast();

  const handleCreateFormation = async (formationData: Partial<FormationOffer>) => {
    try {
      // Enrichir les données avec la spécialité sélectionnée
      const enrichedData = {
        ...formationData,
        specialtyId: selectedSpecialty?.id || '',
        modules: [],
        sections: [],
        status: 'draft' as const,
        responsibleId: '',
        lastModifiedBy: 'admin',
        validationHistory: [],
        totalECTS: formationData.diplomaType === 'licence' ? 180 : 
                  formationData.diplomaType === 'master' ? 120 : 240
      };

      const newFormation = await formationOfferService.createFormationOffer(enrichedData as Omit<FormationOffer, 'id' | 'createdAt' | 'updatedAt'>);
      
      toast({
        title: "Succès",
        description: "Formation créée avec succès"
      });

      setShowCreationForm(false);
      setSelectedSpecialty(null);
      
      if (onFormationCreated) {
        onFormationCreated(newFormation);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la formation",
        variant: "destructive"
      });
    }
  };

  const getHierarchyInfo = (specialty: Specialty) => {
    const department = departments.find(d => d.id === specialty.filiereId);
    const faculty = department ? faculties.find(f => f.id === department.facultyId) : null;
    return { department, faculty };
  };

  if (showCreationForm) {
    return (
      <div className="space-y-4">
        {selectedSpecialty && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-blue-800">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Formation pour la spécialité :</span>
                <Badge variant="outline" className="bg-white">
                  {selectedSpecialty.name}
                </Badge>
              </div>
              {(() => {
                const { department, faculty } = getHierarchyInfo(selectedSpecialty);
                return (
                  <div className="flex items-center gap-2 mt-2 text-sm text-blue-700">
                    {faculty && (
                      <>
                        <Building2 className="h-4 w-4" />
                        <span>{faculty.name}</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                    {department && (
                      <>
                        <Users className="h-4 w-4" />
                        <span>{department.name}</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                    <GraduationCap className="h-4 w-4" />
                    <span>{selectedSpecialty.name}</span>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        <FormationCreationForm 
          onSave={handleCreateFormation}
          onCancel={() => {
            setShowCreationForm(false);
            setSelectedSpecialty(null);
          }}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Création d'Offres de Formation
        </CardTitle>
        <p className="text-slate-600">
          Créez de nouvelles offres de formation rattachées aux spécialités
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {specialties.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Aucune spécialité disponible</p>
            <p className="text-sm text-slate-400">
              Créez d'abord des spécialités pour pouvoir ajouter des formations
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700">Sélectionnez une spécialité :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.filter(s => s.isActive).map((specialty) => {
                const { department, faculty } = getHierarchyInfo(specialty);
                return (
                  <Card key={specialty.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-slate-800">{specialty.name}</h5>
                          <Badge variant="outline">
                            {specialty.level.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            {faculty && (
                              <>
                                <Building2 className="h-3 w-3" />
                                <span>{faculty.name}</span>
                                <ArrowRight className="h-3 w-3" />
                              </>
                            )}
                            {department && (
                              <>
                                <Users className="h-3 w-3" />
                                <span>{department.name}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500">
                          Code: {specialty.code} • Durée: {specialty.duration} années
                        </div>

                        <Button 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => {
                            setSelectedSpecialty(specialty);
                            setShowCreationForm(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une formation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
