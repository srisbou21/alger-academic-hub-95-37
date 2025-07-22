
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ReservationModule } from "@/components/ReservationModule";

import { StatisticsLayout } from "@/components/statistics/StatisticsLayout";
import { TimetableModule } from "@/components/TimetableModule";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { ComprehensiveFormationManager } from "@/components/formation/ComprehensiveFormationManager";
import { MainFacultyDashboard } from "@/components/MainFacultyDashboard";
import { ProfileViewer } from "@/components/ProfileViewer";
import { ScholarshipManagement } from "@/components/ScholarshipManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useRBAC } from "@/hooks/useRBAC";
import { SystemModule } from "@/types/rbac";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, GraduationCap } from "lucide-react";

const Index = () => {
  const [activeRole, setActiveRole] = useState("faculty");
  const [showProfile, setShowProfile] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { canAccessModule } = useRBAC();
  const navigate = useNavigate();

  // Si l'utilisateur n'est pas connecté, afficher la page d'accueil publique
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* En-tête principal */}
            <div className="mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 p-4 rounded-full">
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-slate-800 mb-4">
                FSECSG - Système d'Information
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Faculté des Sciences Économiques, Commerciales et des Sciences de Gestion
              </p>
              <p className="text-lg text-slate-500">
                Université Alger 3 - Alger, Algérie
              </p>
            </div>

            {/* Bouton de connexion */}
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-xl">Accès au Système</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">
                  Connectez-vous pour accéder aux fonctionnalités de la plateforme
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                  size="lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Se connecter
                </Button>
              </CardContent>
            </Card>

            {/* Informations supplémentaires */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Enseignants</h3>
                  <p className="text-sm text-slate-600">
                    Gestion des cours, emplois du temps et évaluations
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Administration</h3>
                  <p className="text-sm text-slate-600">
                    RH, planning, réservations et statistiques
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">IA Intégrée</h3>
                  <p className="text-sm text-slate-600">
                    Génération automatique d'emplois du temps
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = {
    name: user?.name || "Utilisateur",
    role: user?.role || "Utilisateur",
    avatar: "/placeholder.svg",
    id: user?.id || "1"
  };

  const renderContent = () => {
    if (showProfile) {
      return <ProfileViewer />;
    }

    // Vérifier les permissions avant d'afficher le contenu
    switch (activeRole) {
      case "teacher":
        return canAccessModule(SystemModule.TEACHER) ? 
          <TeacherDashboard /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Enseignant</div>;
      case "hr":
        return canAccessModule(SystemModule.HR) ? 
          <HRDashboard /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module RH</div>;
      case "admin":
        return canAccessModule(SystemModule.ADMIN) ? 
          <AdminDashboard /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Administration</div>;
      case "formations":
        return canAccessModule(SystemModule.FORMATIONS) ? 
          <ComprehensiveFormationManager /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Formations</div>;
      case "reservation":
        return canAccessModule(SystemModule.RESERVATIONS) ? 
          <ReservationModule /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Réservations</div>;
      case "statistics":
        return canAccessModule(SystemModule.STATISTICS) ? 
          <StatisticsLayout /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Statistiques</div>;
      case "timetable":
        return canAccessModule(SystemModule.TIMETABLE) ? 
          <TimetableModule /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Emploi du Temps</div>;
      case "faculty":
        return canAccessModule(SystemModule.FACULTY) ? 
          <MainFacultyDashboard /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Faculté</div>;
      case "scholarships":
        return canAccessModule(SystemModule.SCHOLARSHIPS) ? 
          <ScholarshipManagement /> : 
          <div className="p-8 text-center text-red-600">Accès refusé - Module Bourses d'Études</div>;
      default:
        return <MainFacultyDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        currentUser={currentUser}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
      <div className="pt-16">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
