
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { AcademicYearSelector } from "../AcademicYearSelector";
import { UserMenu } from "./UserMenu";

interface NavigationActionsProps {
  currentUser: {
    name: string;
    role: string;
    avatar: string;
    id: string;
  };
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}

export const NavigationActions: React.FC<NavigationActionsProps> = ({
  currentUser,
  selectedYear,
  setSelectedYear,
  showProfile,
  setShowProfile
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Sélecteur d'année académique - toujours visible */}
      <div className="flex items-center">
        <AcademicYearSelector 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Notifications - toujours visible */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative flex items-center justify-center w-10 h-10"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
          3
        </Badge>
      </Button>

      {/* Menu utilisateur - toujours visible */}
      <UserMenu 
        currentUser={currentUser}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
    </div>
  );
};
