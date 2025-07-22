
import React from 'react';
import { NavigationItem } from "./NavigationItem";
import { navigationItems } from "./NavigationConfig";
import { useRBAC } from "../../hooks/useRBAC";

interface NavigationItemsProps {
  activeRole: string;
  setActiveRole: (role: string) => void;
}

export const NavigationItems: React.FC<NavigationItemsProps> = ({
  activeRole,
  setActiveRole
}) => {
  const { canAccessModule, currentUser } = useRBAC();

  console.log("NavigationItems - currentUser:", currentUser);
  console.log("NavigationItems - navigationItems:", navigationItems);

  // Si l'utilisateur n'est pas connecté, ne pas afficher la navigation
  if (!currentUser) {
    console.log("NavigationItems - Pas d'utilisateur connecté, navigation masquée");
    return null;
  }

  const accessibleItems = navigationItems.filter(item => {
    const canAccess = canAccessModule(item.module);
    console.log(`NavigationItems - Module ${item.module}: ${canAccess ? 'accessible' : 'non accessible'}`);
    return canAccess;
  });

  console.log("NavigationItems - accessibleItems:", accessibleItems);

  return (
    <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
      {accessibleItems.map((item) => (
        <NavigationItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          color={item.color}
          isActive={activeRole === item.id}
          onClick={() => setActiveRole(item.id)}
        />
      ))}
    </div>
  );
};
