
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  icon: IconComponent,
  color,
  isActive,
  onClick
}) => {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={`flex items-center gap-2 ${
        isActive 
          ? "bg-blue-600 hover:bg-blue-700 text-white" 
          : `hover:bg-slate-100 ${color}`
      }`}
    >
      <IconComponent className="h-4 w-4" />
      <span className="hidden lg:inline">{label}</span>
    </Button>
  );
};
