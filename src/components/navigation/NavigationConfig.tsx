
import { 
  Users, 
  Settings, 
  BarChart3, 
  Calendar, 
  Building2,
  BookOpen,
  GraduationCap,
  School,
  Award
} from "lucide-react";
import { SystemModule } from "../../types/rbac";

export const navigationItems = [
  { 
    id: "faculty", 
    label: "Faculté", 
    icon: School, 
    color: "text-blue-600",
    module: SystemModule.FACULTY
  },
  { 
    id: "teacher", 
    label: "Enseignant", 
    icon: GraduationCap, 
    color: "text-green-600",
    module: SystemModule.TEACHER
  },
  { 
    id: "hr", 
    label: "GRH", 
    icon: Users, 
    color: "text-purple-600",
    module: SystemModule.HR
  },
  { 
    id: "admin", 
    label: "Administration", 
    icon: Settings, 
    color: "text-red-600",
    module: SystemModule.ADMIN
  },
  { 
    id: "formations", 
    label: "Formations", 
    icon: BookOpen, 
    color: "text-indigo-600",
    module: SystemModule.FORMATIONS
  },
  { 
    id: "reservation", 
    label: "Réservations", 
    icon: Building2, 
    color: "text-orange-600",
    module: SystemModule.RESERVATIONS
  },
  { 
    id: "statistics", 
    label: "Statistiques", 
    icon: BarChart3, 
    color: "text-pink-600",
    module: SystemModule.STATISTICS
  },
  { 
    id: "timetable", 
    label: "Emploi du Temps", 
    icon: Calendar, 
    color: "text-teal-600",
    module: SystemModule.TIMETABLE
  },
  { 
    id: "scholarships", 
    label: "Bourses d'Études", 
    icon: Award, 
    color: "text-amber-600",
    module: SystemModule.SCHOLARSHIPS
  }
];
