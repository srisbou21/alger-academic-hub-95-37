
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, GraduationCap, BookOpen, Users, 
  Shield, Star, Clock, FileText 
} from "lucide-react";

export const TeacherProfiles = () => {
  const currentProfile = {
    type: "permanent",
    name: "Dr. Sarah Benchikh",
    speciality: "Économie",
    permissions: ["notes", "planning", "encadrement", "coordination"],
    responsibilities: ["Responsable UE Microéconomie", "Directeur de mémoire"]
  };

  const profileTypes = [
    {
      type: "permanent",
      title: "Professeur Permanent",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      permissions: ["Accès complet", "Gestion des notes", "Coordination UE", "Encadrement mémoires"],
      description: "Accès complet à toutes les fonctionnalités pédagogiques"
    },
    {
      type: "vacataire", 
      title: "Enseignant Vacataire",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      permissions: ["Matières assignées", "Saisie notes", "Consultation planning"],
      description: "Accès limité aux matières enseignées uniquement"
    },
    {
      type: "directeur",
      title: "Directeur de Mémoire", 
      icon: <FileText className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      permissions: ["Suivi étudiants", "Gestion encadrements", "Évaluation mémoires"],
      description: "Spécialisé dans le suivi et l'encadrement des étudiants"
    },
    {
      type: "responsable",
      title: "Responsable d'UE",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-800 border-amber-200", 
      permissions: ["Coordination UE", "Validation notes", "Gestion équipe"],
      description: "Responsabilités de coordination et de validation"
    }
  ];

  const getProfileIcon = (type: string) => {
    switch (type) {
      case "permanent": return <GraduationCap className="h-6 w-6 text-blue-600" />;
      case "vacataire": return <Clock className="h-6 w-6 text-emerald-600" />;
      case "directeur": return <FileText className="h-6 w-6 text-purple-600" />;
      case "responsable": return <Shield className="h-6 w-6 text-amber-600" />;
      default: return <User className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil actuel */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <User className="h-5 w-5" />
            Mon Profil Enseignant
          </CardTitle>
          <CardDescription>Informations et permissions de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              {getProfileIcon(currentProfile.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{currentProfile.name}</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {profileTypes.find(p => p.type === currentProfile.type)?.title}
                </Badge>
              </div>
              <p className="text-slate-600 mb-3">Spécialité: {currentProfile.speciality}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Responsabilités</h4>
                  <div className="space-y-1">
                    {currentProfile.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3 text-amber-500" />
                        {resp}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentProfile.permissions.map((perm, index) => (
                      <Badge key={index} className="bg-slate-100 text-slate-700 text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types de profils */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Types de Profils Enseignants
          </CardTitle>
          <CardDescription>Description des différents niveaux d'accès</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileTypes.map((profile, index) => (
              <Card key={index} className={`border ${profile.color.split(' ')[2]}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {profile.icon}
                    <h4 className="font-medium">{profile.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{profile.description}</p>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Permissions</h5>
                    <div className="space-y-1">
                      {profile.permissions.map((perm, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                          {perm}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
