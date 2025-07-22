
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validation simple de l'email
      if (!email || !email.includes('@')) {
        setError('Veuillez entrer une adresse email valide');
        return;
      }
      
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Email de réinitialisation envoyé à:', email);
      setSent(true);
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">Email envoyé !</CardTitle>
            <CardDescription>
              Vérifiez votre boîte mail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Un lien de réinitialisation a été envoyé à :
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-blue-600">{email}</p>
              </div>
              <div className="text-sm text-gray-500 space-y-2">
                <p>Si vous ne recevez pas l'email dans les 5 minutes :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vérifiez votre dossier spam/courriers indésirables</li>
                  <li>Assurez-vous que l'adresse email est correcte</li>
                  <li>Contactez l'administrateur si le problème persiste</li>
                </ul>
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => {setSent(false); setEmail(''); setError('');}}
                  variant="outline"
                  className="w-full"
                >
                  Essayer avec une autre adresse
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votrenom@fsecsg.dz"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !email}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer le lien de réinitialisation
                </>
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-2 text-blue-800">Besoin d'aide ?</p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>• Contactez l'administrateur : admin@fsecsg.dz</p>
              <p>• Support technique : +213 XXX XXX XXX</p>
              <p>• Horaires : Dimanche - Jeudi, 8h - 17h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
