
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Users, Clock, Star } from "lucide-react";
import { useState } from "react";

interface PathwaySelectionProps {
  studentData: any;
  onComplete: () => void;
  onUpdate: (data: any) => void;
}

export const PathwaySelection = ({ studentData, onComplete, onUpdate }: PathwaySelectionProps) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const specializations = [
    {
      id: "eco-dev",
      name: "Économie du Développement",
      description: "Analyse des politiques économiques et du développement durable",
      capacity: 45,
      registered: 38,
      requirements: ["Microéconomie ≥ 12", "Macroéconomie ≥ 12"],
      career: ["Analyste économique", "Consultant développement", "Organisations internationales"]
    },
    {
      id: "eco-finance",
      name: "Économie Financière",
      description: "Marchés financiers, banques et institutions financières",
      capacity: 40,
      registered: 35,
      requirements: ["Mathématiques ≥ 12", "Statistiques ≥ 12"],
      career: ["Analyste financier", "Risk manager", "Trader"]
    },
    {
      id: "eco-public",
      name: "Économie Publique",
      description: "Politiques publiques, finances publiques et économie sociale",
      capacity: 35,
      registered: 28,
      requirements: ["Économie publique ≥ 12", "Droit ≥ 10"],
      career: ["Fonction publique", "Collectivités territoriales", "Think tanks"]
    }
  ];

  const optionalCourses = [
    { id: "stats-adv", name: "Statistiques Avancées", credits: 3, teacher: "Dr. Amara" },
    { id: "eco-int", name: "Économie Internationale", credits: 3, teacher: "Pr. Benali" },
    { id: "finance-corp", name: "Finance d'Entreprise", credits: 3, teacher: "Dr. Mansouri" },
    { id: "eco-env", name: "Économie Environnementale", credits: 3, teacher: "Dr. Kaci" }
  ];

  const languages = [
    { id: "english", name: "Anglais", level: "Avancé", credits: 2 },
    { id: "german", name: "Allemand", level: "Intermédiaire", credits: 2 },
    { id: "spanish", name: "Espagnol", level: "Débutant", credits: 2 },
    { id: "chinese", name: "Chinois", level: "Débutant", credits: 2 }
  ];

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId) 
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    );
  };

  const calculateTotalCredits = () => {
    const optionCredits = selectedOptions.reduce((total, optionId) => {
      const option = optionalCourses.find(opt => opt.id === optionId);
      return total + (option?.credits || 0);
    }, 0);
    
    const languageCredits = selectedLanguages.reduce((total, langId) => {
      const language = languages.find(lang => lang.id === langId);
      return total + (language?.credits || 0);
    }, 0);
    
    return optionCredits + languageCredits;
  };

  const handleSubmit = () => {
    onUpdate({ 
      ...studentData, 
      pathwaySelected: true,
      specialization: selectedSpecialization,
      options: selectedOptions,
      languages: selectedLanguages
    });
    onComplete();
  };

  const isValid = selectedSpecialization && selectedLanguages.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Choix du Parcours et Options
        </CardTitle>
        <CardDescription>
          Sélectionnez votre spécialisation et vos options pour l'année {new Date().getFullYear()}-{new Date().getFullYear() + 1}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Choix de la spécialisation */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Spécialisation (Obligatoire)
            </h3>
            <RadioGroup value={selectedSpecialization} onValueChange={handleSpecializationChange}>
              <div className="space-y-4">
                {specializations.map((spec) => (
                  <div key={spec.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={spec.id} id={spec.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={spec.id} className="font-medium text-base cursor-pointer">
                          {spec.name}
                        </Label>
                        <p className="text-sm text-slate-600 mt-1">{spec.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-xs text-slate-500">
                              {spec.registered}/{spec.capacity} places
                            </span>
                          </div>
                          <Badge variant="outline" className={
                            spec.registered / spec.capacity > 0.8 
                              ? "border-amber-200 text-amber-700" 
                              : "border-green-200 text-green-700"
                          }>
                            {spec.registered / spec.capacity > 0.8 ? "Places limitées" : "Places disponibles"}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-700 mb-1">Prérequis:</p>
                          <div className="flex gap-2">
                            {spec.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-700 mb-1">Débouchés:</p>
                          <p className="text-xs text-slate-600">{spec.career.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Options facultatives */}
          <div>
            <h3 className="font-semibold mb-4">Options Facultatives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {optionalCourses.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 border rounded p-3">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.name}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {option.credits} crédits
                      </Badge>
                      <span className="text-xs text-slate-500">{option.teacher}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Langues étrangères */}
          <div>
            <h3 className="font-semibold mb-4">Langues Étrangères (Au moins une obligatoire)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((language) => (
                <div key={language.id} className="flex items-center space-x-3 border rounded p-3">
                  <Checkbox
                    id={language.id}
                    checked={selectedLanguages.includes(language.id)}
                    onCheckedChange={() => handleLanguageToggle(language.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={language.id} className="font-medium cursor-pointer">
                      {language.name}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {language.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {language.credits} crédits
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Récapitulatif de votre sélection</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Spécialisation: </span>
                <span className="text-sm">
                  {selectedSpecialization 
                    ? specializations.find(s => s.id === selectedSpecialization)?.name 
                    : "Non sélectionnée"
                  }
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Options sélectionnées: </span>
                <span className="text-sm">{selectedOptions.length}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Langues sélectionnées: </span>
                <span className="text-sm">{selectedLanguages.length}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Total crédits optionnels: </span>
                <Badge variant="outline">{calculateTotalCredits()} crédits</Badge>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!isValid}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Confirmer la sélection et continuer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
