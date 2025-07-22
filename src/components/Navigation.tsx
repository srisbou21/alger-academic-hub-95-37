
import React from "react";
import { NavigationLogo } from "./navigation/NavigationLogo";
import { NavigationItems } from "./navigation/NavigationItems";
import { NavigationActions } from "./navigation/NavigationActions";
import { useAcademicYear } from "../contexts/AcademicYearContext";

interface NavigationProps {
  activeRole: string;
  setActiveRole: (role: string) => void;
  currentUser: {
    name: string;
    role: string;
    avatar: string;
    id: string;
  };
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}

export const Navigation = ({ activeRole, setActiveRole, currentUser, showProfile, setShowProfile }: NavigationProps) => {
  const { selectedYear, setSelectedYear } = useAcademicYear();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo à gauche */}
          <div className="flex-shrink-0">
            <NavigationLogo />
          </div>
          
          {/* Navigation centrale */}
          <div className="flex-1 flex justify-center">
            <NavigationItems 
              activeRole={activeRole}
              setActiveRole={setActiveRole}
            />
          </div>

          {/* Actions à droite */}
          <div className="flex-shrink-0">
            <NavigationActions
              currentUser={currentUser}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              showProfile={showProfile}
              setShowProfile={setShowProfile}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
