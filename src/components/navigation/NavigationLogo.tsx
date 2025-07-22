
import React from 'react';
import { School } from "lucide-react";

export const NavigationLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <School className="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-slate-800">Système Académique</h1>
        <p className="text-xs text-slate-500">Gestion Universitaire Intégrée</p>
      </div>
    </div>
  );
};
