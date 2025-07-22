
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { FormationOffer } from "../../types/academic";
import { FormationBasicInfoForm } from "./forms/FormationBasicInfoForm";

interface FormationOfferFormProps {
  offer: FormationOffer | null;
  onSave: (offer: FormationOffer) => void;
  onCancel: () => void;
}

export const FormationOfferForm = ({ offer, onSave, onCancel }: FormationOfferFormProps) => {
  const [currentOffer, setCurrentOffer] = useState<Partial<FormationOffer>>({
    modules: [],
    sections: [],
    academicYear: "2024-2025",
    diplomaType: "licence",
    duration: 6,
    modality: "presential",
    language: "fr",
    maxCapacity: 100,
    admissionRequirements: "",
    pedagogicalObjectives: [],
    careerProspects: [],
    status: "draft",
    responsibleId: "",
    responsibleName: "",
    lastModifiedBy: "",
    validationHistory: [],
    totalECTS: 180
  });

  useEffect(() => {
    if (offer) {
      setCurrentOffer(offer);
    } else {
      setCurrentOffer({
        modules: [],
        sections: [],
        academicYear: "2024-2025",
        diplomaType: "licence",
        duration: 6,
        modality: "presential",
        language: "fr",
        maxCapacity: 100,
        admissionRequirements: "",
        pedagogicalObjectives: [],
        careerProspects: [],
        status: "draft",
        responsibleId: "",
        responsibleName: "",
        lastModifiedBy: "",
        validationHistory: [],
        totalECTS: 180
      });
    }
  }, [offer]);

  const handleSave = () => {
    if (!currentOffer.name || !currentOffer.code || !currentOffer.level) {
      return;
    }

    const offerToSave: FormationOffer = {
      id: offer?.id || Date.now().toString(),
      name: currentOffer.name!,
      code: currentOffer.code!,
      specialtyId: currentOffer.specialtyId || "default",
      level: currentOffer.level!,
      academicYear: currentOffer.academicYear!,
      modules: currentOffer.modules || [],
      sections: currentOffer.sections || [],
      diplomaType: currentOffer.diplomaType || "licence",
      duration: currentOffer.duration || 6,
      modality: currentOffer.modality || "presential",
      language: currentOffer.language || "fr",
      maxCapacity: currentOffer.maxCapacity || 100,
      admissionRequirements: currentOffer.admissionRequirements || "",
      pedagogicalObjectives: currentOffer.pedagogicalObjectives || [],
      careerProspects: currentOffer.careerProspects || [],
      status: currentOffer.status || "draft",
      responsibleId: currentOffer.responsibleId || "",
      responsibleName: currentOffer.responsibleName || "",
      lastModifiedBy: currentOffer.lastModifiedBy || "",
      validationHistory: currentOffer.validationHistory || [],
      totalECTS: currentOffer.totalECTS || 180,
      createdAt: offer?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(offerToSave);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {offer ? 'Modifier l\'Offre de Formation' : 'Nouvelle Offre de Formation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormationBasicInfoForm 
          offer={currentOffer}
          onChange={setCurrentOffer}
        />

        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {offer ? 'Mettre à jour' : 'Créer'} l'Offre
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
