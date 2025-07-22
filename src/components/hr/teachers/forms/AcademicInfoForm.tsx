import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

interface AcademicInfoFormProps {
  qualifications: string[];
  researchInterests: string[];
  onQualificationsChange: (qualifications: string[]) => void;
  onResearchInterestsChange: (interests: string[]) => void;
}

export const AcademicInfoForm: React.FC<AcademicInfoFormProps> = ({
  qualifications,
  researchInterests,
  onQualificationsChange,
  onResearchInterestsChange
}) => {
  const [newQualification, setNewQualification] = useState("");
  const [newResearchInterest, setNewResearchInterest] = useState("");

  const addQualification = () => {
    if (newQualification.trim()) {
      onQualificationsChange([...qualifications, newQualification.trim()]);
      setNewQualification("");
    }
  };

  const removeQualification = (index: number) => {
    onQualificationsChange(qualifications.filter((_, i) => i !== index));
  };

  const addResearchInterest = () => {
    if (newResearchInterest.trim()) {
      onResearchInterestsChange([...researchInterests, newResearchInterest.trim()]);
      setNewResearchInterest("");
    }
  };

  const removeResearchInterest = (index: number) => {
    onResearchInterestsChange(researchInterests.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-6">
      {/* Qualifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Qualifications</h3>
        <div className="flex gap-2">
          <Input
            value={newQualification}
            onChange={(e) => setNewQualification(e.target.value)}
            placeholder="Ajouter une qualification"
            onKeyPress={(e) => handleKeyPress(e, addQualification)}
          />
          <Button 
            type="button" 
            onClick={addQualification}
            size="sm"
            disabled={!newQualification.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {qualifications.map((qual, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {qual}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2"
                onClick={() => removeQualification(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Centres d'intérêt de recherche */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Centres d'intérêt de recherche</h3>
        <div className="flex gap-2">
          <Input
            value={newResearchInterest}
            onChange={(e) => setNewResearchInterest(e.target.value)}
            placeholder="Ajouter un centre d'intérêt"
            onKeyPress={(e) => handleKeyPress(e, addResearchInterest)}
          />
          <Button 
            type="button" 
            onClick={addResearchInterest}
            size="sm"
            disabled={!newResearchInterest.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {researchInterests.map((interest, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="flex items-center gap-1"
            >
              {interest}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2"
                onClick={() => removeResearchInterest(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};