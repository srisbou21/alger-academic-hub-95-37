
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IdCard, Download, Printer, QrCode, Calendar, MapPin, Mail, Phone, BookOpen, CreditCard } from "lucide-react";
import { useState } from "react";

interface StudentCardGenerationProps {
  studentData: any;
  onComplete: () => void;
  onUpdate: (data: any) => void;
}

export const StudentCardGeneration = ({ studentData, onComplete, onUpdate }: StudentCardGenerationProps) => {
  const [cardGenerated, setCardGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const cardData = {
    id: studentData.id,
    name: studentData.name,
    photo: "/placeholder.svg",
    specialization: "Économie du Développement",
    level: "L3",
    academicYear: "2024-2025",
    validUntil: "2025-07-31",
    barcode: "ETU202400112345",
    emergencyContact: "0555-123-456",
    email: "sarah.benhamou@univ-alger3.dz"
  };

  const handleGenerateCard = async () => {
    setGenerating(true);
    
    // Simuler la génération de la carte
    setTimeout(() => {
      setCardGenerated(true);
      setGenerating(false);
      onUpdate({ ...studentData, cardGenerated: true });
    }, 2000);
  };

  const handleDownloadCard = () => {
    // Simuler le téléchargement
    const link = document.createElement('a');
    link.href = '/placeholder.svg'; // Dans un vrai système, ce serait le PDF généré
    link.download = `carte-etudiant-${cardData.id}.pdf`;
    link.click();
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IdCard className="h-5 w-5" />
          Génération de la Carte d'Étudiant
        </CardTitle>
        <CardDescription>
          Création et téléchargement de votre nouvelle carte d'étudiant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!cardGenerated ? (
            <>
              {/* Informations pour la carte */}
              <div>
                <h3 className="font-semibold mb-4">Informations pour la carte</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Nom complet</Label>
                      <p className="text-sm text-slate-600">{cardData.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Numéro étudiant</Label>
                      <p className="text-sm text-slate-600">{cardData.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Spécialisation</Label>
                      <p className="text-sm text-slate-600">{cardData.specialization}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Niveau</Label>
                      <p className="text-sm text-slate-600">{cardData.level}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Année académique</Label>
                      <p className="text-sm text-slate-600">{cardData.academicYear}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valide jusqu'au</Label>
                      <p className="text-sm text-slate-600">{new Date(cardData.validUntil).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-slate-600">{cardData.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contact d'urgence</Label>
                      <p className="text-sm text-slate-600">{cardData.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aperçu de la carte */}
              <div>
                <h3 className="font-semibold mb-4">Aperçu de la carte</h3>
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white max-w-md mx-auto">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg">FSECSG</h4>
                      <p className="text-xs opacity-90">Université Alger 3</p>
                    </div>
                    <div className="w-16 h-20 bg-white rounded border overflow-hidden">
                      <img src={cardData.photo} alt="Photo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold">{cardData.name}</h3>
                    <p className="text-xs opacity-90">{cardData.id}</p>
                    <p className="text-xs opacity-90">{cardData.level} - {cardData.specialization}</p>
                    <p className="text-xs opacity-90">Valide: {cardData.academicYear}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <QrCode className="h-8 w-8" />
                    <p className="text-xs font-mono">{cardData.barcode}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerateCard}
                disabled={generating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {generating ? "Génération en cours..." : "Générer la carte d'étudiant"}
              </Button>
            </>
          ) : (
            <>
              {/* Carte générée */}
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IdCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Carte d'étudiant générée avec succès !
                </h3>
                <p className="text-slate-600 mb-6">
                  Votre carte d'étudiant est prête. Vous pouvez la télécharger et l'imprimer.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleDownloadCard} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  <Button variant="outline" onClick={handleDownloadCard}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                </div>
              </div>

              {/* Informations importantes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Informations importantes
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Votre carte est valide jusqu'au {new Date(cardData.validUntil).toLocaleDateString('fr-FR')}</li>
                  <li>• Présentez-la pour accéder aux services universitaires</li>
                  <li>• En cas de perte, contactez immédiatement l'administration</li>
                  <li>• Elle donne accès à la bibliothèque, cantine et activités</li>
                </ul>
              </div>

              {/* Services disponibles */}
              <div>
                <h3 className="font-semibold mb-3">Services accessibles avec votre carte</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <MapPin className="h-6 w-6 mx-auto mb-1 text-slate-600" />
                    <p className="text-xs font-medium">Accès campus</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto mb-1 text-slate-600" />
                    <p className="text-xs font-medium">Bibliothèque</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <CreditCard className="h-6 w-6 mx-auto mb-1 text-slate-600" />
                    <p className="text-xs font-medium">Restaurant</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <Printer className="h-6 w-6 mx-auto mb-1 text-slate-600" />
                    <p className="text-xs font-medium">Impressions</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleComplete} className="w-full bg-blue-600 hover:bg-blue-700">
                Terminer le processus de réinscription
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
}
