
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, GraduationCap, Eye, EyeOff, TestTube } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { RoleTestSelector } from "../RoleTestSelector";

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  // Charger les informations sauvegardées au démarrage
  useEffect(() => {
    const savedEmail = localStorage.getItem('fsecsg_saved_email');
    const savedRememberMe = localStorage.getItem('fsecsg_remember_me') === 'true';
    
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Sauvegarder les informations si "Se souvenir de moi" est coché
    if (rememberMe) {
      localStorage.setItem('fsecsg_saved_email', email);
      localStorage.setItem('fsecsg_remember_me', 'true');
    } else {
      localStorage.removeItem('fsecsg_saved_email');
      localStorage.removeItem('fsecsg_remember_me');
    }
    
    const success = await login(email, password);
    if (!success) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 tracking-tight">
            FSECSG
          </h1>
          <p className="text-xl text-black/80 font-light">
            Système d'Information Académique
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 glass-card">
            <TabsTrigger value="login" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Connexion Standard
            </TabsTrigger>
            <TabsTrigger value="test-roles" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <TestTube className="h-4 w-4 mr-2" />
              Test des Rôles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="animate-slide-up">
            <div className="flex justify-center">
              <Card className="w-full max-w-md glass-card border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6 animate-scale-in">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-glow">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-black font-serif">Connexion</CardTitle>
          <CardDescription className="text-black/70 text-base">
            Accédez à votre espace académique personnalisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Email universitaire</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votrenom@fsecsg.dz"
                required
                disabled={loading}
                className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-500 focus:bg-white pr-12"
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-9 w-9 text-gray-600 hover:text-black hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={loading}
                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-primary"
              />
              <Label htmlFor="remember" className="text-sm text-black mb-0 cursor-pointer">
                Se souvenir de moi
              </Label>
            </div>
            
            {error && (
              <Alert variant="destructive" className="bg-destructive/20 border-destructive/30 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" variant="premium" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-8 p-6 bg-white/90 rounded-xl border border-gray-300 backdrop-blur-sm">
            <p className="text-sm font-medium mb-3 text-black">Comptes de démonstration :</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-black/80">
              <div className="space-y-1">
                <p><span className="font-medium text-black">Super Admin:</span><br />admin@fsecsg.dz</p>
                <p><span className="font-medium text-black">Doyen:</span><br />doyen@fsecsg.dz</p>
              </div>
              <div className="space-y-1">
                <p><span className="font-medium text-black">Chef Dép.:</span><br />chef@fsecsg.dz</p>
                <p><span className="font-medium text-black">Enseignant:</span><br />enseignant@fsecsg.dz</p>
              </div>
            </div>
            <p className="text-sm text-black mt-4 p-3 bg-white/70 rounded-lg">
              <span className="font-medium">Mot de passe :</span> test123
            </p>
            <p className="text-blue-600 font-medium mt-3 text-sm">
              💡 Utilisez l'onglet "Test des Rôles" pour une connexion rapide
            </p>
          </div>
        </CardContent>
      </Card>
            </div>
          </TabsContent>

          <TabsContent value="test-roles" className="animate-slide-up">
            <RoleTestSelector />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
