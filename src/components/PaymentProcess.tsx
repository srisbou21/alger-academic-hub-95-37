
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Building2, Smartphone, Receipt, AlertCircle } from "lucide-react";
import { useState } from "react";

interface PaymentProcessProps {
  studentData: any;
  onComplete: () => void;
  onUpdate: (data: any) => void;
}

export const PaymentProcess = ({ studentData, onComplete, onUpdate }: PaymentProcessProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const tuitionFees = {
    inscription: 5000,
    scolarite: 25000,
    bibliotheque: 2000,
    activites: 3000,
    assurance: 1500
  };

  const scholarshipReduction = studentData.scholarship ? 15000 : 0;
  const totalAmount = Object.values(tuitionFees).reduce((sum, fee) => sum + fee, 0) - scholarshipReduction;

  const paymentMethods = [
    {
      id: "bank-transfer",
      name: "Virement bancaire",
      description: "Virement depuis votre compte bancaire",
      icon: Building2,
      fees: 0,
      processing: "2-3 jours ouvrables"
    },
    {
      id: "card",
      name: "Carte bancaire",
      description: "Paiement par carte Visa/Mastercard",
      icon: CreditCard,
      fees: 200,
      processing: "Immédiat"
    },
    {
      id: "mobile",
      name: "Paiement mobile",
      description: "BaridiMob, CCP, etc.",
      icon: Smartphone,
      fees: 100,
      processing: "Quelques minutes"
    }
  ];

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    // Simuler le processus de paiement
    setTimeout(() => {
      onUpdate({ 
        ...studentData, 
        paymentCompleted: true,
        paymentMethod: selectedPaymentMethod,
        paymentAmount: totalAmount + (paymentMethods.find(p => p.id === selectedPaymentMethod)?.fees || 0)
      });
      setPaymentProcessing(false);
      onComplete();
    }, 2000);
  };

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
  const finalAmount = totalAmount + (selectedMethod?.fees || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Paiement des Droits d'Inscription
        </CardTitle>
        <CardDescription>
          Réglement des frais de scolarité pour l'année universitaire 2024-2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Détail des frais */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Détail des Frais
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Droits d'inscription</span>
                  <span className="text-sm font-medium">{tuitionFees.inscription.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Frais de scolarité</span>
                  <span className="text-sm font-medium">{tuitionFees.scolarite.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bibliothèque</span>
                  <span className="text-sm font-medium">{tuitionFees.bibliotheque.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Activités culturelles</span>
                  <span className="text-sm font-medium">{tuitionFees.activites.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Assurance scolaire</span>
                  <span className="text-sm font-medium">{tuitionFees.assurance.toLocaleString()} DA</span>
                </div>
                
                {scholarshipReduction > 0 && (
                  <>
                    <hr className="border-slate-300" />
                    <div className="flex justify-between text-green-700">
                      <span className="text-sm">Réduction bourse</span>
                      <span className="text-sm font-medium">-{scholarshipReduction.toLocaleString()} DA</span>
                    </div>
                  </>
                )}
                
                <hr className="border-slate-300" />
                <div className="flex justify-between font-semibold">
                  <span>Sous-total</span>
                  <span>{totalAmount.toLocaleString()} DA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div>
            <h3 className="font-semibold mb-4">Méthode de Paiement</h3>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={method.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="h-4 w-4" />
                            <Label htmlFor={method.id} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            {method.fees > 0 && (
                              <Badge variant="outline" className="text-xs">
                                +{method.fees} DA
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{method.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Traitement: {method.processing}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Récapitulatif final */}
          {selectedPaymentMethod && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Récapitulatif du Paiement</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Méthode:</span>
                  <span>{selectedMethod?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sous-total:</span>
                  <span>{totalAmount.toLocaleString()} DA</span>
                </div>
                {selectedMethod?.fees && selectedMethod.fees > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Frais de traitement:</span>
                    <span>{selectedMethod.fees.toLocaleString()} DA</span>
                  </div>
                )}
                <hr className="border-blue-300" />
                <div className="flex justify-between font-semibold">
                  <span>Montant total:</span>
                  <span>{finalAmount.toLocaleString()} DA</span>
                </div>
              </div>
            </div>
          )}

          {/* Informations importantes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Informations importantes</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Le paiement doit être effectué avant le 15 septembre</li>
                  <li>• Un reçu sera automatiquement généré après le paiement</li>
                  <li>• En cas de problème, contactez le service financier</li>
                  <li>• Les remboursements ne sont possibles que dans les 48h</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || paymentProcessing}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {paymentProcessing ? "Traitement en cours..." : `Payer ${finalAmount.toLocaleString()} DA`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
