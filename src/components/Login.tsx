
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 animate-fade-in">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Connexion</CardTitle>
          <p className="text-gray-700 text-lg">Accédez à votre espace académique personnalisé</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 font-semibold text-base">Email universitaire</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-gray-50 border-2 border-gray-300 focus:border-blue-500 text-gray-900 text-base rounded-lg"
                placeholder="votre.email@fsecsg.dz"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-800 font-semibold text-base">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-gray-50 border-2 border-gray-300 focus:border-blue-500 text-gray-900 text-base rounded-lg"
                placeholder="••••••••"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 font-medium mb-4">Comptes de démonstration :</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold text-gray-800">Super Admin</p>
                <p className="text-gray-600">admin@fsecsg.dz</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold text-gray-800">Chef Dept.</p>
                <p className="text-gray-600">chef@fsecsg.dz</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold text-gray-800">Enseignant</p>
                <p className="text-gray-600">enseignant@fsecsg.dz</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold text-gray-800">Personnel</p>
                <p className="text-gray-600">personnel@fsecsg.dz</p>
              </div>
            </div>
            <p className="text-center text-gray-500 text-xs mt-3">Mot de passe : test123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
